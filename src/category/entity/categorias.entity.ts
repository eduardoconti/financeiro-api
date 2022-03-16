import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Users } from 'src/users/entity/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Despesas } from '../../expense/entity/despesas.entity';

@Entity({ schema: 'public', name: 'categorias' })
export class Categorias {
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
  }: Omit<Categorias, 'id'> & { id?: number }): Categorias => {
    return new Categorias(descricao, userId, id);
  };
}
