import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class OTP extends Model { }

OTP.init(
  {
    email: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: "OTP",
    tableName: "otps",
    timestamps: true,
  }
);

export default OTP;
