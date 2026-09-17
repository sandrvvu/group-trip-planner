import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { normalizeEmail } from "../../common/transforms/string.transforms.js";
import { MaxBytes } from "../../common/validators/max-bytes.decorator.js";

export class LoginDto {
  @Transform(normalizeEmail)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxBytes(72)
  password: string;
}
