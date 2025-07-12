'use client'
import { useRouter, useSearchParams } from 'next/navigation';

// shows current filters as removable chips with a "Clear all" button

export function AdminProductFilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keys = ['type', 'subType', 'brand', 'isRGB', 'isWireless', 'minPrice', 'maxPrice'];

  /* This creates a list of filters currently active in the URL
     Example: if your URL is /admin/products?brand=Logitech&type=keyboard, it becomes:
      [
        { key: 'brand', value: 'Logitech' },
        { key: 'type', value: 'keyboard' }
      ]
  */
  const activeFilters = keys
    .map(key => ({ key, value: searchParams.get(key) })) // only show filters that are active (non-empty)
    .filter(f => f.value);

  const clearFilter = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`/admin/products?${params.toString()}`);
  };

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      {activeFilters.map(({ key, value }) => (
        <div key={key} className="bg-gray-100 border px-2 py-1 text-sm rounded flex items-center gap-1">
          <span>{key}: {value}</span>
          <button onClick={() => clearFilter(key)} className="text-red-500 text-xs">✕</button>
        </div>
      ))}
      <button onClick={() => router.push('/admin/products')} className="text-sm text-blue-600 underline">Clear all</button>
    </div>
  );
}
