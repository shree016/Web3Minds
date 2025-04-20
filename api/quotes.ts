// api/quotes.ts

export default async function handler(req, res) {
    try {
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
  
      // Send the quote to the client
      res.status(200).json({
        content: data.content,
        author: data.author,
      });
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({
        content: "Oops! Something went wrong while fetching the quote.",
        author: "Wyde Bot",
      });
    }
  }
  