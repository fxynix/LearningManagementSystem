export const formatDateTime = (isoString: string): string => {
    if (!isoString) return '—';
    const date = new Date(isoString + (isoString.includes('Z') || isoString.includes('+') ? '' : 'Z'));
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(',', '');
};