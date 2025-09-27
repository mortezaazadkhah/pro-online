
export type ImageState = {
  base64: string;
  name: string;
  mimeType: string;
} | null;

export type StyleRecommendation = {
  outfitDescription: string;
  occasion: string;
  shoeSuggestion: string;
  perfumeSuggestion: string;
};
