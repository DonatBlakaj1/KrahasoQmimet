import type { 
  Product, 
  PriceRecord, 
  PriceHistoryRecord, 
  SyncAuditLog, 
  SupermarketSource 
} from '../types';
import { adapterRegistry } from './adapters/adapterRegistry';
import type { RawImportedProduct, ImportResult } from './adapters/SupermarketAdapter';

export interface SyncEngineState {
  isSyncing: boolean;
  lastGlobalSync: string | null;
  sources: SupermarketSource[];
  history: PriceHistoryRecord[];
  auditLogs: SyncAuditLog[];
}

export class SyncEngine {
  private sources: SupermarketSource[];
  private priceHistory: PriceHistoryRecord[] = [];
  private auditLogs: SyncAuditLog[] = [];
  private isSyncing = false;

  constructor() {
    this.sources = adapterRegistry.getSourcesState();
    this.initSampleHistory();
  }

  private initSampleHistory() {
    this.priceHistory = [
      {
        id: 'hist-1',
        productId: 'prod-1',
        productName: 'Qumësht UHT 3.2% Yndyrë',
        supermarketId: 'viva-fresh',
        supermarketName: 'Viva Fresh Store',
        oldPrice: 1.25,
        newPrice: 1.15,
        changeType: 'decrease',
        recordedAt: '2026-10-18T14:30:00Z',
        sourceName: 'Viva Fresh Store (Zbritje Ditore)',
      },
      {
        id: 'hist-2',
        productId: 'prod-2',
        productName: 'Vaj Luledielli i Rafinuar',
        supermarketId: 'interex',
        supermarketName: 'Interex Kosova',
        oldPrice: 1.49,
        newPrice: 1.32,
        changeType: 'decrease',
        recordedAt: '2026-10-18T09:20:00Z',
        sourceName: 'Interex Kosova (Fletushka Zyrtare)',
      },
      {
        id: 'hist-3',
        productId: 'prod-6',
        productName: 'Kafe Turke e Bluar Prince Classic',
        supermarketId: 'maxi',
        supermarketName: 'Maxi Market',
        oldPrice: 4.10,
        newPrice: 3.95,
        changeType: 'decrease',
        recordedAt: '2026-10-17T15:45:00Z',
        sourceName: 'Maxi Market (E-Shop)',
      },
    ];

    this.auditLogs = [
      {
        id: 'log-1',
        sourceId: 'src-maxi',
        sourceName: 'Maxi Market (E-Shop)',
        status: 'success',
        itemsImported: 20,
        itemsUpdated: 3,
        itemsUnchanged: 17,
        message: 'Katalogu publik u sinkronizua me sukses me 20 artikuj të verifikuar.',
        timestamp: '2026-10-18T18:30:00Z',
      },
      {
        id: 'log-2',
        sourceId: 'src-interex',
        sourceName: 'Interex Kosova',
        status: 'success',
        itemsImported: 10,
        itemsUpdated: 2,
        itemsUnchanged: 8,
        message: 'Fletushka dyjavore u analizua: u nxorrën 7 zbritje aktive promocionale.',
        timestamp: '2026-10-18T18:30:00Z',
      },
      {
        id: 'log-3',
        sourceId: 'src-viva-fresh',
        sourceName: 'Viva Fresh Store',
        status: 'warning',
        itemsImported: 5,
        itemsUpdated: 0,
        itemsUnchanged: 5,
        message: 'Hosti onlinedev është offline. U ruajtën të dhënat ekzistuese bazë pa ndërprerje.',
        timestamp: '2026-10-18T18:30:00Z',
      },
    ];
  }

  getSources(): SupermarketSource[] {
    return this.sources;
  }

  getHistory(): PriceHistoryRecord[] {
    return this.priceHistory;
  }

  getAuditLogs(): SyncAuditLog[] {
    return this.auditLogs;
  }

  getIsSyncing(): boolean {
    return this.isSyncing;
  }

