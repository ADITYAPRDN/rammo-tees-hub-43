import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Instagram, Share2, MapPin } from 'lucide-react';
import { getSiteSettings } from '@/services/settingsService';
import type { SiteSettings } from '@/services/settingsService';

const ContactSection = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 animate-slide-up">Hubungi Kami</h2>
          <p className="mt-4 text-lg text-gray-600 animate-slide-up delay-150">
            Ada pertanyaan atau ingin diskusi lebih lanjut? Hubungi kami melalui platform berikut
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Hubungi kami langsung melalui WhatsApp untuk layanan cepat</p>
              <a
                href="https://wa.link/y2tfq3"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                +62 852-1829-5384
              </a>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.open("https://wa.link/y2tfq3", '_blank', 'noopener,noreferrer')}
              >
                Chat Sekarang
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up delay-150">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <Instagram className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Media</h3>
              <p className="text-gray-600 mb-4">Ikuti kami di media sosial untuk update dan inspirasi desain</p>
              <div className="space-y-2">
                <a
                  href="https://www.instagram.com/rammoclothing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary-600 hover:text-primary-700"
                >
                  Instagram: @rammoclothing
                </a>
                <a
                  href="https://www.tiktok.com/@rammoclothing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary-600 hover:text-primary-700"
                >
                  TikTok: @rammoclothing
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up delay-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lokasi</h3>
              <p className="text-gray-600 mb-4">Kunjungi workshop kami di:</p>
              <address className="not-italic text-gray-700 mb-4">
                Workshop Rammo<br />
                Jl. R.A Kartini No.1, Ngringin Condongcatur<br />
                Kec. Depok, Kabupaten Sleman<br />
                Daerah Istimewa Yogyakarta 55281
              </address>
              <Button 
                variant="outline"
                onClick={() => window.open("https://maps.app.goo.gl/M2fJJANhpgTJ58pE7", '_blank', 'noopener,noreferrer')}
              >
                Lihat di Maps
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
