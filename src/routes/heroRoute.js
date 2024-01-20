import { once } from "node:events"
import Hero from "../entities/hero.js"
import { DEFAULT_HEADER } from "../util/util.js"

const routes = ({
  heroService
}) => ({
  '/heroes:get': async (request, response) => {
    const heroes = await heroService.find()
    response.write(JSON.stringify({results: heroes}))
    response.end()
  },

  '/heroes:post': async (request, response) => {
    const data = await once(request, 'data')
    const item = JSON.parse(data)
    const hero = new Hero(item)
    const id = await heroService.create(hero)
    
    
    response.writeHead(201, DEFAULT_HEADER)
    response.write(JSON.stringify({
      id,
      success: 'User created with sucess',
    }))
    response.end()
  },
  
  '/heroes:put': async (request, response) => {
    const data = await once(request, 'data')
    const hero = JSON.parse(data)

    const result = await heroService.update(hero)
    if (result === undefined) {
      response.writeHead(404, DEFAULT_HEADER);
      response.write(JSON.stringify({ message: 'Hero not found' }));
    }
    else {
      response.writeHead(200, DEFAULT_HEADER);
      response.write(JSON.stringify({
        hero: result,
        success: 'Hero updated successfully' 
      }));
    }
    response.end()
  },

  '/heroes:delete': async (request, response) => {
    const data = await once(request, 'data')
    const { id } = JSON.parse(data)
    const result = await heroService.delete(id)
    if (result === undefined) {
      response.writeHead(200, DEFAULT_HEADER);
      response.write(JSON.stringify({ message: 'Hero not found' }));
    }
    else {
      response.writeHead(200, DEFAULT_HEADER);
      response.write(JSON.stringify({
        success: 'Hero deleted successfully' 
      }));
    }
    response.end()
  }
})

export {
  routes
}