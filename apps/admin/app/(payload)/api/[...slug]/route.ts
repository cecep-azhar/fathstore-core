import configPromise from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = (req, context) => REST_GET(configPromise)(req, context)
export const POST = (req, context) => REST_POST(configPromise)(req, context)
export const DELETE = (req, context) => REST_DELETE(configPromise)(req, context)
export const PATCH = (req, context) => REST_PATCH(configPromise)(req, context)
export const OPTIONS = (req, context) => REST_OPTIONS(configPromise)(req, context)
