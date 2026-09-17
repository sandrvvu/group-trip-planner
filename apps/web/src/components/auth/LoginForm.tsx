"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { applyServerErrors } from "@/lib/helpers";
import { useLogin } from "@/mutations";
import { loginSchema, type LoginFormValues } from "@/schemas";

export function LoginForm() {
  const loginMutation = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", keepLoggedIn: false },
  });

  function onSubmit(values: LoginFormValues) {
    const { email, password } = values;
    loginMutation.mutate(
      { email, password },
      {
        onError: (error) => {
          const message = applyServerErrors(error, form.setError, ["email", "password"]);
          if (message) {
            toast.error(message);
          }
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
        <FormField
          control={form.control}
          name="keepLoggedIn"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">Keep me logged in</FormLabel>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-2 h-11 rounded-xl bg-marketing-ink text-white hover:bg-marketing-ink/90"
        >
          Log in
        </Button>
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>
    </Form>
  );
}
