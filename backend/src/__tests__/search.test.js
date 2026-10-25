import test from 'node:test';
import assert from 'node:assert/strict';

import { BaseProvider } from '../providers/base.provider.js';
import amazonProvider from '../providers/amazon.provider.js';
import flipkartProvider from '../providers/flipkart.provider.js';
import meeshoProvider from '../providers/meesho.provider.js';
import { aggregateSearch } from '../providers/aggregator.js';
import { searchProducts } from '../modules/product/product.service.js';

test('Provider Interface Contract - normalize enforces required fields', () => {
  const sample = {
    name: 'Sony WH-CH720N Wireless Headphones',
    platform: 'Amazon',
    price: 9990,
    rating: 4.3,
    review_count: 5120,
    product_url: 'https://amazon.in/dp/example',
    image_url: 'https://example.com/img.jpg',
    in_stock: true,
    delivery_info: '2 Days',
    discount_percentage: 25,
  };

  const provider = new BaseProvider('Amazon');
  const normalized = provider.normalize(sample);

  assert.equal(normalized.name, 'Sony WH-CH720N Wireless Headphones');
  assert.equal(normalized.platform, 'Amazon');
  assert.equal(normalized.price, 9990);
  assert.equal(normalized.currency, 'INR');
  assert.equal(normalized.rating, 4.3);
  assert.equal(normalized.review_count, 5120);
  assert.equal(normalized.product_url, 'https://amazon.in/dp/example');
  assert.equal(normalized.image_url, 'https://example.com/img.jpg');
  assert.equal(normalized.in_stock, true);
  assert.equal(normalized.delivery_info, '2 Days');
  assert.equal(normalized.discount_percentage, 25);
});

test('Amazon Provider - searchProducts returns structured normalized products', async () => {
  const results = await amazonProvider.searchProducts('wireless headphones');
  assert.ok(Array.isArray(results), 'Should return an array');
  assert.ok(results.length > 0, 'Should find products for headphones query');

  const first = results[0];
  assert.ok(first.name, 'Product must have a name');
  assert.equal(first.platform.toLowerCase(), 'amazon');
  assert.ok(typeof first.price === 'number', 'Price must be a number');
  assert.ok(first.currency === 'INR', 'Currency must be INR');
  assert.ok(typeof first.in_stock === 'boolean', 'in_stock must be boolean');
  assert.ok(first.product_url.startsWith('http'), 'product_url must be valid URL');
});

test('Flipkart Provider - searchProducts returns structured normalized products', async () => {
  const results = await flipkartProvider.searchProducts('wireless headphones');
  assert.ok(Array.isArray(results), 'Should return an array');
  assert.ok(results.length > 0, 'Should find products for headphones query');

  const first = results[0];
  assert.ok(first.name, 'Product must have a name');
  assert.equal(first.platform.toLowerCase(), 'flipkart');
  assert.ok(typeof first.price === 'number', 'Price must be a number');
  assert.ok(first.currency === 'INR', 'Currency must be INR');
});

test('Meesho Provider - searchProducts returns structured normalized products', async () => {
  const results = await meeshoProvider.searchProducts('wireless headphones');
  assert.ok(Array.isArray(results), 'Should return an array');
  assert.ok(results.length > 0, 'Should find products for headphones query');

  const first = results[0];
  assert.ok(first.name, 'Product must have a name');
  assert.equal(first.platform.toLowerCase(), 'meesho');
  assert.ok(typeof first.price === 'number', 'Price must be a number');
  assert.ok(first.currency === 'INR', 'Currency must be INR');
});

test('Aggregator - calls all providers in parallel and returns sources & groups', async () => {
  const agg = await aggregateSearch('wireless headphones');

  assert.ok(agg.products, 'Aggregator result must include products array');
  assert.ok(agg.products.length > 0, 'Should return aggregated products');
  assert.ok(agg.sources, 'Aggregator result must report sources status');
  assert.equal(agg.sources.amazon, 'success');
  assert.equal(agg.sources.flipkart, 'success');
  assert.equal(agg.sources.meesho, 'success');

  assert.ok(Array.isArray(agg.groups), 'Aggregator must return deduplicated comparison groups');
  assert.ok(agg.groups.length > 0, 'Should have grouped products');
});

test('Product Service - searchProducts handles empty queries safely', async () => {
  const emptyRes = await searchProducts('');
  assert.equal(emptyRes.totalResults, 0);
  assert.deepEqual(emptyRes.products, []);

  const nullRes = await searchProducts(null);
  assert.equal(nullRes.totalResults, 0);
});

test('Product Service - searchProducts retrieves multi-platform results', async () => {
  const res = await searchProducts('wireless headphones');
  assert.equal(res.query, 'wireless headphones');
  assert.ok(res.totalResults > 0);
  assert.ok(Array.isArray(res.products));
  assert.ok(Array.isArray(res.groups));
});
