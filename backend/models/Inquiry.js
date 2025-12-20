import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
import Listing from "./Listing.js";

class Inquiry extends Model { }

Inquiry.init(
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
        listingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Listing,
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("new", "read", "responded", "archived"),
            defaultValue: "new",
        },
    },
    {
        sequelize,
        modelName: "Inquiry",
        tableName: "inquiries",
        timestamps: true,
    }
);

// Define Associations
User.hasMany(Inquiry, { foreignKey: "companyId" });
Inquiry.belongsTo(User, { foreignKey: "companyId", as: "company" });

Listing.hasMany(Inquiry, { foreignKey: "listingId" });
Inquiry.belongsTo(Listing, { foreignKey: "listingId", as: "listing" });

export default Inquiry;
