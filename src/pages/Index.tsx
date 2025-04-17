
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ContactSection from '@/components/home/ContactSection';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedProducts />
      <ContactSection />
    </Layout>
  );
};

export default Index;
