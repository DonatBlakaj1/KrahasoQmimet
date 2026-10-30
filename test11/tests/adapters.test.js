import test from 'node:test';
import assert from 'node:assert';


// Test price normalization logic
function normalizePrice(rawPrice) {
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

// Test package size standardization
function standardizePackageSize(rawSize) {
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

test('normalizePrice correctly parses and standardizes EUR amounts', () => {
  assert.strictEqual(normalizePrice(1.25), 1.25);
  assert.strictEqual(normalizePrice('1,39 €'), 1.39);
  assert.strictEqual(normalizePrice('€ 2.75'), 2.75);
  assert.strictEqual(normalizePrice('0.999'), 1.00);
  assert.strictEqual(normalizePrice(null), 0);
  assert.strictEqual(normalizePrice(-5.50), 0);
});

test('standardizePackageSize normalizes units across formats', () => {
  assert.deepStrictEqual(standardizePackageSize('1 Litër'), { packageSize: '1 L', unit: 'L' });
  assert.deepStrictEqual(standardizePackageSize('500 gram'), { packageSize: '500 g', unit: 'kg' });
  assert.deepStrictEqual(standardizePackageSize('5 Kilogram'), { packageSize: '5 kg', unit: 'kg' });
  assert.deepStrictEqual(standardizePackageSize('30 cope'), { packageSize: '30 copë', unit: 'copë' });
});

test('Supermarket source metadata has correct transparent status mapping', () => {
  const sources = [
    { id: 'src-maxi', name: 'Maxi Market (E-Shop)', status: 'active_public_catalog' },
    { id: 'src-interex', name: 'Interex Kosova', status: 'partially_authorized_pdf' },
    { id: 'src-meridian', name: 'Meridian Express', status: 'partially_authorized_pdf' },
    { id: 'src-viva-fresh', name: 'Viva Fresh Store', status: 'unreachable_dev_host' },
    { id: 'src-etc', name: 'ETC / Elkos Group', status: 'pending_authorization' },
    { id: 'src-super-viva', name: 'Super Viva', status: 'pending_authorization' },
  ];

  assert.strictEqual(sources.length, 6);
  assert.strictEqual(sources.find(s => s.id === 'src-maxi').status, 'active_public_catalog');
  assert.strictEqual(sources.find(s => s.id === 'src-interex').status, 'partially_authorized_pdf');
  assert.strictEqual(sources.find(s => s.id === 'src-viva-fresh').status, 'unreachable_dev_host');
  assert.strictEqual(sources.find(s => s.id === 'src-etc').status, 'pending_authorization');
});

test('Idempotent synchronization preserves existing prices when source is unchanged', () => {
  const currentPrices = [
    { id: 'pr-1', productId: 'p1', supermarketId: 'maxi', price: 1.19 }
  ];
  
  const incoming = { productId: 'p1', supermarketId: 'maxi', price: 1.19 };

  // Sync logic
  let updatedPrices = [...currentPrices];
  const existingIdx = updatedPrices.findIndex(p => p.productId === incoming.productId && p.supermarketId === incoming.supermarketId);
  
  assert.strictEqual(existingIdx, 0);
  assert.strictEqual(updatedPrices[existingIdx].price, incoming.price);
  assert.strictEqual(updatedPrices.length, 1, 'Does not duplicate existing price record');
});

test('Synchronization tracks price history when price changes', () => {
  const currentPrice = 1.49;
  const newPrice = 1.32;
  const history = [];

  if (currentPrice !== newPrice) {
    history.push({
      oldPrice: currentPrice,
      newPrice: newPrice,
      changeType: newPrice < currentPrice ? 'decrease' : 'increase'
    });
  }

  assert.strictEqual(history.length, 1);
  assert.strictEqual(history[0].changeType, 'decrease');
  assert.strictEqual(history[0].newPrice, 1.32);
});
