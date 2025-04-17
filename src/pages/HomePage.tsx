
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ContactSection from '@/components/home/ContactSection';

const HomePage = () => {
  return (
    <div className="space-y-16 animate-fade-in">
      <Hero />
      <FeaturedProducts />
      <ContactSection />
    </div>
  );
};

export default HomePage;
