import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

export { userSchema };
