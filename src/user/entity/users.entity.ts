import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Despesas } from 'src/expense/entity';
import { Transferencias } from 'src/transference/entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { Earning } from '@earning/entity';

import { Category } from '@category/entity';

import { Carteiras } from '@wallet/entity';

@Entity({ schema: 'public', name: 'users' })
export class Users {
  @PrimaryColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column('text', { nullable: false })
  @Exclude()
  password!: string;

  @Column('text', { nullable: false, unique: true })
  @Exclude()
  login!: string;

  @Column('text', { nullable: false })
  nome!: string;

  @Column('integer', { default: 1 })
  @Exclude()
  status!: number;

  @Column('integer', { default: 1 })
  @Exclude()
  perfil!: number;

  @OneToMany(() => Despesas, (despesas) => despesas.user)
  userDespesa?: Despesas[];

  @OneToMany(() => Earning, (receitas) => receitas.user)
  userReceita?: Earning[];

  @OneToMany(() => Transferencias, (transferencias) => transferencias.user)
  userTransferencia?: Transferencias[];

  @OneToMany(() => Carteiras, (carteiras) => carteiras.user)
  userCarteiras?: Carteiras[];

  @OneToMany(() => Category, (categorias) => categorias.user)
  userCategorias?: Category[];
}
