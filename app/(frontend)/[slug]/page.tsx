import { getPage } from '@/lib/store-payload'
import { RichTextRenderer } from '@/components/store/RichTextRenderer'
import { BRAND } from '@/config/brand'
import { FileEdit, ShieldAlert } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPage(slug)
  if (page) {
    return {
      title: `${page.title} - ${BRAND.name}`,
    }
  }
  return {
    title: `Halaman ${slug} - ${BRAND.name}`,
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPage(slug)

  // Jika halaman ada di Payload CMS, tampilkan konten dari CMS
  if (page) {
    // Mengekstrak konten dari block layout
    const heroBlock = page.layout?.find((b: any) => b.blockType === 'hero')
    const contentBlock = page.layout?.find((b: any) => b.blockType === 'content')

    return (
      <div className="bg-white min-h-screen">
        {heroBlock && (
          <div className="bg-gray-50 border-b border-gray-100 py-20 text-center px-6">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              {heroBlock.headline || page.title}
            </h1>
            {heroBlock.subheadline && (
              <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                {heroBlock.subheadline}
              </p>
            )}
          </div>
        )}
        
        {!heroBlock && (
           <div className="bg-gray-50 border-b border-gray-100 py-16 text-center px-6">
             <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
               {page.title}
             </h1>
           </div>
        )}

        <div className="max-w-4xl mx-auto px-6 py-16 lg:px-8 prose prose-lg prose-amber">
          {contentBlock && contentBlock.richText ? (
            <RichTextRenderer content={contentBlock.richText} />
          ) : (
            <p className="text-gray-500 text-center italic">Konten halaman sedang diperbarui.</p>
          )}
        </div>
      </div>
    )
  }

  // JIKA HALAMAN TIDAK ADA DI CMS, TAMPILKAN DUMMY/PLACEHOLDER (SESUAI REQUEST USER)
  const formatTitle = (slug: string) => slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-amber-50 border-b border-amber-100 py-24 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-black text-amber-900 mb-4 tracking-tight">
          {formatTitle(slug)}
        </h1>
        <p className="text-amber-800/70 max-w-2xl mx-auto text-lg leading-relaxed">
          Ini adalah halaman template sementara (dummy).
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 lg:px-8 text-center space-y-8">
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 shadow-sm text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
            <div className="w-20 h-20 mb-6 rounded-full bg-amber-50 flex items-center justify-center">
                <FileEdit className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Halaman Belum Dibuat di Admin</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                Anda melihat halaman dummy karena CMS belum memiliki data untuk URL slug <code className="bg-gray-100 px-2 py-1 rounded text-red-500 font-mono">/{slug}</code>.
                Untuk mengubah teks ini, silakan buat halaman baru di halaman Admin Area.
            </p>
            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl flex items-start text-left gap-3 w-full border border-blue-100">
                <ShieldAlert className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                   <p className="font-bold mb-1">Cara Mengupdate Konten Ini:</p>
                   <ol className="list-decimal pl-4 space-y-1 text-blue-700/80">
                       <li>Login ke <a href="/admin" className="underline font-semibold hover:text-blue-900">Admin Area</a>.</li>
                       <li>Buka menu <strong>Pages</strong> (Halaman).</li>
                       <li>Buat Halaman Baru dengan slug: <strong className="font-mono bg-blue-100 px-1">{slug}</strong></li>
                       <li>Isi layout (Hero & Text) lalu pilih Publish.</li>
                   </ol>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
