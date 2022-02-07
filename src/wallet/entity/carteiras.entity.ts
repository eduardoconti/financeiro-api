import { Despesas } from '@despesas/entity';
import { ApiProperty } from '@nestjs/swagger';
import { Receitas } from '@receitas/entity';
import { Transferencias } from '@transference/entity';
import { Users } from '@users/entity';
import { Exclude } from 'class-transformer';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity({ schema: 'public', name: 'carteiras' })
export class Carteiras {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column('text', { nullable: false })
  descricao!: string;

  @Exclude()
  @Column({
    type: 'uuid',
    nullable: false,
    name: 'user_id',
  })
  userId!: string;

  @OneToMany(() => Despesas, (despesas) => despesas.carteira, {
    nullable: false,
  })
  carteira!: Despesas[];

  @OneToMany(() => Receitas, (receitas) => receitas.carteira, {
    nullable: false,
  })
  carteiraReceita!: Receitas[];

  @OneToMany(
    () => Transferencias,
    (transferencia) => transferencia.carteiraOrigem,
    { nullable: false },
  )
  transferenciaOrigem!: Transferencias[];

  @OneToMany(
    () => Transferencias,
    (transferencia) => transferencia.carteiraDestino,
    { nullable: false },
  )
  transferenciaDestino!: Transferencias[];

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Exclude()
  user!: Users;
}
