import { useState, useMemo, useCallback } from 'react';
import { Home, Activity, Store, Search, Settings, LogIn } from 'lucide-react';
import { ISearchResult, IUseSearchReturn } from '../interfaces/ISearch';
import { useTransition } from './use-transition';

interface UseSearchProps {
  onClose?: () => void;
}

export const useSearch = ({
  onClose,
}: UseSearchProps = {}): IUseSearchReturn => {
  const { navigateTo } = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const searchResults: ISearchResult[] = useMemo(
    () => [
      {
        id: '1',
        title: 'Home',
        description: 'Navigate to the main dashboard',
        icon: <Home size={16} />,
        action: () => {
          navigateTo('/');
          onClose?.();
          console.log('Navigate to Home');
        },
      },
      {
        id: '2',
        title: 'Diagnostics',
        description: 'View diagnostic tools and reports',
        icon: <Activity size={16} />,
        action: () => {
          navigateTo('/diagnostic');
          onClose?.();
          console.log('Diagnostics clicked');
        },
      },
      {
        id: '3',
        title: 'Marketplace',
        description: 'Browse available diagnostic tools',
        icon: <Store size={16} />,
        action: () => {
          navigateTo('/marketplace');
          onClose?.();
          console.log('Marketplace clicked');
        },
      },

      {
        id: '5',
        title: 'Settings',
        description: 'Configure application settings',
        icon: <Settings size={16} />,
        action: () => {
          onClose?.();
          console.log('Settings clicked');
        },
      },
    ],
    [navigateTo, onClose],
  );

  const filteredResults = useMemo(
    () =>
      searchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchResults, searchQuery],
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
    resetSearch,
  };
};
