
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MessageCircle } from "lucide-react";

const partners = [
  {
    id: 1,
    name: "TechCorp",
    description: "Global technology company providing cloud services and enterprise solutions.",
    logo: "/placeholder.svg",
    partnershipType: "Platinum Sponsor",
    website: "https://example.com",
    featured: true
  },
  {
    id: 2,
    name: "Innovation Labs",
    description: "Research and development hub focused on emerging technologies and startup incubation.",
    logo: "/placeholder.svg",
    partnershipType: "Gold Sponsor",
    website: "https://example.com",
    featured: true
  },
  {
    id: 3,
    name: "Digital University",
    description: "Leading educational institution specializing in computer science and information technology.",
    logo: "/placeholder.svg",
    partnershipType: "Educational Partner",
    website: "https://example.com",
    featured: true
  },
  {
    id: 4,
    name: "StartupBoost",
    description: "Venture capital firm supporting early-stage tech startups and innovative solutions.",
    logo: "/placeholder.svg",
    partnershipType: "Silver Sponsor",
    website: "https://example.com",
    featured: false
  },
  {
    id: 5,
    name: "DevHub",
    description: "Community workspace providing resources for developers and tech enthusiasts.",
    logo: "/placeholder.svg",
    partnershipType: "Community Partner",
    website: "https://example.com",
    featured: false
  },
  {
    id: 6,
    name: "CodeWorks",
    description: "Software development company specializing in mobile applications and web services.",
    logo: "/placeholder.svg",
    partnershipType: "Bronze Sponsor",
    website: "https://example.com",
    featured: false
  }
];

const tiers = [
  {
    name: "Bronze Partner",
    price: "$1,000",
    description: "Perfect for small businesses looking to engage with the tech community.",
    features: [
      "Logo on event materials",
      "1 speaking opportunity per year",
      "2 complimentary event passes",
      "Social media mentions"
    ]
  },
  {
    name: "Silver Partner",
    price: "$2,500",
    description: "Ideal for growing companies wanting to increase their visibility.",
    features: [
      "Logo on website and event materials",
      "2 speaking opportunities per year",
      "Small booth at major events",
      "5 complimentary event passes",
      "Social media campaign"
    ]
  },
  {
    name: "Gold Partner",
    price: "$5,000",
    description: "For organizations looking to establish strong presence in the tech ecosystem.",
    features: [
      "Premium logo placement",
      "4 speaking opportunities per year",
      "Medium booth at all events",
      "10 complimentary event passes",
      "Dedicated social media campaign",
      "Co-branded workshop opportunities"
    ]
  },
  {
    name: "Platinum Partner",
    price: "$10,000",
    description: "Our highest tier for maximum impact and community engagement.",
    features: [
      "Top logo placement on all materials",
      "Unlimited speaking opportunities",
      "Large booth at all events",
      "20 complimentary event passes",
      "Featured content on our platform",
      "Co-organizing opportunities",
      "Direct access to talent pipeline"
    ]
  }
];

const PartnerCard = ({ partner }: { partner: typeof partners[0] }) => {
  return (
    <div className={`bg-card rounded-lg overflow-hidden border shadow transition-all hover:shadow-md ${partner.featured ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="h-40 flex items-center justify-center p-6 bg-muted">
        <img 
          src={partner.logo} 
          alt={`${partner.name} logo`}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {partner.partnershipType}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {partner.description}
        </p>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex items-center" asChild>
            <a href={partner.website} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 mr-2" />
              Visit Website
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Partners = () => {
  return (
    <Layout>
       <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-center p-3 text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
         This page is under construction<br /> Please check back later.
        </h1>
      {/* <div className="container py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">
          Our Partners
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Organizations that support our mission and help us grow
        </p>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Featured Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners
              .filter(partner => partner.featured)
              .map(partner => (
                <PartnerCard key={partner.id} partner={partner} />
              ))
            }
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">All Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map(partner => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>
        
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our growing network of partners and help us build a stronger tech community while gaining visibility for your organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="text-3xl font-bold mt-2">{tier.price}</div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant={index === tiers.length - 1 ? "gradient" : "outline"} className="w-full">
                    Get Started
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Have Questions?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Reach out to our partnerships team to learn more about how we can work together.
          </p>
          <Button variant="gradient" className="flex items-center mx-auto">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </div> */}
    </Layout>
  );
};

export default Partners;
