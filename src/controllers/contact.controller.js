export const createContact = async (req, res) => {
  return res.status(201).json({
    success: true,
    message: "API working without database",
    body: req.body,
  });
};