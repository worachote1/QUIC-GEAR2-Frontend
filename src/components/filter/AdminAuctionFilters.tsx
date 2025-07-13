'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AUCTION_STATUS } from '@/constants/auction/auctionStatus';
import { brandList, typeList, subTypeMap } from '@/constants/product/productOptions';
import { debounce } from '@/utils/debounce';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function AdminAuctionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') ?? '',
    type: searchParams.get('type') ?? '',
    subType: searchParams.get('subType') ?? '',
    isWireless: searchParams.get('isWireless') ?? '',
    isRGB: searchParams.get('isRGB') ?? '',
    auctionStatus: searchParams.get('auctionStatus') ?? '',
    minStartPrice: searchParams.get('minStartPrice') ?? '',
    maxStartPrice: searchParams.get('maxStartPrice') ?? '',
    minBuyOutPrice: searchParams.get('minBuyOutPrice') ?? '',
    maxBuyOutPrice: searchParams.get('maxBuyOutPrice') ?? '',
    startDateFrom: searchParams.get('startDateFrom') ?? '',
    startDateTo: searchParams.get('startDateTo') ?? '',
    endDateFrom: searchParams.get('endDateFrom') ?? '',
    endDateTo: searchParams.get('endDateTo') ?? '',
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
    return () => updateURL.cancel();
  }, [filters]);

  useEffect(() => {
    setFilters({
      brand: searchParams.get('brand') ?? '',
      type: searchParams.get('type') ?? '',
      subType: searchParams.get('subType') ?? '',
      isWireless: searchParams.get('isWireless') ?? '',
      isRGB: searchParams.get('isRGB') ?? '',
      auctionStatus: searchParams.get('auctionStatus') ?? '',
      minStartPrice: searchParams.get('minStartPrice') ?? '',
      maxStartPrice: searchParams.get('maxStartPrice') ?? '',
      minBuyOutPrice: searchParams.get('minBuyOutPrice') ?? '',
      maxBuyOutPrice: searchParams.get('maxBuyOutPrice') ?? '',
      startDateFrom: searchParams.get('startDateFrom') ?? '',
      startDateTo: searchParams.get('startDateTo') ?? '',
      endDateFrom: searchParams.get('endDateFrom') ?? '',
      endDateTo: searchParams.get('endDateTo') ?? '',
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
        <label className="block text-sm font-medium">Status</label>
        <select value={filters.auctionStatus} onChange={e => setFilters(prev => ({ ...prev, auctionStatus: e.target.value }))} className="border px-2 py-1">
          <option value="">All</option>
          {AUCTION_STATUS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Min Start Price</label>
        <input type="number" className="border px-2 py-1 w-24" value={filters.minStartPrice} onChange={e => setFilters(prev => ({ ...prev, minStartPrice: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-medium">Max Start Price</label>
        <input type="number" className="border px-2 py-1 w-24" value={filters.maxStartPrice} onChange={e => setFilters(prev => ({ ...prev, maxStartPrice: e.target.value }))} />
      </div>

      <div>
        <label className="block text-sm font-medium">Min BuyOut Price</label>
        <input type="number" className="border px-2 py-1 w-24" value={filters.minBuyOutPrice} onChange={e => setFilters(prev => ({ ...prev, minBuyOutPrice: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-medium">Max BuyOut Price</label>
        <input type="number" className="border px-2 py-1 w-24" value={filters.maxBuyOutPrice} onChange={e => setFilters(prev => ({ ...prev, maxBuyOutPrice: e.target.value }))} />
      </div>

      <div>
        <label className="block text-sm font-medium">Start Date From</label>
        {/* <input type="date" className="border px-2 py-1" value={filters.startDateFrom} onChange={e => setFilters(prev => ({ ...prev, startDateFrom: e.target.value }))} /> */}
        <DatePicker
          selected={filters.startDateFrom ? new Date(filters.startDateFrom) : null}
          onChange={(date) =>
            setFilters((prev) => ({
              ...prev,
              startDateFrom: date ? date.toISOString() : '',
            }))
          }
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Start From"
          className="border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Start Date To</label>
        <input type="date" className="border px-2 py-1" value={filters.startDateTo} onChange={e => setFilters(prev => ({ ...prev, startDateTo: e.target.value }))} />
      </div>

      <div>
        <label className="block text-sm font-medium">End Date From</label>
        <input type="date" className="border px-2 py-1" value={filters.endDateFrom} onChange={e => setFilters(prev => ({ ...prev, endDateFrom: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-medium">End Date To</label>
        <input type="date" className="border px-2 py-1" value={filters.endDateTo} onChange={e => setFilters(prev => ({ ...prev, endDateTo: e.target.value }))} />
      </div>
    </div>
  );
}
