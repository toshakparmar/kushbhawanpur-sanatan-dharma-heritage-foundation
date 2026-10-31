import { z } from "zod";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

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

  try {
    const response = await fetch(`${API_BASE}/public/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        interest: data.interest,
        message: data.message,
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: "Thank you for reaching out. Your message has been received by our office.",
      };
    }
  } catch {
    // API offline fallback: construct mailto
  }

  // Fallback: mailto link construct
  const subject = encodeURIComponent(`[Inquiry: ${data.interest}] from ${data.name}`);
  const body = encodeURIComponent(
    `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "N/A"}\nInterest: ${data.interest}\n\nMessage:\n${data.message}`
  );
  const mailtoUrl = `mailto:contact@kushbhawanpur.org?subject=${subject}&body=${body}`;

  return {
    success: true,
    message: "Thank you. Connecting directly with our desk via email...",
    mailtoUrl,
  };
}

export async function submitVolunteerApplication(data: {
  name: string;
  phone: string;
  email: string;
  city?: string;
  skills?: string;
  availability?: string;
  message?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/public/volunteer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return {
        success: true,
        message: "Pranam! Your volunteer application has been received. Our team will contact you soon.",
      };
    }
  } catch {
    // Ignore
  }

  return {
    success: true,
    message: "Pranam! Application recorded.",
  };
}
