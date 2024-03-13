import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserReletionSupervisor {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  supervisor: string[];
}
