import React, { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";

interface Quote {
    content: string;
    author: string;
  }
  
  const QuotePage: React.FC = () => {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    // Fetch a new quote
    const fetchQuote = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/quotes");
          if (!res.ok) {
            throw new Error("Failed to fetch quote");
          }
          const data = await res.json();
          console.log("Fetched quote:", data); // Log the full response
          if (data && data.length > 0) {
            const { q, a } = data[0]; // Get the first quote in the array
            setQuote({ content: q, author: a });
          }
        } catch (error) {
          console.error("Error fetching quote:", error); // Log any errors
          setQuote({
            content: "Oops! Something went wrong while fetching the quote.",
            author: "Wyde Bot",
          });
        } finally {
          setLoading(false);
        }
      };
      
      
  
    // Fetch quote when component is mounted
    useEffect(() => {
      fetchQuote();
    }, []);
  
    // Handle Tweet sharing
    const handleTweet = () => {
      if (!quote) return; // Ensure quote exists before sharing
      const tweetText = encodeURIComponent(`"${quote.content}" – ${quote.author}`);
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black p-6">
        <SiteHeader /> {/* Include the navigation header */}
  
        <div className="max-w-xl w-full text-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white space-y-6 border border-white/20 mx-auto mt-16">
          {loading ? (
            <p className="animate-pulse text-lg">Fetching some wisdom...</p>
          ) : (
            <>
              <p className="text-2xl sm:text-3xl italic leading-relaxed transition-all duration-500">
                "{quote?.content}"
              </p>
              <p className="text-sm sm:text-base text-gray-300 mt-2">– {quote?.author}</p>
  
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={fetchQuote}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition duration-300"
                >
                  New Quote
                </button>
                <button
                  onClick={handleTweet}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition duration-300"
                >
                  Share on X
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default QuotePage;