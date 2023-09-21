const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must contain atleast 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
        "Invalid Email Format",
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      match: [
        /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
        "Invalid Phone Number Format",
      ],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others", "Prefer Not to Say"],
      required: true,
    },
    nickname: {
      type: String,
      minlength: [3, "Nick name must be 3 characters long"],
    },
    dob: {
      type: Date,
    },
    role: {
      type: [String],
      required: true,
    },
    dp: {
      type: String,
    },
    lastlogin: {
      type: String,
    },
    underBan: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      street: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      pincode: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

//Verify hashed password & email
userSchema.methods.isVerified = async function (email, password) {
  try {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    const verify = await bcrypt.compare(password, this.password);
    if (verify && email === this.email) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err.message);
  }
};

//Hash Password
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next();
    }
    const hashedPswd = await bcrypt.hash(this.password, 10);
    this.password = hashedPswd;
  } catch (err) {
    console.log(err.message);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
