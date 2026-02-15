import configPromise from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

const handler = (factory: any) => async (req: Request, context: any) => {
  const config = await configPromise
  return factory(config)(req, context)
}

export const GET = handler(REST_GET)
export const POST = handler(REST_POST)
export const DELETE = handler(REST_DELETE)
export const PATCH = handler(REST_PATCH)
export const OPTIONS = handler(REST_OPTIONS)
