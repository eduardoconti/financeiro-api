import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Despesas } from 'src/expense/entity/despesas.entity';
import { Transferencias } from 'src/transferencias/entity/transferencias.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Receitas } from '@earning/entity/receitas.entity';
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
