
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Clock, ExternalLink } from "lucide-react";
import { useTechBlogs } from "@/services/blogService";
import type { BlogPost } from "@/services/blogService";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 rounded-lg overflow-hidden border shadow bg-card">
      <div className="h-60 md:h-full bg-muted flex items-center justify-center">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
        <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
        <Button as="a" href={post.url} target="_blank" className="gap-2">
          Read Article <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden border shadow hover:shadow-md transition-shadow">
      <div className="h-48 bg-muted flex items-center justify-center">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">{post.author.name}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {post.date}
          </div>
        </div>
        <Button as="a" href={post.url} target="_blank" variant="outline" className="w-full gap-2">
          Read Article <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const BlogSkeleton = () => (
  <div className="space-y-8">
    <div className="h-[400px] rounded-lg bg-muted animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(null).map((_, i) => (
        <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  </div>
);

const Blog = () => {
  const { data: posts, isLoading, error } = useTechBlogs();

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
            Tech Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Latest tech insights and community stories
          </p>
          <BlogSkeleton />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-12 md:py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading blog posts</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
          Tech Blog
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Latest tech insights and community stories
        </p>
        
        {posts && posts.length > 0 && (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
              <div className="space-y-8">
                <FeaturedPostCard post={posts[0]} />
              </div>
            </div>
            
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Recent Articles</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1).map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
