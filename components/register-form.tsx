"use client";

import { useState } from "react";
import { toast } from "sonner";
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


const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  squad: z.number().min(1, "Please select a squad").max(10, "Invalid squad"),
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      squad: 0,
    },
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      await axios.post("/api/auth/register", {
        email: data.email,
        password: data.password,
        name: data.email,
        squad: data.squad,
      });

      toast.success("Account created! You can now log in.");
      form.reset();
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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
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
              <Controller
                name="squad"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Squad (10 available)
                    </FieldLabel>
                    <select
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      id={field.name}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value={0} disabled>
                        Select your squad
                      </option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          Squad {n} (Batch {n <= 5 ? 1 : 2})
                        </option>
                      ))}
                    </select>
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
                  {form.formState.isSubmitting ? "Registering…" : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Sign in
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
