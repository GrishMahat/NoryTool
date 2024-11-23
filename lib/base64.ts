/** @format */

export const base64Utils = {
  encode: (
    text: string,
    urlSafe: boolean = false,
    padding: boolean = true
  ): string => {
    try {
      let encoded = btoa(text);
      if (urlSafe) {
        encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_");
      }
      if (!padding) {
        encoded = encoded.replace(/=/g, "");
      }
      return encoded;
    } catch {
      throw new Error("Error encoding text to Base64");
    }
  },

  decode: (base64: string, urlSafe: boolean = false): string => {
    try {
      let decoded = base64;
      if (urlSafe) {
        decoded = decoded.replace(/-/g, "+").replace(/_/g, "/");
      }
      while (decoded.length % 4) {
        decoded += "=";
      }
      return atob(decoded);
    } catch{
      throw new Error("Invalid Base64 input");
    }
  },

  format: (base64: string, lineLength: number): string => {
    return (
      base64
        .replace(/\n/g, "")
        .match(new RegExp(`.{1,${lineLength}}`, "g"))
        ?.join("\n") || base64
    );
  },

  validate: (base64: string): boolean => {
    try {
      atob(base64.replace(/[\s\n]/g, ""));
      return true;
    } catch {
      return false;
    }
  },

  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  base64ToFile: (base64: string, mimeType: string): Blob => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  },

  calculateSize: (base64: string): { encoded: number; decoded: number } => {
    const cleanBase64 = base64.replace(/[\s\n]/g, "");
    const decoded = Math.floor((cleanBase64.length * 3) / 4);
    return {
      encoded: cleanBase64.length,
      decoded,
    };
  },
};
