import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FormField, { PasswordInput } from "../components/ui/FormField";
import Button from "../components/ui/Button";

const eyebrow = (color) => ({
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  color,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "20px",
});

const heading = {
  fontFamily: "var(--font-serif)",
  fontSize: "24px",
  fontWeight: 400,
  color: "var(--ink)",
  marginBottom: "12px",
};

/**
 * /verify-email/:token. Activates a pending sign-up. The user re-enters
 * the password chosen at sign-up, which proves the link belongs to their
 * own sign-up and not to one someone else started with their email.
 */
export default function VerifyEmailPage() {
  const { token: tokenParam } = useParams();
  const [token] = useState(() => tokenParam);
  const { verifyEmail } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  // undefined = checking, null = invalid. A missing token is invalid from the start.
  const [pending, setPending] = useState(() => (token ? undefined : null));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: "" } });

  useEffect(() => {
    if (!token) return;
    authApi
      .checkVerificationToken(token)
      .then((res) => setPending(res?.data || {}))
      .catch(() => setPending(null));
  }, [token]);

  const onSubmit = async ({ password }) => {
    try {
      await verifyEmail(token, { password });
      addToast({ message: "Email verified. Welcome!" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      addToast({ message: err.message || "Verification failed.", type: "error" });
      if (/sign up again|already verified|just activated|expired/i.test(err.message || "")) {
        setPending(null);
      }
    }
  };

  if (pending === undefined) {
    return (
      <div style={{ width: "100%", maxWidth: "380px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-4)" }}>
          Checking link…
        </p>
      </div>
    );
  }

  if (pending === null) {
    return (
      <div style={{ width: "100%", maxWidth: "380px", textAlign: "center" }}>
        <div style={eyebrow("var(--danger)")}>Link invalid</div>
        <h1 style={heading}>This link can't be used.</h1>
        <p style={{ fontSize: "14px", color: "var(--ink-4)", fontWeight: 300, marginBottom: "28px" }}>
          Verification links expire after 24 hours. If your account is already
          active, just sign in.
        </p>
        <Link
          to="/login"
          style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent)", textDecoration: "none", marginRight: "20px" }}>
          Sign in →
        </Link>
        <Link
          to="/register"
          style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent)", textDecoration: "none" }}>
          Sign up again →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "380px" }}>
      <h1 style={{ ...heading, fontSize: "26px", marginBottom: "6px", letterSpacing: "-0.01em" }}>
        Activate your archive
      </h1>
      <p style={{ fontSize: "13px", color: "var(--ink-4)", marginBottom: "36px", fontWeight: 300, lineHeight: 1.6 }}>
        {pending.username ? (
          <>
            This link activates <strong>@{pending.username}</strong>. If that isn't
            the username you chose, don't continue.{" "}
          </>
        ) : null}
        Enter the password you chose when signing up.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Password" error={errors.password?.message}>
          <PasswordInput
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="current-password"
            {...register("password", { required: "Enter your password" })}
          />
        </FormField>

        <Button type="submit" fullWidth isLoading={isSubmitting} style={{ marginTop: "8px" }}>
          Verify and continue →
        </Button>
      </form>
    </div>
  );
}
