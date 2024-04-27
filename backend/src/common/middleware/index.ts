import { RequestHandler } from "express";
import { DynamicModule, Inject, Module, RequestMethod } from "@nestjs/common";
import { MiddlewareConfigProxy, MiddlewareConsumer, ModuleMetadata, Provider, Type } from "@nestjs/common/interfaces";

export type SyncOptions<T> = T & {
  forRoutes?: Parameters<MiddlewareConfigProxy["forRoutes"]>;
  exclude?: Parameters<MiddlewareConfigProxy["exclude"]>;
};

export interface IAsyncOptions<T> extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => SyncOptions<T> | Promise<SyncOptions<T>>;
  inject?: any[];
}

export interface ICoreModule<T> {
  forRoot(options?: SyncOptions<T>): DynamicModule;
  forRootAsync(options: IAsyncOptions<T>): DynamicModule;
}

const DEFAULT_ROUTES = [{ path: "*", method: RequestMethod.ALL }];
const DEFAULT_OPTIONS: SyncOptions<any> = {};

export function createModule<T>(
  createMiddlewares: (options: T) => RequestHandler | Type<any> | Array<Type<any> | RequestHandler>,
): ICoreModule<T> {
  const optionsToken = Symbol("");

  @Module({})
  class CoreModule {
    static forRoot(options: SyncOptions<T>): DynamicModule {
      const optionsProvider: Provider<SyncOptions<T> | null> = {
        provide: optionsToken,
        useValue: options || null,
      };

      return {
        module: CoreModule,
        providers: [optionsProvider],
      };
    }

    static forRootAsync(options: IAsyncOptions<T>): DynamicModule {
      const optionsProvider: Provider<SyncOptions<T> | Promise<SyncOptions<T>>> = {
        provide: optionsToken,
        useFactory: options.useFactory,
        inject: options.inject,
      };

      return {
        module: CoreModule,
        imports: options.imports,
        providers: [optionsProvider],
      };
    }

    constructor(
      @Inject(optionsToken)
      private readonly options: SyncOptions<T> | null,
    ) {}

    configure(consumer: MiddlewareConsumer) {
      const { exclude, forRoutes = DEFAULT_ROUTES, ...createMiddlewaresOpts } = this.options || DEFAULT_OPTIONS;
      const result = createMiddlewares(createMiddlewaresOpts as T);

      let middlewares: Array<RequestHandler | Type<any>>;

      if (Array.isArray(result)) {
        middlewares = result;
      } else {
        middlewares = [result];
      }

      if (exclude) {
        consumer
          .apply(...middlewares)
          .exclude(...exclude)
          .forRoutes(...forRoutes);
      } else {
        consumer.apply(...middlewares).forRoutes(...forRoutes);
      }
    }
  }

  return CoreModule;
}
