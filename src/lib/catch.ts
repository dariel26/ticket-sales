import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ApiError } from "next/dist/server/api-utils";
import { ZodError } from "zod";

export type ActionState = { error?: string; params?: unknown; success?: boolean } | undefined;

export default function catchAsync(fn: (prevState: ActionState, payload: FormData) => Promise<ActionState>) {
  return async (prevState: ActionState, data: FormData): Promise<ActionState> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await fn(prevState, data);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof ZodError) return { error: error.message };
      if (error instanceof ApiError) return { error: error.message };
      if (isRedirectError(error)) throw error;

      return { error: "Um erro inesperado ocorreu ao processar a requisição. Tente novamente mais tarde." };
    }
  };
}
