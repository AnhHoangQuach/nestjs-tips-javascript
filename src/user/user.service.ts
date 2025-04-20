import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;

  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();

    const userFound = users.find(
      (user) => user.username === loginUserDto.username,
    );

    if (!userFound) {
      throw new BadRequestException('User not found');
    }

    if (userFound.password !== loginUserDto.password) {
      throw new BadRequestException('Invalid password');
    }

    return userFound;
  }

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();

    const userFound = users.find(
      (user) => user.username === registerUserDto.username,
    );

    if (userFound) {
      throw new BadRequestException('User already exists');
    }

    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;

    users.push(user);

    await this.dbService.write(users);
    return user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
