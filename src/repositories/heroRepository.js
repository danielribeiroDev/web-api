import {
  readFile,
  writeFile
} from "node:fs/promises"


export default class HeroRepository {
  constructor({
    file
  }) {
    this.file = file
  }

  async #currentFileContent() {
    return JSON.parse(await readFile(this.file))
  }

  find() {
    return this.#currentFileContent()
  }
  
  async create(data) {
    const currentFile = await this.#currentFileContent()
    currentFile.push(data)

    await writeFile(
      this.file, JSON.stringify(currentFile)
    )

    return data.id
  }

  async update(data) {
    const currentFile = await this.#currentFileContent()
    const index = currentFile.findIndex(hero => hero.id === data.id)
    if(index !== -1) {
      currentFile[index] = data
      await writeFile(
        this.file, JSON.stringify(currentFile)
      )
      return data
    }
    else 
      return undefined
  }

  async delete(id) {
    const currentFile = await this.#currentFileContent()
    const index = currentFile.findIndex(hero => hero.id === id)
    if(index !== -1) {
      currentFile.splice(index, 1)
      await writeFile(
        this.file, JSON.stringify(currentFile)
      )
      return 'deleted'
    }
    else 
      return undefined
  }
}

