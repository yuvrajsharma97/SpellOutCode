import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginSchema } from "../schemas";
import FormField, { TextInput, PasswordInput } from "../components/ui/FormField";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      addToast({
        message: err.message || "Invalid credentials.",
        type: "error",
      });
    }
  };

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
        Sign in to your archive
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "var(--ink-4)",
          marginBottom: "36px",
          fontWeight: 300,
        }}>
        No account?{" "}
        <Link
          to="/register"
          style={{ color: "var(--accent)", textDecoration: "none" }}>
          Create one free.
        </Link>
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

        <FormField label="Password" error={errors.password?.message}>
          <PasswordInput
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="current-password"
            {...register("password")}
          />
        </FormField>

        <div
          style={{
            textAlign: "right",
            marginTop: "-12px",
            marginBottom: "24px",
          }}>
          <Link
            to="/forgot-password"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--ink-4)",
              textDecoration: "none",
              transition: "color var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--ink-4)")
            }>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Sign in →
        </Button>
      </form>
    </div>
  );
}
