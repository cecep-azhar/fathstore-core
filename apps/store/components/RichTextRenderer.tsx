import React from 'react'

// Simple Lexical renderer (recursive)
const serialize = (node: any): React.ReactNode => {
    if (!node) return null
    if (Array.isArray(node)) {
         return node.map((n, i) => <React.Fragment key={i}>{serialize(n)}</React.Fragment>)
    }
    
    // Text node
    if (node.text !== undefined) {
        let text =  <span key={Math.random()}>{node.text}</span>
        // Bitmask: 1=bold, 2=italic, 8=underline
        if (node.format & 1) text = <strong key={Math.random()}>{text}</strong>
        if (node.format & 2) text = <em key={Math.random()}>{text}</em>
        if (node.format & 8) text = <u key={Math.random()}>{text}</u>
        return text
    }

    if (!node.children) return null

    const children = node.children.map((n: any, i: number) => <React.Fragment key={i}>{serialize(n)}</React.Fragment>)

    switch (node.type) {
        case 'heading': 
             const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag) ? node.tag : 'h1') as any
             return <Tag className="font-bold mb-4 mt-6 text-gray-900">{children}</Tag>
        case 'paragraph': return <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>
        case 'list': 
             return node.listType === 'number' 
                ? <ol className="list-decimal pl-5 mb-4 space-y-1 text-gray-600">{children}</ol>
                : <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-600">{children}</ul>
        case 'listitem': return <li>{children}</li>
        case 'link': 
             return <a href={node.fields?.url || '#'} className="text-emerald-700 hover:underline">{children}</a>
        default: return <div key={Math.random()}>{children}</div>
    }
}

export const RichTextRenderer = ({ content }: { content: any }) => {
  if (!content || !content.root) return null
  return (
    <div className="prose prose-emerald max-w-none">
      {serialize(content.root)}
    </div>
  )
}
