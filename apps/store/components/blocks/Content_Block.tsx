import type { ContentBlock } from '@fathstore/shared'
import Image from 'next/image'
import React from 'react'
import { getMediaUrl } from '@/lib/utils'

// Simple Lexical renderer (recursive)
const serialize = (node: any): React.ReactNode => {
    if (!node) return null
    
    // Text node
    if (node.text !== undefined) {
        let text =  <span key={Math.random()}>{node.text}</span>
        // Bitmask formats: 1=bold, 2=italic, 8=underline, etc. (simplified)
        if (node.format & 1) text = <strong key={Math.random()}>{text}</strong>
        if (node.format & 2) text = <em key={Math.random()}>{text}</em>
        if (node.format & 8) text = <u key={Math.random()}>{text}</u>
        return text
    }

    if (!node.children) return null

    const children = node.children.map((n: any, i: number) => <React.Fragment key={i}>{serialize(n)}</React.Fragment>)

    switch (node.type) {
        case 'heading': 
             const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag) ? node.tag : 'h1') as keyof JSX.IntrinsicElements
             const sizes = { h1: 'text-4xl', h2: 'text-3xl', h3: 'text-2xl', h4: 'text-xl', h5: 'text-lg', h6: 'text-base' }
             return <Tag className={`${sizes[node.tag as keyof typeof sizes] || 'text-2xl'} font-bold mb-4 text-gray-900`}>{children}</Tag>
        case 'paragraph': return <p className="mb-4 text-gray-700 leading-relaxed text-lg">{children}</p>
        case 'list': 
             return node.listType === 'number' 
                ? <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>
                : <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>
        case 'listitem': return <li>{children}</li>
        case 'link': 
             return <a href={node.fields?.url || '#'} className="text-amber-600 hover:underline font-medium">{children}</a>
        default: return <div key={Math.random()}>{children}</div>
    }
}


export const Content_Block = ({ block }: { block: ContentBlock }) => {
  const content = serialize(block.richText?.root)
  const imageUrl = getMediaUrl(block.sideImage)

  const isSplit = block.layout === 'splitLeft' || block.layout === 'splitRight'
  const isLeft = block.layout === 'splitLeft'

  if (!isSplit) {
    return (
        <section className="py-24 px-6 max-w-4xl mx-auto">
            <div className="prose prose-lg prose-amber max-w-none">
                {content}
            </div>
        </section>
    )
  }

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center`}>
             <div className={`order-2 ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                 <div className="prose prose-xl prose-amber">
                    {content}
                 </div>
             </div>
             <div className={`order-1 ${isLeft ? 'lg:order-1' : 'lg:order-2'} relative`}>
                {imageUrl ? (
                     <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <Image src={imageUrl} alt="Content Image" fill className="object-cover" />
                     </div>
                ) : (
                    <div className="aspect-[4/3] bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
             </div>
        </div>
    </section>
  )
}
