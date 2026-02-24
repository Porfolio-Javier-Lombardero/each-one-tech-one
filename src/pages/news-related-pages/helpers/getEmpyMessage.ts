
  // 3. HELPER para mensajes de UI
  export const getEmptyMessage = (dateFilter: string, topic?:string): string => {
    if (topic === 'foundAtWeb') {
      return 'No articles found matching your search';
    }

    switch (dateFilter) {
      case 'today':
        return 'No articles published today yet';
      case 'yesterday':
        return 'No articles published yesterday';
      case 'lastWeek':
        return 'No older articles found';
      default:
        return 'No articles found';
    }
  };