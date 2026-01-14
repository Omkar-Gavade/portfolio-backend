import Contact from "../models/Contact.js";
import transporter from "../config/mail.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Save message to database
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // Respond immediately (IMPORTANT)
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

    // Send email asynchronously (non-blocking)
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
      .catch((error) => {
        console.error("Email sending failed:", error);
      });

  } catch (error) {
    console.error("Error creating contact:", error);

    // Safety fallback
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};