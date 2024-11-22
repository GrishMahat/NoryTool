/** @format */

export interface UUIDOptions {
  version?: 4;  // For future support of other versions
  uppercase?: boolean;
  noDashes?: boolean;
  prefix?: string;
  count?: number;
}

export interface UUIDValidationResult {
  isValid: boolean;
  version?: number;
  error?: string;
}

export class UUIDUtils {
  private static readonly UUID_REGEX = 
    /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i;

  /**
   * Generates a v4 UUID
   */
  static generate(options: UUIDOptions = {}): string {
    const {
      uppercase = false,
      noDashes = false,
      prefix = '',
    } = options;

    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

    if (noDashes) {
      uuid = uuid.replace(/-/g, '');
    }

    if (uppercase) {
      uuid = uuid.toUpperCase();
    }

    return `${prefix}${uuid}`;
  }

  /**
   * Generates multiple UUIDs
   */
  static generateMultiple(count: number, options: UUIDOptions = {}): string[] {
    return Array.from({ length: count }, () => this.generate(options));
  }

  /**
   * Validates a UUID string
   */
  static validate(uuid: string): UUIDValidationResult {
    // Remove any prefix if present
    const cleanUuid = uuid.replace(/^[a-zA-Z]+:/, '');
    
    // Handle UUIDs without dashes
    const formattedUuid = cleanUuid.length === 32 
      ? cleanUuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
      : cleanUuid;

    if (!this.UUID_REGEX.test(formattedUuid)) {
      return {
        isValid: false,
        error: 'Invalid UUID format'
      };
    }

    // Extract version
    const version = parseInt(formattedUuid.charAt(14), 16);
    if (version !== 4) {
      return {
        isValid: false,
        version,
        error: 'Not a version 4 UUID'
      };
    }

    // Validate variant
    const variantBit = parseInt(formattedUuid.charAt(19), 16);
    if ((variantBit & 0x8) !== 0x8) {
      return {
        isValid: false,
        version,
        error: 'Invalid UUID variant'
      };
    }

    return {
      isValid: true,
      version
    };
  }
} 