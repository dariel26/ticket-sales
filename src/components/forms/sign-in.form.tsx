"use client";

import { z } from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

const signInSchema = z.object({});
type SignInData = z.infer<typeof signInSchema>;

export default function FormSignIn() {
  const [pending, setPending] = useState(false);
  const form = useForm<SignInData>({ resolver: zodResolver(signInSchema) });

  const handleOnSubmitWithGoogle = useCallback(() => {
    setPending(true);
    signIn("google", { redirect: true, redirectTo: "/system/parties" }).finally(() => setPending(false));
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOnSubmitWithGoogle)}
        className="flex h-[100svh] w-[100svw] items-center justify-center"
      >
        <Button type="submit">Entrar com Google {pending ? "..." : ""}</Button>
      </form>
    </Form>
  );
}
