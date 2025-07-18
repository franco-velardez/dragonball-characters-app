import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CharactersModule } from './characters/characters.module'
import { FavoritesModule } from './favorites/favorites.module'

@Module({
  imports: [ConfigModule.forRoot(), CharactersModule, FavoritesModule],
})
export class AppModule {}
