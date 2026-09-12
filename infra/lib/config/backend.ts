export interface BackendSecretConfig {
  secretName: string;
  environmentKeys: Record<string, string>;
}

export interface BackendStackConfig {
  apiName: string;

  lambda?: {
    memorySize?: number;
    timeoutSeconds?: number;
    environment?: Record<string, string>;
  };

  secrets?: BackendSecretConfig[];
}