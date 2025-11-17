// Helper function to get category-specific image
const getImageByCategory = (category, index) => {
  const imageMap = {
    beer: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90"
    ],
    whiskey: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90"
    ],
    vodka: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    gin: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    rum: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    tequila: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    cognac: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    "wine-red": [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    "wine-white": [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    "wine-rose": [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop&q=90"
    ],
    champagne: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    liqueur: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=600&fit=crop&q=90"
    ],
    brandy: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=600&fit=crop&q=90"
    ]
  };
  
  const images = imageMap[category] || imageMap.beer;
  return images[index % images.length];
};

export const drops = [
  // Kenyan Beers
  { id: 1, name: "Tusker Lager", category: "beer", price: 180, size: "500ml", origin: "Kenya", badge: "Popular", image: getImageByCategory("beer", 0) },
  { id: 2, name: "Tusker Malt", category: "beer", price: 200, size: "500ml", origin: "Kenya", badge: "Popular", image: getImageByCategory("beer", 1) },
  { id: 3, name: "White Cap Lager", category: "beer", price: 180, size: "500ml", origin: "Kenya", badge: "Popular", image: getImageByCategory("beer", 2) },
  { id: 4, name: "Pilsner Lager", category: "beer", price: 170, size: "500ml", origin: "Kenya", badge: "Popular", image: getImageByCategory("beer", 0) },
  { id: 5, name: "Summit Lager", category: "beer", price: 160, size: "500ml", origin: "Kenya", badge: "Value", image: getImageByCategory("beer", 1) },
  { id: 6, name: "Guinness Foreign Extra Stout", category: "beer", price: 250, size: "500ml", origin: "Ireland", badge: "Premium", image: getImageByCategory("beer", 2) },
  { id: 7, name: "Heineken", category: "beer", price: 280, size: "500ml", origin: "Netherlands", badge: "Premium", image: getImageByCategory("beer", 0) },
  
  // Premium Spirits - Whiskey
  { id: 8, name: "Johnnie Walker Black Label", category: "whiskey", price: 4500, size: "750ml", origin: "Scotland", badge: "Premium", image: getImageByCategory("whiskey", 0) },
  { id: 9, name: "Johnnie Walker Red Label", category: "whiskey", price: 2800, size: "750ml", origin: "Scotland", badge: "Popular", image: getImageByCategory("whiskey", 1) },
  { id: 10, name: "Jack Daniel's Tennessee Whiskey", category: "whiskey", price: 4200, size: "750ml", origin: "USA", badge: "Premium", image: getImageByCategory("whiskey", 2) },
  { id: 11, name: "Jameson Irish Whiskey", category: "whiskey", price: 3800, size: "750ml", origin: "Ireland", badge: "Popular", image: getImageByCategory("whiskey", 0) },
  { id: 12, name: "Glenfiddich 12 Year Old", category: "whiskey", price: 8500, size: "750ml", origin: "Scotland", badge: "Exclusive", image: getImageByCategory("whiskey", 1) },
  { id: 13, name: "Macallan 18 Year Old", category: "whiskey", price: 45000, size: "750ml", origin: "Scotland", badge: "Exclusive", image: getImageByCategory("whiskey", 2) },
  
  // Vodka
  { id: 14, name: "Smirnoff Vodka", category: "vodka", price: 2200, size: "750ml", origin: "Russia", badge: "Popular", image: getImageByCategory("vodka", 0) },
  { id: 15, name: "Absolut Vodka", category: "vodka", price: 2800, size: "750ml", origin: "Sweden", badge: "Premium", image: getImageByCategory("vodka", 1) },
  { id: 16, name: "Grey Goose Vodka", category: "vodka", price: 6500, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("vodka", 0) },
  { id: 17, name: "Belvedere Vodka", category: "vodka", price: 7200, size: "750ml", origin: "Poland", badge: "Premium", image: getImageByCategory("vodka", 1) },
  { id: 18, name: "Kibao Vodka", category: "vodka", price: 1500, size: "750ml", origin: "Kenya", badge: "Local", image: getImageByCategory("vodka", 0) },
  { id: 19, name: "Ciroc Vodka", category: "vodka", price: 5800, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("vodka", 1) },
  
  // Gin
  { id: 20, name: "Gordon's London Dry Gin", category: "gin", price: 2400, size: "750ml", origin: "UK", badge: "Popular", image: getImageByCategory("gin", 0) },
  { id: 21, name: "Beefeater Gin", category: "gin", price: 2600, size: "750ml", origin: "UK", badge: "Popular", image: getImageByCategory("gin", 1) },
  { id: 22, name: "Hendrick's Gin", category: "gin", price: 5500, size: "750ml", origin: "Scotland", badge: "Premium", image: getImageByCategory("gin", 0) },
  { id: 23, name: "Procera Blue Dot Gin", category: "gin", price: 4800, size: "750ml", origin: "Kenya", badge: "Local", image: getImageByCategory("gin", 1) },
  { id: 24, name: "Hapusa Himalayan Dry Gin", category: "gin", price: 5200, size: "750ml", origin: "India", badge: "Exotic", image: getImageByCategory("gin", 0) },
  { id: 25, name: "Tanqueray London Dry Gin", category: "gin", price: 3200, size: "750ml", origin: "UK", badge: "Premium", image: getImageByCategory("gin", 1) },
  
  // Rum
  { id: 26, name: "Bacardi Superior Rum", category: "rum", price: 2400, size: "750ml", origin: "Puerto Rico", badge: "Popular", image: getImageByCategory("rum", 0) },
  { id: 27, name: "Captain Morgan Original Spiced Rum", category: "rum", price: 2800, size: "750ml", origin: "Jamaica", badge: "Popular", image: getImageByCategory("rum", 1) },
  { id: 28, name: "Kenya Cane Gold Rum", category: "rum", price: 1800, size: "750ml", origin: "Kenya", badge: "Local", image: getImageByCategory("rum", 0) },
  { id: 29, name: "Mount Gay Eclipse Rum", category: "rum", price: 3500, size: "750ml", origin: "Barbados", badge: "Premium", image: getImageByCategory("rum", 1) },
  { id: 30, name: "Appleton Estate Reserve Rum", category: "rum", price: 4200, size: "750ml", origin: "Jamaica", badge: "Premium", image: getImageByCategory("rum", 0) },
  
  // Tequila
  { id: 31, name: "Patrón Silver Tequila", category: "tequila", price: 8500, size: "750ml", origin: "Mexico", badge: "Premium", image: getImageByCategory("tequila", 0) },
  { id: 32, name: "Don Julio 1942 Tequila", category: "tequila", price: 18000, size: "750ml", origin: "Mexico", badge: "Exclusive", image: getImageByCategory("tequila", 1) },
  { id: 33, name: "Jose Cuervo Especial Gold", category: "tequila", price: 3200, size: "750ml", origin: "Mexico", badge: "Popular", image: getImageByCategory("tequila", 0) },
  { id: 34, name: "Patrón Añejo Tequila", category: "tequila", price: 12000, size: "750ml", origin: "Mexico", badge: "Premium", image: getImageByCategory("tequila", 1) },
  { id: 35, name: "Sierra Tequila Blanco", category: "tequila", price: 2800, size: "750ml", origin: "Mexico", badge: "Popular", image: getImageByCategory("tequila", 0) },
  
  // Cognac & Brandy
  { id: 36, name: "Hennessy VS Cognac", category: "cognac", price: 6500, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("cognac", 0) },
  { id: 37, name: "Hennessy XO Cognac", category: "cognac", price: 28000, size: "750ml", origin: "France", badge: "Exclusive", image: getImageByCategory("cognac", 1) },
  { id: 38, name: "Rémy Martin XO Cognac", category: "cognac", price: 32000, size: "750ml", origin: "France", badge: "Exclusive", image: getImageByCategory("cognac", 0) },
  { id: 39, name: "Torres 10 Brandy", category: "brandy", price: 3200, size: "750ml", origin: "Spain", badge: "Popular", image: getImageByCategory("brandy", 0) },
  { id: 40, name: "Martell VSOP Cognac", category: "cognac", price: 5800, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("cognac", 1) },
  
  // Wines - Red
  { id: 41, name: "Four Cousins Sweet Red", category: "wine-red", price: 1200, size: "750ml", origin: "South Africa", badge: "Popular", image: getImageByCategory("wine-red", 0) },
  { id: 42, name: "Nederburg Cabernet Sauvignon", category: "wine-red", price: 1800, size: "750ml", origin: "South Africa", badge: "Premium", image: getImageByCategory("wine-red", 1) },
  { id: 43, name: "Campo Viejo Tempranillo", category: "wine-red", price: 2200, size: "750ml", origin: "Spain", badge: "Premium", image: getImageByCategory("wine-red", 0) },
  { id: 44, name: "Ruffino Chianti", category: "wine-red", price: 2800, size: "750ml", origin: "Italy", badge: "Premium", image: getImageByCategory("wine-red", 1) },
  { id: 45, name: "Torres Sangre de Toro", category: "wine-red", price: 3200, size: "750ml", origin: "Spain", badge: "Premium", image: getImageByCategory("wine-red", 0) },
  
  // Wines - White
  { id: 46, name: "KWV Chenin Blanc", category: "wine-white", price: 1500, size: "750ml", origin: "South Africa", badge: "Popular", image: getImageByCategory("wine-white", 0) },
  { id: 47, name: "Santa Cristina Pinot Grigio", category: "wine-white", price: 2400, size: "750ml", origin: "Italy", badge: "Premium", image: getImageByCategory("wine-white", 1) },
  { id: 48, name: "Four Cousins Sweet Rosé", category: "wine-rose", price: 1200, size: "750ml", origin: "South Africa", badge: "Popular", image: getImageByCategory("wine-rose", 0) },
  { id: 49, name: "Louis Jadot Beaujolais", category: "wine-red", price: 2800, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("wine-red", 1) },
  
  // Champagne & Sparkling
  { id: 50, name: "Moët & Chandon Brut Imperial", category: "champagne", price: 8500, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("champagne", 0) },
  { id: 51, name: "Veuve Clicquot Brut Yellow Label", category: "champagne", price: 9500, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("champagne", 1) },
  { id: 52, name: "Dom Pérignon Vintage", category: "champagne", price: 45000, size: "750ml", origin: "France", badge: "Exclusive", image: getImageByCategory("champagne", 0) },
  { id: 53, name: "Prosecco DOC", category: "champagne", price: 2800, size: "750ml", origin: "Italy", badge: "Popular", image: getImageByCategory("champagne", 1) },
  
  // Liqueurs
  { id: 54, name: "Baileys Irish Cream", category: "liqueur", price: 3200, size: "750ml", origin: "Ireland", badge: "Popular", image: getImageByCategory("liqueur", 0) },
  { id: 55, name: "Amarula Cream Liqueur", category: "liqueur", price: 2800, size: "750ml", origin: "South Africa", badge: "Popular", image: getImageByCategory("liqueur", 1) },
  { id: 56, name: "Kahlúa Coffee Liqueur", category: "liqueur", price: 2400, size: "750ml", origin: "Mexico", badge: "Popular", image: getImageByCategory("liqueur", 0) },
  { id: 57, name: "Cointreau", category: "liqueur", price: 3800, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("liqueur", 1) },
  { id: 58, name: "Grand Marnier", category: "liqueur", price: 4200, size: "750ml", origin: "France", badge: "Premium", image: getImageByCategory("liqueur", 0) },
  { id: 59, name: "Jägermeister", category: "liqueur", price: 3200, size: "750ml", origin: "Germany", badge: "Popular", image: getImageByCategory("liqueur", 1) },
  
  // Premium Whiskeys
  { id: 60, name: "Laphroaig 10 Year Old", category: "whiskey", price: 6800, size: "750ml", origin: "Scotland", badge: "Premium", image: getImageByCategory("whiskey", 0) },
  { id: 61, name: "Chivas Regal 12 Year Old", category: "whiskey", price: 5200, size: "750ml", origin: "Scotland", badge: "Premium", image: getImageByCategory("whiskey", 1) },
  { id: 62, name: "Crown Royal", category: "whiskey", price: 4800, size: "750ml", origin: "Canada", badge: "Premium", image: getImageByCategory("whiskey", 2) },
];

// Category mapping for filters
export const categories = {
  all: "All Products",
  beer: "Beer",
  whiskey: "Whiskey",
  vodka: "Vodka",
  gin: "Gin",
  rum: "Rum",
  tequila: "Tequila",
  cognac: "Cognac & Brandy",
  "wine-red": "Red Wine",
  "wine-white": "White Wine",
  "wine-rose": "Rosé Wine",
  champagne: "Champagne & Sparkling",
  liqueur: "Liqueurs",
};
