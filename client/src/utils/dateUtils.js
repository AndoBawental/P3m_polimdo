// src/utils/dateUtils.js

export const formatDate = (dateString, locale = 'id-ID', options) => {
  if (!dateString) return '-';

  try {
    const defaultOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    return new Date(dateString).toLocaleDateString(locale, options || defaultOptions);
  } catch (error) {
    return '-';
  }
};

export const formatDateNumeric = (dateString) => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return '-';
  }
};
