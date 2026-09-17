"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { applyServerErrors } from "@/lib/helpers";
import { useRegister } from "@/mutations";
import { registerSchema, type RegisterFormValues } from "@/schemas";

export function RegisterForm() {
  const registerMutation = useRegister();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values, {
      onError: (error) => {
        const message = applyServerErrors(error, form.setError, ["email", "name", "password"]);
        if (message) {
          toast.error(message);
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs tracking-wide text-muted-foreground uppercase">
                Your name
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs tracking-wide text-muted-foreground uppercase">
                Email
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs tracking-wide text-muted-foreground uppercase">
                Password
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="mt-2 h-11 rounded-xl bg-marketing-ink text-white hover:bg-marketing-ink/90"
        >
          Create my account
        </Button>
        <p className="text-sm text-muted-foreground">
          Already planning something?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          By signing up you agree to the{" "}
          <Link href="#" className="underline underline-offset-4">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </Form>
  );
}
