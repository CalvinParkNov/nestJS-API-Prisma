import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//access to every modules.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
