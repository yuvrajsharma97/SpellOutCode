import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { registerSchema } from "../schemas";
import FormField, { TextInput, PasswordInput } from "../components/ui/FormField";
import Button from "../components/ui/Button";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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
      navigate("/dashboard");
    } catch (err) {
      addToast({
        message: err.message || "Registration failed. Try again.",
        type: "error",
      });
    }
  };

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
