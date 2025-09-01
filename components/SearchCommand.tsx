'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

import { Button } from './ui/button';

export const SearchCommand = ({
  renderAs = 'button',
  label = 'Add Stock',
  initialStocks,
}: SearchCommandProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  // Cmd/Ctrl + K toggles dialog
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelectStock = () => {
    console.log("Select stock")
  };

  return (
    <>
      {renderAs === 'text' ? (
        <span onClick={() => setOpen(true)} className='search-text '>
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className='search-btn'>
          {label}
        </Button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className='search-dialog'
      >
        <div className='search-field'>
          <CommandInput
            placeholder='Search by symbol or company name'
            value={searchTerm}
            onValueChange={setSearchTerm}
            className='search-input'
          />
          {loading && <Loader2 className='search-loader' />}
        </div>

        <CommandList className='search-list'>
          {loading ? (
            <CommandEmpty className='search-list-empty'>
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className='search-list-indicator'>
              {isSearchMode
                ? `No results found for "${searchTerm}"`
                : 'No stocks available'}
            </div>
          ) : (
            <CommandGroup className='!px-0'>
              <div className='search-count'>
                {isSearchMode ? 'Search Results' : 'Popular Stocks'} (
                {displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                <CommandItem key={stock.symbol + i} className='search-item'>
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className='search-item-link'
                  >
                    <TrendingUp className='h-4 w-4 text-gray-500' />
                    <div className='flex-1'>
                      <div className='search-item-name'>
                        {stock.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {stock.symbol} • {stock.exchange} • {stock.type}
                      </div>
                    </div>
                    Watchlist
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
