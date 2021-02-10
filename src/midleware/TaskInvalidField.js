const requiredField = ['description','completed'];
const isValidField = (req, res, next) => {
  let createField = Object.keys(req.body);
  let isValidField = createField.every((field) => requiredField.includes(field))
  if (!isValidField)
    res.status(404).send({ error: "Invalid Input" });
  next();
}
module.exports = isValidField;