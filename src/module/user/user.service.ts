import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModels } from './models/user.model';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModels)
    private readonly userRepository: Repository<UserModels>,
  ) {}

  async create({
    name,
    subordinates,
    supervisor,
    dateJoin,
    type,
  }: CreateUserDto) {
    const user = this.userRepository.create({ name, dateJoin, type });
    const userEntity = new UserEntity(user);
    await this.setReletion(userEntity, subordinates, supervisor);

    return this.userRepository.save(userEntity);
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['subordinates', 'supervisor'],
    });
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subordinates', 'supervisor'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['subordinates', 'supervisor'],
    });
  }

  async remove(id: string) {
    await this.findOneById(id);
    await this.userRepository.delete(id);

    return;
  }
  async getAllUserSallary() {
    return await this.userRepository.sum('salary');
  }

  async setSubordinates(userId: string, subordinates: string[]) {
    const user = await this.findOneById(userId);
    const userEntity = new UserEntity(user);
    const subordinateEntities = await Promise.all(
      subordinates.map(async (subordinateId) => {
        return await this.findOneById(subordinateId);
      }),
    );

    try {
      userEntity.setSubordinates(subordinateEntities);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
    Object.assign(user, userEntity);

    return this.userRepository.save(user);
  }

  async setSupervisor(userId: string, supervisors: string[]) {
    const user = await this.findOneById(userId);
    const userEntity = new UserEntity(user);
    const supervisorEntities = await Promise.all(
      supervisors.map(async (supervisorId) => {
        return await this.findOneById(supervisorId);
      }),
    );

    try {
      userEntity.setSupervisor(supervisorEntities);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
    Object.assign(user, userEntity);
    if (!user.subordinates.length) user.subordinates = undefined;
    console.log(user);
    return this.userRepository.save(user);
  }

  private async setReletion(
    userEntity: UserEntity,
    subordinates: string[],
    supervisor: string[],
  ) {
    if (subordinates) {
      const findSubordinates = await Promise.all(
        subordinates.map(async (subordinate) => {
          const subordinateEntity = await this.findOneById(subordinate);
          return subordinateEntity;
        }),
      );
      try {
        userEntity.setSubordinates(findSubordinates);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
    if (supervisor) {
      const findSupervisor = await Promise.all(
        supervisor.map(async (supervisor) => {
          const supervisorEntity = await this.findOneById(supervisor);
          return supervisorEntity;
        }),
      );
      try {
        userEntity.setSupervisor(findSupervisor);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
