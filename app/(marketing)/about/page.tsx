import Image from "next/image";

import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const AboutPage = () => {
  return (
    <div className="py-10">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full bg-gradient-to-r from-purple-500/30 to-blue-500/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold md:text-5xl lg:text-6xl">
              About Tuba Fashion
            </h1>
            <p className="text-muted-foreground mt-4 text-lg md:text-xl">
              Crafting Style and Elegance Since 2010
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <MaxWidthWrapper className="py-16">
        <HeaderSection
          label="Our Story"
          title="The Journey of Tuba Fashion"
          subtitle="From a small boutique to a leading fashion brand, our journey has been defined by passion, quality, and innovation."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="rounded-xl border p-1">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.jpg"
                alt="Our Story"
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Founded in 2010, Tuba Fashion began with a simple mission: to
              create beautiful, high-quality clothing that empowers people to
              express their unique style. What started as a small boutique has
              grown into a beloved fashion brand with customers worldwide.
            </p>
            <p className="text-muted-foreground">
              Our founder, Sarah Johnson, believed that fashion should be
              accessible, sustainable, and inclusive. These principles continue
              to guide everything we do, from design to production to customer
              service.
            </p>
            <p className="text-muted-foreground">
              Over the years, we've expanded our collections, opened new stores,
              and built a vibrant online community. But our commitment to
              craftsmanship, ethical practices, and customer satisfaction
              remains unchanged.
            </p>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Our Values Section */}
      <div className="bg-muted py-16">
        <MaxWidthWrapper>
          <HeaderSection
            label="Our Values"
            title="What We Stand For"
            subtitle="Our core values shape every decision we make and every product we create."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Quality",
                description:
                  "We use premium materials and meticulous craftsmanship to create pieces that last.",
              },
              {
                title: "Sustainability",
                description:
                  "We're committed to ethical production and reducing our environmental footprint.",
              },
              {
                title: "Inclusivity",
                description:
                  "We design for diverse body types, styles, and preferences.",
              },
              {
                title: "Innovation",
                description:
                  "We continuously explore new designs, materials, and technologies.",
              },
              {
                title: "Community",
                description:
                  "We foster connections among fashion lovers and support local communities.",
              },
              {
                title: "Transparency",
                description:
                  "We're open about our processes, pricing, and business practices.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group bg-background relative overflow-hidden rounded-2xl border p-6 transition-all hover:shadow-md"
              >
                <h3 className="mb-3 text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Team Section */}
      <MaxWidthWrapper className="py-16">
        <HeaderSection
          label="Our Team"
          title="Meet the People Behind Tuba Fashion"
          subtitle="Our diverse team brings together expertise in design, production, technology, and customer service."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Sarah Johnson",
              role: "Founder & Creative Director",
              image: "/placeholder.jpg",
              bio: "With over 20 years in fashion, Sarah leads our creative vision with passion and expertise.",
            },
            {
              name: "David Chen",
              role: "Head of Design",
              image: "/placeholder.jpg",
              bio: "David's innovative designs have been central to our brand identity since 2012.",
            },
            {
              name: "Aisha Patel",
              role: "Production Manager",
              image: "/placeholder.jpg",
              bio: "Aisha ensures our manufacturing processes meet the highest standards of quality and ethics.",
            },
            {
              name: "Michael Rodriguez",
              role: "E-Commerce Director",
              image: "/placeholder.jpg",
              bio: "Michael has transformed our digital presence and online shopping experience.",
            },
            {
              name: "Emma Wilson",
              role: "Customer Experience Lead",
              image: "/placeholder.jpg",
              bio: "Emma's dedication to customer satisfaction has earned us a loyal community.",
            },
            {
              name: "James Kim",
              role: "Sustainability Officer",
              image: "/placeholder.jpg",
              bio: "James leads our initiatives to reduce environmental impact and promote ethical practices.",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="group bg-background overflow-hidden rounded-xl border transition-all hover:shadow-md"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
                <p className="text-muted-foreground mt-3">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>

      {/* Contact CTA Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 py-16">
        <MaxWidthWrapper>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Want to Learn More?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              We'd love to hear from you! Reach out to our team with questions,
              feedback, or partnership opportunities.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium shadow transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

export default AboutPage;
