import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../user/entities/enums/user-role';
import { Roles } from 'src/auth/roles.decorator';
import { GetUser } from '../auth/get-user.decoretor';

@ApiTags('Address')
@ApiBearerAuth()
@Controller('address')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CLIENT)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser('id') userId: string,
  ) {
    return this.addressService.create(createAddressDto, +userId);
  }

  @Get()
  findOne(@GetUser('id') userId: string) {
    return this.addressService.findOne(+userId);
  }

  @Patch()
  update(
    @GetUser('id') userId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(updateAddressDto, +userId);
  }

  @Delete()
  remove(@GetUser('id') userId: string) {
    return this.addressService.remove(+userId);
  }
}
