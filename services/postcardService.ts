
import { Postcard, Recipient } from '../types';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'postcards_home_data';
const IDENTITY_KEY = 'postcards_current_user';
const MAX_STORED_POSTS = 30; // Increased slightly now that we have better compression

const INITIAL_POSTCARDS: Postcard[] = [
  {
    id: 'init-1',
    sender: 'Julian',
    recipients: ['Family', 'Tracey', 'Francis', 'Lucy', 'Orla', 'Ruby'],
    message: 'Welcome to our new home archive. Every photo is a shared memory.',
    location: 'Archive HQ',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    timestamp: Date.now() - 86400000,
    date: '01 JAN 25'
  }
];

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCurrentUser = (): string => {
  return localStorage.getItem(IDENTITY_KEY) || 'Julian';
};

export const setCurrentUser = (name: string) => {
  localStorage.setItem(IDENTITY_KEY, name);
};

export const getPostcards = (): Postcard[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_POSTCARDS;
  } catch (e) {
    console.error("Failed to read from localStorage", e);
    return INITIAL_POSTCARDS;
  }
};

export const savePostcard = (postcard: Postcard) => {
  try {
    const current = getPostcards();
    const updated = [postcard, ...current].slice(0, MAX_STORED_POSTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Storage quota exceeded", e);
    const current = getPostcards();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([postcard, ...current].slice(0, 5)));
  }
};

export const getLatestForWidget = (recipientName: string): Postcard | null => {
  const all = getPostcards();
  // Filter for postcards where recipient is in the list OR sent to 'Family'
  const filtered = all.filter(p => 
    p.recipients.includes(recipientName) || p.recipients.includes('Family')
  );
  return filtered.length > 0 ? filtered[0] : null;
};

export const polishMessage = async (input: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Rewrite this message for a family postcard. Keep it under 90 characters. Evocative and warm. Original: "${input}"`,
  });
  return response.text?.trim().slice(0, 90) || input;
};
