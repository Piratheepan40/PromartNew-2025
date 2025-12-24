import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Contact extends Model { }

Contact.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("new", "read", "replied"),
      defaultValue: "new",
    },
  },
  {
    sequelize,
    modelName: "Contact",
    tableName: "contacts",
    timestamps: true,
  }
);

export default Contact;
