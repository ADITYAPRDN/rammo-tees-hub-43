
// Tipe data untuk pengaturan situs
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  phoneNumber: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  address: string;
}

// Menyimpan data pengaturan situs dalam memori untuk simulasi database
let siteSettings: SiteSettings = {
  siteName: 'RAMMO Store',
  siteDescription: 'Toko fashion online dengan produk berkualitas tinggi',
  phoneNumber: '+6281234567890',
  whatsapp: '+6281234567890',
  instagram: '@rammostore',
  tiktok: '@rammostore',
  address: 'Jl. Pahlawan No. 123, Surabaya, Indonesia'
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({...siteSettings}), 300);
  });
};

export const updateSiteSettings = async (settings: SiteSettings): Promise<{success: boolean}> => {
  return new Promise((resolve) => {
    siteSettings = {...settings};
    setTimeout(() => resolve({ success: true }), 300);
  });
};
