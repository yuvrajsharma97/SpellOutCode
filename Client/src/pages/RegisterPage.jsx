import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { registerSchema } from "../schemas";
import FormField, { TextInput, PasswordInput } from "../components/ui/FormField";
import Button from "../components/ui/Button";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { addToast } = useToast();
  const [sentTo, setSentTo] = useState(null);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ resolver: zodResolver(registerSchema) });

  const username = watch("username", "");

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      setSentTo(data.email);
    } catch (err) {
      addToast({
        message: err.message || "Registration failed. Try again.",
        type: "error",
      });
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      const res = await authApi.resendVerification({ email: sentTo });
      addToast({ message: res?.message || "If a sign-up is waiting, we've sent a new link." });
    } catch (err) {
      addToast({ message: err.message || "Couldn't resend. Try again shortly.", type: "error" });
    } finally {
      setResending(false);
    }
  };

  if (sentTo) {
    return (
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--success)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}>
          Check your inbox
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "24px",
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: "12px",
          }}>
          Confirm your email to finish.
        </h1>
        <p style={{ fontSize: "14px", color: "var(--ink-4)", fontWeight: 300, marginBottom: "28px", lineHeight: 1.6 }}>
          If <strong>{sentTo}</strong> can be used, we've sent it a verification link.
          It expires in 24 hours. If you already have an account, sign in instead.
        </p>
        <Button fullWidth isLoading={resending} onClick={resend}>
          Resend link
        </Button>
        <p style={{ marginTop: "20px" }}>
          <Link
            to="/login"
            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent)", textDecoration: "none" }}>
            Go to sign in →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "26px",
          fontWeight: 400,
          color: "var(--ink)",
          marginBottom: "6px",
          letterSpacing: "-0.01em",
        }}>
        Create your archive
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "var(--ink-4)",
          marginBottom: "36px",
          fontWeight: 300,
        }}>
        Already have one?{" "}
        <Link
          to="/login"
          style={{ color: "var(--accent)", textDecoration: "none" }}>
          Sign in.
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Full name" error={errors.name?.message}>
          <TextInput
            type="text"
            placeholder="Ammar Khalid"
            error={errors.name?.message}
            autoComplete="name"
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Username"
          error={errors.username?.message}
          hint={
            username
              ? `Your profile will be at spelloutcode.com/${username}`
              : undefined
          }>
          <TextInput
            type="text"
            placeholder="ammar"
            error={errors.username?.message}
            autoComplete="username"
            autoCapitalize="none"
            {...register("username")}
          />
        </FormField>

        <FormField label="Email address" error={errors.email?.message}>
          <TextInput
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Password"
          error={errors.password?.message}
          hint={!errors.password ? "Minimum 8 characters" : undefined}>
          <PasswordInput
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          style={{ marginTop: "8px" }}>
          Create archive →
        </Button>

        <p
          style={{
            fontSize: "11px",
            color: "var(--ink-4)",
            marginTop: "16px",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            lineHeight: 1.6,
          }}>
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            style={{ color: "var(--ink-3)", textDecoration: "underline" }}>
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            style={{ color: "var(--ink-3)", textDecoration: "underline" }}>
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
