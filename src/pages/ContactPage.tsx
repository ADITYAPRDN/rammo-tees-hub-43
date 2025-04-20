import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Instagram, Share2, MapPin } from 'lucide-react';

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
                      href="https://wa.link/y2tfq3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      +62 852-1829-5384
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Instagram className="h-6 w-6 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Instagram</h3>
                    <p className="text-gray-600 mb-2">Ikuti kami untuk update dan inspirasi desain</p>
                    <a
                      href="https://www.instagram.com/rammoclothing/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      @rammoclothing
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Share2 className="h-6 w-6 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">TikTok</h3>
                    <p className="text-gray-600 mb-2">Lihat konten kreatif dan proses produksi kami</p>
                    <a
                      href="https://www.tiktok.com/@rammoclothing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      @rammoclothing
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Alamat Workshop</h3>
                    <address className="not-italic text-gray-600 mb-2">
                      Workshop Rammo<br />
                      Jl. R.A Kartini No.1, Ngringin Condongcatur<br />
                      Kec. Depok, Kabupaten Sleman<br />
                      Daerah Istimewa Yogyakarta 55281<br />
                      Indonesia
                    </address>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="h-96 md:h-auto">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.1675667538164!2d110.40721797497645!3d-7.7676318922722175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59a885892233%3A0x564488b6dc3d587d!2sRAMMO!5e0!3m2!1sen!2sid!4v1711595010041!5m2!1sen!2sid"
              className="w-full h-full border-0 rounded-lg shadow-md"
              allowFullScreen
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="RAMMO Workshop Location"
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
