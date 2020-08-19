import { Module, CacheModule } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsController } from './scripts.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 360,
      max: 30,
    }),
    LoggerModule,
  ],
  providers: [ScriptsService],
  controllers: [ScriptsController],
  exports: [],
})
export class ScriptsModule {}
