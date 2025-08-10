import { useState, useMemo, useCallback } from 'react';
import { Home, Activity, Store, Search } from 'lucide-react';
import { ISearchResult, IUseSearchReturn } from '../interfaces/ISearch';

interface UseSearchProps {
  onNavigateHome?: () => void;
  onClose?: () => void;
}

export const useSearch = ({ onNavigateHome, onClose }: UseSearchProps = {}): IUseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const searchResults: ISearchResult[] = useMemo(() => [
    {
      id: '1',
      title: 'Home',
      description: 'Navigate to the main dashboard',
      icon: <Home size={16} />,
      action: () => {
        onNavigateHome?.();
        onClose?.();
        console.log('Navigate to Home');
      }
    },
    {
      id: '2',
      title: 'Diagnostics',
      description: 'View diagnostic tools and reports',
      icon: <Activity size={16} />,
      action: () => {
        onClose?.();
        console.log('Diagnostics clicked');
      }
    },
    {
      id: '3',
      title: 'Marketplace',
      description: 'Browse available diagnostic tools',
      icon: <Store size={16} />,
      action: () => {
        onClose?.();
        console.log('Marketplace clicked');
      }
    },
    {
      id: '4',
      title: 'Search',
      description: 'Search for anything in DiagnoAI',
      icon: <Search size={16} />,
      action: () => {
        onClose?.();
        console.log('Search functionality');
      }
    }
  ], [onNavigateHome, onClose]);

  const filteredResults = useMemo(() => 
    searchResults.filter(
      result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchResults, searchQuery]
  );

  const handleSelectResult = useCallback((result: ISearchResult) => {
    result.action();
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedIndex(0);
    setHoveredIndex(null);
  }, []);

  return {
    searchResults,
    filteredResults,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    hoveredIndex,
    setHoveredIndex,
    handleSelectResult,
    resetSearch
  };
};
