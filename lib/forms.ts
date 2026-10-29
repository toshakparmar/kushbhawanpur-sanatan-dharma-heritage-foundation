import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(80),
  email: z.string().email("Please provide a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number should be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\-\s]+$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  interest: z.enum([
    "donate",
    "volunteer",
    "heritage-preservation",
    "gau-seva",
    "csr",
    "other",
  ]),
  message: z.string().min(10, "Please share a brief message (min 10 characters)").max(1000),
  // Honeypot field for bot prevention (must remain empty)
  organization_website_hp: z.string().max(0, "Bot detected").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function submitContactMessage(
  data: ContactFormData
): Promise<{ success: boolean; message: string; mailtoUrl?: string }> {
  // Reject if honeypot is filled
  if (data.organization_website_hp) {
    return { success: false, message: "Spam detected." };
  }

  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || "Not provided",
          interest: data.interest,
          message: data.message,
          source: "Kushbhawanpur Foundation Landing Page",
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: "Thank you for reaching out. We have received your message.",
        };
      }
    } catch {
      // Fallback to mailto if endpoint fails
    }
  }

  // Fallback: mailto link construct
  const subject = encodeURIComponent(
    `[Inquiry: ${data.interest}] from ${data.name}`
  );
  const body = encodeURIComponent(
    `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "N/A"}\nInterest: ${data.interest}\n\nMessage:\n${data.message}`
  );
  const mailtoUrl = `mailto:contact@kushbhawanpur-foundation.org?subject=${subject}&body=${body}`;

  return {
    success: true,
    message: "Thank you. Opening your email app to send your message...",
    mailtoUrl,
  };
}
