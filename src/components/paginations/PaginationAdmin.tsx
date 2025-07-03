import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

type Props = {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
};

export const PaginationAdmin = ({ page, setPage, totalPages }: Props) => {
    // handle page change
    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
  );
};
