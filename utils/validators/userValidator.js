import { check, body } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/user.model.js";
export const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((emailValue) =>
      User.findOne({ email: emailValue }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already in user"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password != req.body.passwordConfirm) {
        throw new Error("Password password confirmation incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

export const updateUserValidator = [
  check("id").optional().isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((emailValue) =>
      User.findOne({ email: emailValue }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

export const changeUserPasswordValidator = [
  check("id").optional().isMongoId().withMessage("Invalid User id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (val, { req }) => {
      // 1) verfiy cuurrent password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      // 2) verify password confirm
      if (val != req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];
export const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

export const updateLogedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((emailValue) =>
      User.findOne({ email: emailValue }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number"),
  // check("profileImg").optional(),
  // check("role").optional(),
  validatorMiddleware,
];
