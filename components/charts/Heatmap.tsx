'use client';

import { HEATMAP_WIDGET_CONFIG } from '@/lib/constants';
import React, { useEffect, useRef, memo } from 'react';

const HeatmapComponent = () => {
  // Ref for the div where TradingView widget will be injected
  const container = useRef<HTMLDivElement | null>(null);

  // Ref to track if the script has already been loaded
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Stop if widget already loaded or container is not ready
    if (scriptLoaded.current || !container.current) return;

    const currentContainer = container.current;

    // Clear container first (prevents duplicates)
    currentContainer.innerHTML =
      '<div class="tradingview-widget-container__widget" style="width: 100%; height: 600px;"></div>';

    // Create the script element that loads TradingView widget
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.type = 'text/javascript';
    script.async = true;

    // Inject config directly as JSON (with dark mode + correct height)
    script.innerHTML = JSON.stringify(HEATMAP_WIDGET_CONFIG);

    currentContainer.appendChild(script); // add script to container
    scriptLoaded.current = true; // mark as loaded

    // Cleanup function runs when component unmounts
    return () => {
      if (currentContainer && scriptLoaded.current) {
        currentContainer.innerHTML =
          '<div class="tradingview-widget-container__widget" style="width: 100%; height: 600px;"></div>';
        scriptLoaded.current = false;
      }
    };
  }, []);

  return (
    <div className='w-full'>
      <h3 className='font-semibold text-2xl text-gray-100 mb-5'>
        Stock Heatmap
      </h3>

      {/* Container where the TradingView widget will render */}
      <div
        className='tradingview-widget-container custom-chart'
        ref={container}
      >
        <div
          className='tradingview-widget-container__widget'
          style={{ width: '100%', height: '600px' }}
        />
      </div>
    </div>
  );
};

// Memo to prevent unnecessary re-renders
export const Heatmap = memo(HeatmapComponent);