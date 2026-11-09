import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  department: string;
  branch: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      required: true,
      default: "customer",
      enum: [
        "admin",
        "sales",
        "procurement",
        "accounting",
        "service",
        "parts",
        "financing",
        "recon",
        "imports",
        "tradeins",
        "crm",
        "hr",
        "operations",
        "marketing",
        "compliance",
        "inspection",
        "customer",
      ],
    },
    department: {
      type: String,
      default: "General Operations",
    },
    branch: {
      type: String,
      default: "Victoria Island HQ, Lagos",
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.security.bcryptSaltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password || "");
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

