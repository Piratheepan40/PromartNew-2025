import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Blog extends Model { }

Blog.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    readTime: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, defaultValue: "" },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Blog",
    tableName: "blogs",
    timestamps: true,
  }
);

export default Blog;
