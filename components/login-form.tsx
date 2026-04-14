"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      const { data: result } = await axios.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (result.token) setToken(result.token);
      if (result.user) setUser(result.user);

      toast.success(`Welcome back, ${data.email}!`);
      const requestedRedirect = searchParams.get("redirect");
      const redirectTarget =
        requestedRedirect && requestedRedirect.startsWith("/") && !requestedRedirect.startsWith("//")
          ? requestedRedirect
          : "/";
      router.push(redirectTarget);
    } catch (err) {
      setServerError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || err.message || "An error occurred"
          : "An error occurred",
      );
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                {serverError && (
                  <p className="text-sm text-destructive">{serverError}</p>
                )}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Logging in…" : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
