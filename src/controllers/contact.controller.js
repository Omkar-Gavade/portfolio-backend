import Contact from "../models/Contact.js";
import transporter from "../config/mail.js";

export const createContact = async (req, res) => {
  try {
    // Log request hit (useful during development)
    

    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Save contact message
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    console.log("Contact saved:", contact._id);
    

    // Send email notification
    await transporter.sendMail({
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
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};