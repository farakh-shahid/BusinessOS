import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type CustomerModel = runtime.Types.Result.DefaultSelection<Prisma.$CustomerPayload>;
export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null;
    _min: CustomerMinAggregateOutputType | null;
    _max: CustomerMaxAggregateOutputType | null;
};
export type CustomerMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    preferredLocale: $Enums.LocalePreference | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CustomerMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    preferredLocale: $Enums.LocalePreference | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CustomerCountAggregateOutputType = {
    id: number;
    tenantId: number;
    name: number;
    phone: number;
    email: number;
    preferredLocale: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CustomerMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    phone?: true;
    email?: true;
    preferredLocale?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CustomerMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    phone?: true;
    email?: true;
    preferredLocale?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CustomerCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    phone?: true;
    email?: true;
    preferredLocale?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CustomerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput | Prisma.CustomerOrderByWithRelationInput[];
    cursor?: Prisma.CustomerWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CustomerCountAggregateInputType;
    _min?: CustomerMinAggregateInputType;
    _max?: CustomerMaxAggregateInputType;
};
export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
    [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCustomer[P]> : Prisma.GetScalarType<T[P], AggregateCustomer[P]>;
};
export type CustomerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithAggregationInput | Prisma.CustomerOrderByWithAggregationInput[];
    by: Prisma.CustomerScalarFieldEnum[] | Prisma.CustomerScalarFieldEnum;
    having?: Prisma.CustomerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CustomerCountAggregateInputType | true;
    _min?: CustomerMinAggregateInputType;
    _max?: CustomerMaxAggregateInputType;
};
export type CustomerGroupByOutputType = {
    id: string;
    tenantId: string;
    name: string;
    phone: string;
    email: string | null;
    preferredLocale: $Enums.LocalePreference;
    createdAt: Date;
    updatedAt: Date;
    _count: CustomerCountAggregateOutputType | null;
    _min: CustomerMinAggregateOutputType | null;
    _max: CustomerMaxAggregateOutputType | null;
};
export type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CustomerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CustomerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CustomerGroupByOutputType[P]>;
}>>;
export type CustomerWhereInput = {
    AND?: Prisma.CustomerWhereInput | Prisma.CustomerWhereInput[];
    OR?: Prisma.CustomerWhereInput[];
    NOT?: Prisma.CustomerWhereInput | Prisma.CustomerWhereInput[];
    id?: Prisma.UuidFilter<"Customer"> | string;
    tenantId?: Prisma.UuidFilter<"Customer"> | string;
    name?: Prisma.StringFilter<"Customer"> | string;
    phone?: Prisma.StringFilter<"Customer"> | string;
    email?: Prisma.StringNullableFilter<"Customer"> | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFilter<"Customer"> | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFilter<"Customer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Customer"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    measurements?: Prisma.MeasurementListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
};
export type CustomerOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredLocale?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    measurements?: Prisma.MeasurementOrderByRelationAggregateInput;
    orders?: Prisma.OrderOrderByRelationAggregateInput;
};
export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_phone?: Prisma.CustomerTenantIdPhoneCompoundUniqueInput;
    AND?: Prisma.CustomerWhereInput | Prisma.CustomerWhereInput[];
    OR?: Prisma.CustomerWhereInput[];
    NOT?: Prisma.CustomerWhereInput | Prisma.CustomerWhereInput[];
    tenantId?: Prisma.UuidFilter<"Customer"> | string;
    name?: Prisma.StringFilter<"Customer"> | string;
    phone?: Prisma.StringFilter<"Customer"> | string;
    email?: Prisma.StringNullableFilter<"Customer"> | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFilter<"Customer"> | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFilter<"Customer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Customer"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    measurements?: Prisma.MeasurementListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
}, "id" | "tenantId_phone">;
export type CustomerOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredLocale?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CustomerCountOrderByAggregateInput;
    _max?: Prisma.CustomerMaxOrderByAggregateInput;
    _min?: Prisma.CustomerMinOrderByAggregateInput;
};
export type CustomerScalarWhereWithAggregatesInput = {
    AND?: Prisma.CustomerScalarWhereWithAggregatesInput | Prisma.CustomerScalarWhereWithAggregatesInput[];
    OR?: Prisma.CustomerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CustomerScalarWhereWithAggregatesInput | Prisma.CustomerScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Customer"> | string;
    tenantId?: Prisma.UuidWithAggregatesFilter<"Customer"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Customer"> | string;
    phone?: Prisma.StringWithAggregatesFilter<"Customer"> | string;
    email?: Prisma.StringNullableWithAggregatesFilter<"Customer"> | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceWithAggregatesFilter<"Customer"> | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Customer"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Customer"> | Date | string;
};
export type CustomerCreateInput = {
    id?: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCustomersInput;
    measurements?: Prisma.MeasurementCreateNestedManyWithoutCustomerInput;
    orders?: Prisma.OrderCreateNestedManyWithoutCustomerInput;
};
export type CustomerUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    measurements?: Prisma.MeasurementUncheckedCreateNestedManyWithoutCustomerInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutCustomerInput;
};
export type CustomerUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCustomersNestedInput;
    measurements?: Prisma.MeasurementUpdateManyWithoutCustomerNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutCustomerNestedInput;
};
export type CustomerUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    measurements?: Prisma.MeasurementUncheckedUpdateManyWithoutCustomerNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutCustomerNestedInput;
};
export type CustomerCreateManyInput = {
    id?: string;
    tenantId: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CustomerUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerListRelationFilter = {
    every?: Prisma.CustomerWhereInput;
    some?: Prisma.CustomerWhereInput;
    none?: Prisma.CustomerWhereInput;
};
export type CustomerOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CustomerTenantIdPhoneCompoundUniqueInput = {
    tenantId: string;
    phone: string;
};
export type CustomerCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    preferredLocale?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CustomerMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    preferredLocale?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CustomerMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    preferredLocale?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CustomerScalarRelationFilter = {
    is?: Prisma.CustomerWhereInput;
    isNot?: Prisma.CustomerWhereInput;
};
export type CustomerCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.CustomerCreateWithoutTenantInput, Prisma.CustomerUncheckedCreateWithoutTenantInput> | Prisma.CustomerCreateWithoutTenantInput[] | Prisma.CustomerUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CustomerCreateOrConnectWithoutTenantInput | Prisma.CustomerCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.CustomerCreateManyTenantInputEnvelope;
    connect?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
};
export type CustomerUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.CustomerCreateWithoutTenantInput, Prisma.CustomerUncheckedCreateWithoutTenantInput> | Prisma.CustomerCreateWithoutTenantInput[] | Prisma.CustomerUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CustomerCreateOrConnectWithoutTenantInput | Prisma.CustomerCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.CustomerCreateManyTenantInputEnvelope;
    connect?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
};
export type CustomerUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerCreateWithoutTenantInput, Prisma.CustomerUncheckedCreateWithoutTenantInput> | Prisma.CustomerCreateWithoutTenantInput[] | Prisma.CustomerUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CustomerCreateOrConnectWithoutTenantInput | Prisma.CustomerCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.CustomerUpsertWithWhereUniqueWithoutTenantInput | Prisma.CustomerUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.CustomerCreateManyTenantInputEnvelope;
    set?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
    disconnect?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
    delete?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
    connect?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
    update?: Prisma.CustomerUpdateWithWhereUniqueWithoutTenantInput | Prisma.CustomerUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.CustomerUpdateManyWithWhereWithoutTenantInput | Prisma.CustomerUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.CustomerScalarWhereInput | Prisma.CustomerScalarWhereInput[];
};
export type CustomerUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerCreateWithoutTenantInput, Prisma.CustomerUncheckedCreateWithoutTenantInput> | Prisma.CustomerCreateWithoutTenantInput[] | Prisma.CustomerUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.CustomerCreateOrConnectWithoutTenantInput | Prisma.CustomerCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.CustomerUpsertWithWhereUniqueWithoutTenantInput | Prisma.CustomerUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.CustomerCreateManyTenantInputEnvelope;
    set?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
    disconnect?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
    delete?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
    connect?: Prisma.CustomerWhereUniqueInput | Prisma.CustomerWhereUniqueInput[];
    update?: Prisma.CustomerUpdateWithWhereUniqueWithoutTenantInput | Prisma.CustomerUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.CustomerUpdateManyWithWhereWithoutTenantInput | Prisma.CustomerUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.CustomerScalarWhereInput | Prisma.CustomerScalarWhereInput[];
};
export type EnumLocalePreferenceFieldUpdateOperationsInput = {
    set?: $Enums.LocalePreference;
};
export type CustomerCreateNestedOneWithoutMeasurementsInput = {
    create?: Prisma.XOR<Prisma.CustomerCreateWithoutMeasurementsInput, Prisma.CustomerUncheckedCreateWithoutMeasurementsInput>;
    connectOrCreate?: Prisma.CustomerCreateOrConnectWithoutMeasurementsInput;
    connect?: Prisma.CustomerWhereUniqueInput;
};
export type CustomerUpdateOneRequiredWithoutMeasurementsNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerCreateWithoutMeasurementsInput, Prisma.CustomerUncheckedCreateWithoutMeasurementsInput>;
    connectOrCreate?: Prisma.CustomerCreateOrConnectWithoutMeasurementsInput;
    upsert?: Prisma.CustomerUpsertWithoutMeasurementsInput;
    connect?: Prisma.CustomerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CustomerUpdateToOneWithWhereWithoutMeasurementsInput, Prisma.CustomerUpdateWithoutMeasurementsInput>, Prisma.CustomerUncheckedUpdateWithoutMeasurementsInput>;
};
export type CustomerCreateNestedOneWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.CustomerCreateWithoutOrdersInput, Prisma.CustomerUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.CustomerCreateOrConnectWithoutOrdersInput;
    connect?: Prisma.CustomerWhereUniqueInput;
};
export type CustomerUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerCreateWithoutOrdersInput, Prisma.CustomerUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.CustomerCreateOrConnectWithoutOrdersInput;
    upsert?: Prisma.CustomerUpsertWithoutOrdersInput;
    connect?: Prisma.CustomerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CustomerUpdateToOneWithWhereWithoutOrdersInput, Prisma.CustomerUpdateWithoutOrdersInput>, Prisma.CustomerUncheckedUpdateWithoutOrdersInput>;
};
export type CustomerCreateWithoutTenantInput = {
    id?: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    measurements?: Prisma.MeasurementCreateNestedManyWithoutCustomerInput;
    orders?: Prisma.OrderCreateNestedManyWithoutCustomerInput;
};
export type CustomerUncheckedCreateWithoutTenantInput = {
    id?: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    measurements?: Prisma.MeasurementUncheckedCreateNestedManyWithoutCustomerInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutCustomerInput;
};
export type CustomerCreateOrConnectWithoutTenantInput = {
    where: Prisma.CustomerWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerCreateWithoutTenantInput, Prisma.CustomerUncheckedCreateWithoutTenantInput>;
};
export type CustomerCreateManyTenantInputEnvelope = {
    data: Prisma.CustomerCreateManyTenantInput | Prisma.CustomerCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type CustomerUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.CustomerWhereUniqueInput;
    update: Prisma.XOR<Prisma.CustomerUpdateWithoutTenantInput, Prisma.CustomerUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.CustomerCreateWithoutTenantInput, Prisma.CustomerUncheckedCreateWithoutTenantInput>;
};
export type CustomerUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.CustomerWhereUniqueInput;
    data: Prisma.XOR<Prisma.CustomerUpdateWithoutTenantInput, Prisma.CustomerUncheckedUpdateWithoutTenantInput>;
};
export type CustomerUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.CustomerScalarWhereInput;
    data: Prisma.XOR<Prisma.CustomerUpdateManyMutationInput, Prisma.CustomerUncheckedUpdateManyWithoutTenantInput>;
};
export type CustomerScalarWhereInput = {
    AND?: Prisma.CustomerScalarWhereInput | Prisma.CustomerScalarWhereInput[];
    OR?: Prisma.CustomerScalarWhereInput[];
    NOT?: Prisma.CustomerScalarWhereInput | Prisma.CustomerScalarWhereInput[];
    id?: Prisma.UuidFilter<"Customer"> | string;
    tenantId?: Prisma.UuidFilter<"Customer"> | string;
    name?: Prisma.StringFilter<"Customer"> | string;
    phone?: Prisma.StringFilter<"Customer"> | string;
    email?: Prisma.StringNullableFilter<"Customer"> | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFilter<"Customer"> | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFilter<"Customer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Customer"> | Date | string;
};
export type CustomerCreateWithoutMeasurementsInput = {
    id?: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCustomersInput;
    orders?: Prisma.OrderCreateNestedManyWithoutCustomerInput;
};
export type CustomerUncheckedCreateWithoutMeasurementsInput = {
    id?: string;
    tenantId: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutCustomerInput;
};
export type CustomerCreateOrConnectWithoutMeasurementsInput = {
    where: Prisma.CustomerWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerCreateWithoutMeasurementsInput, Prisma.CustomerUncheckedCreateWithoutMeasurementsInput>;
};
export type CustomerUpsertWithoutMeasurementsInput = {
    update: Prisma.XOR<Prisma.CustomerUpdateWithoutMeasurementsInput, Prisma.CustomerUncheckedUpdateWithoutMeasurementsInput>;
    create: Prisma.XOR<Prisma.CustomerCreateWithoutMeasurementsInput, Prisma.CustomerUncheckedCreateWithoutMeasurementsInput>;
    where?: Prisma.CustomerWhereInput;
};
export type CustomerUpdateToOneWithWhereWithoutMeasurementsInput = {
    where?: Prisma.CustomerWhereInput;
    data: Prisma.XOR<Prisma.CustomerUpdateWithoutMeasurementsInput, Prisma.CustomerUncheckedUpdateWithoutMeasurementsInput>;
};
export type CustomerUpdateWithoutMeasurementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCustomersNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutCustomerNestedInput;
};
export type CustomerUncheckedUpdateWithoutMeasurementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutCustomerNestedInput;
};
export type CustomerCreateWithoutOrdersInput = {
    id?: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutCustomersInput;
    measurements?: Prisma.MeasurementCreateNestedManyWithoutCustomerInput;
};
export type CustomerUncheckedCreateWithoutOrdersInput = {
    id?: string;
    tenantId: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    measurements?: Prisma.MeasurementUncheckedCreateNestedManyWithoutCustomerInput;
};
export type CustomerCreateOrConnectWithoutOrdersInput = {
    where: Prisma.CustomerWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerCreateWithoutOrdersInput, Prisma.CustomerUncheckedCreateWithoutOrdersInput>;
};
export type CustomerUpsertWithoutOrdersInput = {
    update: Prisma.XOR<Prisma.CustomerUpdateWithoutOrdersInput, Prisma.CustomerUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.CustomerCreateWithoutOrdersInput, Prisma.CustomerUncheckedCreateWithoutOrdersInput>;
    where?: Prisma.CustomerWhereInput;
};
export type CustomerUpdateToOneWithWhereWithoutOrdersInput = {
    where?: Prisma.CustomerWhereInput;
    data: Prisma.XOR<Prisma.CustomerUpdateWithoutOrdersInput, Prisma.CustomerUncheckedUpdateWithoutOrdersInput>;
};
export type CustomerUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutCustomersNestedInput;
    measurements?: Prisma.MeasurementUpdateManyWithoutCustomerNestedInput;
};
export type CustomerUncheckedUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    measurements?: Prisma.MeasurementUncheckedUpdateManyWithoutCustomerNestedInput;
};
export type CustomerCreateManyTenantInput = {
    id?: string;
    name: string;
    phone: string;
    email?: string | null;
    preferredLocale?: $Enums.LocalePreference;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CustomerUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    measurements?: Prisma.MeasurementUpdateManyWithoutCustomerNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutCustomerNestedInput;
};
export type CustomerUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    measurements?: Prisma.MeasurementUncheckedUpdateManyWithoutCustomerNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutCustomerNestedInput;
};
export type CustomerUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocale?: Prisma.EnumLocalePreferenceFieldUpdateOperationsInput | $Enums.LocalePreference;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerCountOutputType = {
    measurements: number;
    orders: number;
};
export type CustomerCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    measurements?: boolean | CustomerCountOutputTypeCountMeasurementsArgs;
    orders?: boolean | CustomerCountOutputTypeCountOrdersArgs;
};
export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerCountOutputTypeSelect<ExtArgs> | null;
};
export type CustomerCountOutputTypeCountMeasurementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MeasurementWhereInput;
};
export type CustomerCountOutputTypeCountOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
};
export type CustomerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    preferredLocale?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    measurements?: boolean | Prisma.Customer$measurementsArgs<ExtArgs>;
    orders?: boolean | Prisma.Customer$ordersArgs<ExtArgs>;
    _count?: boolean | Prisma.CustomerCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customer"]>;
