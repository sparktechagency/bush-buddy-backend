import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

import { CONFIG } from "../../../core/config";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { IAdmin } from "./admin.interface";

const adminSchema = new Schema<IAdmin>({
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: USER_ROLE.SUPPER_ADMIN },
  isDeleted: { type: Boolean, default: false },
});

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(CONFIG.BCRYPT.bcrypt_salt_rounds)
  );
});

export const Admin = model<IAdmin>("Admin", adminSchema);
