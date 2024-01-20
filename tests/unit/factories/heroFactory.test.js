import test from "node:test"
import assert from "assert"

import { generateInstance } from "../../../src/factories/heroFactory.js"
import HeroService from "../../../src/services/heroService.js"

test('Hero factories - instance generate test suite', async (t) => {
    await t.test('it should return a valid HeroService object', async(t) => {
        const mockPath = '/'
        assert.ok(
            generateInstance(mockPath) instanceof HeroService
        )
    })
})