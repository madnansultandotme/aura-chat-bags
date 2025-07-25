import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { MessageCircle, Filter, Grid, List, Heart, ShoppingCart } from 'lucide-react';
import { products, categories, brands } from '@/data/products';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  
  const filteredProducts = products.filter(product => {
    if (categoryParam && product.category !== categoryParam) return false;
    if (brandParam && product.brand.toLowerCase() !== brandParam.toLowerCase()) return false;
    if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
    if (brandFilter !== 'all' && product.brand.toLowerCase() !== brandFilter.toLowerCase()) return false;
    
    // Price range filtering
    if (priceRange !== 'all') {
      const price = parseInt(product.price.replace('$', ''));
      switch (priceRange) {
        case '0-200':
          if (price > 200) return false;
          break;
        case '200-300':
          if (price <= 200 || price > 300) return false;
          break;
        case '300-500':
          if (price <= 300 || price > 500) return false;
          break;
        case '500+':
          if (price <= 500) return false;
          break;
      }
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', ''));
      case 'price-high':
        return parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''));
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: any) => {
    const message = `Hi! I would like to add this item to my cart:

🛍️ *${product.name}*
💰 Price: ${product.price}
🏷️ Brand: ${product.brand}
📦 Category: ${product.category.replace('-', ' ')}

Please let me know about availability and how to proceed with the purchase.`;
    
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleQuickBuy = (product: any) => {
    const message = `Hi! I want to buy this product immediately:

🛍️ *${product.name}*
💰 Price: ${product.price}
🏷️ Brand: ${product.brand}

Can you please help me complete the purchase?`;
    
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-subtle py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {categoryParam ? `${categoryParam.replace('-', ' ')} Collection` : 
               brandParam ? `${brandParam} Collection` : 'Our Collection'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover luxury handbags crafted for the modern woman
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
              
              {/* Category Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Brand</label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.name.toLowerCase()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-200">$0 - $200</SelectItem>
                    <SelectItem value="200-300">$200 - $300</SelectItem>
                    <SelectItem value="300-500">$300 - $500</SelectItem>
                    <SelectItem value="500+">$500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Categories Quick Links */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Shop by Category</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs text-muted-foreground">({category.count})</span>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Brands Quick Links */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Shop by Brand</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <Link
                    key={brand.id}
                    to={`/shop?brand=${brand.name.toLowerCase()}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{brand.name}</span>
                    <span className="text-xs text-muted-foreground">({brand.count})</span>
                  </Link>
                ))}
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-muted-foreground">
                Showing {sortedProducts.length} products
              </p>
              
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-luxury transition-all duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>
                    
                    {product.badge && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {product.badge}
                      </div>
                    )}

                    <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                      <Heart className="h-4 w-4 text-primary" />
                    </button>

                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="whatsapp"
                        size="sm"
                        onClick={() => handleQuickBuy(product)}
                        className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Quick Buy
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-accent' : 'text-muted'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="whatsapp"
                        size="sm"
                        onClick={() => handleQuickBuy(product)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setCategoryFilter('all');
                    setBrandFilter('all');
                    setPriceRange('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;