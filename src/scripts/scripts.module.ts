import { Module, CacheModule } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsController } from './scripts.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 360,
      max: 30,
    }),
  ],
  providers: [ScriptsService],
  controllers: [ScriptsController],
  exports: [],
})
export class ScriptsModule {}
