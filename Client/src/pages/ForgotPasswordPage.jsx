import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { authApi } from "../api/auth";
import { forgotPasswordSchema } from "../schemas";
import FormField, { TextInput } from "../components/ui/FormField";
import Button from "../components/ui/Button";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      await authApi.forgotPassword(data);
      setSent(true);
    } catch {
      // Show success regardless to prevent email enumeration
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div style={{ width: "100%", maxWidth: "380px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--success)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}>
          Email sent
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "24px",
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: "12px",
            letterSpacing: "-0.01em",
          }}>
          Check your inbox.
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--ink-4)",
            marginBottom: "32px",
            fontWeight: 300,
            lineHeight: 1.6,
          }}>
          If an account exists for{" "}
          <strong style={{ color: "var(--ink-3)", fontWeight: 500 }}>
            {getValues("email")}
          </strong>
          , you'll receive a reset link shortly.
        </p>
        <Link
          to="/login"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--ink-4)",
            textDecoration: "none",
            transition: "color var(--transition)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-4)")}>
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "380px" }}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "26px",
          fontWeight: 400,
          color: "var(--ink)",
          marginBottom: "6px",
          letterSpacing: "-0.01em",
        }}>
        Reset your password
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "var(--ink-4)",
          marginBottom: "36px",
          fontWeight: 300,
        }}>
        Enter your email and we'll send a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Email address" error={errors.email?.message}>
          <TextInput
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
        </FormField>

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          style={{ marginTop: "8px" }}>
          Send reset link →
        </Button>
      </form>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Link
          to="/login"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink-4)",
            textDecoration: "none",
            transition: "color var(--transition)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-4)")}>
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
