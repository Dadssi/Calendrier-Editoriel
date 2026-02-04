export type Platform = 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export type Format = 'reel' | 'carrousel' | 'post' | 'story' | 'video_longue' | 'live';

export type Genre = 
  | 'educatif'
  | 'behind'
  | 'humour'
  | 'business'
  | 'portfolio'
  | 'inspiration'
  | 'interactif';

export type SubGenre = {
  educatif: 'tutoriels' | 'demo' | 'comparaisons' | 'faq' | 'analyses';
  behind: 'processus' | 'setup' | 'evolution' | 'journee' | 'organisation';
  humour: 'situations' | 'avantapres' | 'parodies' | 'memes' | 'fails';
  business: 'tarification' | 'tendances' | 'interviews' | 'retours' | 'reflexions';
  portfolio: 'etudes' | 'avantapres' | 'projets' | 'collaborations';
  inspiration: 'parcours' | 'echecs' | 'motivation' | 'communaute';
  interactif: 'qa' | 'sondages' | 'challenges' | 'feedback';
};

export type Status = 'todo' | 'prepared' | 'published';

export interface Content {
  id: number;
  date: string; // Format YYYY-MM-DD
  title: string;
  description: string;
  platforms: Platform[];
  format: Format;
  genre: Genre;
  subGenre: string;
  time: string; // Format HH:mm
  status: Status;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  contents: Content[];
}

export const GENRES_CONFIG: Record<Genre, { label: string; subGenres: { value: string; label: string }[] }> = {
  educatif: {
    label: 'Éducatif',
    subGenres: [
      { value: 'tutoriels', label: 'Tutoriels' },
      { value: 'demo', label: 'Démo' },
      { value: 'comparaisons', label: 'Comparaisons' },
      { value: 'faq', label: 'FAQ' },
      { value: 'analyses', label: 'Analyses' },
    ],
  },
  behind: {
    label: 'Behind the Scenes',
    subGenres: [
      { value: 'processus', label: 'Processus' },
      { value: 'setup', label: 'Setup' },
      { value: 'evolution', label: 'Évolution projet' },
      { value: 'journee', label: 'Journée type' },
      { value: 'organisation', label: 'Organisation' },
    ],
  },
  humour: {
    label: 'Humoristique',
    subGenres: [
      { value: 'situations', label: 'Situations freelance' },
      { value: 'avantapres', label: 'Avant/Après' },
      { value: 'parodies', label: 'Parodies' },
      { value: 'memes', label: 'Memes' },
      { value: 'fails', label: 'Fails' },
    ],
  },
  business: {
    label: 'Business',
    subGenres: [
      { value: 'tarification', label: 'Tarification' },
      { value: 'tendances', label: 'Tendances' },
      { value: 'interviews', label: 'Interviews' },
      { value: 'retours', label: 'Retours clients' },
      { value: 'reflexions', label: 'Réflexions' },
    ],
  },
  portfolio: {
    label: 'Portfolio',
    subGenres: [
      { value: 'etudes', label: 'Études de cas' },
      { value: 'avantapres', label: 'Avant/Après' },
      { value: 'projets', label: 'Projets persos' },
      { value: 'collaborations', label: 'Collaborations' },
    ],
  },
  inspiration: {
    label: 'Inspiration',
    subGenres: [
      { value: 'parcours', label: 'Parcours' },
      { value: 'echecs', label: 'Échecs/Réussites' },
      { value: 'motivation', label: 'Motivation' },
      { value: 'communaute', label: 'Communauté' },
    ],
  },
  interactif: {
    label: 'Interactif',
    subGenres: [
      { value: 'qa', label: 'Q&A' },
      { value: 'sondages', label: 'Sondages' },
      { value: 'challenges', label: 'Challenges' },
      { value: 'feedback', label: 'Feedback' },
    ],
  },
};

export const FORMATS_CONFIG: { value: Format; label: string }[] = [
  { value: 'reel', label: 'Reel' },
  { value: 'carrousel', label: 'Carrousel' },
  { value: 'post', label: 'Post (texte + image)' },
  { value: 'story', label: 'Story' },
  { value: 'video_longue', label: 'Vidéo longue (YouTube)' },
  { value: 'live', label: 'Live' },
];

export const PLATFORMS_CONFIG: { value: Platform; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
];

export const STATUS_CONFIG: { value: Status; label: string }[] = [
  { value: 'todo', label: 'À faire' },
  { value: 'prepared', label: 'Préparé' },
  { value: 'published', label: 'Publié' },
];
