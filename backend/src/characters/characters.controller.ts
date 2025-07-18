import { Controller, Get, Param } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { API_CHARACTERS } from 'shared'

@Controller(API_CHARACTERS)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  async getAll() {
    return this.charactersService.getAll()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.charactersService.getById(parseInt(id))
  }
}
