import pg from 'pg';
import {
  DynamicModule,
  Global,
  Inject,
  InjectionToken,
  Module,
  ModuleMetadata,
  OnApplicationShutdown,
  OptionalFactoryDependency,
  Provider,
  Type
} from '@nestjs/common';

export type PgPoolModuleOptions = ConstructorParameters<typeof pg.Pool>[number];

export type PgPoolOptionsFactory = {
  createPgPoolOptions(): Promise<PgPoolModuleOptions> | PgPoolModuleOptions;
};

export interface PgPoolModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<PgPoolOptionsFactory>;
  useClass?: Type<PgPoolOptionsFactory>;
  useFactory?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It's fine to accept `any` type here.
    ...args: any[]
  ) => Promise<PgPoolModuleOptions> | PgPoolModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

@Global()
@Module({})
export class PgPoolModule implements OnApplicationShutdown {
  constructor(@Inject(pg.Pool) private readonly pool: pg.Pool) {}

  public async onApplicationShutdown() {
    await this.pool.end();
  }

  /**
   * Configures the PgPoolModule NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRoot(
    ...options: ConstructorParameters<typeof pg.Pool>
  ): DynamicModule {
    const poolProvider: Provider<pg.Pool> = {
      provide: pg.Pool,
      useValue: new pg.Pool(...options)
    };

    return {
      module: PgPoolModule,
      imports: [],
      providers: [poolProvider],
      exports: [pg.Pool]
    };
  }

  /**
   * Configures the PgPoolModule NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRootAsync(
    asyncOptions: PgPoolModuleAsyncOptions
  ): DynamicModule {
    const dbProvider = {
      provide: pg.Pool,
      useFactory: async (
        ...options: ConstructorParameters<typeof pg.Pool>
      ): Promise<unknown> => new pg.Pool(...options),
      inject: [this.OPTIONS_PROVIDER_TOKEN]
    };

    const asyncProviders = this.asyncOptionsProviders(asyncOptions);

    return {
      module: PgPoolModule,
      imports: asyncOptions.imports,
      providers: [dbProvider, ...asyncProviders],
      exports: [dbProvider]
    };
  }

  private static asyncOptionsProviders(
    asyncOptions: PgPoolModuleAsyncOptions
  ): Provider[] {
    if (asyncOptions.useExisting || asyncOptions.useFactory)
      return [this.factoryOptionsProvider(asyncOptions)];

    const useClass = asyncOptions.useClass as Type<PgPoolOptionsFactory>;

    return [
      this.factoryOptionsProvider(asyncOptions),
      {
        provide: useClass,
        useClass
      }
    ];
  }

  private static factoryOptionsProvider(
    options: PgPoolModuleAsyncOptions
  ): Provider<PgPoolModuleOptions> {
    if (options.useFactory) {
      return {
        provide: this.OPTIONS_PROVIDER_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }

    const inject = [options.useClass || options.useExisting] as [
      Type<PgPoolOptionsFactory>
    ];

    return {
      provide: this.OPTIONS_PROVIDER_TOKEN,
      useFactory: (factory: PgPoolOptionsFactory) =>
        factory.createPgPoolOptions(),
      inject
    };
  }

  private static OPTIONS_PROVIDER_TOKEN = Symbol('__optionsProviderToken__');
}
