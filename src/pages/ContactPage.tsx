
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Instagram, TikTok, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hubungi Kami</h1>
          <p className="mt-4 text-lg text-gray-600">
            Ada pertanyaan atau ingin bekerja sama dengan kami? Jangan ragu untuk menghubungi
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start space-x-4">
                  <MessageSquare className="h-6 w-6 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">WhatsApp</h3>
                    <p className="text-gray-600 mb-2">Kontak kami melalui WhatsApp untuk respons cepat</p>
                    <a
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      +62 812-3456-7890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Instagram className="h-6 w-6 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Instagram</h3>
                    <p className="text-gray-600 mb-2">Ikuti kami untuk update dan inspirasi desain</p>
                    <a
                      href="https://instagram.com/rammo_tshirts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      @rammo_tshirts
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <TikTok className="h-6 w-6 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">TikTok</h3>
                    <p className="text-gray-600 mb-2">Lihat konten kreatif dan proses produksi kami</p>
                    <a
                      href="https://tiktok.com/@rammo_tshirts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      @rammo_tshirts
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Alamat Workshop</h3>
                    <address className="not-italic text-gray-600 mb-2">
                      Jl. Sablon Kreatif No. 123<br />
                      Jakarta Selatan, 12345<br />
                      Indonesia
                    </address>
                    <p className="text-gray-600">
                      Buka: Senin - Sabtu, 09:00 - 17:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="h-96 md:h-auto">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.36633952333!2d106.7588024673722!3d-6.229386715321705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1713936069971!5m2!1sid!2sid" 
              className="w-full h-full border-0 rounded-lg shadow-md"
              allowFullScreen
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="RAMMO T-Shirts Location"
            ></iframe>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Siap untuk Memesan?</h2>
          <p className="mb-6 text-gray-600">
            Pesan kaos custom berkualitas tinggi sekarang juga!
          </p>
          <Button 
            asChild
            className="px-8 py-6 text-lg"
            onClick={() => window.location.href = '/order'}
          >
            <a href="/order">Buat Pesanan</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
