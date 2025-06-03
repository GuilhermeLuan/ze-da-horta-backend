import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
