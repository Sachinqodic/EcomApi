import express from "express";
import joi from "joi";

const app = express();
app.use(express.json());

const userRegisterValidation = joi.object({
  username: joi.string().alphanum().min(3).max(15).required().trim(),
  email: joi.string().email().required().trim(),
  age: joi.number().required(),
  Phone: joi.number().required(),
  Address: joi.string().required(),
  password: joi.string().required(),
});

userRegisterValidation.requiredFieldsValidation = (data) => {
  const requiredFields = [
    "username",
    "email",
    "age",
    "Phone",
    "Address",
    "password",
  ];
  for (let field of requiredFields) {
    if (!data[field]) {
      return {
        error: {
          message: "Missing required fields in the body",
        },
      };
    }
  }
  return { error: null };
};

export default userRegisterValidation;
