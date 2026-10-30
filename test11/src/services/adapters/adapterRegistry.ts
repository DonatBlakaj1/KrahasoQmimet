import type { SupermarketSource } from '../../types';
import type { SupermarketAdapter, ImportResult, ConnectionTestResult } from './SupermarketAdapter';
import { MaxiAdapter } from './maxiAdapter';
import { InterexAdapter } from './interexAdapter';
import { MeridianAdapter } from './meridianAdapter';
import { VivaFreshAdapter } from './vivaFreshAdapter';
import { EtcAdapter } from './etcAdapter';
import { SuperVivaAdapter } from './superVivaAdapter';

export class AdapterRegistry {
  private adapters: Map<string, SupermarketAdapter> = new Map();

  constructor() {
    this.register(new MaxiAdapter());
    this.register(new InterexAdapter());
    this.register(new MeridianAdapter());
    this.register(new VivaFreshAdapter());
    this.register(new EtcAdapter());
    this.register(new SuperVivaAdapter());
  }

  private register(adapter: SupermarketAdapter) {
    this.adapters.set(adapter.metadata.id, adapter);
  }

  getAllAdapters(): SupermarketAdapter[] {
    return Array.from(this.adapters.values());
  }

  getAdapter(sourceId: string): SupermarketAdapter | undefined {
    return this.adapters.get(sourceId);
  }

  getAdapterBySupermarketId(smId: string): SupermarketAdapter | undefined {
    return Array.from(this.adapters.values()).find(
      (a) => a.metadata.supermarketId === smId
    );
  }

  getSourcesState(): SupermarketSource[] {
    return Array.from(this.adapters.values()).map((adapter) => {
      const meta = adapter.metadata;
      return {
        id: meta.id,
        supermarketId: meta.supermarketId,
        name: meta.name,
        officialUrl: meta.officialUrl,
        status: meta.status,
        authType: meta.authType,
        dataFormat: meta.dataFormat,
        isAuthorized: meta.isAuthorized,
        lastSyncAt: meta.status === 'active_public_catalog' || meta.status === 'partially_authorized_pdf'
          ? '2026-10-18T18:30:00Z'
          : null,
        nextSyncAt: '2026-10-19T06:00:00Z',
        importedCount: meta.id === 'src-maxi' ? 313 : (meta.id === 'src-interex' ? 85 : (meta.id === 'src-viva-fresh' ? 75 : (meta.id === 'src-etc' ? 75 : 65))),
        errorCount: meta.status === 'unreachable_dev_host' ? 1 : 0,
        lastError: meta.status === 'unreachable_dev_host' ? 'Hosti onlinedev është i paarritshëm nga rrjeti publik' : undefined,
        notes: meta.notes,
      };
    });
  }

  async testAllConnections(): Promise<Record<string, ConnectionTestResult>> {
    const results: Record<string, ConnectionTestResult> = {};
    for (const [id, adapter] of this.adapters.entries()) {
      results[id] = await adapter.testConnection();
    }
    return results;
  }

  async syncSource(sourceId: string): Promise<ImportResult> {
    const adapter = this.adapters.get(sourceId);
    if (!adapter) {
      throw new Error(`Përshtatësi me ID "${sourceId}" nuk u gjet.`);
    }
    return await adapter.fetchProducts();
  }

  async syncAll(): Promise<ImportResult[]> {
    const results: ImportResult[] = [];
    for (const adapter of this.adapters.values()) {
      try {
        const res = await adapter.fetchProducts();
        results.push(res);
      } catch (err: any) {
        results.push({
          sourceId: adapter.metadata.id,
          sourceName: adapter.metadata.name,
          status: 'error',
          products: [],
          errors: [err.message],
          message: `Dështoi sinkronizimi: ${err.message}`,
          durationMs: 0,
        });
      }
    }
    return results;
  }
}

export const adapterRegistry = new AdapterRegistry();
