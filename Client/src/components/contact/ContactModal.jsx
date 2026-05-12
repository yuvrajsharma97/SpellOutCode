import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactApi } from "../api/contact";
import { contactSchema } from "../schemas";
import { useToast } from "../context/ToastContext";
import Modal from "../components/ui/Modal";
import FormField, { TextInput, TextArea } from "../components/ui/FormField";
import Button from "../components/ui/Button";

export default function ContactModal({
  isOpen,
  onClose,
  username,
  recipientName,
}) {
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data) => {
    try {
      await contactApi.send(username, data);
      addToast({ message: "Message sent successfully.", type: "success" });
      reset();
      onClose();
    } catch (err) {
      addToast({
        message: err.message || "Failed to send message.",
        type: "error",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contact ${recipientName}`}
      width="460px">
      <p
        style={{
          fontSize: "13px",
          color: "var(--ink-4)",
          marginBottom: "24px",
          fontWeight: 300,
          lineHeight: 1.6,
        }}>
        Send a message to {recipientName}. They'll receive it by email.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Your name" error={errors.senderName?.message}>
          <TextInput
            type="text"
            placeholder="Your name"
            error={errors.senderName?.message}
            {...register("senderName")}
          />
        </FormField>

        <FormField label="Your email" error={errors.senderEmail?.message}>
          <TextInput
            type="email"
            placeholder="you@example.com"
            error={errors.senderEmail?.message}
            {...register("senderEmail")}
          />
        </FormField>

        <FormField label="Message" error={errors.message?.message}>
          <TextArea
            rows={5}
            placeholder={`Write your message to ${recipientName}…`}
            error={errors.message?.message}
            {...register("message")}
          />
        </FormField>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            marginTop: "8px",
          }}>
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Send message →
          </Button>
        </div>
      </form>
    </Modal>
  );
}
