import { Injectable, Logger } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name)

  constructor(private readonly supabase: SupabaseService) {}

  async getFavorites(sessionId: string): Promise<number[]> {
    try {
      const { data, error } = (await this.supabase
        .getClient()
        .from('public_favorites')
        .select('character_id')
        .eq('session_id', sessionId)) as {
        data: { character_id: number }[] | null
        error: Error
      }

      if (error) throw error
      return data?.map((item) => item.character_id) ?? []
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Failed to get favorites: ${errorMessage}`)
      return []
    }
  }

  async toggleFavorite(sessionId: string, characterId: number): Promise<boolean> {
    try {
      const { data: existing, error: queryError } = await this.supabase
        .getClient()
        .from('public_favorites')
        .select('*')
        .eq('session_id', sessionId)
        .eq('character_id', characterId)

      if (queryError) throw queryError

      const favoriteExists = existing && existing.length > 0

      if (favoriteExists) {
        // Remove favorite
        const { error: deleteError } = await this.supabase
          .getClient()
          .from('public_favorites')
          .delete()
          .eq('session_id', sessionId)
          .eq('character_id', characterId)

        if (deleteError) throw deleteError
        return false
      } else {
        // Add favorite
        const { error: insertError } = await this.supabase
          .getClient()
          .from('public_favorites')
          .insert({
            session_id: sessionId,
            character_id: characterId,
          })

        if (insertError) throw insertError
        return true
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? `Failed to toggle favorite: ${error.message}` : 'Unknown error'
      this.logger.error(errorMessage)
      throw error
    }
  }
}
