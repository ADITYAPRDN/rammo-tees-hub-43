
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';

const SiteSettings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Hero section settings
  const [heroSettings, setHeroSettings] = useState({
    title: 'RAMMO T-Shirts',
    subtitle: 'Sablon Kaos Berkualitas Premium',
    description: 'Jasa sablon kaos berkualitas dengan hasil terbaik untuk kebutuhan personal maupun bisnis Anda',
    imageUrl: '/t-shirt-1.png',
    buttonText: 'Pesan Sekarang'
  });
  
  // Contact settings
  const [contactSettings, setContactSettings] = useState({
    whatsappNumber: '6281234567890',
    instagram: 'rammo_tshirts',
    tiktok: 'rammo_tshirts',
    address: 'Jl. Sablon Kreatif No. 123, Jakarta Selatan, 12345',
    email: 'info@rammo-tshirts.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2773280663566!2d106.82596231476884!3d-6.2295284995487855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15c7707016f%3A0x50c7d605ba8542f1!2sMonumen%20Nasional!5e0!3m2!1sen!2sid!4v1632890718775!5m2!1sen!2sid'
  });
  
  // About settings
  const [aboutSettings, setAboutSettings] = useState({
    title: 'Tentang RAMMO',
    description: 'RAMMO adalah usaha sablon kaos yang berdiri sejak tahun 2015. Kami menyediakan jasa sablon kaos berkualitas dengan harga terjangkau. Kepuasan pelanggan adalah prioritas kami.',
    vision: 'Menjadi penyedia jasa sablon terpercaya dengan kualitas premium.',
    mission: 'Memberikan layanan sablon terbaik dengan harga terjangkau dan hasil memuaskan.',
    imageUrl: '/t-shirt-2.png'
  });
  
  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setHeroSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setAboutSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const saveSettings = (settingsType) => {
    setLoading(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Pengaturan Disimpan",
        description: `Pengaturan ${
          settingsType === 'hero' ? 'Hero Section' : 
          settingsType === 'contact' ? 'Kontak' : 'Tentang Kami'
        } berhasil diperbarui`,
      });
    }, 1000);
  };
  
  return (
    <div>
      <Tabs defaultValue="hero">
        <TabsList className="mb-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="contact">Kontak & Sosial Media</TabsTrigger>
          <TabsTrigger value="about">Tentang Kami</TabsTrigger>
        </TabsList>
        
        {/* Hero Section Settings */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Hero Section</CardTitle>
              <CardDescription>
                Kustomisasi bagian utama pada halaman landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Hero</Label>
                <Input
                  id="title"
                  name="title"
                  value={heroSettings.title}
                  onChange={handleHeroChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subjudul</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={heroSettings.subtitle}
                  onChange={handleHeroChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={heroSettings.description}
                  onChange={handleHeroChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Gambar Hero</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={heroSettings.imageUrl}
                  onChange={handleHeroChange}
                />
                {heroSettings.imageUrl && (
                  <div className="mt-2 border rounded p-2 max-w-xs">
                    <img
                      src={heroSettings.imageUrl}
                      alt="Hero Preview"
                      className="w-full h-auto max-h-40 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonText">Teks Tombol CTA</Label>
                <Input
                  id="buttonText"
                  name="buttonText"
                  value={heroSettings.buttonText}
                  onChange={handleHeroChange}
                />
              </div>
              
              <Button 
                onClick={() => saveSettings('hero')} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Kontak & Sosial Media</CardTitle>
              <CardDescription>
                Kelola informasi kontak dan akun sosial media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={contactSettings.whatsappNumber}
                  onChange={handleContactChange}
                  placeholder="628xxxxxxxxxx"
                />
                <p className="text-xs text-gray-500">Format: 628xxxxxxxxxx (tanpa tanda + atau -)</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={contactSettings.email}
                  onChange={handleContactChange}
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Username Instagram</Label>
                <div className="flex items-center">
                  <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md text-gray-500">
                    @
                  </span>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={contactSettings.instagram}
                    onChange={handleContactChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tiktok">Username TikTok</Label>
                <div className="flex items-center">
                  <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md text-gray-500">
                    @
                  </span>
                  <Input
                    id="tiktok"
                    name="tiktok"
                    value={contactSettings.tiktok}
                    onChange={handleContactChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={contactSettings.address}
                  onChange={handleContactChange}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mapEmbedUrl">URL Embed Google Maps</Label>
                <Input
                  id="mapEmbedUrl"
                  name="mapEmbedUrl"
                  value={contactSettings.mapEmbedUrl}
                  onChange={handleContactChange}
                />
                <p className="text-xs text-gray-500">Dapatkan dari Google Maps dengan klik Share > Embed a map</p>
              </div>
              
              {contactSettings.mapEmbedUrl && (
                <div className="mt-2 border rounded overflow-hidden h-48">
                  <iframe 
                    src={contactSettings.mapEmbedUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    loading="lazy"
                    title="Google Maps"
                  ></iframe>
                </div>
              )}
              
              <Button 
                onClick={() => saveSettings('contact')} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* About Settings */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Tentang Kami</CardTitle>
              <CardDescription>
                Kelola informasi tentang perusahaan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">Judul</Label>
                <Input
                  id="aboutTitle"
                  name="title"
                  value={aboutSettings.title}
                  onChange={handleAboutChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutDescription">Deskripsi Perusahaan</Label>
                <Textarea
                  id="aboutDescription"
                  name="description"
                  value={aboutSettings.description}
                  onChange={handleAboutChange}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vision">Visi</Label>
                <Textarea
                  id="vision"
                  name="vision"
                  value={aboutSettings.vision}
                  onChange={handleAboutChange}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mission">Misi</Label>
                <Textarea
                  id="mission"
                  name="mission"
                  value={aboutSettings.mission}
                  onChange={handleAboutChange}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutImageUrl">URL Gambar</Label>
                <Input
                  id="aboutImageUrl"
                  name="imageUrl"
                  value={aboutSettings.imageUrl}
                  onChange={handleAboutChange}
                />
                {aboutSettings.imageUrl && (
                  <div className="mt-2 border rounded p-2 max-w-xs">
                    <img
                      src={aboutSettings.imageUrl}
                      alt="About Preview"
                      className="w-full h-auto max-h-40 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => saveSettings('about')} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;
