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
  phoneNumber: '+62 852-1829-5384',
  whatsapp: '+62 852-1829-5384',
  instagram: '@rammoclothing',
  tiktok: '@rammoclothing',
  address: 'Jl. R.A Kartini No.1, Ngringin Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281'
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
