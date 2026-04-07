export const cardImages = import.meta.glob('/public/cards/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export const getImageUrl = (imagePath: string) => {
  // imagePath is like "/cards/1.png"
  const fullPath = `/public${imagePath}`;
  return cardImages[fullPath] || imagePath;
};
