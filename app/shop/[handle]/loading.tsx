export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-rice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-48 bg-ink/5 rounded-sm animate-pulse mb-8" />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div className="aspect-square bg-ink/5 rounded-lg animate-pulse" />

          {/* Info skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-20 bg-ink/5 rounded-sm animate-pulse" />
            <div className="h-10 w-3/4 bg-ink/5 rounded-sm animate-pulse" />
            <div className="h-4 w-40 bg-ink/5 rounded-sm animate-pulse" />
            <div className="h-8 w-24 bg-ink/5 rounded-sm animate-pulse" />
            <div className="h-24 bg-ink/5 rounded-sm animate-pulse" />
            <div className="h-32 bg-ink/5 rounded-sm animate-pulse" />
          </div>
        </div>

        {/* Detail tabs skeleton */}
        <div className="mt-12">
          <div className="h-10 w-full bg-ink/5 rounded-sm animate-pulse mb-6" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 w-full bg-ink/5 rounded-sm animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
