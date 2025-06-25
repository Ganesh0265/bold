// AI-powered clothing recommendations with optimized performance
import { ColorAnalyzer, StyleMatcher } from './algorithms';

export interface AIRecommendation {
  id: string;
  baseItem: any;
  recommendedItems: RecommendedItem[];
  confidence: number;
  reasoning: string;
  style: string;
  occasion: string;
}

export interface RecommendedItem {
  category: string;
  suggestedColors: string[];
  suggestedStyles: string[];
  compatibilityScore: number;
  reasoning: string;
  existingMatches?: any[];
  shoppingSuggestions?: ShoppingSuggestion[];
}

export interface ShoppingSuggestion {
  name: string;
  price: number;
  store: string;
  imageUrl: string;
  link: string;
  description: string;
  colors: string[];
  styles: string[];
}

export interface OutfitRecommendation {
  id: string;
  name: string;
  description: string;
  items: {
    name: string;
    price: number;
    store: string;
    imageUrl: string;
    link: string;
  }[];
  totalPrice: number;
  occasion: string;
  style: string;
  confidence: number;
}

export class AIRecommendationEngine {
  private static styleDatabase = {
    'Minimalist': {
      colors: ['white', 'black', 'gray', 'beige', 'navy'],
      patterns: ['solid', 'subtle'],
      silhouettes: ['clean', 'structured', 'simple']
    },
    'Bohemian': {
      colors: ['earth tones', 'warm', 'rust', 'olive', 'cream'],
      patterns: ['floral', 'paisley', 'ethnic'],
      silhouettes: ['flowy', 'loose', 'layered']
    },
    'Classic': {
      colors: ['navy', 'white', 'black', 'brown', 'gray'],
      patterns: ['stripes', 'solid', 'subtle check'],
      silhouettes: ['tailored', 'structured', 'timeless']
    },
    'Edgy': {
      colors: ['black', 'dark', 'metallic', 'bold'],
      patterns: ['geometric', 'abstract', 'bold'],
      silhouettes: ['fitted', 'asymmetric', 'structured']
    },
    'Romantic': {
      colors: ['pink', 'cream', 'soft', 'pastel'],
      patterns: ['floral', 'lace', 'delicate'],
      silhouettes: ['flowing', 'feminine', 'soft']
    }
  };

