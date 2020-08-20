import { Module, CacheModule } from '@nestjs/common';
import { ScriptsController } from './scripts.controller';
import { LoggerModule } from '../logger/logger.module';
import { GetCodeUseCaseSymbol } from 'src/domains/ports/in/get-code.use-case';
import { RepoAdapterService } from './repo-adapter.service';
import { RepoProxyService } from 'src/domains/services/repo-proxy.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 360,
      max: 30,
    }),
    LoggerModule,
  ],
  providers: [
    RepoAdapterService,
    {
      provide: GetCodeUseCaseSymbol,
      useFactory: (
        repoAdapterService: RepoAdapterService,
      ): RepoProxyService => {
        return new RepoProxyService(
          repoAdapterService,
          repoAdapterService,
          repoAdapterService,
          repoAdapterService,
        );
      },
      inject: [RepoAdapterService],
    },
  ],
  controllers: [ScriptsController],
  exports: [],
})
export class ScriptsModule {}
