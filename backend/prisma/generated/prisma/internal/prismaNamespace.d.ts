import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Tenant: "Tenant";
    readonly User: "User";
    readonly Customer: "Customer";
    readonly Measurement: "Measurement";
    readonly Order: "Order";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "tenant" | "user" | "customer" | "measurement" | "order";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Tenant: {
            payload: Prisma.$TenantPayload<ExtArgs>;
            fields: Prisma.TenantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TenantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                findFirst: {
                    args: Prisma.TenantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                findMany: {
                    args: Prisma.TenantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                create: {
                    args: Prisma.TenantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                createMany: {
                    args: Prisma.TenantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                delete: {
                    args: Prisma.TenantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                update: {
                    args: Prisma.TenantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                deleteMany: {
                    args: Prisma.TenantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TenantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                upsert: {
                    args: Prisma.TenantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                aggregate: {
                    args: Prisma.TenantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTenant>;
                };
                groupBy: {
                    args: Prisma.TenantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TenantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TenantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TenantCountAggregateOutputType> | number;
                };
            };
        };
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Customer: {
            payload: Prisma.$CustomerPayload<ExtArgs>;
            fields: Prisma.CustomerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findMany: {
                    args: Prisma.CustomerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                create: {
                    args: Prisma.CustomerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                createMany: {
                    args: Prisma.CustomerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                delete: {
                    args: Prisma.CustomerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                update: {
                    args: Prisma.CustomerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomer>;
                };
                groupBy: {
                    args: Prisma.CustomerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCountAggregateOutputType> | number;
                };
            };
        };
        Measurement: {
            payload: Prisma.$MeasurementPayload<ExtArgs>;
            fields: Prisma.MeasurementFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MeasurementFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MeasurementFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>;
                };
                findFirst: {
                    args: Prisma.MeasurementFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MeasurementFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>;
                };
                findMany: {
                    args: Prisma.MeasurementFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>[];
                };
                create: {
                    args: Prisma.MeasurementCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>;
                };
                createMany: {
                    args: Prisma.MeasurementCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MeasurementCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>[];
                };
                delete: {
                    args: Prisma.MeasurementDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>;
                };
                update: {
                    args: Prisma.MeasurementUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>;
                };
                deleteMany: {
                    args: Prisma.MeasurementDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MeasurementUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MeasurementUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>[];
                };
                upsert: {
                    args: Prisma.MeasurementUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MeasurementPayload>;
                };
                aggregate: {
                    args: Prisma.MeasurementAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMeasurement>;
                };
                groupBy: {
                    args: Prisma.MeasurementGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MeasurementGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MeasurementCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MeasurementCountAggregateOutputType> | number;
                };
            };
        };
        Order: {
            payload: Prisma.$OrderPayload<ExtArgs>;
            fields: Prisma.OrderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                findFirst: {
                    args: Prisma.OrderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                findMany: {
                    args: Prisma.OrderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                create: {
                    args: Prisma.OrderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                createMany: {
                    args: Prisma.OrderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                delete: {
                    args: Prisma.OrderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                update: {
                    args: Prisma.OrderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                deleteMany: {
                    args: Prisma.OrderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                upsert: {
                    args: Prisma.OrderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                aggregate: {
                    args: Prisma.OrderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrder>;
                };
                groupBy: {
                    args: Prisma.OrderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const TenantScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly permissions: "permissions";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly name: "name";
    readonly phone: "phone";
    readonly email: "email";
    readonly preferredLocale: "preferredLocale";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const MeasurementScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly customerId: "customerId";
    readonly takenByUserId: "takenByUserId";
    readonly unit: "unit";
    readonly chest: "chest";
    readonly waist: "waist";
    readonly shoulder: "shoulder";
    readonly sleeve: "sleeve";
    readonly neck: "neck";
    readonly shirtLength: "shirtLength";
    readonly trouserLength: "trouserLength";
    readonly hip: "hip";
    readonly thigh: "thigh";
    readonly chestPocket: "chestPocket";
    readonly sidePockets: "sidePockets";
    readonly collar: "collar";
    readonly placket: "placket";
    readonly gera: "gera";
    readonly notes: "notes";
    readonly emailSentAt: "emailSentAt";
    readonly createdAt: "createdAt";
};
export type MeasurementScalarFieldEnum = (typeof MeasurementScalarFieldEnum)[keyof typeof MeasurementScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: "id";
    readonly tenantId: "tenantId";
    readonly customerId: "customerId";
    readonly createdByUserId: "createdByUserId";
    readonly measurementId: "measurementId";
    readonly orderNumber: "orderNumber";
    readonly status: "status";
    readonly garmentType: "garmentType";
    readonly deliveryDate: "deliveryDate";
    readonly fabricSource: "fabricSource";
    readonly fabricNotes: "fabricNotes";
    readonly chestPocket: "chestPocket";
    readonly sidePockets: "sidePockets";
    readonly collar: "collar";
    readonly placket: "placket";
    readonly gera: "gera";
    readonly styleNotes: "styleNotes";
    readonly advancePaid: "advancePaid";
    readonly totalPrice: "totalPrice";
    readonly balanceDue: "balanceDue";
    readonly isRush: "isRush";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumLocalePreferenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LocalePreference'>;
export type ListEnumLocalePreferenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LocalePreference[]'>;
export type EnumMeasurementUnitFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MeasurementUnit'>;
export type ListEnumMeasurementUnitFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MeasurementUnit[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumPocketOptionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PocketOption'>;
export type ListEnumPocketOptionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PocketOption[]'>;
export type EnumCollarTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CollarType'>;
export type ListEnumCollarTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CollarType[]'>;
export type EnumPlacketTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlacketType'>;
export type ListEnumPlacketTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlacketType[]'>;
export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>;
export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>;
export type EnumGarmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GarmentType'>;
export type ListEnumGarmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GarmentType[]'>;
export type EnumFabricSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FabricSource'>;
export type ListEnumFabricSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FabricSource[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    tenant?: Prisma.TenantOmit;
    user?: Prisma.UserOmit;
    customer?: Prisma.CustomerOmit;
    measurement?: Prisma.MeasurementOmit;
    order?: Prisma.OrderOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
