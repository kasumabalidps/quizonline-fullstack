export function formatDate(dateString) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }
  
  return new Date(dateString).toLocaleDateString('id-ID', options)
}
