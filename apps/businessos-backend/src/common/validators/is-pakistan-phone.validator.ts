import { isValidPakistanPhone } from "@business-os/shared";
import {
  registerDecorator,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isPakistanPhone", async: false })
export class IsPakistanPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === "string" && isValidPakistanPhone(value);
  }

  defaultMessage(): string {
    return "Enter a valid mobile number (e.g. 03001234567)";
  }
}

export function IsPakistanPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPakistanPhoneConstraint,
    });
  };
}
