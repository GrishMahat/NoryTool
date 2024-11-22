/** @format */

type JSONAnalysis = {
  totalKeys: number;
  depth: number;
  arrayLengths: Record<number, number>;
  valueTypes: Record<string, number>;
};

export class JSONUtils {
  static format(json: string, indent: number = 2): string {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, indent);
    } catch {
      throw new Error("Invalid JSON format");
    }
  }

  static beautify(json: string): string {
    return this.format(json, 2);
  }

  static minify(json: string): string {
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
        totalKeys: 0,
        depth: 0,
        arrayLengths: {},
        valueTypes: {},
      };

      const analyzeNode = (node: unknown, depth = 0) => {
        analysis.depth = Math.max(analysis.depth, depth);

        if (Array.isArray(node)) {
          analysis.arrayLengths[depth] =
            (analysis.arrayLengths[depth] || 0) + node.length;
          node.forEach((item) => analyzeNode(item, depth + 1));
        } else if (typeof node === "object" && node !== null) {
          analysis.totalKeys += Object.keys(node).length;
          Object.values(node).forEach((value) => analyzeNode(value, depth + 1));
        } else {
          analysis.valueTypes[typeof node] =
            (analysis.valueTypes[typeof node] || 0) + 1;
        }
      };

      analyzeNode(parsed);
      return analysis;
    } catch  {
      throw new Error("Invalid JSON format");
    }
  }

  static validate(json: string): boolean {
    try {
      JSON.parse(json);
      return true;
    } catch {
      return false;
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
}
