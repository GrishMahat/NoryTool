/** @format */



export interface JSONAnalysis {
  summary: {
    totalSize: number; // in bytes
    totalKeys: number;
    maxDepth: number;
    format: {
      indentation: number;
      hasTrailingCommas: boolean;
      hasDuplicateKeys: boolean;
    };
    performance: {
      parseTime: number;
      analysisTime: number;
      totalTime: number;
    };
  };
  structure: {
    objects: {
      count: number;
      maxNesting: number;
      averageKeys: number;
      keyDistribution: Record<string, number>;
    };
    arrays: {
      count: number;
      maxLength: number;
      totalItems: number;
      averageLength: number;
      nestedArrays: number;
    };
    values: {
      strings: {
        count: number;
        maxLength: number;
        averageLength: number;
        empty: number;
        min: number;
        max: number;
        patterns: {
          dates: number;
          emails: number;
          urls: number;
          uuids: number;
        };
      };
      numbers: {
        count: number;
        integers: number;
        decimals: number;
        min: number;
        max: number;
        stats: {
          min: number;
          max: number;
          average: number;
          median: number;
          mode: number[];
        };
      };
      booleans: {
        count: number;
        true: number;
        false: number;
      };
      nulls: number;
      undefined: number;
    };
    paths: {
      longest: string;
      deepest: string[];
      all: string[];
      circular: string[];
    };
    validation: {
      errors: Array<{
        path: string;
        message: string;
        severity: "error" | "warning";
      }>;
      warnings: string[];
    };
  };
  paths: {
    longest: string;
    deepest: string[];
    all: string[];
    circular: string[];
  };
}

export interface FilterOptions {
  path?: string;
  query?: string;
  caseSensitive?: boolean;
  includeParents?: boolean;
  maxDepth?: number;
  conditions?: Array<{
    key?: string;
    value?: string | number | boolean | null;
    type?: "string" | "number" | "boolean" | "null" | "object" | "array";
    operator?:
      | "equals"
      | "contains"
      | "startsWith"
      | "endsWith"
      | "gt"
      | "lt"
      | "gte"
      | "lte";
  }>;
  limit?: number;
  exclude?: string[];
}

export class JSONUtils {
  private static readonly DATE_REGEX =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly URL_REGEX =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  static format(
    json: string,
    indent: number = 2
  ): {
    formatted: string;
    error?: string;
    performance?: { parseTime: number; formatTime: number };
  } {
    const validation = this.validate(json);

    if (!validation.isValid) {
      return { formatted: json, error: validation.error };
    }

    try {
      const parseStartTime = performance.now();
      const parsed = JSON.parse(json);
      const parseTime = performance.now() - parseStartTime;

      const formatStartTime = performance.now();
      const formatted = JSON.stringify(parsed, null, indent);
      const formatTime = performance.now() - formatStartTime;

      return {
        formatted,
        performance: {
          parseTime,
          formatTime,
        },
      };
    } catch (error) {
      console.error("JSON formatting error:", error);
      return {
        formatted: json,
        error:
          error instanceof Error
            ? `Formatting failed: ${error.message}`
            : "Unknown formatting error occurred",
      };
    }
  }

  static beautify(json: string): { formatted: string; error?: string } {
    return this.format(json, 2);
  }

  static minify(json: string): { formatted: string; error?: string } {
    return this.format(json, 0);
  }

  static filterByPath(json: string, path: string): string {
    try {
      let result = JSON.parse(json);

      if (path) {
        const paths = path.split(".");
        for (const segment of paths) {
          if (result && typeof result === "object") {
            result = result[segment];
          } else {
            throw new Error("Invalid path");
          }
        }
      }

      return JSON.stringify(result, null, 2);
    } catch {
      throw new Error("Invalid JSON or filter path");
    }
  }

