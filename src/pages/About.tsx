
import { Layout } from "@/components/layout";

const About = () => {
  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text animate-gradient-shift bg-[length:200%_auto]">About WYDE</h1>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="grid md:grid-cols-1 gap-8">
            <div>
              <p className="text-lg mb-4">
                WYDE was founded in 2024 by a group of passionate students who wanted to create a community where technology enthusiasts could learn, collaborate, and grow together.
              </p>
              <p className="text-lg mb-4">
                What started as small meetups in university classrooms quickly grew into a vibrant community spanning multiple campuses and attracting industry professionals.
              </p>
              <p className="text-lg">
                Today, WYDE stands as a bridge between academic learning and real-world application, empowering students to build meaningful projects and forge valuable connections.
              </p>
            </div>
            <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="italic text-lg">
                  "To democratize access to technology education and create a community where students can build, learn, and grow together."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
              <p>We believe everyone deserves access to technology education regardless of their background or prior experience.</p>
            </div>
            <div className="bg-background border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
              <p>We encourage working together, sharing knowledge, and building connections that last beyond our events.</p>
            </div>
            <div className="bg-background border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p>We push boundaries, experiment with new technologies, and strive to create solutions that make a real difference.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-32 h-32 bg-muted rounded-full mb-4"></div>
                <h3 className="font-semibold text-lg">Team Member {index + 1}</h3>
                <p className="text-muted-foreground text-sm text-center">Co-founder & Role</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
