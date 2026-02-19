export interface Shop {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  address: string;
  phone: string;
  whatsApp?: string;
  isVerified: boolean;
  isDeliveryAvailable: boolean;
  status: string;
  city?: City;
}

export interface City {
  id: string;
  name: string;
  slug: string;
}
