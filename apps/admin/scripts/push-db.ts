// @ts-nocheck

import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  console.log('Connecting to Payload to push schema...')
  const payload = await getPayload({ config })
  console.log('Schema successfully pushed!')
  process.exit(0)
}
run()
