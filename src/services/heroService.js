export default class HeroService {
  constructor({
    heroRepository
  }) {
    this.heroRepository = heroRepository
  }

  find() {
    return this.heroRepository.find()
  }

  create(data) {
    return this.heroRepository.create(data)
  }

  update(data) {
    return this.heroRepository.update(data)
  }

  delete(id) {
    return this.heroRepository.delete(id)
  }
}