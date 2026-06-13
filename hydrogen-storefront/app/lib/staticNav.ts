/**
 * Static navigation tree mirroring macorner.co's exact menu structure.
 * Used as the primary nav source; the Shopify collection-based nav is a fallback
 * if this is explicitly replaced with `null`.
 */

export interface NavLeaf {
  id: string;
  title: string;
  url: string;
}

export interface NavGroup {
  id: string;
  title: string;
  /** URL for the "See All" link; omit if the group has no See All */
  seeAllUrl?: string;
  items: NavLeaf[];
}

export interface NavItem {
  id: string;
  title: string;
  url: string;
  /** When present, hovering this item shows the mega-dropdown */
  groups?: NavGroup[];
}

export const MACORNER_NAV: NavItem[] = [
  {
    id: 'graduation',
    title: 'Graduation',
    url: '/collections/graduation',
  },
  {
    id: 'fathers-day',
    title: "Father's Day",
    url: '/collections/fathers-day',
  },
  {
    id: 'gifts',
    title: 'Gifts',
    url: '/collections/all',
    groups: [
      {
        id: 'by-occasion',
        title: 'By Occasion',
        seeAllUrl: '/collections/all',
        items: [
          { id: 'summer', title: 'Summer', url: '/collections/summer' },
          { id: 'fd-occasion', title: "Father's Day", url: '/collections/fathers-day' },
          { id: 'americas-250th', title: "America's 250th Anniversary", url: '/collections/americas-250th-anniversary' },
          { id: 'anniversary', title: 'Anniversary', url: '/collections/anniversary' },
          { id: 'birthday', title: 'Birthday', url: '/collections/birthday' },
          { id: 'memorial-loved', title: 'Memorial For Loved Ones', url: '/collections/memorial-for-loved-ones' },
          { id: 'memorial-pet', title: 'Memorial Pet', url: '/collections/memorial-pet' },
          { id: 'wedding', title: 'Wedding', url: '/collections/wedding' },
          { id: 'new-baby', title: 'New Baby', url: '/collections/new-baby' },
          { id: 'just-because', title: 'Just Because', url: '/collections/just-because' },
        ],
      },
      {
        id: 'by-recipient',
        title: 'By Recipient',
        items: [
          { id: 'for-her', title: 'Her', url: '/collections/for-her' },
          { id: 'for-him', title: 'Him', url: '/collections/for-him' },
          { id: 'for-moms', title: 'Moms', url: '/collections/for-moms' },
          { id: 'for-dads', title: 'Dads', url: '/collections/for-dads' },
          { id: 'for-friends', title: 'Friends', url: '/collections/for-friends' },
          { id: 'for-yourself', title: 'Yourself', url: '/collections/for-yourself' },
          { id: 'for-couples', title: 'Couples', url: '/collections/for-couples' },
          { id: 'for-kids', title: 'Kids', url: '/collections/for-kids' },
          { id: 'for-siblings', title: 'Siblings', url: '/collections/for-siblings' },
          { id: 'for-grandparents', title: 'Grandparents', url: '/collections/for-grandparents' },
          { id: 'for-parents', title: 'Parents', url: '/collections/for-parents' },
          { id: 'for-new-parents', title: 'New Parents', url: '/collections/for-new-parents' },
          { id: 'for-coworkers', title: 'Coworkers', url: '/collections/for-coworkers' },
          { id: 'for-teachers', title: 'Teachers', url: '/collections/for-teachers' },
        ],
      },
      {
        id: 'by-interest',
        title: 'By Interest',
        items: [
          { id: 'int-sports', title: 'Sports', url: '/collections/sports' },
          { id: 'int-gardening', title: 'Gardening', url: '/collections/gardening' },
          { id: 'int-reading', title: 'Reading', url: '/collections/reading' },
          { id: 'int-games', title: 'Games & Toys', url: '/collections/games-toys' },
          { id: 'int-pets', title: 'Pets', url: '/collections/pets' },
          { id: 'int-traveling', title: 'Traveling', url: '/collections/traveling' },
          { id: 'int-beer-wine', title: 'Beer & Wine', url: '/collections/beer-wine' },
        ],
      },
      {
        id: 'by-product',
        title: 'By Product',
        seeAllUrl: '/collections/all',
        items: [
          { id: 'prod-apparel', title: 'Apparel', url: '/collections/apparel' },
          { id: 'prod-home', title: 'Home & Living', url: '/collections/home-living' },
          { id: 'prod-drink', title: 'Drink & Barware', url: '/collections/drink-barware' },
          { id: 'prod-jewelry', title: 'Jewelry', url: '/collections/jewelry' },
          { id: 'prod-accessories', title: 'Accessories', url: '/collections/accessories' },
          { id: 'prod-new-arrivals', title: 'New Arrivals', url: '/collections/new-arrivals' },
        ],
      },
      {
        id: 'by-price',
        title: 'By Price',
        items: [
          { id: 'under-20', title: 'Under $20', url: '/collections/under-20' },
          { id: 'under-30', title: 'Under $30', url: '/collections/under-30' },
          { id: 'under-50', title: 'Under $50', url: '/collections/under-50' },
          { id: 'fifty-up', title: '$50 & Up', url: '/collections/50-and-up' },
        ],
      },
    ],
  },
  {
    id: 'home-living',
    title: 'Home & Living',
    url: '/collections/home-living',
    groups: [
      {
        id: 'bed-bath',
        title: 'Bed & Bath',
        seeAllUrl: '/collections/bed-bath',
        items: [
          { id: 'blankets', title: 'Blankets', url: '/collections/blankets' },
          { id: 'laundry-basket', title: 'Laundry Storage Basket', url: '/collections/laundry-storage-basket' },
          { id: 'pillows', title: 'Pillows', url: '/collections/pillows' },
          { id: 'quilt-sets', title: 'Quilt Sets', url: '/collections/quilt-sets' },
          { id: 'wearable-blanket', title: 'Wearable Blanket Hoodies', url: '/collections/wearable-blanket-hoodies' },
        ],
      },
      {
        id: 'christmas-ornaments',
        title: 'Christmas Ornaments',
        seeAllUrl: '/collections/christmas-ornaments',
        items: [
          { id: 'acrylic-ornaments', title: 'Acrylic Ornaments', url: '/collections/acrylic-ornaments' },
          { id: 'aluminum-ornaments', title: 'Aluminum Ornaments', url: '/collections/aluminum-ornaments' },
          { id: 'ceramic-ornaments', title: 'Ceramic Ornaments', url: '/collections/ceramic-ornaments' },
          { id: 'glass-ornaments', title: 'Glass Ornaments', url: '/collections/glass-ornaments' },
          { id: 'suncatcher-ornaments', title: 'Suncatcher Ornaments', url: '/collections/suncatcher-ornaments' },
          { id: 'wooden-ornaments', title: 'Wooden Ornaments', url: '/collections/wooden-ornaments' },
        ],
      },
      {
        id: 'floor-rugs',
        title: 'Floor & Rugs',
        seeAllUrl: '/collections/floor-rugs',
        items: [
          { id: 'christmas-tree-skirts', title: 'Christmas Tree Skirts', url: '/collections/christmas-tree-skirts' },
          { id: 'doormats', title: 'Doormats', url: '/collections/doormats' },
          { id: 'runner-rugs', title: 'Runner Rugs', url: '/collections/runner-rugs' },
        ],
      },
      {
        id: 'frames-displays',
        title: 'Frames and Displays',
        seeAllUrl: '/collections/frames-displays',
        items: [
          { id: 'acrylic-plaques', title: 'Acrylic Plaques', url: '/collections/acrylic-plaques' },
          { id: 'acrylic-desk-clocks', title: 'Acrylic Desk Clocks', url: '/collections/acrylic-desk-clocks' },
          { id: 'ceramic-flower-vases', title: 'Ceramic Flower Vases', url: '/collections/ceramic-flower-vases' },
          { id: 'ceramic-plates', title: 'Ceramic Plates', url: '/collections/ceramic-plates' },
          { id: 'family-puzzles', title: 'Family Puzzles', url: '/collections/family-puzzles' },
        ],
      },
      {
        id: 'hanging-decoration',
        title: 'Hanging Decoration',
        seeAllUrl: '/collections/hanging-decoration',
        items: [
          { id: 'magnets', title: 'Magnets', url: '/collections/magnets' },
          { id: 'suncatchers', title: 'Suncatchers', url: '/collections/suncatchers' },
          { id: 'wine-bottle-wind-chimes', title: 'Wine Bottle Wind Chimes', url: '/collections/wine-bottle-wind-chimes' },
          { id: 'wood-signs', title: 'Wood Signs', url: '/collections/wood-signs' },
        ],
      },
      {
        id: 'jewelry-storage',
        title: 'Jewelry Storage',
        seeAllUrl: '/collections/jewelry-storage',
        items: [
          { id: 'jewelry-dishes', title: 'Jewelry Dishes', url: '/collections/jewelry-dishes' },
          { id: 'jewelry-boxes', title: 'Jewelry Boxes', url: '/collections/jewelry-boxes' },
          { id: 'leather-valet-trays', title: 'Leather Valet Trays', url: '/collections/leather-valet-trays' },
          { id: 'makeup-boxes-led', title: 'Makeup Boxes With LED Mirror', url: '/collections/makeup-boxes-led-mirror' },
        ],
      },
      {
        id: 'kitchen-dining',
        title: 'Kitchen & Dining',
        seeAllUrl: '/collections/kitchen-dining',
        items: [
          { id: 'cookie-jars', title: 'Cookie Jars', url: '/collections/cookie-jars' },
          { id: 'cutting-boards', title: 'Cutting Boards', url: '/collections/cutting-boards' },
          { id: 'oven-mitts', title: 'Oven Mitts And Pot Holders', url: '/collections/oven-mitts-pot-holders' },
          { id: 'platters', title: 'Platters', url: '/collections/platters' },
          { id: 'tea-biscuit-boards', title: 'Tea & Biscuit Boards', url: '/collections/tea-biscuit-boards' },
        ],
      },
      {
        id: 'lighting',
        title: 'Lighting',
        seeAllUrl: '/collections/lighting',
        items: [
          { id: 'bottle-lamps', title: 'Bottle Lamps', url: '/collections/bottle-lamps' },
          { id: 'fabric-lamps', title: 'Fabric Lamps', url: '/collections/fabric-lamps' },
          { id: 'led-candles', title: 'LED Candles', url: '/collections/led-candles' },
          { id: 'led-night-light', title: 'LED Night Light', url: '/collections/led-night-light' },
          { id: 'mason-jar-lights', title: 'Mason Jar Lights', url: '/collections/mason-jar-lights' },
          { id: 'vintage-lantern', title: 'Vintage Lantern Night Lights', url: '/collections/vintage-lantern-night-lights' },
        ],
      },
      {
        id: 'outdoor-gardening',
        title: 'Outdoor & Gardening',
        seeAllUrl: '/collections/outdoor-gardening',
        items: [
          { id: 'ceramic-plant-pots', title: 'Ceramic Plant Pots', url: '/collections/ceramic-plant-pots' },
          { id: 'door-corner-signs', title: 'Door Corner Wood Signs', url: '/collections/door-corner-wood-signs' },
          { id: 'garden-stakes', title: 'Garden Stakes', url: '/collections/garden-stakes' },
          { id: 'watering-cans', title: 'Indoor Watering Cans', url: '/collections/indoor-watering-cans' },
          { id: 'metal-signs', title: 'Metal Signs', url: '/collections/metal-signs' },
          { id: 'solar-lights', title: 'Solar Lights', url: '/collections/solar-lights' },
          { id: 'wind-chimes', title: 'Wind Chimes', url: '/collections/wind-chimes' },
        ],
      },
      {
        id: 'wall-decor',
        title: 'Wall Decor',
        seeAllUrl: '/collections/wall-decor',
        items: [
          { id: 'posters-canvas', title: 'Posters / Canvas', url: '/collections/posters-canvas' },
          { id: 'key-holders', title: 'Key Holders', url: '/collections/key-holders' },
          { id: 'wood-acrylic-wall-art', title: 'Wood And Acrylic Wall Art', url: '/collections/wood-acrylic-wall-art' },
        ],
      },
    ],
  },
  {
    id: 'drink-barware',
    title: 'Drink & Barware',
    url: '/collections/drink-barware',
    groups: [
      {
        id: 'bottles',
        title: 'Bottles',
        seeAllUrl: '/collections/bottles',
        items: [
          { id: 'kids-water-bottles', title: 'Kids Water Bottles With Straw Lid', url: '/collections/kids-water-bottles' },
          { id: 'ss-water-bottles', title: 'Stainless Steel Water Bottles', url: '/collections/stainless-steel-water-bottles' },
          { id: 'time-marker-bottles', title: 'Water Bottles With Time Marker', url: '/collections/water-bottles-time-marker' },
          { id: '32oz-bottles', title: '32oz Steel Water Bottles', url: '/collections/32oz-steel-water-bottles' },
        ],
      },
      {
        id: 'cans-cups',
        title: 'Cans & Cups',
        seeAllUrl: '/collections/cans-cups',
        items: [
          { id: 'can-coolers', title: 'Can Coolers', url: '/collections/can-coolers' },
          { id: 'color-changing-cups', title: 'Color Changing Cups', url: '/collections/color-changing-cups' },
          { id: 'clear-glass-cups', title: 'Clear Glass Cups', url: '/collections/clear-glass-cups' },
          { id: 'enamel-tea-cups', title: 'Enamel Flower Tea Cups', url: '/collections/enamel-flower-tea-cups' },
          { id: 'mason-jar-cups', title: 'Mason Jar Cups With Straw', url: '/collections/mason-jar-cups-straw' },
          { id: 'shimmer-glass-cans', title: 'Shimmer Glass Cans', url: '/collections/shimmer-glass-cans' },
        ],
      },
      {
        id: 'mugs',
        title: 'Mugs',
        seeAllUrl: '/collections/mugs',
        items: [
          { id: 'accent-mugs', title: 'Accent Mugs', url: '/collections/accent-mugs' },
          { id: 'ceramic-mugs', title: 'Ceramic Mugs', url: '/collections/ceramic-mugs' },
          { id: 'marble-mugs', title: 'Marble Mugs', url: '/collections/marble-mugs' },
          { id: 'glass-mugs', title: 'Glass Mugs', url: '/collections/glass-mugs' },
          { id: 'pottery-mugs', title: 'Pottery Mugs', url: '/collections/pottery-mugs' },
        ],
      },
      {
        id: 'tumblers',
        title: 'Tumblers',
        seeAllUrl: '/collections/tumblers',
        items: [
          { id: 'acrylic-tumblers', title: 'Acrylic Insulated Tumblers', url: '/collections/acrylic-insulated-tumblers' },
          { id: '20oz-tumblers', title: '20oz Tumblers', url: '/collections/20oz-tumblers' },
          { id: '30oz-tumblers', title: '30oz Tumblers With Handle', url: '/collections/30oz-tumblers-handle' },
          { id: '40oz-tumblers', title: '40oz Tumblers', url: '/collections/40oz-tumblers' },
          { id: 'engraved-40oz', title: 'Engraved 40oz Tumblers', url: '/collections/engraved-40oz-tumblers' },
        ],
      },
      {
        id: 'barware',
        title: 'Barware',
        seeAllUrl: '/collections/barware',
        items: [
          { id: 'beer-glasses', title: 'Beer Glasses', url: '/collections/beer-glasses' },
          { id: 'decanters', title: 'Decanters', url: '/collections/decanters' },
          { id: 'stemless-wine', title: 'Stemless Wine Glasses', url: '/collections/stemless-wine-glasses' },
          { id: 'whiskey-glasses', title: 'Whiskey Glasses', url: '/collections/whiskey-glasses' },
        ],
      },
    ],
  },
  {
    id: 'apparel',
    title: 'Apparel',
    url: '/collections/apparel',
    groups: [
      {
        id: 'tops',
        title: 'Tops',
        seeAllUrl: '/collections/tops',
        items: [
          { id: 'back-printed-shirts', title: 'Back Printed Shirts', url: '/collections/back-printed-shirts' },
          { id: 'front-printed-shirts', title: 'Front Printed Shirts', url: '/collections/front-printed-shirts' },
          { id: 'hawaiian-shirts', title: 'Hawaiian Shirts', url: '/collections/hawaiian-shirts' },
          { id: 'polo-shirts', title: 'Polo Shirts', url: '/collections/polo-shirts' },
          { id: 'sleeve-design-shirts', title: 'Shirts With Design On Sleeve', url: '/collections/shirts-design-sleeve' },
          { id: 'ugly-sweaters', title: 'Ugly Sweaters', url: '/collections/ugly-sweaters' },
          { id: 'youth-tees', title: 'Youth Tees', url: '/collections/youth-tees' },
        ],
      },
      {
        id: 'bottoms',
        title: 'Bottoms',
        seeAllUrl: '/collections/bottoms',
        items: [
          { id: 'beach-shorts', title: 'Beach Shorts', url: '/collections/beach-shorts' },
          { id: 'dolphin-shorts', title: 'Dolphin Shorts', url: '/collections/dolphin-shorts' },
          { id: 'leggings', title: 'Leggings', url: '/collections/leggings' },
          { id: 'satin-pajama-pants', title: 'Satin Pajama Pants', url: '/collections/satin-pajama-pants' },
          { id: 'sweatpants', title: 'Sweatpants', url: '/collections/sweatpants' },
        ],
      },
      {
        id: 'underwear',
        title: 'Underwear',
        seeAllUrl: '/collections/underwear',
        items: [
          { id: 'mens-boxer-briefs', title: "Men's Boxer Briefs", url: '/collections/mens-boxer-briefs' },
          { id: 'womens-briefs', title: "Women's Briefs", url: '/collections/womens-briefs' },
        ],
      },
      {
        id: 'apparel-set',
        title: 'Apparel Set',
        seeAllUrl: '/collections/apparel-set',
        items: [
          { id: 'matching-shirts', title: 'Matching Shirts', url: '/collections/matching-shirts' },
          { id: 'hawaiian-sets', title: 'Hawaiian Sets', url: '/collections/hawaiian-sets' },
          { id: 'matching-underwear', title: 'Matching Underwear Sets', url: '/collections/matching-underwear-sets' },
          { id: 'pajamas-sets', title: 'Pajamas Sets', url: '/collections/pajamas-sets' },
          { id: 'pajamas-shorts-sets', title: 'Pajamas Shorts Sets', url: '/collections/pajamas-shorts-sets' },
          { id: 'satin-pajama-sets', title: 'Satin Pajama Sets', url: '/collections/satin-pajama-sets' },
        ],
      },
      {
        id: 'other-clothings',
        title: 'Other Clothings',
        seeAllUrl: '/collections/other-clothings',
        items: [
          { id: 'aprons', title: 'Aprons', url: '/collections/aprons' },
          { id: 'baby-bodysuit', title: 'Baby Bodysuit', url: '/collections/baby-bodysuit' },
          { id: 'kimono-chiffon', title: 'Kimono Chiffon Cover Ups', url: '/collections/kimono-chiffon-cover-ups' },
          { id: 'sleep-tees', title: 'Sleep Tees', url: '/collections/sleep-tees' },
          { id: 'sleeve-dresses', title: 'Sleeve Dresses', url: '/collections/sleeve-dresses' },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    title: 'Accessories',
    url: '/collections/accessories',
    groups: [
      {
        id: 'bags-purses',
        title: 'Bags & Purses',
        seeAllUrl: '/collections/bags-purses',
        items: [
          { id: 'backpacks', title: 'Backpacks', url: '/collections/backpacks' },
          { id: 'beach-bags', title: 'Beach Bags', url: '/collections/beach-bags' },
          { id: 'leather-bags', title: 'Leather Bags', url: '/collections/leather-bags' },
          { id: 'leather-toiletry-bags', title: 'Leather Toiletry Bags', url: '/collections/leather-toiletry-bags' },
          { id: 'tote-bags', title: 'Tote Bags', url: '/collections/tote-bags' },
          { id: 'wallets', title: 'Wallets', url: '/collections/wallets' },
        ],
      },
      {
        id: 'travel-accessories',
        title: 'Travel Accessories',
        seeAllUrl: '/collections/travel-accessories',
        items: [
          { id: 'beach-towels', title: 'Beach Towels', url: '/collections/beach-towels' },
          { id: 'kids-hooded-towels', title: 'Kids Hooded Towels', url: '/collections/kids-hooded-towels' },
          { id: 'luggage-covers', title: 'Luggage Covers', url: '/collections/luggage-covers' },
          { id: 'luggage-tags', title: 'Luggage Tags', url: '/collections/luggage-tags' },
        ],
      },
      {
        id: 'car-accessories',
        title: 'Car Accessories',
        seeAllUrl: '/collections/car-accessories',
        items: [
          { id: 'car-visor-clips', title: 'Car Visor Clips', url: '/collections/car-visor-clips' },
          { id: 'car-vent-clips', title: 'Car Vent Clips', url: '/collections/car-vent-clips' },
          { id: 'car-sunshades', title: 'Car Sunshades', url: '/collections/car-sunshades' },
          { id: 'memorial-charm-ornaments', title: 'Memorial Charm Car Ornaments', url: '/collections/memorial-charm-car-ornaments' },
          { id: 'rearview-accessories', title: 'Rear View Mirror Accessories', url: '/collections/rear-view-mirror-accessories' },
        ],
      },
      {
        id: 'clothing-accessories',
        title: 'Clothing Accessories',
        seeAllUrl: '/collections/clothing-accessories',
        items: [
          { id: 'hats-caps', title: 'Hats & Caps', url: '/collections/hats-caps' },
          { id: 'belts', title: 'Belts', url: '/collections/belts' },
          { id: 'neckties', title: 'Neckties', url: '/collections/neckties' },
          { id: 'footwear', title: 'Footwear', url: '/collections/footwear' },
        ],
      },
      {
        id: 'stationery',
        title: 'Stationery',
        seeAllUrl: '/collections/stationery',
        items: [
          { id: 'acrylic-clipboards', title: 'Acrylic Clipboards', url: '/collections/acrylic-clipboards' },
          { id: 'book-page-holders', title: 'Book Page Holders', url: '/collections/book-page-holders' },
          { id: 'leather-journals', title: 'Leather Journals', url: '/collections/leather-journals' },
          { id: 'leather-bookmarks', title: 'Leather Magnetic Bookmarks', url: '/collections/leather-magnetic-bookmarks' },
          { id: 'pencil-cases', title: 'Pencil Cases', url: '/collections/pencil-cases' },
        ],
      },
      {
        id: 'keychains',
        title: 'Keychains',
        seeAllUrl: '/collections/keychains',
        items: [
          { id: 'ss-keychains', title: 'Engraved Stainless Steel Keychains', url: '/collections/engraved-stainless-steel-keychains' },
          { id: 'leather-keychains', title: 'Leather Keychains', url: '/collections/leather-keychains' },
          { id: 'memorial-keychains', title: 'Memorial Keychains', url: '/collections/memorial-keychains' },
          { id: 'baseball-keychains', title: 'Leather Baseball Keychains', url: '/collections/leather-baseball-keychains' },
          { id: 'acrylic-keychains', title: 'Acrylic Keychains', url: '/collections/acrylic-keychains' },
        ],
      },
      {
        id: 'pet-supplies',
        title: 'Pet Supplies',
        seeAllUrl: '/collections/pet-supplies',
        items: [
          { id: 'bandana-collars', title: 'Bandana Collars', url: '/collections/bandana-collars' },
          { id: 'pet-bowls', title: 'Pet Bowls', url: '/collections/pet-bowls' },
          { id: 'pet-loss-frames', title: 'Pet Loss Frames', url: '/collections/pet-loss-frames' },
          { id: 'pet-shirts', title: 'Pet Shirts', url: '/collections/pet-shirts' },
        ],
      },
      {
        id: 'sports-outdoor',
        title: 'Sports & Outdoor Recreation',
        seeAllUrl: '/collections/sports-outdoor',
        items: [
          { id: 'baseballs', title: 'Baseballs', url: '/collections/baseballs' },
          { id: 'golf-balls', title: 'Golf Balls', url: '/collections/golf-balls' },
          { id: 'golf-ball-holders', title: 'Golf Ball Holders', url: '/collections/golf-ball-holders' },
          { id: 'pickleball-covers', title: 'Pickleball Paddle Covers', url: '/collections/pickleball-paddle-covers' },
          { id: 'footballs', title: 'Footballs', url: '/collections/footballs' },
          { id: 'golf-bag-tags', title: 'Leather Golf Bag Tags', url: '/collections/leather-golf-bag-tags' },
        ],
      },
      {
        id: 'tech-accessories',
        title: 'Tech Accessories',
        seeAllUrl: '/collections/tech-accessories',
        items: [
          { id: 'phone-cases', title: 'Phone Cases', url: '/collections/phone-cases' },
          { id: 'mouse-pads', title: 'Mouse Pads', url: '/collections/mouse-pads' },
          { id: 'leather-phone-holsters', title: 'Leather Phone Holsters', url: '/collections/leather-phone-holsters' },
        ],
      },
    ],
  },
  {
    id: 'interests',
    title: 'Interests',
    url: '/collections/interests',
    groups: [
      {
        id: 'drinks',
        title: 'Drinks',
        seeAllUrl: '/collections/drinks',
        items: [
          { id: 'wine', title: 'Wine', url: '/collections/wine' },
          { id: 'whiskey', title: 'Whiskey', url: '/collections/whiskey' },
          { id: 'beer', title: 'Beer', url: '/collections/beer' },
        ],
      },
      {
        id: 'lifestyle-hobbies',
        title: 'Lifestyle & Hobbies',
        items: [
          { id: 'gardening', title: 'Gardening', url: '/collections/gardening' },
          { id: 'gym', title: 'Gym', url: '/collections/gym' },
          { id: 'reading', title: 'Reading', url: '/collections/reading' },
          { id: 'sewing', title: 'Sewing', url: '/collections/sewing' },
          { id: 'yoga', title: 'Yoga', url: '/collections/yoga' },
        ],
      },
      {
        id: 'outdoor-adventure',
        title: 'Outdoor & Adventure',
        items: [
          { id: 'camping', title: 'Camping', url: '/collections/camping' },
          { id: 'fishing-hunting', title: 'Fishing & Hunting', url: '/collections/fishing-hunting' },
          { id: 'hiking', title: 'Hiking', url: '/collections/hiking' },
          { id: 'traveling', title: 'Traveling', url: '/collections/traveling' },
        ],
      },
      {
        id: 'pets-interest',
        title: 'Pets',
        seeAllUrl: '/collections/pets',
        items: [
          { id: 'cat-lovers', title: 'Cat Lovers', url: '/collections/cat-lovers' },
          { id: 'dog-lovers', title: 'Dog Lovers', url: '/collections/dog-lovers' },
        ],
      },
      {
        id: 'sports-interest',
        title: 'Sports',
        items: [
          { id: 'baseball', title: 'Baseball', url: '/collections/baseball' },
          { id: 'basketball', title: 'Basketball', url: '/collections/basketball' },
          { id: 'football', title: 'Football', url: '/collections/football' },
          { id: 'golf', title: 'Golf', url: '/collections/golf' },
          { id: 'hockey', title: 'Hockey', url: '/collections/hockey' },
          { id: 'pickleball', title: 'Pickleball', url: '/collections/pickleball' },
          { id: 'softball', title: 'Softball', url: '/collections/softball' },
          { id: 'tennis', title: 'Tennis', url: '/collections/tennis' },
        ],
      },
    ],
  },
  {
    id: 'happy-customers',
    title: 'Happy Customers',
    url: '/pages/happy-customers',
  },
];
