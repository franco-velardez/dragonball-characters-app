import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
  private client: SupabaseClient

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL')
    const key = this.configService.get<string>('SUPABASE_KEY')

    if (!url || !key) {
      throw new Error('Supabase credentials not configured')
    }

    this.client = createClient(url, key)
  }

  getClient() {
    return this.client
  }
}
