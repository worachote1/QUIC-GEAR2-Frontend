'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { formatDateToReadable } from '@/utils/formatDate'; 
import { AUCTION_FILTER_KEYS, AUCTION_FILTER_LABELS } from '@/constants/auction/auctionFilterFields';

export function AdminAuctionFilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keys = AUCTION_FILTER_KEYS;
  const labelMap = AUCTION_FILTER_LABELS;

  const activeFilters = keys
    .map(key => ({ key, value: searchParams.get(key) }))
    .filter(f => f.value);

  const clearFilter = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams);
    keys.forEach(k => params.delete(k));
    router.push(`/admin/auctions`);
  };

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      {activeFilters.map(({ key, value }) => {
        let displayValue = value;

        // Convert booleans to Yes/No
        if (value === 'true') displayValue = 'Yes';
        else if (value === 'false') displayValue = 'No';

        // Format numbers or numeric strings
        else if (!isNaN(Number(value))) {
          const num = Number(value);
          displayValue = `฿${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        }

        // Format dates using your helper
        else if (key.includes('Date')) {
          displayValue = formatDateToReadable(value!);
        }

        return (
          <div
            key={key + value}
            className="flex items-center bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-sm"
          >
            <span className="mr-2 font-medium">
              {labelMap[key] || key}: {displayValue}
            </span>
            <button
              onClick={() => clearFilter(key)}
              className="text-blue-700 hover:text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        );
      })}

      <button
        onClick={clearAll}
        className="text-sm underline text-blue-600 hover:text-blue-800 ml-2 cursor-pointer"
      >
        Clear all
      </button>
    </div>
  );
}
