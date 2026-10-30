export type Category = 
  | 'Qumësht & Vezë'
  | 'Bukë & Brumëra'
  | 'Vaj & Ushqim Bazik'
  | 'Fruta & Perime'
  | 'Mish & Delikatesë'
  | 'Pije & Lëngje'
  | 'Ëmbëlsira & Snack'
  | 'Higjienë & Pastrim';

export interface Supermarket {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  cities: string[];
  totalStores: number;
  description: string;
  website: string;
  hotline: string;
}

export type SourceStatus = 
  | 'active_public_catalog' 
  | 'partially_authorized_pdf' 
  | 'pending_authorization' 
  | 'unreachable_dev_host' 
  | 'error';

export type SourceAuthType = 
  | 'public_e_shop' 
  | 'pdf_leaflet' 
  | 'partner_api' 
  | 'commercial_feed';

export interface SupermarketSource {
  id: string;
  supermarketId: string;
  name: string;
  officialUrl: string;
  status: SourceStatus;
  authType: SourceAuthType;
  dataFormat: string;
  isAuthorized: boolean;
  lastSyncAt: string | null;
  nextSyncAt: string | null;
  importedCount: number;
  errorCount: number;
  lastError?: string;
  notes: string;
}

export interface PriceRecord {
  id: string;
  productId: string;
  supermarketId: string;
  price: number;
  oldPrice?: number; // if on discount
  isOnDiscount?: boolean;
  promotionStartDate?: string;
  promotionEndDate?: string;
  lastUpdated: string; // ISO date string or formatted date
  isAvailable: boolean;
  // Source Transparency & Verification
  sourceUrl?: string;
  sourceName?: string;
  sourceType?: 'online_shop' | 'promotional_pdf' | 'partner_feed' | 'manual_verification';
  verifiedAt?: string;
}

export interface PriceHistoryRecord {
  id: string;
  productId: string;
  productName: string;
  supermarketId: string;
  supermarketName: string;
  oldPrice: number;
  newPrice: number;
  changeType: 'increase' | 'decrease' | 'initial';
  recordedAt: string;
  sourceName: string;
}

export interface SyncAuditLog {
  id: string;
  sourceId: string;
  sourceName: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  itemsImported: number;
  itemsUpdated: number;
  itemsUnchanged: number;
  message: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  packageSize: string; // e.g. "1 L", "1 kg", "500 g", "30 copë"
  unitPriceMeasure?: 'kg' | 'L' | 'copë';
  barcode: string;
  imageUrl: string;
  productUrl?: string;
  description: string;
  isPopular?: boolean;
}

export interface ProductWithPrices extends Product {
  prices: (PriceRecord & { supermarket: Supermarket })[];
  minPrice: number;
  maxPrice: number;
  cheapestSupermarket: Supermarket | null;
  savingsPercentage: number;
  savingsAmount: number;
}

export interface ShoppingListItem {
  productId: string;
  quantity: number;
  preferredSupermarketId?: string; // Optional: specific supermarket chosen or auto-cheapest
  addedAt: string;
}

export type ViewMode = 
  | 'home' 
  | 'catalog' 
  | 'compare' 
  | 'shopping-list' 
  | 'supermarkets' 
  | 'admin';

export interface FilterState {
  searchQuery: string;
  category: string;
  supermarketId: string;
  onlyDiscounts: boolean;
  maxPrice: number;
  sortBy: 'cheapest' | 'expensive' | 'name-asc' | 'savings';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
