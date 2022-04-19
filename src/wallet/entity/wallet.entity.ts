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

import { Earning } from '@earning/entity/earning.entity';

import { Users } from '@users/entity/users.entity';

import { Despesas } from '@expense/entity/expense.entity';

import { Transferencias } from '@transference/entity';
@Entity({ schema: 'public', name: 'carteiras' })
export class Carteiras {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id?: number;

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
  carteira?: Despesas[];

  @OneToMany(() => Earning, (receitas) => receitas.carteira, {
    nullable: false,
  })
  carteiraReceita?: Earning[];

  @OneToMany(
    () => Transferencias,
    (transferencia) => transferencia.carteiraOrigem,
    { nullable: false },
  )
  transferenciaOrigem?: Transferencias[];

  @OneToMany(
    () => Transferencias,
    (transferencia) => transferencia.carteiraDestino,
    { nullable: false },
  )
  transferenciaDestino?: Transferencias[];

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Exclude()
  user?: Users;
}
