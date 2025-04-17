
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { updateSiteSettings, getSiteSettings } from '@/services/settingsService';
import { SiteSettings as SiteSettingsType } from '@/services/settingsService';

const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettingsType>({
    siteName: '',
    siteDescription: '',
    phoneNumber: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
    address: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil pengaturan situs',
          variant: 'destructive'
        });
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateSiteSettings(settings);
      toast({
        title: 'Sukses',
        description: 'Pengaturan situs berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui pengaturan situs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="social">Media Sosial</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>
                  Atur informasi dasar tentang situs web Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nama Situs</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    placeholder="Nama situs web Anda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Deskripsi Situs</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    placeholder="Deskripsi singkat tentang situs web Anda"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
                <CardDescription>
                  Atur informasi kontak untuk situs web Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={settings.phoneNumber}
                    onChange={handleChange}
                    placeholder="+62 XXX XXXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={settings.whatsapp}
                    onChange={handleChange}
                    placeholder="+62 XXX XXXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    placeholder="Alamat fisik bisnis Anda"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Media Sosial</CardTitle>
                <CardDescription>
                  Hubungkan akun media sosial Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={settings.instagram}
                    onChange={handleChange}
                    placeholder="@username_instagram"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    name="tiktok"
                    value={settings.tiktok}
                    onChange={handleChange}
                    placeholder="@username_tiktok"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default SiteSettings;
