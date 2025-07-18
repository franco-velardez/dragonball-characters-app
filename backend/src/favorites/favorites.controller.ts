import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { API_FAVORITES, API_FAVORITES_TOGGLE } from 'shared'

@Controller(API_FAVORITES)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@Query('sessionId') sessionId: string) {
    try {
      return await this.favoritesService.getFavorites(sessionId)
    } catch (error) {
      console.log(error)
      return []
    }
  }

  @Post(API_FAVORITES_TOGGLE)
  async toggleFavorite(
    @Body('sessionId') sessionId: string,
    @Body('characterId') characterId: number
  ) {
    try {
      return await this.favoritesService.toggleFavorite(sessionId, characterId)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'An unknown error occurred' }
    }
  }
}