  /**
   * Idempotently synchronizes a single source against existing products & price records.
   * If a source fails, existing price records are preserved (Fault Tolerance).
   */
  async syncSource(
    sourceId: string,
    currentProducts: Product[],
    currentPrices: PriceRecord[]
  ): Promise<{
    updatedProducts: Product[];
    updatedPrices: PriceRecord[];
    result: ImportResult;
  }> {
    this.isSyncing = true;
    const adapter = adapterRegistry.getAdapter(sourceId);

    if (!adapter) {
      this.isSyncing = false;
      throw new Error(`Përshtatësi "${sourceId}" nuk ekziston.`);
    }

    try {
      const result = await adapter.fetchProducts();
      const updatedProducts = [...currentProducts];
      let updatedPrices = [...currentPrices];

      let importedCount = 0;
      let updatedCount = 0;
      let unchangedCount = 0;

      const now = new Date().toISOString();

      for (const imported of result.products) {
        // 1. Deduplication: match by barcode or name + brand
        let matchedProduct = updatedProducts.find(
          (p) => (imported.barcode && p.barcode === imported.barcode) ||
                 (p.name.toLowerCase() === imported.name.toLowerCase() && p.brand.toLowerCase() === imported.brand.toLowerCase())
        );

        if (!matchedProduct) {
          // Create new product if not present
          const newId = `prod-import-${Date.now()}-${Math.random().toString().slice(2, 6)}`;
          matchedProduct = {
            id: newId,
            name: imported.name,
            brand: imported.brand,
            category: imported.category,
            packageSize: imported.packageSize,
            unitPriceMeasure: imported.unitPriceMeasure || 'kg',
            barcode: imported.barcode || `GEN-${Date.now()}`,
            imageUrl: imported.imageUrl,
            productUrl: imported.productUrl,
            description: `Artikull i importuar nga burimi ${imported.sourceName}`,
          };
          updatedProducts.push(matchedProduct);
          importedCount++;
        }

        // 2. Price record matching for this product + supermarket
        const existingPriceIndex = updatedPrices.findIndex(
          (pr) => pr.productId === matchedProduct!.id && pr.supermarketId === adapter.metadata.supermarketId
        );

        const targetPrice = imported.isOnDiscount && imported.promotionalPrice !== undefined 
          ? imported.promotionalPrice 
          : imported.regularPrice;

        if (existingPriceIndex >= 0) {
          const oldRecord = updatedPrices[existingPriceIndex];
          if (oldRecord.price !== targetPrice) {
            // Price changed! Record into Price History
            this.priceHistory.unshift({
              id: `hist-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
              productId: matchedProduct.id,
              productName: matchedProduct.name,
              supermarketId: adapter.metadata.supermarketId,
              supermarketName: adapter.metadata.name,
              oldPrice: oldRecord.price,
              newPrice: targetPrice,
              changeType: targetPrice < oldRecord.price ? 'decrease' : 'increase',
              recordedAt: now,
              sourceName: imported.sourceName,
            });

            updatedPrices[existingPriceIndex] = {
              ...oldRecord,
              price: targetPrice,
              oldPrice: imported.isOnDiscount ? imported.regularPrice : undefined,
              isOnDiscount: imported.isOnDiscount,
              promotionStartDate: imported.promotionStartDate,
              promotionEndDate: imported.promotionEndDate,
              sourceUrl: imported.sourceUrl,
              sourceName: imported.sourceName,
              sourceType: imported.sourceType,
              verifiedAt: now,
              lastUpdated: now,
            };
            updatedCount++;
          } else {
            unchangedCount++;
            // Just refresh verification timestamp
            updatedPrices[existingPriceIndex] = {
              ...oldRecord,
              sourceUrl: imported.sourceUrl || oldRecord.sourceUrl,
              sourceName: imported.sourceName || oldRecord.sourceName,
              verifiedAt: now,
              lastUpdated: now,
            };
          }
        } else {
          // Insert new price record
          const newPriceId = `pr-sync-${Date.now()}-${Math.random().toString().slice(2, 6)}`;
          updatedPrices.push({
            id: newPriceId,
            productId: matchedProduct.id,
            supermarketId: adapter.metadata.supermarketId,
            price: targetPrice,
            oldPrice: imported.isOnDiscount ? imported.regularPrice : undefined,
            isOnDiscount: imported.isOnDiscount,
            promotionStartDate: imported.promotionStartDate,
            promotionEndDate: imported.promotionEndDate,
            lastUpdated: now,
            isAvailable: true,
            sourceUrl: imported.sourceUrl,
            sourceName: imported.sourceName,
            sourceType: imported.sourceType,
            verifiedAt: now,
          });
          importedCount++;
        }
      }

      // 3. Update source metadata
      this.sources = this.sources.map((src) => {
        if (src.id === sourceId) {
          return {
            ...src,
            lastSyncAt: now,
            nextSyncAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
            importedCount: result.products.length,
            errorCount: result.errors.length,
            lastError: result.errors[0],
          };
        }
        return src;
      });

      // 4. Audit Log Entry
      this.auditLogs.unshift({
        id: `log-${Date.now()}`,
        sourceId,
        sourceName: adapter.metadata.name,
        status: result.status === 'error' ? 'error' : (result.errors.length > 0 ? 'warning' : 'success'),
        itemsImported: importedCount,
        itemsUpdated: updatedCount,
        itemsUnchanged: unchangedCount,
        message: result.message,
        timestamp: now,
      });

      this.isSyncing = false;
      return {
        updatedProducts,
        updatedPrices,
        result,
      };
    } catch (err: any) {
      this.isSyncing = false;
      this.auditLogs.unshift({
        id: `log-${Date.now()}`,
        sourceId,
        sourceName: adapter.metadata.name,
        status: 'error',
        itemsImported: 0,
        itemsUpdated: 0,
        itemsUnchanged: 0,
        message: `Dështoi sinkronizimi: ${err.message}`,
        timestamp: new Date().toISOString(),
      });
      throw err;
    }
  }
}

export const syncEngine = new SyncEngine();
