const requiredField = ['name', 'age', 'email', 'password'];
const isValidField = (req, res, next) => {
  let createField = Object.keys(req.body);
  let isValidField = createField.every((field) => requiredField.includes(field))
  if (!isValidField)
    res.status(404).send({ error: "Invalid Input" });
  next();
}
module.exports = isValidField;