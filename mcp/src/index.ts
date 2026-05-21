#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createWisdomServer } from './server.js'

const server = createWisdomServer()
const transport = new StdioServerTransport()

await server.connect(transport)
