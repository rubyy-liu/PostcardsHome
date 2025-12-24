
export type Recipient = string;

export interface Postcard {
  id: string;
  sender: string;
  recipients: Recipient[];
  message: string;
  location: string;
  imageUrl: string;
  timestamp: number;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
}

// Keeping ArchivePost for potential specimen feature compatibility
export interface ArchivePost {
  id: string;
  title: string;
  observation: string;
  coordinates: string;
  status: string;
  imageUrl: string;
  date: string;
  index: number;
}
