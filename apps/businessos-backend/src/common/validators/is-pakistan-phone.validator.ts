import { isValidPakistanPhone } from "@business-os/shared";
import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isPakistanPhone", async: false })
export class IsPakistanPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === "string" && isValidPakistanPhone(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid Pakistani phone number (e.g. 03001234567)`;
  }
}

export function IsPakistanPhone(validationOptions?: ValidationOptions) {
  return function registerPakistanPhoneValidator(
    object: object,
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPakistanPhoneConstraint,
    });
  };
}
