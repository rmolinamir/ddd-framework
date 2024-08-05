import { Client } from 'pg';
import {
  DynamicModule,
  Inject,
  InjectionToken,
  Module,
  ModuleMetadata,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OptionalFactoryDependency,
  Provider,
  Type
} from '@nestjs/common';

export type PgClientModuleOptions = ConstructorParameters<
  typeof Client
>[number];

export type PgClientOptionsFactory = {
  createPgClientOptions():
    | Promise<PgClientModuleOptions>
    | PgClientModuleOptions;
};

export interface PgClientModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<PgClientOptionsFactory>;
  useClass?: Type<PgClientOptionsFactory>;
  useFactory?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It's fine to accept `any` type here.
    ...args: any[]
  ) => Promise<PgClientModuleOptions> | PgClientModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

@Module({})
export class PgClientModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(@Inject(Client) private readonly client: Client) {}

  public async onApplicationBootstrap() {
    await this.client.connect();
  }

  public async onApplicationShutdown() {
    await this.client.end();
  }

  /**
   * Configures the PgClientModule NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRoot(
    ...options: ConstructorParameters<typeof Client>
  ): DynamicModule {
    const clientProvider: Provider<Client> = {
      provide: Client,
      useValue: new Client(...options)
    };

    return {
      module: PgClientModule,
      imports: [],
      providers: [clientProvider],
      exports: [Client]
    };
  }

  /**
   * Configures the PgClientModule NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRootAsync(
    asyncOptions: PgClientModuleAsyncOptions
  ): DynamicModule {
    const dbProvider = {
      provide: Client,
      useFactory: async (
        ...options: ConstructorParameters<typeof Client>
      ): Promise<unknown> => new Client(...options),
      inject: [this.OPTIONS_PROVIDER_TOKEN]
    };

    const asyncProviders = this.asyncOptionsProviders(asyncOptions);

    return {
      module: PgClientModule,
      imports: asyncOptions.imports,
      providers: [dbProvider, ...asyncProviders],
      exports: [dbProvider]
    };
  }

  private static asyncOptionsProviders(
    asyncOptions: PgClientModuleAsyncOptions
  ): Provider[] {
    if (asyncOptions.useExisting || asyncOptions.useFactory)
      return [this.factoryOptionsProvider(asyncOptions)];

    const useClass = asyncOptions.useClass as Type<PgClientOptionsFactory>;

    return [
      this.factoryOptionsProvider(asyncOptions),
      {
        provide: useClass,
        useClass
      }
    ];
  }

  private static factoryOptionsProvider(
    options: PgClientModuleAsyncOptions
  ): Provider<PgClientModuleOptions> {
    if (options.useFactory) {
      return {
        provide: this.OPTIONS_PROVIDER_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }

    const inject = [options.useClass || options.useExisting] as [
      Type<PgClientOptionsFactory>
    ];

    return {
      provide: this.OPTIONS_PROVIDER_TOKEN,
      useFactory: (factory: PgClientOptionsFactory) =>
        factory.createPgClientOptions(),
      inject
    };
  }

  private static OPTIONS_PROVIDER_TOKEN = Symbol('OPTIONS_PROVIDER_TOKEN');
}
