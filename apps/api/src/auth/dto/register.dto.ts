import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { normalizeEmail, trim } from "../../common/transforms/string.transforms.js";
import { MaxBytes } from "../../common/validators/max-bytes.decorator.js";

export class RegisterDto {
  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(255)
  email: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(8)
  @MaxBytes(72)
  password: string;
}
