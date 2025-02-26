/** @format */

export interface UUIDOptions {
  version?: 4; // For future support of other versions
  uppercase?: boolean;
  noDashes?: boolean;
  prefix?: string;
  suffix?: string;
  count?: number;
  format?: "standard" | "base64" | "short" | "url";
}

export interface UUIDValidationResult {
  isValid: boolean;
  version?: number;
  error?: string;
  format?: string;
  details?: {
    hasValidFormat: boolean;
    hasValidVersion: boolean;
    hasValidVariant: boolean;
  };
}

export interface UUIDInfo {
  version: number;
  variant: string;
  timestamp?: string;
  node?: string;
  clockSequence?: string;
}

export class UUIDUtils {
  private static readonly UUID_REGEX =
    /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i;

  private static readonly SHORT_UUID_ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";

  /**
   * Generates a v4 UUID with enhanced options
   */
  static generate(options: UUIDOptions = {}): string {
    const {
      uppercase = false,
      noDashes = false,
      prefix = "",
      suffix = "",
      format = "standard",
    } = options;

    // Generate standard UUID
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

    // Apply format transformations
    switch (format) {
      case "base64":
        uuid = this.toBase64(uuid);
        break;
      case "short":
        uuid = this.toShortUUID(uuid);
        break;
      case "url":
        uuid = this.toURLSafe(uuid);
        break;
      default:
        if (noDashes) {
          uuid = uuid.replace(/-/g, "");
        }
        if (uppercase) {
          uuid = uuid.toUpperCase();
        }
    }

    return `${prefix}${uuid}${suffix}`;
  }

  /**
   * Generates multiple UUIDs with progress callback
   */
  static generateMultiple(
    count: number,
    options: UUIDOptions = {},
    onProgress?: (progress: number) => void
  ): string[] {
    const uuids: string[] = [];
    const batchSize = 1000;
    let generated = 0;

    while (generated < count) {
      const batchCount = Math.min(batchSize, count - generated);
      const batch = Array.from({ length: batchCount }, () =>
        this.generate(options)
      );
      uuids.push(...batch);
      generated += batchCount;

      if (onProgress) {
        onProgress((generated / count) * 100);
      }
    }

    return uuids;
  }

  /**
   * Enhanced UUID validation with detailed feedback
   */
  static validate(uuid: string): UUIDValidationResult {
    // Remove any prefix/suffix if present
    const cleanUuid = uuid.replace(/^[a-zA-Z]+:/, "").replace(/[a-zA-Z]+$/, "");

    // Handle different formats
    let formattedUuid = cleanUuid;
    let format = "standard";

    if (cleanUuid.length === 22) {
      try {
        formattedUuid = this.fromBase64(cleanUuid);
        format = "base64";
      } catch {
        return {
          isValid: false,
          error: "Invalid Base64 UUID format",
        };
      }
    } else if (cleanUuid.length === 22 && /^[0-9a-zA-Z_-]+$/.test(cleanUuid)) {
      try {
        formattedUuid = this.fromShortUUID(cleanUuid);
        format = "short";
      } catch {
        return {
          isValid: false,
          error: "Invalid short UUID format",
        };
      }
    } else if (cleanUuid.length === 32) {
      formattedUuid = cleanUuid.replace(
        /(.{8})(.{4})(.{4})(.{4})(.{12})/,
        "$1-$2-$3-$4-$5"
      );
    }

    const hasValidFormat = this.UUID_REGEX.test(formattedUuid);
    if (!hasValidFormat) {
      return {
        isValid: false,
        error: "Invalid UUID format",
        format,
        details: {
          hasValidFormat: false,
          hasValidVersion: false,
          hasValidVariant: false,
        },
      };
    }

    // Extract and validate version
    const version = parseInt(formattedUuid.charAt(14), 16);
    const hasValidVersion = version === 4;

    // Validate variant
    const variantBit = parseInt(formattedUuid.charAt(19), 16);
    const hasValidVariant = (variantBit & 0x8) === 0x8;

    const isValid = hasValidFormat && hasValidVersion && hasValidVariant;

    return {
      isValid,
      version,
      format,
      error: isValid ? undefined : "Invalid UUID version or variant",
      details: {
        hasValidFormat,
        hasValidVersion,
        hasValidVariant,
      },
    };
  }

  /**
   * Get detailed information about a UUID
   */
  static getInfo(uuid: string): UUIDInfo | null {
    const validation = this.validate(uuid);
    if (!validation.isValid) return null;

    const cleanUuid = uuid.replace(/[^0-9a-f]/gi, "");
    return {
      version: parseInt(cleanUuid.charAt(12), 16),
      variant: this.getVariantName(parseInt(cleanUuid.charAt(16), 16)),
      timestamp: new Date().toISOString(), // For v4, this is just creation time
    };
  }

  /**
   * Convert UUID to Base64
   */
  private static toBase64(uuid: string): string {
    const hex = uuid.replace(/-/g, "");
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  /**
   * Convert Base64 to UUID
   */
  private static fromBase64(base64: string): string {
    const b64 = base64.replace(/-/g, "+").replace(/_/g, "/") + "==";
    const bytes = new Uint8Array(
      atob(b64)
        .split("")
        .map((c) => c.charCodeAt(0))
    );
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, "0");
    }
    return hex.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }

  /**
   * Convert UUID to short format
   */
  private static toShortUUID(uuid: string): string {
    const hex = BigInt(`0x${uuid.replace(/-/g, "")}`);
    let short = "";
    const base = BigInt(this.SHORT_UUID_ALPHABET.length);
    let remaining = hex;

    while (remaining > BigInt(0)) {
      const index = Number(remaining % base);
      short = this.SHORT_UUID_ALPHABET[index] + short;
      remaining = remaining / base;
    }

    return short.padStart(22, this.SHORT_UUID_ALPHABET[0]);
  }

  /**
   * Convert short format to UUID
   */
  private static fromShortUUID(short: string): string {
    let hex = BigInt(0);
    const base = BigInt(this.SHORT_UUID_ALPHABET.length);

    for (const char of short) {
      hex = hex * base + BigInt(this.SHORT_UUID_ALPHABET.indexOf(char));
    }

    return hex
      .toString(16)
      .padStart(32, "0")
      .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }

  /**
   * Convert UUID to URL-safe format
   */
  private static toURLSafe(uuid: string): string {
    return uuid.replace(/-/g, "_");
  }

  /**
   * Get variant name from variant bits
   */
  private static getVariantName(variant: number): string {
    if ((variant & 0x8) === 0) return "NCS";
    if ((variant & 0xc) === 0x8) return "RFC4122";
    if ((variant & 0xe) === 0xc) return "Microsoft";
    return "Future";
  }

  /**
   * Check if two UUIDs are equal (case-insensitive)
   */
  static equals(uuid1: string, uuid2: string): boolean {
    return uuid1.toLowerCase() === uuid2.toLowerCase();
  }

  /**
   * Parse a string that might contain UUIDs and extract them
   */
  static extractUUIDs(text: string): string[] {
    const uuidPattern =
      /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;
    return text.match(uuidPattern) || [];
  }
} 