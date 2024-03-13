import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserReletionSubordinates } from './dto/update-user-reletion-subordinates.dto';
import { UpdateUserReletionSupervisor } from './dto/update-user-reletion-supervisor.dto copy';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    if (user.subordinates) {
      for (const el of user.subordinates) {
        await this.userService.setSupervisor(el.id, [user.id]);
      }
    }
    if (user.supervisor) {
      for (const el of user.supervisor) {
        await this.userService.setSubordinates(el.id, [user.id]);
      }
    }

    return user;
  }

  @Post(':id/subordinates')
  async addSubordinate(
    @Param('id') managerId: string,
    @Body() { subordinates }: UpdateUserReletionSubordinates,
  ) {
    const user = await this.userService.setSubordinates(
      managerId,
      subordinates,
    );
    for (const el of subordinates) {
      await this.userService.setSupervisor(el, [user.id]);
    }
    return user;
  }

  @Post(':id/supervisor')
  async addSupervisor(
    @Param('id') managerId: string,
    @Body() { supervisor }: UpdateUserReletionSupervisor,
  ) {
    const user = await this.userService.setSupervisor(managerId, supervisor);
    for (const el of supervisor) {
      await this.userService.setSubordinates(el, [user.id]);
    }
    return user;
  }
  @Get('salary')
  async getAllUserSallary() {
    return await this.userService.getAllUserSallary();
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
