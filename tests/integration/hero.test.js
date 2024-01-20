
import test from "node:test"
import assert from "node:assert"
import { promisify } from "node:util"

import {
  readFile,
} from "node:fs/promises"

import {
  join,
  dirname
} from "node:path"

import {
  fileURLToPath
} from "node:url"


test('Hero Integration Test Suite', async (t) => {
  const testPort = 9009

  process.env.PORT = testPort

  const { server } = await import('../../src/index.js')
  const testServerAdress = `http://localhost:${testPort}/heroes`

  await t.test('it should create a hero', async (t) => {
    const data = {
      name: "Batman",
      age: 50,
      power: "rich"
    }

    const request = await fetch(testServerAdress, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    assert.deepStrictEqual(
      request.headers.get('content-type'),
      'application/json'
    )

    assert.strictEqual(
      request.status, 201
    )

    const result = await request.json()
    assert.deepStrictEqual(
      result.success,
      'User created with sucess',
      'it should return a  valid text message'
    )

    assert.ok(
      result.id.length > 30,
      'id should be a valid uuid'
    )
  })
  
  await t.test('it should retrieve all heroes', async (t) => {
    const currentDir = dirname(
      fileURLToPath(
        import.meta.url
      )
    )
    
    const filePath = join(currentDir, './../../database/','data.json')

    const data = JSON.parse(await readFile(filePath))
    
    const request = await fetch(testServerAdress, {
      method: 'GET'
    }) 

    assert.strictEqual(
      request.status, 200
    )
    
    const { results } = await request.json()
    assert.deepStrictEqual(
      results,
      data,
      'it should return the correct data'
    )
    
  })

  await t.test('it should update a hero', async (t) => {
    const auxData = {
      name:"Aux",
      age:20,
      power:"help"
    }

    const auxRequest = await fetch(testServerAdress, {
      method: 'POST',
      body: JSON.stringify(auxData)
    })

    const auxItem = await auxRequest.json()
    
    const data = {
      id: auxItem.id,
      name:"Daniel",
      age:20,
      power:"patience"
    }

    const request = await fetch(testServerAdress, {
      method: 'PUT',
      body: JSON.stringify(data)
    })

    assert.deepStrictEqual(
      request.headers.get('content-type'),
      'application/json'
    )

    assert.strictEqual(
      request.status,
      200
    )

    const result = await request.json()
    assert.deepStrictEqual(
      result.hero,
      data,
      'it should return the hero updated'
      )
      
    assert.deepStrictEqual(
      result.success,
      'Hero updated successfully',
      'it should return a valid text message'
    )
  })

  await t.test('it should delete a hero', async (t) => {
    const auxData = {
      "id":"17ca00e3-9916-4aea-b582-432f30a29770","name":"Daniel","age":50,"power":"rich"
    }

    const auxRequest = await fetch(testServerAdress, {
      method: 'POST',
      body: JSON.stringify(auxData)
    })

    const auxItem = await auxRequest.json()

    const request = await fetch(testServerAdress, {
      method: 'DELETE',
      body: JSON.stringify({ id: auxItem.id })
    })

    assert.deepStrictEqual(
      request.headers.get('content-type'),
      'application/json'
    )

    assert.strictEqual(
      request.status,
      200
    )

    const result = await request.json()
    assert.deepStrictEqual(
      result.success,
      'Hero deleted successfully',
      'it should return a valid text message'
    )
  })

  await t.test('it should throw a error', async (t) => {
    const request = await fetch(testServerAdress, {
      method: 'POST',
      body: {}
    })
  })

  await promisify(server.close.bind(server))()
})
