import test from "node:test"
import assert from "node:assert"
import {
  join,
  dirname
} from "node:path"
import {
  fileURLToPath
} from "node:url"
import HeroRepository  from './../../../src/repositories/heroRepository.js'
import { prepareDataMockFile } from "./../../util/util.js"


const currentDir = dirname(
  fileURLToPath(
    import.meta.url
  )
) 
const filePath = join(currentDir, './../../util','data.json')  

test('Hero repositories - data operations test suite', async (t) => {
    await t.test('it should call .find() function', async (t) => {
      const dataMock =  
      [
        {
          id: 1,
          name: "Stark",
          age: "30",
          power: "genious"
        },
        {
          id: 2,
          name: "Batman",
          age: "40",
          power: "rich"
        }
      ]       
      
      await prepareDataMockFile(
        dataMock,
        filePath
      )
              
      const repository = new HeroRepository({ file: filePath })
      assert.deepStrictEqual(
        await repository.find(),
        dataMock,
        'it should return a valid data'
      )
    })

    await t.test('it should call .create(data) function', async (t) => {
      const dataMock = {
        id: 9999,
        name: 'Ghost Rider',
        age: 'infinity',
        power: 'cool motorcycle'
      }

      const heroRepository = new HeroRepository({file: filePath})
      assert.deepStrictEqual(
        await heroRepository.create(dataMock),
        dataMock.id
      )
    })
    
    await t.test('it should call .update(data) function', async (t) => {
      const dataMock = {
        id: 9999,
        name: 'Joker',
        age: '?',
        power: 'medness'
      }

      const heroRepository = new HeroRepository({file: filePath})
      assert.deepStrictEqual(
        await heroRepository.update(dataMock),
        dataMock
      )
    })

    await t.test('it should call .delete(data) function', async (t) => {
      const dataMock = {
        id: 9999
      }

      const heroRepository = new HeroRepository({file: filePath})
      assert.deepStrictEqual(
        await heroRepository.delete(dataMock.id),
        'deleted'
      )
    })
})