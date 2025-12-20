import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

class Listing extends Model { }

Listing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING
    },
    website: {
      type: DataTypes.STRING
    },
    keyFeatures: {
      type: DataTypes.TEXT, // Using TEXT for compatibility if JSON not supported
      defaultValue: "[]",
      get() {
        const rawValue = this.getDataValue('keyFeatures');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('keyFeatures', JSON.stringify(value));
      }
    },
    attachments: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      get() {
        const rawValue = this.getDataValue('attachments');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('attachments', JSON.stringify(value));
      }
    },
    verificationDocuments: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      get() {
        const rawValue = this.getDataValue('verificationDocuments');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('verificationDocuments', JSON.stringify(value));
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending"
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  },
  {
    sequelize,
    modelName: "Listing",
    tableName: "listings",
    timestamps: true,
  }
);

// Define Association
User.hasMany(Listing, { foreignKey: "companyId" });
Listing.belongsTo(User, { foreignKey: "companyId" });

export default Listing;