  static analyze(json: string): JSONAnalysis {
    const startTime = performance.now();
    let parseTime = 0;

    try {
      const parseStartTime = performance.now();
      const parsed = JSON.parse(json);
      parseTime = performance.now() - parseStartTime;

      const analysis: JSONAnalysis = {
        summary: {
          totalSize: new Blob([json]).size,
          totalKeys: 0,
          maxDepth: 0,
          format: {
            indentation: this.detectIndentation(json),
            hasTrailingCommas: this.hasTrailingCommas(json),
            hasDuplicateKeys: this.hasDuplicateKeys(json),
          },
          performance: {
            parseTime,
            analysisTime: 0,
            totalTime: 0,
          },
        },
        structure: {
          objects: {
            count: 0,
            maxNesting: 0,
            averageKeys: 0,
            keyDistribution: {},
          },
          arrays: {
            count: 0,
            maxLength: 0,
            totalItems: 0,
            averageLength: 0,
            nestedArrays: 0,
          },
          values: {
            strings: {
              count: 0,
              maxLength: 0,
              averageLength: 0,
              empty: 0,
              min: Infinity,
              max: -Infinity,
              patterns: {
                dates: 0,
                emails: 0,
                urls: 0,
                uuids: 0,
              },
            },
            numbers: {
              count: 0,
              integers: 0,
              decimals: 0,
              min: Infinity,
              max: -Infinity,
              stats: {
                min: Infinity,
                max: -Infinity,
                average: 0,
                median: 0,
                mode: [],
              },
            },
            booleans: {
              count: 0,
              true: 0,
              false: 0,
            },
            nulls: 0,
            undefined: 0,
          },
          paths: {
            longest: "",
            deepest: [],
            all: [],
            circular: [],
          },
          validation: {
            errors: [],
            warnings: [],
          },
        },
        paths: {
          longest: "",
          deepest: [],
          all: [],
          circular: [],
        },
      };

      const visited = new Set<unknown>();
      const numbers: number[] = [];

      const analyzeNode = (
        node: unknown,
        path: string = "",
        depth = 0
      ): void => {
        if (visited.has(node)) {
          analysis.structure.paths.circular.push(path);
          analysis.paths.circular.push(path);
          return;
        }

        if (typeof node === "object" && node !== null) {
          visited.add(node);
        }

        analysis.summary.maxDepth = Math.max(analysis.summary.maxDepth, depth);

        if (Array.isArray(node)) {
          analysis.structure.arrays.count++;
          analysis.structure.arrays.maxLength = Math.max(
            analysis.structure.arrays.maxLength,
            node.length
          );
          analysis.structure.arrays.totalItems += node.length;

          if (node.some((item) => Array.isArray(item))) {
            analysis.structure.arrays.nestedArrays++;
          }

          node.forEach((item, index) => {
            analyzeNode(item, `${path}[${index}]`, depth + 1);
          });
        } else if (typeof node === "object" && node !== null) {
          analysis.structure.objects.count++;
          const keys = Object.keys(node);

          keys.forEach((key) => {
            analysis.structure.objects.keyDistribution[key] =
              (analysis.structure.objects.keyDistribution[key] || 0) + 1;

            const fullPath = path ? `${path}.${key}` : key;
            analysis.structure.paths.all.push(fullPath);
            analysis.paths.all.push(fullPath);

            if (fullPath.length > analysis.structure.paths.longest.length) {
              analysis.structure.paths.longest = fullPath;
              analysis.paths.longest = fullPath;
            }

            analyzeNode(
              (node as Record<string, unknown>)[key],
              fullPath,
              depth + 1
            );
          });
        } else {
          this.analyzeValue(node, analysis, path, numbers);
        }
      };

      analyzeNode(parsed);

      // Calculate final statistics
      if (numbers.length > 0) {
        const sorted = numbers.sort((a, b) => a - b);
        analysis.structure.values.numbers.stats.median =
          sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

        // Calculate mode
        const frequency: Record<number, number> = {};
        let maxFreq = 0;
        numbers.forEach((num) => {
          frequency[num] = (frequency[num] || 0) + 1;
          maxFreq = Math.max(maxFreq, frequency[num]);
        });
        analysis.structure.values.numbers.stats.mode = Object.entries(frequency)
          .filter(([, freq]) => freq === maxFreq)
          .map(([num]) => Number(num));
      }

      const endTime = performance.now();
      analysis.summary.performance.analysisTime =
        endTime - startTime - parseTime;
      analysis.summary.performance.totalTime = endTime - startTime;

      return analysis;
    } catch (error) {
      console.error("JSON analysis error:", error);
      throw new Error(
        error instanceof Error
          ? `Analysis failed: ${error.message}`
          : "Unknown analysis error occurred"
      );
    }
  }

