export interface Env {
  MAIN: KVNamespace;
  IMAGES: R2Bucket;
  ASSETS: {
    fetch: typeof fetch;
  };
}