  // Enhanced shopping suggestions with real-looking product images
  private static shoppingSuggestions = {
    'Tops': [
      {
        name: 'Classic White Button Shirt',
        price: 45.99,
        store: 'Everlane',
        imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Timeless white cotton shirt perfect for any occasion',
        colors: ['white', 'cream'],
        styles: ['classic', 'minimalist', 'professional']
      },
      {
        name: 'Soft Cashmere Sweater',
        price: 89.99,
        store: 'COS',
        imageUrl: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Luxurious cashmere sweater in neutral tones',
        colors: ['beige', 'gray', 'cream'],
        styles: ['minimalist', 'cozy', 'elegant']
      },
      {
        name: 'Silk Blouse',
        price: 65.00,
        store: 'Zara',
        imageUrl: 'https://images.pexels.com/photos/7679721/pexels-photo-7679721.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Elegant silk blouse for professional settings',
        colors: ['navy', 'black', 'white'],
        styles: ['professional', 'elegant', 'classic']
      },
      {
        name: 'Striped Long Sleeve Tee',
        price: 32.00,
        store: 'Uniqlo',
        imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Classic striped tee for casual styling',
        colors: ['navy', 'white', 'red'],
        styles: ['casual', 'classic', 'nautical']
      }
    ],
    'Bottoms': [
      {
        name: 'High-Waisted Trousers',
        price: 79.99,
        store: 'Mango',
        imageUrl: 'https://images.pexels.com/photos/7679722/pexels-photo-7679722.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Tailored high-waisted trousers for a polished look',
        colors: ['black', 'navy', 'gray'],
        styles: ['professional', 'tailored', 'classic']
      },
      {
        name: 'Wide-Leg Jeans',
        price: 55.00,
        store: 'H&M',
        imageUrl: 'https://images.pexels.com/photos/7679723/pexels-photo-7679723.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Comfortable wide-leg jeans in classic denim',
        colors: ['blue', 'black', 'white'],
        styles: ['casual', 'relaxed', 'modern']
      },
      {
        name: 'Pleated Midi Skirt',
        price: 42.99,
        store: 'Uniqlo',
        imageUrl: 'https://images.pexels.com/photos/7679724/pexels-photo-7679724.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Versatile pleated skirt for work and weekend',
        colors: ['navy', 'black', 'beige'],
        styles: ['feminine', 'classic', 'versatile']
      },
      {
        name: 'Tailored Shorts',
        price: 38.00,
        store: 'COS',
        imageUrl: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Smart tailored shorts for summer',
        colors: ['khaki', 'navy', 'white'],
        styles: ['smart-casual', 'summer', 'tailored']
      }
    ],
    'Outerwear': [
      {
        name: 'Wool Blend Coat',
        price: 149.99,
        store: 'COS',
        imageUrl: 'https://images.pexels.com/photos/7679725/pexels-photo-7679725.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Elegant wool coat for cold weather',
        colors: ['camel', 'black', 'gray'],
        styles: ['classic', 'elegant', 'timeless']
      },
      {
        name: 'Denim Jacket',
        price: 59.99,
        store: 'Levi\'s',
        imageUrl: 'https://images.pexels.com/photos/7679726/pexels-photo-7679726.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Classic denim jacket for casual styling',
        colors: ['blue', 'black', 'white'],
        styles: ['casual', 'classic', 'versatile']
      },
      {
        name: 'Blazer',
        price: 95.00,
        store: 'Zara',
        imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Structured blazer for professional looks',
        colors: ['navy', 'black', 'gray'],
        styles: ['professional', 'structured', 'classic']
      }
    ],
    'Shoes': [
      {
        name: 'Leather Ankle Boots',
        price: 95.00,
        store: 'Zara',
        imageUrl: 'https://images.pexels.com/photos/7679727/pexels-photo-7679727.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Versatile leather boots for any season',
        colors: ['black', 'brown', 'tan'],
        styles: ['classic', 'versatile', 'edgy']
      },
      {
        name: 'White Sneakers',
        price: 75.00,
        store: 'Adidas',
        imageUrl: 'https://images.pexels.com/photos/7679728/pexels-photo-7679728.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Clean white sneakers for casual outfits',
        colors: ['white', 'cream'],
        styles: ['casual', 'sporty', 'minimalist']
      },
      {
        name: 'Pointed Toe Flats',
        price: 68.00,
        store: 'Everlane',
        imageUrl: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Elegant pointed flats for work and play',
        colors: ['black', 'nude', 'navy'],
        styles: ['professional', 'elegant', 'classic']
      }
    ],
    'Accessories': [
      {
        name: 'Leather Handbag',
        price: 120.00,
        store: 'Mango',
        imageUrl: 'https://images.pexels.com/photos/7679729/pexels-photo-7679729.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Structured leather handbag for everyday use',
        colors: ['black', 'brown', 'tan'],
        styles: ['classic', 'professional', 'elegant']
      },
      {
        name: 'Silk Scarf',
        price: 35.00,
        store: 'H&M',
        imageUrl: 'https://images.pexels.com/photos/7679730/pexels-photo-7679730.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Elegant silk scarf to elevate any outfit',
        colors: ['navy', 'cream', 'burgundy'],
        styles: ['elegant', 'classic', 'feminine']
      },
      {
        name: 'Statement Necklace',
        price: 45.00,
        store: 'COS',
        imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
        link: '#',
        description: 'Bold statement necklace for special occasions',
        colors: ['gold', 'silver', 'rose gold'],
        styles: ['statement', 'elegant', 'bold']
      }
    ]
  };

  // Cache for color analysis to improve performance
  private static colorCache = new Map<string, string[]>();

