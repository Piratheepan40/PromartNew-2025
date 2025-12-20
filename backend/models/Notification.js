import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
import Listing from "./Listing.js";

class Notification extends Model { }

Notification.init(
  {
    type: {
      type: DataTypes.ENUM("new_listing", "status_update", "re_approval"),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    listingId: {
      type: DataTypes.INTEGER,
      references: {
        model: Listing,
        key: "id",
      },
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
  }
);

User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

Listing.hasMany(Notification, { foreignKey: "listingId" });
Notification.belongsTo(Listing, { foreignKey: "listingId" });

export default Notification;