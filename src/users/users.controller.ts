import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto, SignInDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) {}
    @Post('/signup')
    public async createUser(@Body() body: CreateUserDto) {
        return await this.authService.singup(body.email, body.password);
    }

    @Post('/signin')
    public async signinUser(@Body() body: SignInDto) {
        return await this.authService.signin(body.email, body.password);
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
