import Joi from "joi";
import { stripHtml } from "string-strip-html";

const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

const messageSchema = Joi.object({
  to: Joi.string().min(1).required(),
  text: Joi.string().min(1).required(),
  type: Joi.string().valid("private_message", "message").required(),
});

function sanitizeString(str) {
  return stripHtml(str).result.trim();
}
function sanitizeObject(object) {
  const keys = Object.keys(object);
  keys.forEach((key) => {
    if (typeof object[key] === "string")
      object[key] = sanitizeString(object[key]);
  });
  return object;
}

export { userSchema, messageSchema, sanitizeString, sanitizeObject };
