import configPromise from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = (req: Request, context: any) => REST_GET(configPromise)(req, context)
export const POST = (req: Request, context: any) => REST_POST(configPromise)(req, context)
export const DELETE = (req: Request, context: any) => REST_DELETE(configPromise)(req, context)
export const PATCH = (req: Request, context: any) => REST_PATCH(configPromise)(req, context)
export const OPTIONS = (req: Request, context: any) => REST_OPTIONS(configPromise)(req, context)

