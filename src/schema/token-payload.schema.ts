export type AppUserPayload = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  whatsapp_no: string | null;
  verified: boolean;
  guest: boolean;
};
