export function ProductCardSkeleton() {
  return (
    <div className="card-base animate-pulse">
      <div className="aspect-square bg-vg-dark" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-vg-border rounded w-1/3" />
        <div className="h-4 bg-vg-border rounded w-3/4" />
        <div className="h-3 bg-vg-border rounded w-1/2" />
        <div className="h-9 bg-vg-border rounded mt-4" />
      </div>
    </div>
  );
}

export function BrandCardSkeleton() {
  return (
    <div className="card-base p-6 animate-pulse space-y-3">
      <div className="w-16 h-16 bg-vg-border rounded" />
      <div className="h-5 bg-vg-border rounded w-1/2" />
      <div className="h-3 bg-vg-border rounded w-1/4" />
      <div className="space-y-2">
        <div className="h-3 bg-vg-border rounded" />
        <div className="h-3 bg-vg-border rounded w-5/6" />
        <div className="h-3 bg-vg-border rounded w-4/6" />
      </div>
      <div className="h-9 bg-vg-border rounded" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="aspect-square md:aspect-auto md:h-96 bg-vg-dark rounded-lg" />
      <div className="space-y-4">
        <div className="h-8 bg-vg-border rounded w-2/3" />
        <div className="h-4 bg-vg-border rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-vg-border rounded" />
          <div className="h-3 bg-vg-border rounded w-5/6" />
          <div className="h-3 bg-vg-border rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'product', count = 8 }) {
  const Skeleton = type === 'brand' ? BrandCardSkeleton : ProductCardSkeleton;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </>
  );
}
