import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'
import { Character, FetchCharactersResponse } from 'shared-types'

@Injectable()
export class CharactersService {
  constructor(private readonly supabase: SupabaseService) {}

  private getSelectQuery() {
    return `
      id,
      name,
      description,
      image,
      transformations:character_transformations (
        id,
        name,
        description,
        ki,
        image
      )
    `
  }

  async getAll(): Promise<FetchCharactersResponse> {
    const { data, count, error } = await this.supabase
      .getClient()
      .from('characters')
      .select<ReturnType<typeof this.getSelectQuery>, Character>(this.getSelectQuery(), {
        count: 'exact',
      })

    if (error) {
      throw new Error(`Failed to fetch characters: ${error.message}`)
    }

    return {
      items: data || [],
      total: count || 0,
    }
  }

  async getById(id: number): Promise<Character | null> {
    const { data, error } = await this.supabase
      .getClient()
      .from('characters')
      .select<ReturnType<typeof this.getSelectQuery>, Character>(this.getSelectQuery())
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Failed to fetch character ${id}: `, error)
      return null
    }

    return data
  }
}
