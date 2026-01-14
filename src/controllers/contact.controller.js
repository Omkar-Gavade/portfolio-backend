import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    // Log request hit (useful during development)
    console.log("Contact API called");

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