  private static analyzeValue(
    value: unknown,
    analysis: JSONAnalysis,
    path: string,
    numbers: number[]
  ): void {
    switch (typeof value) {
      case "string":
        this.analyzeString(value as string, analysis);
        break;
      case "number":
        this.analyzeNumber(value as number, analysis, numbers);
        break;
      case "boolean":
        this.analyzeBoolean(value as boolean, analysis);
        break;
      case "undefined":
        analysis.structure.values.undefined++;
        analysis.structure.validation.warnings.push(
          `Undefined value found at path: ${path}`
        );
        break;
      default:
        if (value === null) {
          analysis.structure.values.nulls++;
        }
    }
  }

  private static analyzeString(value: string, analysis: JSONAnalysis): void {
    const { strings } = analysis.structure.values;
    strings.count++;
    strings.maxLength = Math.max(strings.maxLength, value.length);
    strings.min = Math.min(strings.min, value.length);
    strings.max = Math.max(strings.max, value.length);

    if (value.length === 0) {
      strings.empty++;
    }

    // Pattern recognition
    if (this.DATE_REGEX.test(value)) strings.patterns.dates++;
    if (this.EMAIL_REGEX.test(value)) strings.patterns.emails++;
    if (this.URL_REGEX.test(value)) strings.patterns.urls++;
    if (this.UUID_REGEX.test(value)) strings.patterns.uuids++;
  }

  private static analyzeNumber(
    value: number,
    analysis: JSONAnalysis,
    numbers: number[]
  ): void {
    const { numbers: nums } = analysis.structure.values;
    nums.count++;
    numbers.push(value);

    if (Number.isInteger(value)) {
      nums.integers++;
    } else {
      nums.decimals++;
    }

    nums.min = Math.min(nums.min, value);
    nums.max = Math.max(nums.max, value);
    nums.stats.min = Math.min(nums.stats.min, value);
    nums.stats.max = Math.max(nums.stats.max, value);
    nums.stats.average =
      (nums.stats.average * (nums.count - 1) + value) / nums.count;
  }

  private static analyzeBoolean(value: boolean, analysis: JSONAnalysis): void {
    const { booleans } = analysis.structure.values;
    booleans.count++;
    if (value) {
      booleans.true++;
    } else {
      booleans.false++;
    }
  }

  private static detectIndentation(json: string): number {
    const lines = json.split("\n");
    for (let i = 1; i < lines.length; i++) {
      const spaces = lines[i].match(/^\s+/);
      if (spaces) {
        return spaces[0].length;
      }
    }
    return 0;
  }

