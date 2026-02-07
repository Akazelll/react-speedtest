export {};

declare global {
  interface Window {
    ndt7: {
      test: (config: any) => Promise<number>;
    };
  }
}
