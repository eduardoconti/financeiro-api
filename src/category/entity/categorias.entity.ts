import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Users } from '@users/entity';

import { Despesas } from '../../expense/entity/expense.entity';

@Entity({ schema: 'public', name: 'categorias' })
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'user_id',
  })
  @Exclude()
  userId!: string;

  @Column('text', { nullable: false })
  descricao!: string;

  @OneToMany(() => Despesas, (despesas) => despesas.categoria, {
    nullable: false,
  })
  categoria?: Despesas[];

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Exclude()
  user?: Users;

  private constructor(descricao: string, userId: string, id?: number) {
    this.descricao = descricao;
    this.userId = userId;
    this.id = id;
  }

  static build = ({
    descricao,
    userId,
    id,
  }: Omit<Category, 'id'> & { id?: number }): Category => {
    return new Category(descricao, userId, id);
  };
}
