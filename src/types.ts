export interface Venue {
  name: string;
  address: string;
  city: string;
  mapsUrl: string;
  /** Horário exibido no cartão (ex.: "16h30"). */
  time: string;
  note?: string;
}

export interface StoryChapter {
  id: string;
  date: string;
  title: string;
  quote: string;
  text: string;
  image: string;
  imageAlt: string;
  /** Proporção da moldura da foto na timeline. */
  portrait?: boolean;
}

export type GalleryCategory = 'ensaio' | 'viagens' | 'noivado';

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: GalleryCategory;
  portrait?: boolean;
}

export interface GiftQuota {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Cota livre: o convidado escolhe o valor. */
  customAmount?: boolean;
}

export type NotePaper = 'cream' | 'peach' | 'terracotta' | 'sage';

export interface GuestNote {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  paper: NotePaper;
  status: 'pending' | 'approved';
}

export interface FaqItem {
  question: string;
  answer: string;
}