  static async generateRecommendations(
    baseItem: any, 
    wardrobeItems: any[], 
    userPreferences?: any
  ): Promise<AIRecommendation> {
    // Use cached colors or analyze if not cached
    let dominantColors = this.colorCache.get(baseItem.image_url);
    if (!dominantColors) {
      dominantColors = await this.extractDominantColorsOptimized(baseItem.image_url);
      this.colorCache.set(baseItem.image_url, dominantColors);
    }

    const complementaryColors = ColorAnalyzer.getComplementaryColors(dominantColors[0]);
    
    // Determine style based on item characteristics
    const detectedStyle = this.detectItemStyle(baseItem);
    
    // Generate recommendations for each category
    const recommendations = await this.generateCategoryRecommendations(
      baseItem,
      wardrobeItems,
      dominantColors,
      complementaryColors,
      detectedStyle
    );

    return {
      id: `rec_${Date.now()}`,
      baseItem,
      recommendedItems: recommendations,
      confidence: this.calculateOverallConfidence(recommendations),
      reasoning: this.generateReasoningText(baseItem, recommendations, detectedStyle),
      style: detectedStyle,
      occasion: this.suggestOccasion(baseItem, detectedStyle)
    };
  }

  // Generate complete outfit recommendations based on wardrobe
  static generateOutfitRecommendations(wardrobeItems: any[]): OutfitRecommendation[] {
    const recommendations: OutfitRecommendation[] = [];
    
    // Analyze user's style preferences
    const userStyle = this.analyzeUserStyle(wardrobeItems);
    
    // Generate different types of outfit recommendations
    const occasions = ['Professional', 'Casual', 'Date Night', 'Weekend', 'Travel'];
    
    occasions.forEach(occasion => {
      const outfitRec = this.generateOutfitForOccasion(wardrobeItems, occasion, userStyle);
      if (outfitRec) {
        recommendations.push(outfitRec);
      }
    });

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private static generateOutfitForOccasion(
    wardrobeItems: any[], 
    occasion: string, 
    userStyle: string
  ): OutfitRecommendation | null {
    const occasionMap = {
      'Professional': {
        requiredCategories: ['Tops', 'Bottoms', 'Shoes'],
        optionalCategories: ['Outerwear', 'Accessories'],
        style: 'Classic',
        colors: ['navy', 'black', 'white', 'gray']
      },
      'Casual': {
        requiredCategories: ['Tops', 'Bottoms'],
        optionalCategories: ['Shoes', 'Outerwear'],
        style: 'Minimalist',
        colors: ['blue', 'white', 'gray', 'beige']
      },
      'Date Night': {
        requiredCategories: ['Tops', 'Bottoms', 'Shoes'],
        optionalCategories: ['Accessories'],
        style: 'Romantic',
        colors: ['black', 'navy', 'burgundy', 'emerald']
      },
      'Weekend': {
        requiredCategories: ['Tops', 'Bottoms'],
        optionalCategories: ['Shoes', 'Accessories'],
        style: 'Casual',
        colors: ['any']
      },
      'Travel': {
        requiredCategories: ['Tops', 'Bottoms', 'Shoes'],
        optionalCategories: ['Outerwear'],
        style: 'Minimalist',
        colors: ['versatile']
      }
    };

    const config = occasionMap[occasion as keyof typeof occasionMap];
    if (!config) return null;

    // Find items for each required category
    const outfitItems: any[] = [];
    const shoppingItems: any[] = [];

    config.requiredCategories.forEach(category => {
      const categoryItems = wardrobeItems.filter(item => item.category === category);
      
      if (categoryItems.length > 0) {
        // Pick the best matching item for this occasion
        const bestItem = this.selectBestItemForOccasion(categoryItems, occasion, config.colors);
        if (bestItem) {
          outfitItems.push({
            name: bestItem.name,
            price: 0, // User's own item
            store: 'Your Wardrobe',
            imageUrl: bestItem.image_url,
            link: '#'
          });
        }
      } else {
        // Suggest shopping items for missing categories
        const suggestions = this.shoppingSuggestions[category as keyof typeof this.shoppingSuggestions] || [];
        const bestSuggestion = suggestions.find(item => 
          item.styles.includes(config.style.toLowerCase()) ||
          config.colors.some(color => item.colors.includes(color))
        ) || suggestions[0];
        
        if (bestSuggestion) {
          shoppingItems.push(bestSuggestion);
        }
      }
    });

    // Add optional items if available
    config.optionalCategories.forEach(category => {
      const categoryItems = wardrobeItems.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        const bestItem = this.selectBestItemForOccasion(categoryItems, occasion, config.colors);
        if (bestItem && outfitItems.length < 4) {
          outfitItems.push({
            name: bestItem.name,
            price: 0,
            store: 'Your Wardrobe',
            imageUrl: bestItem.image_url,
            link: '#'
          });
        }
      }
    });

    // Add shopping suggestions to complete the outfit
    const allItems = [...outfitItems, ...shoppingItems];
    const totalPrice = shoppingItems.reduce((sum, item) => sum + item.price, 0);

    if (allItems.length < 2) return null; // Need at least 2 items for an outfit

    return {
      id: `outfit_${Date.now()}_${occasion}`,
      name: `${occasion} Look`,
      description: this.generateOutfitDescription(occasion, config.style, allItems.length),
      items: allItems,
      totalPrice,
      occasion,
      style: config.style,
      confidence: this.calculateOutfitConfidence(outfitItems.length, allItems.length)
    };
  }

