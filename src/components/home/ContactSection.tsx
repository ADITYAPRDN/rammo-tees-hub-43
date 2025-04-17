
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Instagram, TikTok, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Hubungi Kami</h2>
          <p className="mt-4 text-lg text-gray-600">
            Ada pertanyaan atau ingin diskusi lebih lanjut? Hubungi kami melalui platform berikut
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Hubungi kami langsung melalui WhatsApp untuk layanan cepat</p>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                +62 812-3456-7890
              </a>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.open('https://wa.me/6281234567890', '_blank', 'noopener,noreferrer')}
              >
                Chat Sekarang
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <Instagram className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Media</h3>
              <p className="text-gray-600 mb-4">Ikuti kami di media sosial untuk update dan inspirasi desain</p>
              <div className="space-y-2">
                <a
                  href="https://instagram.com/rammo_tshirts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary-600 hover:text-primary-700"
                >
                  Instagram: @rammo_tshirts
                </a>
                <a
                  href="https://tiktok.com/@rammo_tshirts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary-600 hover:text-primary-700"
                >
                  TikTok: @rammo_tshirts
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lokasi</h3>
              <p className="text-gray-600 mb-4">Kunjungi workshop kami di:</p>
              <address className="not-italic text-gray-700 mb-4">
                Jl. Sablon Kreatif No. 123<br />
                Jakarta Selatan, 12345
              </address>
              <Link to="/contact">
                <Button variant="outline">Lihat di Peta</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
