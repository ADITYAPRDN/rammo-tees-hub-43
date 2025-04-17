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
          {[
            {
              icon: <MessageSquare className="h-6 w-6 text-primary-500" />,
              title: "WhatsApp",
              content: (
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                  <p className="text-gray-600 mb-4">Hubungi kami langsung melalui WhatsApp untuk layanan cepat</p>
                  <a
                    href={`https://wa.me/${settings?.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-700"
                  >
                    {settings?.whatsapp}
                  </a>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.open(`https://wa.me/${settings?.whatsapp.replace(/[^0-9]/g, '')}`, '_blank', 'noopener,noreferrer')}
                  >
                    Chat Sekarang
                  </Button>
                </CardContent>
              )
            },
            {
              icon: <Instagram className="h-6 w-6 text-primary-500" />,
              title: "Social Media",
              content: (
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <Instagram className="h-6 w-6 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Social Media</h3>
                  <p className="text-gray-600 mb-4">Ikuti kami di media sosial untuk update dan inspirasi desain</p>
                  <div className="space-y-2">
                    <a
                      href={`https://instagram.com/${settings?.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary-600 hover:text-primary-700"
                    >
                      Instagram: {settings?.instagram}
                    </a>
                    <a
                      href={`https://tiktok.com/${settings?.tiktok}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary-600 hover:text-primary-700"
                    >
                      TikTok: {settings?.tiktok}
                    </a>
                  </div>
                </CardContent>
              )
            },
            {
              icon: <MapPin className="h-6 w-6 text-primary-500" />,
              title: "Lokasi",
              content: (
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lokasi</h3>
                  <p className="text-gray-600 mb-4">Kunjungi workshop kami di:</p>
                  <address className="not-italic text-gray-700 mb-4">
                    {settings?.address}
                  </address>
                  <Link to="/contact">
                    <Button variant="outline">Lihat di Peta</Button>
                  </Link>
                </CardContent>
              )
            }
          ].map((item, index) => (
            <Card 
              key={item.title}
              className="bg-white shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                {item.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
