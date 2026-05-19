import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async create(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async update(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }
    if (
      existingUser.firstName === user.firstName &&
      existingUser.lastName === user.lastName &&
      existingUser.email === user.email &&
      existingUser.password === user.password &&
      existingUser.role === user.role &&
      existingUser.status === user.status
    ) {
      throw new Error("No changes detected");
    }
    user.firstName = user.firstName;
    user.lastName = user.lastName;
    user.email = user.email;
    user.password = user.password;
    user.role = user.role;
    user.status = user.status;
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }
    await this.userRepository.delete(id);
  }
}
