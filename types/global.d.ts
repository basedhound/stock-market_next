declare global {
  type SignInFormData = {
    email: string;
    password: string;
  };

  type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
    country: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
  };

  type CountrySelectProps = {
    name: string;
    label: string;
    control: Control;
    error?: FieldError;
    required?: boolean;
  };

  type FormInputProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister;
    error?: FieldError;
    validation?: RegisterOptions;
    disabled?: boolean;
    value?: string;
  };

  type Option = {
    value: string;
    label: string;
  };

  type SelectFieldProps = {
    name: string;
    label: string;
    placeholder: string;
    options: readonly Option[];
    control: Control;
    error?: FieldError;
    required?: boolean;
  };

  type FooterLinkProps = {
    text: string;
    linkText: string;
    href: string;
  };

  type SearchCommandProps = {
    renderAs?: 'button' | 'text';
    label?: string;
    initialStocks: StockWithWatchlistStatus[];
  };

  type WelcomeEmailData = {
    email: string;
    name: string;
    intro: string;
  };

  type User = {
    id: string;
    name: string;
    email: string;
  };

  type Stock = {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
  };

  type StockWithWatchlistStatus = Stock & {
    isInWatchlist: boolean;
  };

  type FinnhubSearchResult = {
    symbol: string;
    description: string;
    displaySymbol?: string;
    type: string;
    exchange: string;
  };

  type FinnhubSearchResponse = {
    count: number;
    result: FinnhubSearchResult[];
  };

  type StockDetailsPageProps = {
    params: Promise<{
      symbol: string;
    }>;
  };

  type WatchlistButtonProps = {
    symbol: string;
    company: string;
    isInWatchlist: boolean;
    showTrashIcon?: boolean;
    type?: 'button' | 'icon';
    onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
  };

  type QuoteData = {
    c?: number;
    dp?: number;
  };

  type ProfileData = {
    name?: string;
    marketCapitalization?: number;
  };

  type FinancialsData = {
    metric?: { [key: string]: number };
  };

  type SelectedStock = {
    symbol: string;
    company: string;
    currentPrice?: number;
  };

    type WatchlistTableProps = {
    watchlist: StockWithData[];
  };

  type StockWithData = {
    userId: string;
    symbol: string;
    company: string;
    addedAt: Date;
    currentPrice?: number;
    changePercent?: number;
    priceFormatted?: string;
    changeFormatted?: string;
    marketCap?: string;
    peRatio?: string;
  };

  type AlertsListProps = {
  stocks: Alert[];
}

  //
  type StockData = {
    symbol: string;
    company: string;
    price: string;
    change: string;
    marketCap: string;
    peRatio: string;
    eps: string;
    sentiment: string;
  };

  type PaginationInfo = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  type StocksResponse = {
    data: StockData[];
    pagination: PaginationInfo;
  };

  type MarketNewsArticle = {
    id: number;
    headline: string;
    summary: string;
    source: string;
    url: string;
    datetime: number;
    category: string;
    related: string;
    image: string;
  };

  type WatchlistNewsProps = {
    news?: MarketNewsArticle[]; 
  };

  type SearchCommandProps = {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    renderAs?: 'button' | 'text';
    buttonLabel?: string;
    buttonVariant?: 'primary' | 'secondary';
    className?: string;
  };

  type AlertFormData = {
    alertName: string;
    alertType: 'upper' | 'lower';
    condition: 'greater' | 'less';
    threshold: string;
  };

  type AlertData = {
    symbol: string;
    company: string;
    alertName: string;
    alertType: 'upper' | 'lower';
    threshold: string;
  };

  type AlertModalProps = {
    alertId?: string;
    initialData?: AlertData;
    action?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
  };

  type RecommendationData = {
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
    period: string;
    symbol: string;
  };

  type RawNewsArticle = {
    id: number;
    headline?: string;
    summary?: string;
    source?: string;
    url?: string;
    datetime?: number;
    image?: string;
    category?: string;
    related?: string;
  };

  type StockDetailsProps = {
    symbol: string | null;
    onClose: () => void;
    open: boolean;
  };

  type UserForNewsEmail = {
    id: string;
    email: string;
    name: string;
    country: string;
    investmentGoals?: string;
    riskTolerance?: string;
    preferredIndustry?: string;
  };

  type Alert = {
    id: string;
    symbol: string;
    company: string;
    alertName: string;
    currentPrice: number;
    alertType: 'upper' | 'lower' | 'volume';
    threshold: number;
    changePercent?: number;
    frequency: string;
  };
}

export {};