export type CustomerSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    preferredLocale?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customer"]>;
export type CustomerSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    preferredLocale?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customer"]>;
export type CustomerSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    phone?: boolean;
    email?: boolean;
    preferredLocale?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CustomerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "name" | "phone" | "email" | "preferredLocale" | "createdAt" | "updatedAt", ExtArgs["result"]["customer"]>;
export type CustomerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    measurements?: boolean | Prisma.Customer$measurementsArgs<ExtArgs>;
    orders?: boolean | Prisma.Customer$ordersArgs<ExtArgs>;
    _count?: boolean | Prisma.CustomerCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CustomerIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type CustomerIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $CustomerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Customer";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        measurements: Prisma.$MeasurementPayload<ExtArgs>[];
        orders: Prisma.$OrderPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        name: string;
        phone: string;
        email: string | null;
        preferredLocale: $Enums.LocalePreference;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["customer"]>;
    composites: {};
};
export type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CustomerPayload, S>;
export type CustomerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CustomerCountAggregateInputType | true;
};
export interface CustomerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Customer'];
        meta: {
            name: 'Customer';
        };
    };
    findUnique<T extends CustomerFindUniqueArgs>(args: Prisma.SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CustomerFindFirstArgs>(args?: Prisma.SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CustomerFindManyArgs>(args?: Prisma.SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CustomerCreateArgs>(args: Prisma.SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CustomerCreateManyArgs>(args?: Prisma.SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CustomerDeleteArgs>(args: Prisma.SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CustomerUpdateArgs>(args: Prisma.SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CustomerDeleteManyArgs>(args?: Prisma.SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CustomerUpdateManyArgs>(args: Prisma.SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CustomerUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CustomerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CustomerUpsertArgs>(args: Prisma.SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CustomerCountArgs>(args?: Prisma.Subset<T, CustomerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CustomerCountAggregateOutputType> : number>;
    aggregate<T extends CustomerAggregateArgs>(args: Prisma.Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>;
    groupBy<T extends CustomerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CustomerGroupByArgs['orderBy'];
    } : {
        orderBy?: CustomerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CustomerFieldRefs;
}
export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    measurements<T extends Prisma.Customer$measurementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Customer$measurementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MeasurementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    orders<T extends Prisma.Customer$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Customer$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CustomerFieldRefs {
    readonly id: Prisma.FieldRef<"Customer", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Customer", 'String'>;
    readonly name: Prisma.FieldRef<"Customer", 'String'>;
    readonly phone: Prisma.FieldRef<"Customer", 'String'>;
    readonly email: Prisma.FieldRef<"Customer", 'String'>;
    readonly preferredLocale: Prisma.FieldRef<"Customer", 'LocalePreference'>;
    readonly createdAt: Prisma.FieldRef<"Customer", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Customer", 'DateTime'>;
}
export type CustomerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where: Prisma.CustomerWhereUniqueInput;
};
export type CustomerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where: Prisma.CustomerWhereUniqueInput;
};
export type CustomerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CustomerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CustomerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CustomerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerCreateInput, Prisma.CustomerUncheckedCreateInput>;
};
export type CustomerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CustomerCreateManyInput | Prisma.CustomerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CustomerCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    data: Prisma.CustomerCreateManyInput | Prisma.CustomerCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CustomerIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CustomerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerUpdateInput, Prisma.CustomerUncheckedUpdateInput>;
    where: Prisma.CustomerWhereUniqueInput;
};
export type CustomerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CustomerUpdateManyMutationInput, Prisma.CustomerUncheckedUpdateManyInput>;
    where?: Prisma.CustomerWhereInput;
    limit?: number;
};
export type CustomerUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerUpdateManyMutationInput, Prisma.CustomerUncheckedUpdateManyInput>;
    where?: Prisma.CustomerWhereInput;
    limit?: number;
    include?: Prisma.CustomerIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CustomerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where: Prisma.CustomerWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerCreateInput, Prisma.CustomerUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CustomerUpdateInput, Prisma.CustomerUncheckedUpdateInput>;
};
export type CustomerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where: Prisma.CustomerWhereUniqueInput;
};
export type CustomerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerWhereInput;
    limit?: number;
};
export type Customer$measurementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Customer$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CustomerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
};
