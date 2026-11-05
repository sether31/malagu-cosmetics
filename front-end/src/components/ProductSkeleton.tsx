interface ProductSkeletonProps {
  length?: number;
}

const ProductSkeleton = ({length = 8}: ProductSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: length }).map((_, i) => (
        <div 
          key={i} 
          className="w-full bg-gray-200 rounded-lg h-100 animate-pulse" 
        />
      ))}
    </div>
  );
};

export default ProductSkeleton;
