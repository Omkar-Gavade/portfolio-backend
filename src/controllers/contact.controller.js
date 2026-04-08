import Contact from "../models/Contact.js";
import transporter from "../config/mail.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save to DB
    const contact = await Contact.create({ name, email, message });
    console.log("Saved:", contact._id);

    // Respond immediately (IMPORTANT)
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

    // 🔥 Send email (non-blocking)
    transporter
      .sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Contact Message",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      })
      .then(() => console.log("Email sent"))
      .catch((err) => console.error("Email error:", err.message));

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