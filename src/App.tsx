import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import Glossary from "./pages/Glossary";
import TermDetail from "./pages/TermDetail";
import Submit from "./pages/Submit";
import Learn from "./pages/Learn";
import Profile from "./pages/Profile";
import Moderation from "./pages/Moderation";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Core pages */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />

          {/* Glossary */}
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/glossary/:slug" element={<TermDetail />} />

          {/* Community */}
          <Route path="/submit" element={<Submit />} />
          <Route path="/moderation" element={<Moderation />} />

          {/* Learning */}
          <Route path="/learn" element={<Learn />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:address" element={<Profile />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
