const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="w-full bg-gray-200 rounded-lg h-100 animate-pulse" 
        />
      ))}
    </div>
  );
};

export default ProductSkeleton;
