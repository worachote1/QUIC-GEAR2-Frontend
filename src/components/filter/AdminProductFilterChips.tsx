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
    <div className="mb-4 flex flex-wrap gap-2">
      {activeFilters.map(({ key, value }) => (
        <div key={key + value} className="flex items-center bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-sm">
          <span className="mr-2 font-medium">{key}: {value}</span>
          <button onClick={() => clearFilter(key)} className="text-blue-700 hover:text-red-500">✕</button>
        </div>
      ))}
      <button
        onClick={() => router.push('/admin/products')}
        className="text-sm underline text-blue-600 hover:text-blue-800 ml-2"
      >
        Clear all
      </button>
    </div>
  );
}
