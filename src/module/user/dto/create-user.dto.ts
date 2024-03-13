import { IsString, IsDate, IsEnum, IsArray, IsOptional } from 'class-validator';
import { UserType } from '../enums/type-user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dateJoin: Date;

  @ApiProperty()
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  subordinates: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  supervisor: string[];
}
