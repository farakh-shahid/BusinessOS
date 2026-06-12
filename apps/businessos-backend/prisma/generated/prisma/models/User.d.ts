import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    email: string | null;
    passwordHash: string | null;
    role: $Enums.UserRole | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    email: string | null;
    passwordHash: string | null;
    role: $Enums.UserRole | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    tenantId: number;
    name: number;
    email: number;
    passwordHash: number;
    role: number;
    permissions: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    email?: true;
    passwordHash?: true;
    role?: true;
    permissions?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    tenantId: string | null;
    name: string;
    email: string;
    passwordHash: string;
    role: $Enums.UserRole;
    permissions: runtime.JsonValue;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.UuidFilter<"User"> | string;
    tenantId?: Prisma.UuidNullableFilter<"User"> | string | null;
    name?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    permissions?: Prisma.JsonFilter<"User">;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantNullableScalarRelationFilter, Prisma.TenantWhereInput> | null;
    measurementsTaken?: Prisma.MeasurementListRelationFilter;
    ordersCreated?: Prisma.OrderListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    measurementsTaken?: Prisma.MeasurementOrderByRelationAggregateInput;
    ordersCreated?: Prisma.OrderOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    tenantId?: Prisma.UuidNullableFilter<"User"> | string | null;
    name?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    permissions?: Prisma.JsonFilter<"User">;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantNullableScalarRelationFilter, Prisma.TenantWhereInput> | null;
    measurementsTaken?: Prisma.MeasurementListRelationFilter;
    ordersCreated?: Prisma.OrderListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"User"> | string;
    tenantId?: Prisma.UuidNullableWithAggregatesFilter<"User"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    role?: Prisma.EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole;
    permissions?: Prisma.JsonWithAggregatesFilter<"User">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant?: Prisma.TenantCreateNestedOneWithoutUsersInput;
    measurementsTaken?: Prisma.MeasurementCreateNestedManyWithoutTakenByInput;
    ordersCreated?: Prisma.OrderCreateNestedManyWithoutCreatedByInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    tenantId?: string | null;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    measurementsTaken?: Prisma.MeasurementUncheckedCreateNestedManyWithoutTakenByInput;
    ordersCreated?: Prisma.OrderUncheckedCreateNestedManyWithoutCreatedByInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneWithoutUsersNestedInput;
    measurementsTaken?: Prisma.MeasurementUpdateManyWithoutTakenByNestedInput;
    ordersCreated?: Prisma.OrderUpdateManyWithoutCreatedByNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    measurementsTaken?: Prisma.MeasurementUncheckedUpdateManyWithoutTakenByNestedInput;
    ordersCreated?: Prisma.OrderUncheckedUpdateManyWithoutCreatedByNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    tenantId?: string | null;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserListRelationFilter = {
    every?: Prisma.UserWhereInput;
    some?: Prisma.UserWhereInput;
    none?: Prisma.UserWhereInput;
};
export type UserOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTenantInput, Prisma.UserUncheckedCreateWithoutTenantInput> | Prisma.UserCreateWithoutTenantInput[] | Prisma.UserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTenantInput | Prisma.UserCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.UserCreateManyTenantInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTenantInput, Prisma.UserUncheckedCreateWithoutTenantInput> | Prisma.UserCreateWithoutTenantInput[] | Prisma.UserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTenantInput | Prisma.UserCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.UserCreateManyTenantInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTenantInput, Prisma.UserUncheckedCreateWithoutTenantInput> | Prisma.UserCreateWithoutTenantInput[] | Prisma.UserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTenantInput | Prisma.UserCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutTenantInput | Prisma.UserUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.UserCreateManyTenantInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutTenantInput | Prisma.UserUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutTenantInput | Prisma.UserUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTenantInput, Prisma.UserUncheckedCreateWithoutTenantInput> | Prisma.UserCreateWithoutTenantInput[] | Prisma.UserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTenantInput | Prisma.UserCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutTenantInput | Prisma.UserUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.UserCreateManyTenantInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutTenantInput | Prisma.UserUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutTenantInput | Prisma.UserUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type UserCreateNestedOneWithoutMeasurementsTakenInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMeasurementsTakenInput, Prisma.UserUncheckedCreateWithoutMeasurementsTakenInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMeasurementsTakenInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutMeasurementsTakenNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMeasurementsTakenInput, Prisma.UserUncheckedCreateWithoutMeasurementsTakenInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMeasurementsTakenInput;
    upsert?: Prisma.UserUpsertWithoutMeasurementsTakenInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutMeasurementsTakenInput, Prisma.UserUpdateWithoutMeasurementsTakenInput>, Prisma.UserUncheckedUpdateWithoutMeasurementsTakenInput>;
};
export type UserCreateNestedOneWithoutOrdersCreatedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOrdersCreatedInput, Prisma.UserUncheckedCreateWithoutOrdersCreatedInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOrdersCreatedInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutOrdersCreatedNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOrdersCreatedInput, Prisma.UserUncheckedCreateWithoutOrdersCreatedInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOrdersCreatedInput;
    upsert?: Prisma.UserUpsertWithoutOrdersCreatedInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOrdersCreatedInput, Prisma.UserUpdateWithoutOrdersCreatedInput>, Prisma.UserUncheckedUpdateWithoutOrdersCreatedInput>;
};
export type UserCreateWithoutTenantInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    measurementsTaken?: Prisma.MeasurementCreateNestedManyWithoutTakenByInput;
    ordersCreated?: Prisma.OrderCreateNestedManyWithoutCreatedByInput;
};
export type UserUncheckedCreateWithoutTenantInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    measurementsTaken?: Prisma.MeasurementUncheckedCreateNestedManyWithoutTakenByInput;
    ordersCreated?: Prisma.OrderUncheckedCreateNestedManyWithoutCreatedByInput;
};
export type UserCreateOrConnectWithoutTenantInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTenantInput, Prisma.UserUncheckedCreateWithoutTenantInput>;
};
export type UserCreateManyTenantInputEnvelope = {
    data: Prisma.UserCreateManyTenantInput | Prisma.UserCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type UserUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.UserWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserUpdateWithoutTenantInput, Prisma.UserUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTenantInput, Prisma.UserUncheckedCreateWithoutTenantInput>;
};
export type UserUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTenantInput, Prisma.UserUncheckedUpdateWithoutTenantInput>;
};
export type UserUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.UserScalarWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyWithoutTenantInput>;
};
export type UserScalarWhereInput = {
    AND?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    OR?: Prisma.UserScalarWhereInput[];
    NOT?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    id?: Prisma.UuidFilter<"User"> | string;
    tenantId?: Prisma.UuidNullableFilter<"User"> | string | null;
    name?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    permissions?: Prisma.JsonFilter<"User">;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
};
export type UserCreateWithoutMeasurementsTakenInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant?: Prisma.TenantCreateNestedOneWithoutUsersInput;
    ordersCreated?: Prisma.OrderCreateNestedManyWithoutCreatedByInput;
};
export type UserUncheckedCreateWithoutMeasurementsTakenInput = {
    id?: string;
    tenantId?: string | null;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ordersCreated?: Prisma.OrderUncheckedCreateNestedManyWithoutCreatedByInput;
};
export type UserCreateOrConnectWithoutMeasurementsTakenInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutMeasurementsTakenInput, Prisma.UserUncheckedCreateWithoutMeasurementsTakenInput>;
};
export type UserUpsertWithoutMeasurementsTakenInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutMeasurementsTakenInput, Prisma.UserUncheckedUpdateWithoutMeasurementsTakenInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutMeasurementsTakenInput, Prisma.UserUncheckedCreateWithoutMeasurementsTakenInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutMeasurementsTakenInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutMeasurementsTakenInput, Prisma.UserUncheckedUpdateWithoutMeasurementsTakenInput>;
};
export type UserUpdateWithoutMeasurementsTakenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneWithoutUsersNestedInput;
    ordersCreated?: Prisma.OrderUpdateManyWithoutCreatedByNestedInput;
};
export type UserUncheckedUpdateWithoutMeasurementsTakenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ordersCreated?: Prisma.OrderUncheckedUpdateManyWithoutCreatedByNestedInput;
};
export type UserCreateWithoutOrdersCreatedInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant?: Prisma.TenantCreateNestedOneWithoutUsersInput;
    measurementsTaken?: Prisma.MeasurementCreateNestedManyWithoutTakenByInput;
};
export type UserUncheckedCreateWithoutOrdersCreatedInput = {
    id?: string;
    tenantId?: string | null;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    measurementsTaken?: Prisma.MeasurementUncheckedCreateNestedManyWithoutTakenByInput;
};
export type UserCreateOrConnectWithoutOrdersCreatedInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOrdersCreatedInput, Prisma.UserUncheckedCreateWithoutOrdersCreatedInput>;
};
export type UserUpsertWithoutOrdersCreatedInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOrdersCreatedInput, Prisma.UserUncheckedUpdateWithoutOrdersCreatedInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOrdersCreatedInput, Prisma.UserUncheckedCreateWithoutOrdersCreatedInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOrdersCreatedInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOrdersCreatedInput, Prisma.UserUncheckedUpdateWithoutOrdersCreatedInput>;
};
export type UserUpdateWithoutOrdersCreatedInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneWithoutUsersNestedInput;
    measurementsTaken?: Prisma.MeasurementUpdateManyWithoutTakenByNestedInput;
};
export type UserUncheckedUpdateWithoutOrdersCreatedInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    measurementsTaken?: Prisma.MeasurementUncheckedUpdateManyWithoutTakenByNestedInput;
};
export type UserCreateManyTenantInput = {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    measurementsTaken?: Prisma.MeasurementUpdateManyWithoutTakenByNestedInput;
    ordersCreated?: Prisma.OrderUpdateManyWithoutCreatedByNestedInput;
};
export type UserUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    measurementsTaken?: Prisma.MeasurementUncheckedUpdateManyWithoutTakenByNestedInput;
    ordersCreated?: Prisma.OrderUncheckedUpdateManyWithoutCreatedByNestedInput;
};
export type UserUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    permissions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOutputType = {
    measurementsTaken: number;
    ordersCreated: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    measurementsTaken?: boolean | UserCountOutputTypeCountMeasurementsTakenArgs;
    ordersCreated?: boolean | UserCountOutputTypeCountOrdersCreatedArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountMeasurementsTakenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MeasurementWhereInput;
};
export type UserCountOutputTypeCountOrdersCreatedArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    permissions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.User$tenantArgs<ExtArgs>;
    measurementsTaken?: boolean | Prisma.User$measurementsTakenArgs<ExtArgs>;
    ordersCreated?: boolean | Prisma.User$ordersCreatedArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    permissions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.User$tenantArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    permissions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.User$tenantArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    permissions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "name" | "email" | "passwordHash" | "role" | "permissions" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.User$tenantArgs<ExtArgs>;
    measurementsTaken?: boolean | Prisma.User$measurementsTakenArgs<ExtArgs>;
    ordersCreated?: boolean | Prisma.User$ordersCreatedArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.User$tenantArgs<ExtArgs>;
};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.User$tenantArgs<ExtArgs>;
};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs> | null;
        measurementsTaken: Prisma.$MeasurementPayload<ExtArgs>[];
        ordersCreated: Prisma.$OrderPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string | null;
        name: string;
        email: string;
        passwordHash: string;
        role: $Enums.UserRole;
        permissions: runtime.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.User$tenantArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$tenantArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    measurementsTaken<T extends Prisma.User$measurementsTakenArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$measurementsTakenArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MeasurementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    ordersCreated<T extends Prisma.User$ordersCreatedArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$ordersCreatedArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly tenantId: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'UserRole'>;
    readonly permissions: Prisma.FieldRef<"User", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
    include?: Prisma.UserIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$tenantArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
};
export type User$measurementsTakenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MeasurementSelect<ExtArgs> | null;
    omit?: Prisma.MeasurementOmit<ExtArgs> | null;
    include?: Prisma.MeasurementInclude<ExtArgs> | null;
    where?: Prisma.MeasurementWhereInput;
    orderBy?: Prisma.MeasurementOrderByWithRelationInput | Prisma.MeasurementOrderByWithRelationInput[];
    cursor?: Prisma.MeasurementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MeasurementScalarFieldEnum | Prisma.MeasurementScalarFieldEnum[];
};
export type User$ordersCreatedArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderSelect<ExtArgs> | null;
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    cursor?: Prisma.OrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
