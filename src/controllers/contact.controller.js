import Contact from "../models/Contact.js";
import transporter from "../config/mail.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Save contact message to DB
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // ✅ RESPOND IMMEDIATELY (do NOT wait for email)
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

    // 🔥 Send email asynchronously (non-blocking)
    transporter
      .sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "New Portfolio Contact Message",
        text: `
You received a new message from your portfolio website.

Name: ${name}
Email: ${email}

Message:
${message}
        `,
      })
      .catch((err) => {
        console.error("Email sending failed:", err);
      });

  } catch (error) {
    console.error("Error creating contact:", error);

    // Safety fallback
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};