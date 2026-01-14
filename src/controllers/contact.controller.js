import Contact from "../models/Contact.js";
import transporter from "../config/mail.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

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

    // Respond immediately (DO NOT WAIT FOR EMAIL)
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

    // Send email asynchronously (fire-and-forget)
    transporter
      .sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "New Portfolio Contact Message",
        text: `
New message received from portfolio website.

Name: ${name}
Email: ${email}

Message:
${message}
        `,
      })
      .catch((err) => {
        console.error("Email failed:", err.message);
      });

  } catch (error) {
    console.error("Contact API error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};