  private static hasTrailingCommas(json: string): boolean {
    return /,[\s\n]*[}\]]/.test(json);
  }

  private static hasDuplicateKeys(json: string): boolean {
    const keys = new Set<string>();
    let foundDuplicate = false;

    JSON.parse(json, (key, value) => {
      if (key && keys.has(key)) {
        foundDuplicate = true;
      }
      keys.add(key);
      return value;
    });

    return foundDuplicate;
  }

  static validate(json: string): { isValid: boolean; error?: string } {
    try {
      JSON.parse(json);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Invalid JSON format",
      };
    }
  }

  static downloadJSON(json: string, filename?: string): void {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `formatted_json_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static filter(json: string, options: FilterOptions = {}): string {
    try {
      let result = JSON.parse(json);

      // Apply path filter if specified
      if (options.path) {
        const paths = options.path.split(".");
        for (const segment of paths) {
          if (result && typeof result === "object") {
            result = result[segment];
          } else {
            throw new Error("Invalid path");
          }
        }
      }

      // Apply search query if specified
      if (options.query) {
        const searchQuery = options.caseSensitive
          ? options.query
          : options.query.toLowerCase();

        const filterByQuery = (obj: unknown, depth = 0): unknown => {
          if (options.maxDepth && depth > options.maxDepth) return null;

          if (Array.isArray(obj)) {
            const filtered = obj
              .map((item) => filterByQuery(item, depth + 1))
              .filter((item) => item !== null);
            return filtered.length ? filtered : null;
          }

          if (typeof obj === "object" && obj !== null) {
            const filtered: Record<string, unknown> = {};
            let hasMatch = false;

            for (const [key, value] of Object.entries(obj)) {
              const valueStr = String(value);
              const matchesQuery = options.caseSensitive
                ? valueStr.includes(searchQuery)
                : valueStr.toLowerCase().includes(searchQuery);

              if (matchesQuery) {
                filtered[key] = value;
                hasMatch = true;
              } else {
                const childResult = filterByQuery(value, depth + 1);
                if (childResult !== null) {
                  filtered[key] = childResult;
                  hasMatch = true;
                }
              }
            }

            return hasMatch ? filtered : null;
          }

          const stringValue = String(obj);
          return options.caseSensitive
            ? stringValue.includes(searchQuery)
              ? obj
              : null
            : stringValue.toLowerCase().includes(searchQuery)
            ? obj
            : null;
        };

        result = filterByQuery(result) ?? {};
      }

      // Apply conditions if specified
      if (options.conditions?.length) {
        const filterByConditions = (obj: unknown, depth = 0): unknown => {
          if (options.maxDepth && depth > options.maxDepth) return null;

          if (Array.isArray(obj)) {
            const filtered = obj
              .map((item) => filterByConditions(item, depth + 1))
              .filter((item) => item !== null);
            return filtered.length ? filtered : null;
          }

          if (typeof obj === "object" && obj !== null) {
            const filtered: Record<string, unknown> = {};
            let hasMatch = false;

            for (const [key, value] of Object.entries(obj)) {
              const condition = options.conditions?.[0];
              const matchesCondition =
                condition &&
                typeof value === typeof condition.value &&
                (options.caseSensitive
                  ? value === condition.value
                  : String(value).toLowerCase() ===
                    String(condition.value).toLowerCase());

              if (matchesCondition) {
                filtered[key] = value;
                hasMatch = true;
              } else {
                const childResult = filterByConditions(value, depth + 1);
                if (childResult !== null) {
                  filtered[key] = childResult;
                  hasMatch = true;
                }
              }
            }

            return hasMatch ? filtered : null;
          }

          const condition = options.conditions?.[0];
          return condition &&
            typeof obj === typeof condition.value &&
            (options.caseSensitive
              ? obj === condition.value
              : String(obj).toLowerCase() ===
                String(condition.value).toLowerCase())
            ? obj
            : null;
        };

        result = filterByConditions(result) ?? {};
      }

      // Apply limit if specified
      if (options.limit) {
        const entries = Object.entries(result);
        const limitedEntries = entries.slice(0, options.limit);
        result = Object.fromEntries(limitedEntries);
      }

      // Apply exclude if specified
      if (options.exclude) {
        const exclude = options.exclude.map((key) => key.toLowerCase());
        const filtered: Record<string, unknown> = {};
        Object.keys(result)
          .filter((key) => !exclude.includes(key.toLowerCase()))
          .forEach((key) => {
            filtered[key] = (result as Record<string, unknown>)[key];
          });
        result = filtered;
      }

      return JSON.stringify(result, null, 2);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Invalid JSON or filter options"
      );
    }
  }
}
