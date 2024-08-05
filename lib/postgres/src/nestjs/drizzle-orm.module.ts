import { DrizzleConfig } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { Client } from 'pg';
import {
  DynamicModule,
  InjectionToken,
  Module,
  ModuleMetadata,
  OptionalFactoryDependency,
  Provider,
  Type
} from '@nestjs/common';

export type DrizzleOrmModuleOptions = {
  db: Client;
  options?: DrizzleConfig;
};

export type DrizzleOrmOptionsFactory = {
  createDrizzleOrmOptions():
    | Promise<DrizzleOrmModuleOptions>
    | DrizzleOrmModuleOptions;
};

export interface DrizzleOrmModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<DrizzleOrmOptionsFactory>;
  useClass?: Type<DrizzleOrmOptionsFactory>;
  useFactory?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It's fine to accept `any` type here.
    ...args: any[]
  ) => Promise<DrizzleOrmModuleOptions> | DrizzleOrmModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

@Module({})
export class DrizzleOrmModule {
  /**
   * Configures the DrizzleOrmModule NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRoot({
    db,
    options
  }: DrizzleOrmModuleOptions): DynamicModule {
    const dbProvider: Provider<PgDatabase<PgQueryResultHKT>> = {
      provide: PgDatabase,
      useValue: drizzle(db, options)
    };

    return {
      module: DrizzleOrmModule,
      imports: [],
      providers: [dbProvider],
      exports: [PgDatabase]
    };
  }

  /**
   * Configures the DrizzleOrmModule NestJS module.
   * Configurations are only loaded once because the internal module is global.
   */
  public static forRootAsync(
    asyncOptions: DrizzleOrmModuleAsyncOptions
  ): DynamicModule {
    const dbProvider = {
      provide: PgDatabase,
      useFactory: async ({
        options = {},
        db
      }: DrizzleOrmModuleOptions): Promise<unknown> => drizzle(db, options),
      inject: [this.OPTIONS_PROVIDER_TOKEN]
    };

    const asyncProviders = this.asyncOptionsProviders(asyncOptions);

    return {
      module: DrizzleOrmModule,
      imports: asyncOptions.imports,
      providers: [dbProvider, ...asyncProviders],
      exports: [PgDatabase]
    };
  }

  private static asyncOptionsProviders(
    asyncOptions: DrizzleOrmModuleAsyncOptions
  ): Provider[] {
    if (asyncOptions.useExisting || asyncOptions.useFactory)
      return [this.factoryOptionsProvider(asyncOptions)];

    const useClass = asyncOptions.useClass as Type<DrizzleOrmOptionsFactory>;

    return [
      this.factoryOptionsProvider(asyncOptions),
      {
        provide: useClass,
        useClass
      }
    ];
  }

  private static factoryOptionsProvider(
    options: DrizzleOrmModuleAsyncOptions
  ): Provider<DrizzleOrmModuleOptions> {
    if (options.useFactory) {
      return {
        provide: this.OPTIONS_PROVIDER_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }

    const inject = [options.useClass || options.useExisting] as [
      Type<DrizzleOrmOptionsFactory>
    ];

    return {
      provide: this.OPTIONS_PROVIDER_TOKEN,
      useFactory: (factory: DrizzleOrmOptionsFactory) =>
        factory.createDrizzleOrmOptions(),
      inject
    };
  }

  private static OPTIONS_PROVIDER_TOKEN = Symbol('OPTIONS_PROVIDER_TOKEN');
}