  private static selectBestItemForOccasion(items: any[], occasion: string, preferredColors: string[]): any | null {
    // Score items based on how well they fit the occasion
    const scoredItems = items.map(item => {
      let score = 0;
      
      // Color matching
      if (preferredColors.includes('any') || preferredColors.includes('versatile')) {
        score += 1;
      } else {
        const itemColor = item.color.toLowerCase();
        if (preferredColors.some(color => itemColor.includes(color))) {
          score += 2;
        }
      }
      
      // Wear count (prefer items that aren't overworn)
      if (item.wear_count < 10) score += 1;
      if (item.wear_count < 5) score += 1;
      
      // Tags matching
      const occasionTags = occasion.toLowerCase().split(' ');
      if (item.tags.some((tag: string) => 
        occasionTags.some(occTag => tag.toLowerCase().includes(occTag))
      )) {
        score += 2;
      }
      
      return { item, score };
    });

    const bestMatch = scoredItems.sort((a, b) => b.score - a.score)[0];
    return bestMatch ? bestMatch.item : null;
  }

  private static analyzeUserStyle(wardrobeItems: any[]): string {
    const styleScores: Record<string, number> = {};
    
    Object.keys(this.styleDatabase).forEach(style => {
      styleScores[style] = 0;
    });

    wardrobeItems.forEach(item => {
      const itemText = `${item.name} ${item.tags.join(' ')} ${item.color}`.toLowerCase();
      
      Object.entries(this.styleDatabase).forEach(([style, characteristics]) => {
        // Check color matches
        characteristics.colors.forEach(color => {
          if (itemText.includes(color.toLowerCase())) {
            styleScores[style] += 1;
          }
        });
        
        // Check pattern matches
        characteristics.patterns.forEach(pattern => {
          if (itemText.includes(pattern.toLowerCase())) {
            styleScores[style] += 1;
          }
        });
        
        // Check silhouette matches
        characteristics.silhouettes.forEach(silhouette => {
          if (itemText.includes(silhouette.toLowerCase())) {
            styleScores[style] += 1;
          }
        });
      });
    });

    // Return the style with the highest score
    const topStyle = Object.entries(styleScores).sort(([,a], [,b]) => b - a)[0];
    return topStyle ? topStyle[0] : 'Classic';
  }

  private static generateOutfitDescription(occasion: string, style: string, itemCount: number): string {
    const descriptions = {
      'Professional': `A polished ${style.toLowerCase()} look perfect for the office and business meetings`,
      'Casual': `An effortless ${style.toLowerCase()} ensemble for everyday comfort and style`,
      'Date Night': `A sophisticated ${style.toLowerCase()} outfit that's perfect for romantic evenings`,
      'Weekend': `A relaxed ${style.toLowerCase()} look ideal for weekend activities and leisure`,
      'Travel': `A versatile ${style.toLowerCase()} outfit that's comfortable and stylish for any journey`
    };

    const baseDescription = descriptions[occasion as keyof typeof descriptions] || 
                           `A stylish ${style.toLowerCase()} outfit for ${occasion.toLowerCase()}`;
    
    return `${baseDescription}. This ${itemCount}-piece ensemble combines comfort with style.`;
  }

