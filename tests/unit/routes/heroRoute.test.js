import test from "node:test"
import assert from "node:assert"
import { randomUUID } from "node:crypto"
import { DEFAULT_HEADER } from './../../../src/util/util.js' 
import { createMockRequest } from './../../util/util.js'

const callTracker = new assert.CallTracker()
process.on('exit', () => callTracker.verify())

import {
  routes
} from './../../../src/routes/heroRoute.js'


test('Hero routes - endpoints test suite', async (t) => {
  await t.test('it should call /heroes:get route', async (t) => {
    const databaseMock = [{
      "id":"7f99724e-d7da-416f-821e-2d4697573d8d",
      "name":"Batman",
      "age":50,
      "power":"rich"
    }]

    const heroServiceStub= {
      find: async () => databaseMock
    }

    const endpoints = routes({
      heroService: heroServiceStub
    })
    
    const endpoint = '/heroes:get'
    const request = {}
    const response = {
      write: callTracker.calls(item => {
        const expected = JSON.stringify({
          results: databaseMock
        })
        assert.strictEqual(
          item,
          expected,
          'write should be called with the correct payload'
        )
      }),
      end: callTracker.calls(item => {
        assert.strictEqual(
          item, 
          undefined,
          'end sould be called without params'
        )
      })
    }
    const route = endpoints[endpoint]
    await route(request, response)
  })

  await t.test('it should call /heroes:post route', async (t)=> {
    const requestData = {
      "name": "Superman",
      "age": 35,
      "power": "super strength"
    }

    const idMock = randomUUID()

    const heroServiceStub = {
      create: async (hero) => idMock
    }
    
    const endpoints = routes({
      heroService: heroServiceStub
    })

    const endpoint = '/heroes:post'

    const response = {
      writeHead: callTracker.calls((status, header) => {
        assert.strictEqual(status, 201, 'it should be called with status 201.')
        assert.deepStrictEqual(header, DEFAULT_HEADER, 'it should be called with the correct request header.')
      }),
      write: callTracker.calls(item => {
        assert.deepStrictEqual(
          item, 
          JSON.stringify({id: idMock, success: 'User created with sucess'}), 
          'it should be called with the correct payload')
      }),
      end: callTracker.calls(item => {
        assert.strictEqual(
          item, 
          undefined,
          'end sould be called without params'
          )
        })
      }

      const route = endpoints[endpoint]
      await route(createMockRequest('POST', '/heroes', requestData), response)
    })

  await t.test('it should call /heroes:put route', async (t) => {
    const requestData = {
      id: randomUUID(),
      name: 'Node Test',
      age: 15,
      power: 'help me',
    }

    const expected = {hero: requestData, success: 'Hero updated successfully'}
    
    const heroServiceStub = {
      update: async (hero) => requestData        
    }

    const response = {
      writeHead: callTracker.calls((status, header) => {
        assert.strictEqual(
          status,
          200,
          'it should be called with status 200'
        ) 
        assert.deepStrictEqual(
          header,
          DEFAULT_HEADER,
          'it should be called with the correct request header'
        )
      }),

      write: callTracker.calls(item => {
        assert.deepStrictEqual(
          JSON.parse(item),
          expected,
          'it should be called with the correct payload'
        )
      }),

      end: callTracker.calls(item => {
        assert.strictEqual(
          item, 
          undefined,
          'end sould be called without params'
          )
      })
    }

    const endpoints = routes({
      heroService: heroServiceStub
    })
    const endpoint = '/heroes:put'
    const route = endpoints[endpoint]

    await route(createMockRequest('PUT', 'heroes', JSON.stringify(requestData)), response)
  })

  await t.test('it should call /heroes:delete route', async (t) => {
    const databaseMock = {
      id:"7f99724e-d7da-416f-821e-2d4697573d8d",
    }

    const heroServiceStub= {
      delete: async (id) => 'deleted'
    }

    const endpoints = routes({
      heroService: heroServiceStub
    })
  
    const endpoint = '/heroes:delete'
    
    const response = {
      writeHead: callTracker.calls((status, header) => {
        assert.strictEqual(
          status,
          200,
          'it should be called with status 200'
        ) 
        assert.deepStrictEqual(
          header,
          DEFAULT_HEADER,
          'it should be called with the correct request header'
        )
      }),

      write: callTracker.calls(item => {
        const expected = JSON.stringify({
          success: 'Hero deleted successfully'
        })
        assert.strictEqual(
          item,
          expected,
          'write should be called with the correct payload'
        )
      }),
      end: callTracker.calls(item => {
        assert.strictEqual(
          item, 
          undefined,
          'end sould be called without params'
        )
      })
    }
    const route = endpoints[endpoint]
    await route(createMockRequest('DELETE', '/heroes', JSON.stringify(databaseMock)), response)
  })
})
