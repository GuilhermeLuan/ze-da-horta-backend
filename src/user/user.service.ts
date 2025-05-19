import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/auth.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role';
import { ClientProfile } from './entities/client-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: RegisterDto): Promise<User> {
    const newUser = new User();
    newUser.name = dto.name;
    newUser.email = dto.email;
    newUser.password = dto.password;
    newUser.role = dto.role;

    if (dto.role == UserRole.CLIENT) {
      console.log('Creating a client profile');
      const clientProfile = new ClientProfile();

      if (dto.cpf) {
        clientProfile.cpf = dto.cpf;
      }

      newUser.clientProfile = clientProfile;
    }

    const userToSave = this.userRepository.create(newUser);
    return this.userRepository.save(userToSave);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