  private static calculateOutfitConfidence(ownedItems: number, totalItems: number): number {
    const completeness = ownedItems / totalItems;
    const baseConfidence = 0.7;
    const completenessBonus = completeness * 0.3;
    
    return Math.min(baseConfidence + completenessBonus, 0.95);
  }

  private static async extractDominantColorsOptimized(imageUrl: string): Promise<string[]> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Reduce canvas size for faster processing
        const maxSize = 100;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const colors = this.analyzeImageDataOptimized(imageData);
        resolve(colors);
      };
      
      img.onerror = () => resolve(['#000000']);
      img.src = imageUrl;
    });
  }

  private static analyzeImageDataOptimized(imageData: ImageData | undefined): string[] {
    if (!imageData) return ['#000000'];
    
    const colorMap = new Map<string, number>();
    const data = imageData.data;
    
    // Sample every 20th pixel for better performance
    for (let i = 0; i < data.length; i += 80) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      if (alpha > 128) { // Skip transparent pixels
        // Quantize colors to reduce variations
        const quantizedR = Math.round(r / 32) * 32;
        const quantizedG = Math.round(g / 32) * 32;
        const quantizedB = Math.round(b / 32) * 32;
        
        const color = this.rgbToHex(quantizedR, quantizedG, quantizedB);
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
      }
    }
    
    // Get top 3 colors for faster processing
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color]) => color);
  }

  private static detectItemStyle(item: any): string {
    const itemText = `${item.name} ${item.tags.join(' ')} ${item.color}`.toLowerCase();
    
    let maxScore = 0;
    let detectedStyle = 'Classic';
    
    Object.entries(this.styleDatabase).forEach(([style, characteristics]) => {
      let score = 0;
      
      // Check color matches
      characteristics.colors.forEach(color => {
        if (itemText.includes(color.toLowerCase())) score += 2;
      });
      
      // Check pattern matches
      characteristics.patterns.forEach(pattern => {
        if (itemText.includes(pattern.toLowerCase())) score += 1.5;
      });
      
      // Check silhouette matches
      characteristics.silhouettes.forEach(silhouette => {
        if (itemText.includes(silhouette.toLowerCase())) score += 1;
      });
      
      if (score > maxScore) {
        maxScore = score;
        detectedStyle = style;
      }
    });
    
    return detectedStyle;
  }

  private static async generateCategoryRecommendations(
    baseItem: any,
    wardrobeItems: any[],
    dominantColors: string[],
    complementaryColors: string[],
    style: string
  ): Promise<RecommendedItem[]> {
    const recommendations: RecommendedItem[] = [];
    const targetCategories = this.getTargetCategories(baseItem.category);
    
    for (const category of targetCategories) {
      const categoryItems = wardrobeItems.filter(item => item.category === category);
      const existingMatches = this.findExistingMatches(baseItem, categoryItems);
      
      // Generate shopping suggestions for this category
      const shoppingSuggestions = this.generateShoppingSuggestions(
        category,
        dominantColors,
        complementaryColors,
        style
      );
      
      const recommendation: RecommendedItem = {
        category,
        suggestedColors: this.getSuggestedColors(dominantColors, complementaryColors, category),
        suggestedStyles: this.getSuggestedStyles(style, category),
        compatibilityScore: this.calculateCategoryCompatibility(baseItem, category),
        reasoning: this.generateCategoryReasoning(baseItem, category, style),
        existingMatches: existingMatches.slice(0, 3), // Top 3 matches
        shoppingSuggestions: shoppingSuggestions.slice(0, 3) // Top 3 shopping suggestions
      };
      
      recommendations.push(recommendation);
    }
    
    return recommendations;
  }

  private static generateShoppingSuggestions(
    category: string,
    dominantColors: string[],
    complementaryColors: string[],
    style: string
  ): ShoppingSuggestion[] {
    const categorySuggestions = this.shoppingSuggestions[category as keyof typeof this.shoppingSuggestions] || [];
    
    // Filter and score suggestions based on style and color compatibility
    return categorySuggestions
      .map(suggestion => ({
        ...suggestion,
        score: this.calculateShoppingSuggestionScore(suggestion, dominantColors, complementaryColors, style)
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...suggestion }) => suggestion);
  }

  private static calculateShoppingSuggestionScore(
    suggestion: any,
    dominantColors: string[],
    complementaryColors: string[],
    style: string
  ): number {
    let score = 0;
    
    // Color compatibility
    const allRelevantColors = [...dominantColors, ...complementaryColors, 'white', 'black', 'gray'];
    suggestion.colors.forEach((color: string) => {
      if (allRelevantColors.some(relevantColor => 
        color.toLowerCase().includes(relevantColor.toLowerCase()) ||
        relevantColor.toLowerCase().includes(color.toLowerCase())
      )) {
        score += 2;
      }
    });
    
    // Style compatibility
    const styleKeywords = style.toLowerCase();
    suggestion.styles.forEach((suggestionStyle: string) => {
      if (styleKeywords.includes(suggestionStyle.toLowerCase()) ||
          suggestionStyle.toLowerCase().includes(styleKeywords)) {
        score += 1.5;
      }
    });
    
    return score;
  }

  private static getTargetCategories(baseCategory: string): string[] {
    const categoryMap = {
      'Tops': ['Bottoms', 'Outerwear', 'Accessories', 'Shoes'],
      'Bottoms': ['Tops', 'Shoes', 'Accessories'],
      'Outerwear': ['Tops', 'Bottoms', 'Accessories'],
      'Shoes': ['Bottoms', 'Accessories'],
      'Accessories': ['Tops', 'Bottoms', 'Outerwear']
    };
    
    return categoryMap[baseCategory as keyof typeof categoryMap] || [];
  }

  private static findExistingMatches(baseItem: any, categoryItems: any[]): any[] {
    return categoryItems
      .map(item => ({
        ...item,
        compatibilityScore: StyleMatcher.calculateCompatibilityScore(baseItem, item)
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .filter(item => item.compatibilityScore > 0.6);
  }

  private static getSuggestedColors(
    dominantColors: string[], 
    complementaryColors: string[], 
    category: string
  ): string[] {
    const suggestions = [...complementaryColors];
    
    // Add neutral colors that work with everything
    const neutrals = ['white', 'black', 'gray', 'beige'];
    suggestions.push(...neutrals);
    
    // Category-specific color suggestions
    if (category === 'Accessories') {
      suggestions.push('gold', 'silver', 'brown');
    } else if (category === 'Shoes') {
      suggestions.push('brown', 'tan', 'burgundy');
    }
    
    return [...new Set(suggestions)].slice(0, 5);
  }

  private static getSuggestedStyles(baseStyle: string, category: string): string[] {
    const styleCharacteristics = this.styleDatabase[baseStyle as keyof typeof this.styleDatabase];
    if (!styleCharacteristics) return ['classic', 'versatile'];
    
    const suggestions = [...styleCharacteristics.silhouettes];
    
    // Add category-specific style suggestions
    if (category === 'Accessories') {
      suggestions.push('statement', 'delicate', 'vintage');
    } else if (category === 'Shoes') {
      suggestions.push('comfortable', 'elegant', 'casual');
    }
    
    return suggestions.slice(0, 4);
  }

  private static calculateCategoryCompatibility(baseItem: any, category: string): number {
    // Base compatibility scores for different category combinations
    const compatibilityMatrix = {
      'Tops': { 'Bottoms': 0.95, 'Outerwear': 0.8, 'Accessories': 0.85, 'Shoes': 0.7 },
      'Bottoms': { 'Tops': 0.95, 'Shoes': 0.9, 'Accessories': 0.8 },
      'Outerwear': { 'Tops': 0.8, 'Bottoms': 0.75, 'Accessories': 0.7 },
      'Shoes': { 'Bottoms': 0.9, 'Accessories': 0.6 },
      'Accessories': { 'Tops': 0.85, 'Bottoms': 0.8, 'Outerwear': 0.7, 'Shoes': 0.6 }
    };
    
    const baseCategory = baseItem.category;
    return compatibilityMatrix[baseCategory as keyof typeof compatibilityMatrix]?.[category as keyof any] || 0.6;
  }

  private static generateCategoryReasoning(baseItem: any, category: string, style: string): string {
    const reasoningTemplates = {
      'Bottoms': `Based on your ${baseItem.name}, ${category.toLowerCase()} in complementary colors would create a balanced look. Consider ${style.toLowerCase()} silhouettes that match the item's aesthetic.`,
      'Tops': `To complement your ${baseItem.name}, look for ${category.toLowerCase()} that share similar style elements while providing visual interest through color or texture contrast.`,
      'Accessories': `${category} can elevate your ${baseItem.name} by adding subtle details that enhance the overall ${style.toLowerCase()} aesthetic without overwhelming the look.`,
      'Shoes': `The right ${category.toLowerCase()} will ground your outfit featuring the ${baseItem.name}, maintaining the ${style.toLowerCase()} vibe while ensuring comfort and style.`,
      'Outerwear': `Layer your ${baseItem.name} with ${category.toLowerCase()} that complements its style while adding functionality and visual depth to your outfit.`
    };
    
    return reasoningTemplates[category as keyof typeof reasoningTemplates] || 
           `This ${category.toLowerCase()} category pairs well with your ${baseItem.name} to create a cohesive ${style.toLowerCase()} look.`;
  }

  private static calculateOverallConfidence(recommendations: RecommendedItem[]): number {
    const avgScore = recommendations.reduce((sum, rec) => sum + rec.compatibilityScore, 0) / recommendations.length;
    const hasExistingMatches = recommendations.some(rec => rec.existingMatches && rec.existingMatches.length > 0);
    
    let confidence = avgScore * 0.7;
    if (hasExistingMatches) confidence += 0.2;
    if (recommendations.length >= 3) confidence += 0.1;
    
    return Math.min(confidence, 0.95);
  }

  private static generateReasoningText(baseItem: any, recommendations: RecommendedItem[], style: string): string {
    const matchCount = recommendations.reduce((sum, rec) => sum + (rec.existingMatches?.length || 0), 0);
    
    if (matchCount > 0) {
      return `Based on your ${baseItem.name} and ${style.toLowerCase()} style preferences, I found ${matchCount} existing items in your wardrobe that would pair beautifully. The color palette and style elements create a cohesive look perfect for various occasions.`;
    } else {
      return `Your ${baseItem.name} has great potential for ${style.toLowerCase()} styling. I've identified key categories and color combinations that would complement this piece perfectly. Consider adding items in the suggested colors to maximize your outfit possibilities.`;
    }
  }

  private static suggestOccasion(baseItem: any, style: string): string {
    const occasionMap = {
      'Minimalist': 'Professional, Casual, Everyday',
      'Bohemian': 'Casual, Creative, Weekend',
      'Classic': 'Professional, Formal, Versatile',
      'Edgy': 'Night Out, Creative, Statement',
      'Romantic': 'Date Night, Special Events, Feminine'
    };
    
    const baseOccasion = occasionMap[style as keyof typeof occasionMap] || 'Versatile';
    
    // Refine based on item category
    if (baseItem.category === 'Outerwear') return 'Layering, Transitional Weather';
    if (baseItem.category === 'Accessories') return 'Accent Piece, Style Enhancement';
    
    return baseOccasion;
  }

  private static rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // Generate shopping recommendations for missing pieces
  static generateShoppingRecommendations(recommendations: AIRecommendation): any[] {
    const shoppingList: any[] = [];
    
    recommendations.recommendedItems.forEach(rec => {
      if (!rec.existingMatches || rec.existingMatches.length === 0) {
        // Add shopping suggestions from the recommendation
        if (rec.shoppingSuggestions) {
          rec.shoppingSuggestions.forEach(suggestion => {
            shoppingList.push({
              ...suggestion,
              category: rec.category,
              priority: rec.compatibilityScore,
              reasoning: `Perfect match for your ${recommendations.baseItem.name}`,
            });
          });
        }
      }
    });
    
    return shoppingList.sort((a, b) => b.priority - a.priority);
  }
}