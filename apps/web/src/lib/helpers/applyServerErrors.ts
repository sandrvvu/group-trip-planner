import { isAxiosError } from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiError } from "@/types";

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldNames: Path<T>[],
): string | null {
  if (!isAxiosError<ApiError>(error) || !error.response?.data) {
    return "Something went wrong. Please try again.";
  }

  const { message } = error.response.data;
  const messages = Array.isArray(message) ? message : [message];
  let matched = false;

  for (const text of messages) {
    const field = fieldNames.find((name) =>
      text.toLowerCase().startsWith(String(name).toLowerCase()),
    );
    if (field) {
      setError(field, { message: text });
      matched = true;
    }
  }

  return matched ? null : messages.join(" ");
}
