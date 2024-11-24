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
  };
  structure: {
    objects: {
      count: number;
      maxNesting: number;
      averageKeys: number;
    };
    arrays: {
      count: number;
      maxLength: number;
      totalItems: number;
      averageLength: number;
    };
    values: {
      strings: {
        count: number;
        maxLength: number;
        averageLength: number;
        empty: number;
        min: number;
        max: number;
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
        };
      };
      booleans: {
        count: number;
        true: number;
        false: number;
      };
      nulls: number;
    };
    paths: {
      longest: string;
      deepest: string[];
      all: string[];
    };
  };
  paths: {
    longest: string;
    deepest: string[];
    all: string[];
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
  static format(
    json: string,
    indent: number = 2,
  ): { formatted: string; error?: string } {
    const validation = this.validate(json);
    if (!validation.isValid) {
      return { formatted: json, error: validation.error };
    }

    try {
      const parsed = JSON.parse(json);
      const formatted = JSON.stringify(parsed, null, indent);
      return { formatted };
    } catch (error) {
      return {
        formatted: json,
        error: error instanceof Error ? error.message : "Formatting failed",
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
    try {
      const parsed = JSON.parse(json);
      const analysis: JSONAnalysis = {
        summary: {
          totalSize: 0,
          totalKeys: 0,
          maxDepth: 0,
          format: {
            indentation: 0,
            hasTrailingCommas: false,
            hasDuplicateKeys: false,
          },
        },
        structure: {
          objects: {
            count: 0,
            maxNesting: 0,
            averageKeys: 0,
          },
          arrays: {
            count: 0,
            maxLength: 0,
            totalItems: 0,
            averageLength: 0,
          },
          values: {
            strings: {
              count: 0,
              maxLength: 0,
              averageLength: 0,
              empty: 0,
              min: Infinity,
              max: -Infinity,
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
              },
            },
            booleans: {
              count: 0,
              true: 0,
              false: 0,
            },
            nulls: 0,
          },
          paths: {
            longest: "",
            deepest: [],
            all: [],
          },
        },
        paths: {
          longest: "",
          deepest: [],
          all: [],
        },
      };

      let totalKeyLength = 0;
      let totalKeys = 0;
      let totalStringLength = 0;
      let totalStrings = 0;
      let totalNumbers = 0;
      let numberSum = 0;

      const analyzeNode = (node: unknown, depth = 0) => {
        analysis.summary.maxDepth = Math.max(analysis.summary.maxDepth, depth);

        if (Array.isArray(node)) {
          analysis.structure.arrays.count++;
          analysis.structure.arrays.maxLength = Math.max(
            analysis.structure.arrays.maxLength,
            node.length
          );
          analysis.structure.arrays.totalItems += node.length;
          analysis.structure.arrays.averageLength =
            analysis.structure.arrays.totalItems /
            analysis.structure.arrays.count;
          node.forEach((item) => analyzeNode(item, depth + 1));
        } else if (typeof node === "object" && node !== null) {
          analysis.structure.objects.count++;
          analysis.structure.objects.maxNesting = Math.max(
            analysis.structure.objects.maxNesting,
            depth
          );
          analysis.structure.objects.averageKeys =
            totalKeys / analysis.structure.objects.count;
          const keys = Object.keys(node);
          analysis.summary.totalKeys += keys.length;

          keys.forEach((key) => {
            totalKeyLength += key.length;
            totalKeys++;

            if (
              !analysis.structure.paths.longest ||
              key.length > analysis.structure.paths.longest.length
            ) {
              analysis.structure.paths.longest = key;
            }
            analysis.structure.paths.deepest.push(key);
            analysis.structure.paths.all.push(key);
          });

          Object.values(node).forEach((value) => analyzeNode(value, depth + 1));
        } else {
          const type = typeof node;
          analysis.summary.totalKeys++;

          if (type === "string" && typeof node === "string") {
            totalStringLength += node.length;
            totalStrings++;
            analysis.structure.values.strings.min = Math.min(
              analysis.structure.values.strings.min,
              node.length
            );
            analysis.structure.values.strings.max = Math.max(
              analysis.structure.values.strings.max,
              node.length
            );
          } else if (type === "number" && typeof node === "number") {
            totalNumbers++;
            numberSum += node;
            analysis.structure.values.numbers.min = Math.min(
              analysis.structure.values.numbers.min,
              node
            );
            analysis.structure.values.numbers.max = Math.max(
              analysis.structure.values.numbers.max,
              node
            );
          }
        }
      };

      analyzeNode(parsed);

      // Calculate averages
      analysis.summary.totalKeys = totalKeys ? totalKeyLength / totalKeys : 0;
      analysis.structure.values.strings.averageLength = totalStrings
        ? totalStringLength / totalStrings
        : 0;
      analysis.structure.values.numbers.stats.average = totalNumbers
        ? numberSum / totalNumbers
        : 0;

      return analysis;
    } catch {
      throw new Error("Invalid JSON format");
    }
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
