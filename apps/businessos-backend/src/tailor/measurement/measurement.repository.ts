import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import {
  DEFAULT_MEASUREMENT_UNIT,
  toCollarType,
  toGarmentType,
  toPlacketType,
  toPocketOption,
} from "../common/tailor.mapper";
import type { CreateMeasurementInput } from "./dto/create-measurement.types";
import type { UpdateMeasurementDto } from "./dto/update-measurement.dto";
import {
  legacyMeasurementColumns,
  normalizeMeasurementMap,
  normalizeStyleMap,
} from "./measurement-json.helper";
import { toMeasurementDto } from "./measurement.mapper";

@Injectable()
export class MeasurementRepository {
  constructor(private readonly prisma: PrismaService) {}

  listByCustomer(tenantId: string, customerId: string) {
    return this.prisma.measurement
      .findMany({
        where: { tenantId, customerId },
        orderBy: { createdAt: "desc" },
      })
      .then((rows) => rows.map(toMeasurementDto));
  }

  async findById(tenantId: string, measurementId: string) {
    const row = await this.prisma.measurement.findFirst({
      where: { id: measurementId, tenantId },
    });

    if (!row) {
      throw new BadRequestException("Measurement not found");
    }

    return row;
  }

  async create(
    tenantId: string,
    userId: string,
    dto: CreateMeasurementInput,
  ) {
    const measurementsData = normalizeMeasurementMap(dto.measurements);
    const styleData = normalizeStyleMap(dto.style);
    const legacy = legacyMeasurementColumns(measurementsData);

    const row = await this.prisma.measurement.create({
      data: {
        tenantId,
        customerId: dto.customerId,
        takenByUserId: userId,
        garmentType: dto.garmentType
          ? toGarmentType(dto.garmentType)
          : undefined,
        unit: DEFAULT_MEASUREMENT_UNIT,
        measurementsData,
        styleData,
        chest: legacy.chest,
        waist: legacy.waist,
        shoulder: legacy.shoulder,
        sleeve: legacy.sleeve,
        neck: legacy.neck,
        shirtLength: legacy.shirtLength,
        trouserLength: legacy.trouserLength,
        hip: legacy.hip,
        thigh: legacy.thigh,
        chestPocket: toPocketOption(styleData.chestPocket),
        sidePockets: toPocketOption(styleData.sidePockets),
        collar: toCollarType(styleData.collar),
        placket: toPlacketType(styleData.placket),
        gera: styleData.gera?.trim() || null,
        notes: styleData.notes?.trim() || null,
      },
    });

    return toMeasurementDto(row);
  }

  async update(
    tenantId: string,
    measurementId: string,
    dto: UpdateMeasurementDto,
  ) {
    await this.findById(tenantId, measurementId);
    const measurementsData = normalizeMeasurementMap(dto.measurements);
    const styleData = normalizeStyleMap(dto.style);
    const legacy = legacyMeasurementColumns(measurementsData);

    const row = await this.prisma.measurement.update({
      where: { id: measurementId },
      data: {
        garmentType: dto.garmentType
          ? toGarmentType(dto.garmentType)
          : undefined,
        measurementsData,
        styleData,
        chest: legacy.chest,
        waist: legacy.waist,
        shoulder: legacy.shoulder,
        sleeve: legacy.sleeve,
        neck: legacy.neck,
        shirtLength: legacy.shirtLength,
        trouserLength: legacy.trouserLength,
        hip: legacy.hip,
        thigh: legacy.thigh,
        chestPocket: toPocketOption(styleData.chestPocket),
        sidePockets: toPocketOption(styleData.sidePockets),
        collar: toCollarType(styleData.collar),
        placket: toPlacketType(styleData.placket),
        gera: styleData.gera?.trim() || null,
        notes: styleData.notes?.trim() || null,
      },
    });

    return toMeasurementDto(row);
  }
}
