import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) {}

    public async singup(email: string, password: string) {
        const users = await this.userService.find(email);
        if(users.length) {
            throw new BadRequestException('Email in use');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const hashedPassword = salt + '.' + hash.toString('hex');
        
        const user = await this.userService.create(email, hashedPassword);
        return user;
    }

    public async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if(!user) {
            throw new BadRequestException('Invalid credentials');
        }
        
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Invalid credentials');
        }

        return user;
    }
}