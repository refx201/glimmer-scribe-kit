import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { 
  Search, 
  SlidersHorizontal,
  X,
  Filter,
  DollarSign,
  Tag
} from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
}

interface CompactFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  brands: Brand[];
  onReset: () => void;
}

export function CompactFilterBar({
  searchTerm,
  setSearchTerm,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  brands,
  onReset
}: CompactFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Price presets for quick selection
  const pricePresets = [
    { label: 'الكل', min: 0, max: 5000 },
    { label: 'تحت 500₪', min: 0, max: 500 },
    { label: '500-1000₪', min: 500, max: 1000 },
    { label: '1000-2000₪', min: 1000, max: 2000 },
    { label: 'فوق 2000₪', min: 2000, max: 5000 }
  ];

  const handleBrandToggle = (brandName: string) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brandName));
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  };

  const activeFiltersCount = selectedBrands.length + (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Top Search Bar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200 focus:border-blue-500"
          />
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="h-11 px-4 border-gray-200 bg-white hover:bg-gray-50 relative"
            >
              <Filter className="h-4 w-4 ml-2" />
              فلترة
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-blue-600 text-white text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-gray-50">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                خيارات الفلترة
                <Button variant="ghost" size="sm" onClick={onReset}>
                  <X className="h-4 w-4" />
                </Button>
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Price Filter */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium">نطاق السعر</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {pricePresets.map((preset) => (
                      <Button
                        key={preset.label}
                        variant={priceRange[0] === preset.min && priceRange[1] === preset.max ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPriceRange([preset.min, preset.max] as [number, number])}
                        className="text-xs h-8"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="من"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]] as [number, number])}
                        className="text-center text-xs h-8"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="إلى"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                        className="text-center text-xs h-8"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brands Filter */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium">العلامات التجارية</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {brands.map((brand) => (
                      <div
                        key={brand.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          selectedBrands.includes(brand.name)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => handleBrandToggle(brand.name)}
                      >
                        <Checkbox
                          checked={selectedBrands.includes(brand.name)}
                          className="pointer-events-none"
                        />
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          {brand.logo_url && (
                            <img 
                              src={brand.logo_url} 
                              alt={brand.name}
                              className="h-4 w-4 object-contain rounded"
                            />
                          )}
                          <span className="text-xs font-medium truncate">{brand.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedBrands.map((brand) => (
            <Badge
              key={brand}
              variant="secondary"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
              onClick={() => handleBrandToggle(brand)}
            >
              {brand}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < 5000) && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
              onClick={() => setPriceRange([0, 5000])}
            >
              {priceRange[0]}-{priceRange[1]}₪
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}