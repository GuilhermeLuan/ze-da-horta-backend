import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly userService: UserService,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<Address> {
    const clientProfile = await this.userService.getClientProfile(userId);

    await this.assertThatAddressAlreadyExists(clientProfile.id);

    const createdAddress = this.addressRepository.create({
      ...createAddressDto,
      clientProfile,
    });
    return await this.addressRepository.save(createdAddress);
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }

  private async assertThatAddressAlreadyExists(userId: number): Promise<void> {
    const existingAddress = await this.addressRepository.findOne({
      where: { clientProfileId: userId },
    });

    if (existingAddress) {
      throw new ConflictException('Address already exists for this user');
    }
  }
}
