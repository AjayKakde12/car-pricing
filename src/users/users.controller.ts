import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
    constructor(private readonly userService: UsersService) {}
    @Post('/signup')
    public createUser(@Body() body: CreateUserDto) {
        this.userService.create(body.email, body.password);
    }

    @Get('/user/:id')
    public async findUser(@Param('id') id: string) {
        return await this.userService.findOne(parseInt(id));
    }

    @Get('/users')
    public async findAllUsers(@Query('email') email: string) {
        return await this.userService.find(email);
    }

    @Delete('/user/:id')
    public async removeUser(@Param('id') id: string) {
        return await this.userService.remove(parseInt(id));
    }

    @Patch('/user/:id')
    public async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return await this.userService.update(parseInt(id), body)
    }

}
