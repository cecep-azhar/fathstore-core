import type { StatsBlock } from '@fathstore/shared'

export const Stats_Block = ({ block }: { block: StatsBlock }) => {
  return (
    <section className="bg-white border-y border-gray-100 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {block.headline && (
             <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">{block.headline}</h2>
        )}
        <div className={`grid grid-cols-1 gap-8 sm:grid-cols-${Math.min(block.statItems.length, 3)} lg:grid-cols-${Math.min(block.statItems.length, 4)} text-center`}>
          {block.statItems.map((item, i) => (
            <div key={i} className="flex flex-col p-8 bg-gray-50 rounded-3xl hover:bg-amber-50 transition-colors cursor-default border border-transparent hover:border-amber-100">
              <dt className="order-2 mt-2 leading-6 font-bold text-gray-600 uppercase tracking-wider text-sm">
                {item.label}
              </dt>
              <dd className="order-1 text-5xl font-black text-amber-600 mb-2">
                {item.value}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
