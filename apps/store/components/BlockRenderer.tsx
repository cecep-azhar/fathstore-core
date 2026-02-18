import type { PageBlock } from '@fathstore/shared'
import { Hero_Block } from './blocks/Hero_Block'
import { Content_Block } from './blocks/Content_Block'
import { Stats_Block } from './blocks/Stats_Block'
import { FeaturedProducts_Block } from './blocks/FeaturedProducts_Block'

export const BlockRenderer = ({ blocks }: { blocks: PageBlock[] }) => {
  if (!blocks || !Array.isArray(blocks)) return null

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <Hero_Block key={index} block={block} />
          case 'content':
            return <Content_Block key={index} block={block} />
          case 'stats':
            return <Stats_Block key={index} block={block} />
          case 'featuredProducts':
            return <FeaturedProducts_Block key={index} block={block} />
          default:
            return <div key={index} className="p-4 bg-red-50 text-red-500 border border-red-200">Unknown block type: {block.blockType}</div>
        }
      })}
    </>
  )
}
