"use client"

import emailjs from "@emailjs/browser"

interface EmailData {
  to_email: string
  volunteer_name: string
  volunteer_id: string
  pdf_attachment: string
}

export async function sendEmail(emailData: EmailData): Promise<void> {
  try {
    // Initialize EmailJS with your public key
    // Note: In a real implementation, you would need to sign up for EmailJS and get your own keys
    emailjs.init("YOUR_PUBLIC_KEY")

    const result = await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", emailData)

    console.log("Email sent successfully:", result.text)
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
}
