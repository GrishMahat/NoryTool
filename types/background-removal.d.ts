declare module '@imgly/background-removal' {
  export function removeBackground(
    image: string | Blob,
    config?: {
      publicPath?: string;
      debug?: boolean;
      progress?: (progress: number) => void;
      model?: 'small' | 'medium' | 'large';
    }
  ): Promise<Blob>;
} 