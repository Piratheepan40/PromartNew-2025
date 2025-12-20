// controllers/blogController.js
import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, author, category, readTime, image } = req.body;

    if (!title || !excerpt || !content || !author || !readTime || !category) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const blog = await Blog.create({ title, excerpt, content, author, readTime, category, image });
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error creating blog" });
  }
};


// 📋 Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const blogs = await Blog.findAll({
      where: filter,
      order: [["createdAt", "DESC"]]
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

// 🔍 Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};

// ✏️ Update blog
export const updateBlog = async (req, res) => {
  try {
    const [updated] = await Blog.update(req.body, { where: { id: req.params.id } });
    if (updated === 0) return res.status(404).json({ message: "Blog not found" });

    const blog = await Blog.findByPk(req.params.id);
    res.json({ message: "Blog updated", blog });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// ❌ Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.destroy({ where: { id: req.params.id } });
    if (deleted === 0) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};
