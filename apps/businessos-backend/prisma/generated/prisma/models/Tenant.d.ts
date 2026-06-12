import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type TenantModel = runtime.Types.Result.DefaultSelection<Prisma.$TenantPayload>;
export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
};
export type TenantMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TenantMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TenantCountAggregateOutputType = {
    id: number;
    name: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TenantMinAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TenantMaxAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TenantCountAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TenantAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TenantCountAggregateInputType;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
};
export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
    [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTenant[P]> : Prisma.GetScalarType<T[P], AggregateTenant[P]>;
};
export type TenantGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithAggregationInput | Prisma.TenantOrderByWithAggregationInput[];
    by: Prisma.TenantScalarFieldEnum[] | Prisma.TenantScalarFieldEnum;
    having?: Prisma.TenantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TenantCountAggregateInputType | true;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
};
export type TenantGroupByOutputType = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
};
export type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TenantGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TenantGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TenantGroupByOutputType[P]>;
}>>;
export type TenantWhereInput = {
    AND?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    OR?: Prisma.TenantWhereInput[];
    NOT?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    id?: Prisma.UuidFilter<"Tenant"> | string;
    name?: Prisma.StringFilter<"Tenant"> | string;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    customers?: Prisma.CustomerListRelationFilter;
    measurements?: Prisma.MeasurementListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
};
export type TenantOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    users?: Prisma.UserOrderByRelationAggregateInput;
    customers?: Prisma.CustomerOrderByRelationAggregateInput;
    measurements?: Prisma.MeasurementOrderByRelationAggregateInput;
    orders?: Prisma.OrderOrderByRelationAggregateInput;
};
export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    OR?: Prisma.TenantWhereInput[];
    NOT?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    name?: Prisma.StringFilter<"Tenant"> | string;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    customers?: Prisma.CustomerListRelationFilter;
    measurements?: Prisma.MeasurementListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
}, "id">;
export type TenantOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TenantCountOrderByAggregateInput;
    _max?: Prisma.TenantMaxOrderByAggregateInput;
    _min?: Prisma.TenantMinOrderByAggregateInput;
};
export type TenantScalarWhereWithAggregatesInput = {
    AND?: Prisma.TenantScalarWhereWithAggregatesInput | Prisma.TenantScalarWhereWithAggregatesInput[];
    OR?: Prisma.TenantScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TenantScalarWhereWithAggregatesInput | Prisma.TenantScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Tenant"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Tenant"> | Date | string;
};
export type TenantCreateInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutTenantInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutTenantInput;
    measurements?: Prisma.MeasurementCreateNestedManyWithoutTenantInput;
    orders?: Prisma.OrderCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutTenantInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutTenantInput;
    measurements?: Prisma.MeasurementUncheckedCreateNestedManyWithoutTenantInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutTenantNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutTenantNestedInput;
    measurements?: Prisma.MeasurementUpdateManyWithoutTenantNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutTenantNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutTenantNestedInput;
    measurements?: Prisma.MeasurementUncheckedUpdateManyWithoutTenantNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateManyInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TenantUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantNullableScalarRelationFilter = {
    is?: Prisma.TenantWhereInput | null;
    isNot?: Prisma.TenantWhereInput | null;
};
export type TenantScalarRelationFilter = {
    is?: Prisma.TenantWhereInput;
    isNot?: Prisma.TenantWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type TenantCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutUsersInput, Prisma.TenantUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutUsersInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutUsersInput, Prisma.TenantUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.TenantUpsertWithoutUsersInput;
    disconnect?: Prisma.TenantWhereInput | boolean;
    delete?: Prisma.TenantWhereInput | boolean;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutUsersInput, Prisma.TenantUpdateWithoutUsersInput>, Prisma.TenantUncheckedUpdateWithoutUsersInput>;
};
export type TenantCreateNestedOneWithoutCustomersInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutCustomersInput, Prisma.TenantUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutCustomersInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutCustomersNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutCustomersInput, Prisma.TenantUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutCustomersInput;
    upsert?: Prisma.TenantUpsertWithoutCustomersInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutCustomersInput, Prisma.TenantUpdateWithoutCustomersInput>, Prisma.TenantUncheckedUpdateWithoutCustomersInput>;
};
export type TenantCreateNestedOneWithoutMeasurementsInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutMeasurementsInput, Prisma.TenantUncheckedCreateWithoutMeasurementsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutMeasurementsInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutMeasurementsNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutMeasurementsInput, Prisma.TenantUncheckedCreateWithoutMeasurementsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutMeasurementsInput;
    upsert?: Prisma.TenantUpsertWithoutMeasurementsInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutMeasurementsInput, Prisma.TenantUpdateWithoutMeasurementsInput>, Prisma.TenantUncheckedUpdateWithoutMeasurementsInput>;
};
export type TenantCreateNestedOneWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutOrdersInput, Prisma.TenantUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutOrdersInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutOrdersInput, Prisma.TenantUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutOrdersInput;
    upsert?: Prisma.TenantUpsertWithoutOrdersInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutOrdersInput, Prisma.TenantUpdateWithoutOrdersInput>, Prisma.TenantUncheckedUpdateWithoutOrdersInput>;
};
export type TenantCreateWithoutUsersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customers?: Prisma.CustomerCreateNestedManyWithoutTenantInput;
    measurements?: Prisma.MeasurementCreateNestedManyWithoutTenantInput;
    orders?: Prisma.OrderCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutTenantInput;
    measurements?: Prisma.MeasurementUncheckedCreateNestedManyWithoutTenantInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutUsersInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutUsersInput, Prisma.TenantUncheckedCreateWithoutUsersInput>;
};
export type TenantUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutUsersInput, Prisma.TenantUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutUsersInput, Prisma.TenantUncheckedCreateWithoutUsersInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutUsersInput, Prisma.TenantUncheckedUpdateWithoutUsersInput>;
};
export type TenantUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customers?: Prisma.CustomerUpdateManyWithoutTenantNestedInput;
    measurements?: Prisma.MeasurementUpdateManyWithoutTenantNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutTenantNestedInput;
    measurements?: Prisma.MeasurementUncheckedUpdateManyWithoutTenantNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutCustomersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutTenantInput;
    measurements?: Prisma.MeasurementCreateNestedManyWithoutTenantInput;
    orders?: Prisma.OrderCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutCustomersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutTenantInput;
    measurements?: Prisma.MeasurementUncheckedCreateNestedManyWithoutTenantInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutCustomersInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutCustomersInput, Prisma.TenantUncheckedCreateWithoutCustomersInput>;
};
export type TenantUpsertWithoutCustomersInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutCustomersInput, Prisma.TenantUncheckedUpdateWithoutCustomersInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutCustomersInput, Prisma.TenantUncheckedCreateWithoutCustomersInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutCustomersInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutCustomersInput, Prisma.TenantUncheckedUpdateWithoutCustomersInput>;
};
export type TenantUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutTenantNestedInput;
    measurements?: Prisma.MeasurementUpdateManyWithoutTenantNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutTenantNestedInput;
    measurements?: Prisma.MeasurementUncheckedUpdateManyWithoutTenantNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutMeasurementsInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutTenantInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutTenantInput;
    orders?: Prisma.OrderCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutMeasurementsInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutTenantInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutTenantInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutMeasurementsInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutMeasurementsInput, Prisma.TenantUncheckedCreateWithoutMeasurementsInput>;
};
export type TenantUpsertWithoutMeasurementsInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutMeasurementsInput, Prisma.TenantUncheckedUpdateWithoutMeasurementsInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutMeasurementsInput, Prisma.TenantUncheckedCreateWithoutMeasurementsInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutMeasurementsInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutMeasurementsInput, Prisma.TenantUncheckedUpdateWithoutMeasurementsInput>;
};
export type TenantUpdateWithoutMeasurementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutTenantNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutTenantNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutMeasurementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutTenantNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutTenantNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutOrdersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutTenantInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutTenantInput;
    measurements?: Prisma.MeasurementCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutOrdersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutTenantInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutTenantInput;
    measurements?: Prisma.MeasurementUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutOrdersInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutOrdersInput, Prisma.TenantUncheckedCreateWithoutOrdersInput>;
};
export type TenantUpsertWithoutOrdersInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutOrdersInput, Prisma.TenantUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutOrdersInput, Prisma.TenantUncheckedCreateWithoutOrdersInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutOrdersInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutOrdersInput, Prisma.TenantUncheckedUpdateWithoutOrdersInput>;
};
export type TenantUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutTenantNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutTenantNestedInput;
    measurements?: Prisma.MeasurementUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutTenantNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutTenantNestedInput;
    measurements?: Prisma.MeasurementUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCountOutputType = {
    users: number;
    customers: number;
    measurements: number;
    orders: number;
};
export type TenantCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs;
    customers?: boolean | TenantCountOutputTypeCountCustomersArgs;
    measurements?: boolean | TenantCountOutputTypeCountMeasurementsArgs;
    orders?: boolean | TenantCountOutputTypeCountOrdersArgs;
};
export type TenantCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantCountOutputTypeSelect<ExtArgs> | null;
};
export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type TenantCountOutputTypeCountCustomersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerWhereInput;
};
export type TenantCountOutputTypeCountMeasurementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MeasurementWhereInput;
};
export type TenantCountOutputTypeCountOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
};
export type TenantSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    users?: boolean | Prisma.Tenant$usersArgs<ExtArgs>;
    customers?: boolean | Prisma.Tenant$customersArgs<ExtArgs>;
    measurements?: boolean | Prisma.Tenant$measurementsArgs<ExtArgs>;
    orders?: boolean | Prisma.Tenant$ordersArgs<ExtArgs>;
    _count?: boolean | Prisma.TenantCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectScalar = {
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TenantOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["tenant"]>;
export type TenantInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.Tenant$usersArgs<ExtArgs>;
    customers?: boolean | Prisma.Tenant$customersArgs<ExtArgs>;
    measurements?: boolean | Prisma.Tenant$measurementsArgs<ExtArgs>;
    orders?: boolean | Prisma.Tenant$ordersArgs<ExtArgs>;
    _count?: boolean | Prisma.TenantCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TenantIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type TenantIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $TenantPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Tenant";
    objects: {
        users: Prisma.$UserPayload<ExtArgs>[];
        customers: Prisma.$CustomerPayload<ExtArgs>[];
        measurements: Prisma.$MeasurementPayload<ExtArgs>[];
        orders: Prisma.$OrderPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["tenant"]>;
    composites: {};
};
export type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TenantPayload, S>;
export type TenantCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TenantCountAggregateInputType | true;
};
export interface TenantDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Tenant'];
        meta: {
            name: 'Tenant';
        };
    };
    findUnique<T extends TenantFindUniqueArgs>(args: Prisma.SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TenantFindFirstArgs>(args?: Prisma.SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TenantFindManyArgs>(args?: Prisma.SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TenantCreateArgs>(args: Prisma.SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TenantCreateManyArgs>(args?: Prisma.SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TenantDeleteArgs>(args: Prisma.SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TenantUpdateArgs>(args: Prisma.SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TenantDeleteManyArgs>(args?: Prisma.SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TenantUpdateManyArgs>(args: Prisma.SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TenantUpsertArgs>(args: Prisma.SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TenantCountArgs>(args?: Prisma.Subset<T, TenantCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TenantCountAggregateOutputType> : number>;
    aggregate<T extends TenantAggregateArgs>(args: Prisma.Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>;
    groupBy<T extends TenantGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TenantGroupByArgs['orderBy'];
    } : {
        orderBy?: TenantGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TenantFieldRefs;
}
export interface Prisma__TenantClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.Tenant$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    customers<T extends Prisma.Tenant$customersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$customersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    measurements<T extends Prisma.Tenant$measurementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$measurementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MeasurementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    orders<T extends Prisma.Tenant$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TenantFieldRefs {
    readonly id: Prisma.FieldRef<"Tenant", 'String'>;
    readonly name: Prisma.FieldRef<"Tenant", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
}
export type TenantFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantCreateInput, Prisma.TenantUncheckedCreateInput>;
};
export type TenantCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TenantCreateManyInput | Prisma.TenantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TenantCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    data: Prisma.TenantCreateManyInput | Prisma.TenantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TenantUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUpdateInput, Prisma.TenantUncheckedUpdateInput>;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyInput>;
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type TenantUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyInput>;
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type TenantUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateInput, Prisma.TenantUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TenantUpdateInput, Prisma.TenantUncheckedUpdateInput>;
};
export type TenantDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type Tenant$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Tenant$customersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput | Prisma.CustomerOrderByWithRelationInput[];
    cursor?: Prisma.CustomerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerScalarFieldEnum | Prisma.CustomerScalarFieldEnum[];
};
export type Tenant$measurementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Tenant$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TenantDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
};
