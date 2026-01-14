import Contact from "../models/Contact.js";
import transporter from "../config/mail.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
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

    // IMPORTANT: respond immediately
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

    // Send email asynchronously (DO NOT await)
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
    console.error("Contact API error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};