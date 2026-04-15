function Spinner({ color, size = 'medium' }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };
  
  return (
    <div 
      className={`animate-spin rounded-full border-4 border-transparent border-t-current ${sizeClasses[size] || sizeClasses.medium}`}
      style={{ color: color || '#1976d2' }}
    />
  );
}

export default Spinner;