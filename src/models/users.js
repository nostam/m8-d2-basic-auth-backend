const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const atob = require("atob");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username required"],
      minlength: [3, "Username must be at least 3 characters"],
      validate: {
        validator: async function (username) {
          const user = await this.constructor.findOne({ username });
          if (user && user.username === this.username) return true;
          return !user ? true : false;
        },
        message: () => "Username is taken",
      },
    },
    password: {
      type: String,
      unique: true,
      required: [true, "User password required"],
      minlength: [10, "Password requires minimum 10 characters"],
    },
    firstName: { type: String, required: [true, "User first name required"] },
    lastName: { type: String, required: [true, "User last name required"] },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: [true, "User role required"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  const result = ["password", "__v"].forEach((key) => delete userObj[key]);
  return result;
};

UserSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({ username: username });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return null;
  } else return null;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 11);
  }
  next();
});

module.exports = model("User", UserSchema);
