import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  updateBlog,
} from "@/services/blogService";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category?: string;
  image: string;
}

const BlogManagement = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setPosts(data);
      } catch {
        toast({ title: "Failed to load blogs", variant: "destructive" });
      }
    };
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPost.id) {
        const updated = await updateBlog(currentPost.id, currentPost);
        setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
        toast({ title: "Blog updated successfully" });
      } else {
        const newBlog = await createBlog(currentPost);
        setPosts([newBlog, ...posts]);
        toast({ title: "Blog created successfully" });
      }
      setIsEditing(false);
      setCurrentPost({});
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      setPosts(posts.filter((p) => p.id !== id));
      toast({ title: "Blog deleted successfully" });
    } catch {
      toast({ title: "Error deleting blog", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={currentPost.title || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={currentPost.excerpt || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, excerpt: e.target.value })
                }
                required
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={currentPost.category || ""}
                onValueChange={(value) =>
                  setCurrentPost({ ...currentPost, category: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Tips & Tricks",
                    "Industry Insights",
                    "Guides",
                    "Success Stories",
                    "Business Finance",
                    "Relationships",
                  ].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={currentPost.content || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, content: e.target.value })
                }
                required
                rows={10}
              />
            </div>
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={currentPost.author || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, author: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="readTime">Read Time *</Label>
              <Input
                id="readTime"
                value={currentPost.readTime || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, readTime: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={currentPost.image || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
              {currentPost.image && (
                <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md border border-slate-200">
                  <img
                    src={currentPost.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {currentPost.id ? "Update" : "Create"} Post
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPost({});
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">{post.title}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      By {post.author} •{" "}
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentPost(post);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
