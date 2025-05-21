import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/auth.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/enums/user-role';
import { ClientProfile } from './entities/client-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAuthDto } from '../auth/dto/update-auth.dto';
import { ProducerProfile } from './entities/producer-profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: RegisterDto): Promise<User> {
    await this.assertThatEmailAlreadyExists(dto.email);

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
        await this.assertThatCpfAlreadyExists(dto.cpf);
      }

      newUser.clientProfile = clientProfile;
    }

    if (dto.role == UserRole.PRODUCER) {
      console.log('Creating a producer profile');
      const producerProfile = new ProducerProfile();

      if (dto.cnpj) {
        await this.assertThatCnpjAlreadyExists(dto.cnpj);
        producerProfile.cnpj = dto.cnpj;
      }

      newUser.producerProfile = producerProfile;
    }

    const userToSave = this.userRepository.create(newUser);
    return this.userRepository.save(userToSave);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['clientProfile'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateAuthDto): Promise<User> {
    const userToUpdate = await this.findOne(id);
    Object.assign(userToUpdate, updateUserDto);

    return this.userRepository.save(userToUpdate);
  }

  async remove(id: number): Promise<void> {
    await this.assertThatUserExists(id);
    await this.userRepository.delete(id);
  }

  async assertThatUserExists(id: number): Promise<void> {
    await this.findOne(id);
  }

  async assertThatEmailAlreadyExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new NotFoundException(`User with email ${email} already exists`);
    }
  }

  async assertThatCpfAlreadyExists(cpf: string): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.clientProfile', 'clientProfile')
      .where('clientProfile.cpf = :cpf', { cpf })
      .getOne();

    if (user) {
      throw new NotFoundException(`User with CPF ${cpf} already exists`);
    }
  }

  async assertThatCnpjAlreadyExists(cnpj: string): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.producerProfile', 'producerProfile')
      .where('producerProfile.cnpj = :cnpj', { cnpj: cnpj })
      .getOne();

    if (user) {
      throw new NotFoundException(`User with CNPJ ${cnpj} already exists`);
    }
  }
}
