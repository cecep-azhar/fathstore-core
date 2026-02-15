import configPromise from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET, GRAPHQL_POST } from '@payloadcms/next/routes'

export const GET = (req: Request) => {
  return GRAPHQL_PLAYGROUND_GET(configPromise)(req)
}

export const POST = (req: Request) => {
  return GRAPHQL_POST(configPromise)(req)
}
