import { ValidateBy, ValidationOptions, buildMessage } from "class-validator";

export function MaxBytes(max: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: "maxBytes",
      constraints: [max],
      validator: {
        validate: (value: unknown) =>
          typeof value === "string" && Buffer.byteLength(value, "utf8") <= max,
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must be at most $constraint1 bytes long`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
