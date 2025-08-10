export interface ISearchResult {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export interface ISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome?: () => void;
}

export interface IUseSearchReturn {
  searchResults: ISearchResult[];
  filteredResults: ISearchResult[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  handleSelectResult: (result: ISearchResult) => void;
  resetSearch: () => void;
}
