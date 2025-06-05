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
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { GetUser } from '../auth/get-user.decoretor';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/enums/user-role';

@ApiTags('Favorites')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(CreateFavoriteDto, UpdateFavoriteDto)
@Controller('favorites')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CLIENT)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  addFavorite(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @GetUser('id') userId: string,
  ) {
    console.log(userId);
    return this.favoritesService.addFavorite(createFavoriteDto, +userId);
  }

  @Get()
  getUserFavoriteProducts(@GetUser('id') userId: string) {
    return this.favoritesService.getUserFavoriteProducts(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return this.favoritesService.update(+id, updateFavoriteDto);
  }

  @Delete(':id')
  remove(@Param('id') favoriteId: string) {
    return this.favoritesService.removeFavorite(+favoriteId);
  }
}
