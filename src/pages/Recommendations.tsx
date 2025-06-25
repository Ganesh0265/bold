import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, Heart, ShoppingBag, Filter, TrendingUp, Star, Loader } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AIRecommendationEngine, OutfitRecommendation } from '../lib/aiRecommendations';
import Card from '../components/Card';
import Button from '../components/Button';

const Recommendations: React.FC = () => {
  const { wardrobeItems } = useApp();
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [outfitRecommendations, setOutfitRecommendations] = useState<OutfitRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = ['All', 'Modern Classic', 'Minimalist', 'Bohemian', 'Edgy', 'Romantic'];
  const occasions = ['All', 'Professional', 'Casual', 'Date Night', 'Weekend', 'Travel'];

  useEffect(() => {
    const generateRecommendations = async () => {
      setLoading(true);
      try {
        // Generate outfit recommendations based on user's wardrobe
        const recommendations = AIRecommendationEngine.generateOutfitRecommendations(wardrobeItems);
        setOutfitRecommendations(recommendations);
      } catch (error) {
        console.error('Error generating recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (wardrobeItems.length > 0) {
      generateRecommendations();
    } else {
      setLoading(false);
    }
  }, [wardrobeItems]);

  const filteredRecommendations = outfitRecommendations.filter(rec => {
    const matchesStyle = selectedStyle === 'All' || rec.style === selectedStyle;
    const matchesOccasion = selectedOccasion === 'All' || rec.occasion === selectedOccasion;
    return matchesStyle && matchesOccasion;
  });

  const generateNewRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      const recommendations = AIRecommendationEngine.generateOutfitRecommendations(wardrobeItems);
      setOutfitRecommendations(recommendations);
    } catch (error) {
      console.error('Error generating new recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Generating AI Recommendations</h3>
          <p className="text-gray-600">Analyzing your wardrobe to create perfect outfit suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
            AI Recommendations
          </h1>
          <p className="text-gray-600 mt-1">Personalized outfit suggestions curated just for you</p>
        </div>
        <Button onClick={generateNewRecommendations} disabled={loading}>
          <Sparkles className="w-4 h-4 mr-2" />
          Get New Recommendations
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Styles</option>
            {styles.slice(1).map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={selectedOccasion}
            onChange={(e) => setSelectedOccasion(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Occasions</option>
            {occasions.slice(1).map(occasion => (
              <option key={occasion} value={occasion}>{occasion}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-emerald-50 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Style Insights</h3>
            <p className="text-gray-700 mb-3">
              Based on your wardrobe analysis, you have <strong>{wardrobeItems.length} items</strong> across{' '}
              <strong>{new Set(wardrobeItems.map(item => item.category)).size} categories</strong>. 
              Your style preferences lean towards <strong>versatile and classic</strong> pieces with a preference for quality over quantity.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Versatile Pieces
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                Classic Styles
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Quality Investment
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Outfit Recommendations */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {recommendation.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{recommendation.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {recommendation.style}
                      </span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                        {recommendation.occasion}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-gray-600">{(recommendation.confidence * 100).toFixed(0)}% match</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {recommendation.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.store}</p>
                        {item.price > 0 ? (
                          <p className="text-lg font-semibold text-green-600">${item.price}</p>
                        ) : (
                          <p className="text-sm text-purple-600 font-medium">From your wardrobe</p>
                        )}
                      </div>
                      {item.price > 0 && (
                        <a
                          href={item.link}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total and Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {recommendation.totalPrice > 0 ? 'Shopping cost' : 'Complete outfit from your wardrobe'}
                      </p>
                      {recommendation.totalPrice > 0 && (
                        <p className="text-2xl font-bold text-gray-900">${recommendation.totalPrice}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      {recommendation.totalPrice > 0 && (
                        <Button size="sm">
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Shop All
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {wardrobeItems.length === 0 ? 'Build Your Wardrobe First' : 'No recommendations found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {wardrobeItems.length === 0 
              ? 'Add some items to your wardrobe to get personalized outfit recommendations.'
              : 'Try adjusting your filters or generate new recommendations.'}
          </p>
          {wardrobeItems.length === 0 ? (
            <Button onClick={() => window.location.href = '/wardrobe'}>
              <Sparkles className="w-4 h-4 mr-2" />
              Add Wardrobe Items
            </Button>
          ) : (
            <Button onClick={generateNewRecommendations}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate New Recommendations
            </Button>
          )}
        </div>
      )}

      {/* Shopping Suggestions */}
      {wardrobeItems.length > 0 && (
        <Card className="mt-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 text-purple-600 mr-2" />
              Trending Style Pieces
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: 'Tailored Blazer',
                  price: 120.00,
                  store: 'Everlane',
                  imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
                  description: 'Perfect for professional looks'
                },
                {
                  name: 'Silk Blouse',
                  price: 85.00,
                  store: 'Zara',
                  imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300',
                  description: 'Versatile and elegant'
                },
                {
                  name: 'Wide-Leg Trousers',
                  price: 95.00,
                  store: 'COS',
                  imageUrl: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=300',
                  description: 'Modern and comfortable'
                },
                {
                  name: 'Leather Ankle Boots',
                  price: 150.00,
                  store: 'Mango',
                  imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300',
                  description: 'Essential wardrobe staple'
                }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">${item.price}</span>
                      <span className="text-sm text-gray-500">{item.store}</span>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="flex-1 text-xs">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Shop
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Recommendations;