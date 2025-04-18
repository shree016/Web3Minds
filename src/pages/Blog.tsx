
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Clock, Tag } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with React: A Beginner's Guide",
    excerpt: "Learn the basics of React.js and build your first component-based application with this step-by-step tutorial.",
    date: "April 15, 2025",
    readTime: "8 min read",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      role: "Web Developer"
    },
    image: "/placeholder.svg",
    category: "Tutorials",
    featured: true
  },
  {
    id: 2,
    title: "Recap: Spring Hackathon 2025",
    excerpt: "A look back at our most successful hackathon yet, featuring 30 teams and incredible projects that tackled real-world problems.",
    date: "March 28, 2025",
    readTime: "5 min read",
    author: {
      name: "Sophia Lee",
      avatar: "/placeholder.svg",
      role: "Event Coordinator"
    },
    image: "/placeholder.svg",
    category: "Events",
    featured: true
  },
  {
    id: 3,
    title: "The Future of AI in Education",
    excerpt: "Exploring how artificial intelligence is transforming the educational landscape and what it means for students and educators.",
    date: "March 10, 2025",
    readTime: "10 min read",
    author: {
      name: "Marcus Chen",
      avatar: "/placeholder.svg",
      role: "AI Researcher"
    },
    image: "/placeholder.svg",
    category: "Technology Trends",
    featured: true
  },
  {
    id: 4,
    title: "How to Prepare for Technical Interviews",
    excerpt: "Essential tips and strategies to help you ace your next technical interview, from data structures to system design questions.",
    date: "February 25, 2025",
    readTime: "12 min read",
    author: {
      name: "Jamie Wilson",
      avatar: "/placeholder.svg",
      role: "Software Engineer"
    },
    image: "/placeholder.svg",
    category: "Career Advice",
    featured: false
  },
  {
    id: 5,
    title: "Building Accessible Web Applications",
    excerpt: "Learn why accessibility matters and how to implement WCAG guidelines to make your web applications inclusive for all users.",
    date: "February 12, 2025",
    readTime: "7 min read",
    author: {
      name: "Taylor Nguyen",
      avatar: "/placeholder.svg",
      role: "UX Designer"
    },
    image: "/placeholder.svg",
    category: "Web Development",
    featured: false
  },
  {
    id: 6,
    title: "Introduction to Blockchain Development",
    excerpt: "Dive into the world of blockchain technology and learn how to build your first decentralized application from scratch.",
    date: "January 30, 2025",
    readTime: "15 min read",
    author: {
      name: "Jordan Park",
      avatar: "/placeholder.svg",
      role: "Blockchain Developer"
    },
    image: "/placeholder.svg",
    category: "Tutorials",
    featured: false
  }
];

const FeaturedPostCard = ({ post }: { post: typeof blogPosts[0] }) => {
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
        <p className="text-muted-foreground mb-4 flex-grow">
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
        <Button>Read Article</Button>
      </div>
    </div>
  );
};

const BlogCard = ({ post }: { post: typeof blogPosts[0] }) => {
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
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
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
        <Button variant="outline" className="w-full">Read Article</Button>
      </div>
    </div>
  );
};

const Blog = () => {
  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
          Blog
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Insights, tutorials, and community stories
        </p>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
          <div className="space-y-8">
            {blogPosts
              .filter(post => post.featured)
              .slice(0, 1)
              .map(post => (
                <FeaturedPostCard key={post.id} post={post} />
              ))
            }
          </div>
        </div>
        
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="outline" size="sm">Tutorials</Button>
              <Button variant="outline" size="sm">Events</Button>
              <Button variant="outline" size="sm">Career</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" size="lg">Load More Articles</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
