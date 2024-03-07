import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.eneity';
import { Permisson } from './entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Role,Permisson])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {

}
