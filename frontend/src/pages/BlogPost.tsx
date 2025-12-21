import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { getBlogById, getBlogs } from '@/services/blogService';
import { useEffect, useState } from 'react';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBlogById(id!);
        setPost(data);
        setLoading(false);
        const blog = await getBlogs();
        setBlogPosts(blog);
      } catch (err) {
        setError(true);
      }
    };
    fetchPost();
  }, [id]);

  if (error) return <p>Blog not found</p>;
  if (!post) return loading;





  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-800">Post Not Found</h1>
          <Link to="/blog">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/blog">
              <Button
                variant="ghost"
                className="mb-6 text-slate-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 border-0">
              {post.category}
            </Badge>

            <h1
              className="mb-6 text-4xl font-bold md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-amber-500 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 backdrop-blur-sm bg-white/5"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-background"
          >
            <path
              d="M0 120L1440 120L1440 0C1440 0 1080 80 720 80C360 80 0 0 0 0L0 120Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 bg-background">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={post.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"}
                alt={post.title}
                className="h-96 w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";
                }}
              />
            </div>

            <Card className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-2xl prose-p:mb-4 prose-p:text-slate-600 prose-strong:text-slate-800 prose-headings:text-slate-800 prose-ul:text-slate-600 prose-ol:text-slate-600 prose-li:text-slate-600 prose-blockquote:border-amber-500 prose-blockquote:text-slate-600"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </Card>

            {/* Related Articles */}
            <div className="mt-16 border-t border-slate-200 pt-12">
              <h3
                className="mb-8 text-2xl font-bold text-slate-800"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Related Articles
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {blogPosts
                  .filter((p) => p.id !== id && p.category === post.category)
                  .slice(0, 2)
                  .map((relatedPost) => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
                      <Card className="group h-full rounded-2xl overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={relatedPost.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"}
                            alt={relatedPost.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800";
                            }}
                          />
                        </div>
                        <div className="p-6">
                          <Badge variant="secondary" className="mb-3 bg-slate-100 text-slate-700">
                            {relatedPost.category}
                          </Badge>
                          <h4 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                            {relatedPost.title}
                          </h4>
                        </div>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Back to Blog CTA */}
            <div className="mt-12 text-center">
              <Link to="/blog">
                <Button
                  variant="outline"
                  className="border-amber-500 text-amber-600 hover:bg-amber-50 group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to All Articles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white mb-5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="mb-4 text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Grow Your Business?
            </h2>
            <p className="mb-10 text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of businesses already succeeding with ProMart.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
              onClick={() => window.location.href = '/register'}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;