import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

class NextBaseOpenAPIRegistry {
  private static instance;
  private constructor() {}
  public static getInstance(): OpenAPIRegistry {
    if (!NextBaseOpenAPIRegistry.instance) {
      NextBaseOpenAPIRegistry.instance = new OpenAPIRegistry();
    }
    return NextBaseOpenAPIRegistry.instance;
  }
}

export const NextBaseOpenAPIRegistryClient: OpenAPIRegistry =
  NextBaseOpenAPIRegistry.getInstance();
