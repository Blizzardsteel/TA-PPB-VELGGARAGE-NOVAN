export const formatPrice = (price) => {
  if (!price) return 'Hubungi distributor resmi';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const getImageFallback = (e) => {
  e.target.style.display = 'none';
  if (e.target.nextSibling) {
    e.target.nextSibling.style.display = 'flex';
  }
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getConstructionTypeLabel = (type) => {
  const labels = {
    monoblock: 'Monoblock',
    'multi-piece': 'Multi-Piece',
    forged: 'Forged',
    'flow-formed': 'Flow Formed',
    cast: 'Cast',
  };
  return labels[type] || type || 'Unknown';
};
