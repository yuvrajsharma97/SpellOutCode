import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { resetPasswordSchema } from "../schemas";
import FormField, { TextInput } from "../components/ui/FormField";
import Button from "../components/ui/Button";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      await authApi.resetPassword(token, data.password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      addToast({
        message: err.message || "Reset link is invalid or expired.",
        type: "error",
      });
    }
  };

  if (done) {
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
          Password updated
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "24px",
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: "12px",
          }}>
          All done.
        </h1>
        <p style={{ fontSize: "14px", color: "var(--ink-4)", fontWeight: 300 }}>
          Redirecting you to sign in…
        </p>
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
        Choose a new password
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "var(--ink-4)",
          marginBottom: "36px",
          fontWeight: 300,
        }}>
        Minimum 8 characters.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="New password" error={errors.password?.message}>
          <TextInput
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>

        <FormField
          label="Confirm password"
          error={errors.confirmPassword?.message}>
          <TextInput
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </FormField>

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          style={{ marginTop: "8px" }}>
          Update password →
        </Button>
      </form>
    </div>
  );
}
