import { IsIn } from "class-validator";

export const ORDER_DOCUMENT_TYPES = ["receipt", "measurements"] as const;
export type OrderDocumentTypeParam = (typeof ORDER_DOCUMENT_TYPES)[number];

export class SendOrderDocumentQueryDto {
  @IsIn(ORDER_DOCUMENT_TYPES)
  type!: OrderDocumentTypeParam;
}
