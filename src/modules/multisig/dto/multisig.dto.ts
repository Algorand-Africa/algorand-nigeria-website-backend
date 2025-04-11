import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class MultisigDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ isArray: true, type: String })
  members: string[];

  @ApiProperty()
  threshold: number;
}

export class CreateMultisigDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  members: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  threshold: number;
}

export class MultisigSessionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ isArray: true, type: String })
  members: string[];

  @ApiProperty()
  threshold: number;

  @ApiProperty()
  token: string;

  @ApiProperty({ isArray: true, type: String })
  txns: string[];

  @ApiProperty({ isArray: true, type: String })
  membersThatSigned: string[];

  @ApiProperty()
  minimumSignatures: number;
}

export class CreateMultisigSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNumber()
  minimumSignatures: number;
}

export class UpdateMultisigSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  session: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  txn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}
