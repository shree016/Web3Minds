
import { Layout } from "@/components/layout";
import { HeroSection } from "@/components/home/hero-section";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { ProjectsGallery } from "@/components/home/projects-gallery";
import { Testimonials } from "@/components/home/testimonials";
import { StatsCounter } from "@/components/home/stats-counter";
import { Newsletter } from "@/components/home/newsletter";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <UpcomingEvents />
      <ProjectsGallery />
      <StatsCounter />
      <Testimonials />
      <Newsletter />
    </Layout>
  );
};

export default Home;
