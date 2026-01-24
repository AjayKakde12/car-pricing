import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}
    public create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    public async findOne(id: number) {
        const user = await this.repo.findOneBy({id});
        if(!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    public async find(email: string) {
        return await this.repo.find({ where: { email } })
    }

    public async update(id: number, attrs: Partial<User>) {
        let user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('User not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    public async remove(id: number) {
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('User not found');
        }
        return this.repo.remove(user);
    }

}
