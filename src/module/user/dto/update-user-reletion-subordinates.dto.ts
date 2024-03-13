import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserReletionSubordinates {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  subordinates: string[];
}
