import type { Category, SourceAuthType, SourceStatus } from '../../types';

export interface RawImportedProduct {
  externalId: string;
  name: string;
  brand: string;
  category: Category;
  packageSize: string;
  unitPriceMeasure?: 'kg' | 'L' | 'copë';
  barcode?: string;
  imageUrl: string;
  productUrl?: string;
  regularPrice: number;
  promotionalPrice?: number;
  isOnDiscount: boolean;
  promotionStartDate?: string;
  promotionEndDate?: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: 'online_shop' | 'promotional_pdf' | 'partner_feed' | 'manual_verification';
  rawPayload?: Record<string, any>;
}

export interface AdapterMetadata {
  id: string;
  supermarketId: string;
  name: string;
  officialUrl: string;
  status: SourceStatus;
  authType: SourceAuthType;
  dataFormat: string;
  isAuthorized: boolean;
  notes: string;
  supportedFeatures: {
    canImportProducts: boolean;
    hasLivePrices: boolean;
    hasPromotions: boolean;
    hasBarcodes: boolean;
    hasPdfs: boolean;
  };
}

export interface ImportResult {
  sourceId: string;
  sourceName: string;
  status: 'success' | 'warning' | 'error' | 'pending_auth';
  products: RawImportedProduct[];
  errors: string[];
  message: string;
  durationMs: number;
}

export interface ConnectionTestResult {
  sourceId: string;
  isReachable: boolean;
  statusCode?: number;
  latencyMs: number;
  message: string;
}

export interface SupermarketAdapter {
  metadata: AdapterMetadata;
  testConnection(): Promise<ConnectionTestResult>;
  fetchProducts(): Promise<ImportResult>;
}

/**
 * Normalizes price values to EUR with 2 decimal places.
 */
export function normalizePrice(rawPrice: number | string | undefined | null): number {
  if (rawPrice === undefined || rawPrice === null) return 0;
  if (typeof rawPrice === 'number') {
    return Math.max(0, Number(rawPrice.toFixed(2)));
  }
  const cleaned = rawPrice
    .toString()
    .replace(/[^\d.,]/g, '')
    .replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.max(0, Number(parsed.toFixed(2)));
}

/**
 * Standardizes common package sizes into consistent format (e.g. "1 L", "1 kg", "500 g", "30 copë").
 */
export function standardizePackageSize(rawSize?: string): { packageSize: string; unit: 'kg' | 'L' | 'copë' } {
  if (!rawSize) return { packageSize: '1 copë', unit: 'copë' };
  
  const trimmed = rawSize.trim();
  const lower = trimmed.toLowerCase();

  if (lower.includes('kg') || lower.includes('kilogram')) {
    const num = lower.replace(/[^\d.]/g, '') || '1';
    return { packageSize: `${num} kg`, unit: 'kg' };
  }
  if (lower.includes('g') || lower.includes('gram')) {
    const num = lower.replace(/[^\d.]/g, '') || '500';
    return { packageSize: `${num} g`, unit: 'kg' };
  }
  if (lower.includes('l') || lower.includes('liter') || lower.includes('litër')) {
    const num = lower.replace(/[^\d.]/g, '') || '1';
    return { packageSize: `${num} L`, unit: 'L' };
  }
  if (lower.includes('ml')) {
    const num = lower.replace(/[^\d.]/g, '') || '500';
    return { packageSize: `${num} ml`, unit: 'L' };
  }
  if (lower.includes('cop') || lower.includes('cope') || lower.includes('copë') || lower.includes('pack')) {
    const num = lower.replace(/[^\d.]/g, '') || '1';
    return { packageSize: `${num} copë`, unit: 'copë' };
  }

  return { packageSize: trimmed, unit: 'copë' };
}
