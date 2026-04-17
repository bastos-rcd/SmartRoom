import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Request } from "./request.entity";

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async findAll(): Promise<Request[]> {
    return this.requestRepository.find();
  }

  async findOne(id: number): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { id },
    });
    if (!request) {
      throw new Error("Request not found");
    }
    return request;
  }

  async create(request: Request): Promise<Request> {
    const newRequest = await this.requestRepository.create(request);
    return await this.requestRepository.save(newRequest);
  }

  async update(request: Request): Promise<Request> {
    const existingRequest = await this.requestRepository.findOne({
      where: { id: request.id },
    });
    if (!existingRequest) {
      throw new Error("Request not found");
    }
    if (
      existingRequest.type === request.type &&
      existingRequest.description === request.description &&
      existingRequest.status === request.status &&
      existingRequest.userId === request.userId
    ) {
      throw new Error("No changes detected");
    }
    request.type = request.type;
    request.description = request.description;
    request.status = request.status;
    request.creationDate = request.creationDate;
    request.userId = request.userId;
    return await this.requestRepository.save(request);
  }

  async delete(id: number): Promise<void> {
    const existingRequest = await this.requestRepository.findOne({
      where: { id },
    });
    if (!existingRequest) {
      throw new Error("Request not found");
    }
    await this.requestRepository.delete(id);
  }
}
