
import { useQuery } from "@tanstack/react-query";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  image: string;
  category: string;
  url: string;
}

const fetchTechBlogs = async (): Promise<BlogPost[]> => {
  // Using the Dev.to API as an example
  const response = await fetch('https://dev.to/api/articles?tag=technology&top=15');
  const data = await response.json();
  
  return data.map((post: any) => ({
    id: post.id.toString(),
    title: post.title,
    excerpt: post.description || 'No description available',
    date: new Date(post.published_at).toLocaleDateString(),
    readTime: `${Math.ceil(post.reading_time)} min read`,
    author: {
      name: post.user.name || post.user.username,
      avatar: post.user.profile_image || '/placeholder.svg',
      role: 'Dev.to Author'
    },
    image: post.cover_image || '/placeholder.svg',
    category: post.tags[0] || 'Technology',
    url: post.url
  }));
};

export const useTechBlogs = () => {
  return useQuery({
    queryKey: ['techBlogs'],
    queryFn: fetchTechBlogs,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });
};
