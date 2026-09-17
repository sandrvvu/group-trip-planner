import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { STATUS_CODES } from "node:http";
import type { ApiError } from "@repo/shared";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const body = this.toApiError(exception);

    if (body.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.message : String(exception),
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    httpAdapter.reply(host.switchToHttp().getResponse(), body, body.statusCode);
  }

  private toApiError(exception: unknown): ApiError {
    if (!(exception instanceof HttpException)) {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      return {
        statusCode,
        message: "Internal server error",
        error: STATUS_CODES[statusCode] ?? "Internal Server Error",
      };
    }

    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    const fallbackError = STATUS_CODES[statusCode] ?? "Error";

    if (typeof response === "string") {
      return { statusCode, message: response, error: fallbackError };
    }

    const { message, error } = response as { message?: unknown; error?: unknown };

    return {
      statusCode,
      message: isMessage(message) ? message : exception.message,
      error: typeof error === "string" ? error : fallbackError,
    };
  }
}

function isMessage(value: unknown): value is string | string[] {
  return (
    typeof value === "string" ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}
