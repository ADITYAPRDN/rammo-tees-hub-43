
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 animate-slide-up">
              Kualitas Sablon <span className="text-primary-500">Premium</span> untuk Semua Kebutuhan
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg animate-slide-up delay-150">
              Baju kaos berkualitas tinggi dengan sablon terbaik untuk acara, bisnis, atau ekspresi kreatif Anda.
            </p>
            <div className="pt-4 animate-slide-up delay-300">
              <Link to="/order">
                <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-6 py-3 inline-flex items-center gap-2 text-lg hover:scale-105 transition-transform">
                  Pesan Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-slide-up delay-150">
            <div className="absolute inset-0 bg-primary-300 rounded-full opacity-20 blur-3xl transform -translate-x-4 translate-y-4"></div>
            <img
              src="/t-shirt-1.png"
              alt="RAMMO T-Shirts Collection"
              className="relative z-10 w-full h-auto object-cover rounded-lg shadow-xl transition-transform hover:scale-105 duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
