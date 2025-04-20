// api/quotes.ts (or api/zenQuote.ts)
export default async function handler(req, res) {
    try {
        const response = await fetch("https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/today");

      const data = await response.json();
  
      // Send the quote to the frontend
      res.status(200).json(data[0]);
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({
        content: "Oops! Something went wrong while fetching the quote.",
        author: "Wyde Bot",
      });
    }
  }
  