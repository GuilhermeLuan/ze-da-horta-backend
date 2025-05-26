import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { User } from '../user/entities/user.entity';
import { Store } from './entities/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
