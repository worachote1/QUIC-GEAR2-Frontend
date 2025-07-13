'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { brandList, typeList, subTypeMap } from '@/constants/product/productOptions';
import { useEffect, useState } from 'react';
import { debounce } from '@/utils/debounce';

// complete filtering UI including `type`, `subType`, `brand`, `isRGB`, `isWireless`, `minPrice`, and `maxPrice`

export function AdminProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') ?? '',
    subType: searchParams.get('subType') ?? '',
    brand: searchParams.get('brand') ?? '',
    isRGB: searchParams.get('isRGB') ?? '',
    isWireless: searchParams.get('isWireless') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  });

  const updateURL = debounce((newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`?${params.toString()}`);
  }, 300);

  useEffect(() => {
    updateURL(filters);
    return () => updateURL.cancel(); // this cleanup function cancels the old debounce, so only the latest one runs
  }, [filters]);

  // Now: When the URL changes (from chip delete or clear), `filters` state will also update.
  useEffect(() => {
    setFilters({
      type: searchParams.get('type') ?? '',
      subType: searchParams.get('subType') ?? '',
      brand: searchParams.get('brand') ?? '',
      isRGB: searchParams.get('isRGB') ?? '',
      isWireless: searchParams.get('isWireless') ?? '',
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
    });
  }, [searchParams.toString()]);

  return (
    <div className="mb-4 flex gap-4 flex-wrap items-end">
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select value={filters.type} onChange={e => setFilters(prev => ({ ...prev, type: e.target.value, subType: '' }))} className="border px-2 py-1">
          <option value="">All</option>
          {typeList.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Sub-Type</label>
        <select value={filters.subType} onChange={e => setFilters(prev => ({ ...prev, subType: e.target.value }))} className="border px-2 py-1">
          <option value="">All</option>
          {filters.type && subTypeMap[filters.type]?.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Brand</label>
        <select value={filters.brand} onChange={e => setFilters(prev => ({ ...prev, brand: e.target.value }))} className="border px-2 py-1">
          <option value="">All</option>
          {brandList.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">RGB</label>
        <select value={filters.isRGB} onChange={e => setFilters(prev => ({ ...prev, isRGB: e.target.value }))} className="border px-2 py-1">
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Wireless</label>
        <select value={filters.isWireless} onChange={e => setFilters(prev => ({ ...prev, isWireless: e.target.value }))} className="border px-2 py-1">
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Min Price</label>
        <input
          type="number"
          className="border px-2 py-1 w-24"
          value={filters.minPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Max Price</label>
        <input
          type="number"
          className="border px-2 py-1 w-24"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
        />
      </div>
    </div>
  );
}
