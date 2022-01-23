import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Users } from 'src/users/entity/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Despesas } from '../../despesas/entity/despesas.entity';

@Entity({ schema: 'public', name: 'categorias' })
export class Categorias {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  @IsNumber()
  id: number;

  @Column('text', { nullable: false })
  @IsString()
  descricao: string;

  @OneToMany(() => Despesas, (despesas) => despesas.categoria, {
    nullable: false,
  })
  @IsArray()
  categoria: Despesas[];

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @Exclude()
  user: Users;
}
