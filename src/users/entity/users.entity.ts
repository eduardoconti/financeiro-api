import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { Receitas } from '@receitas/entity';

import { Categorias } from '@categorias/entity';

import { Carteiras } from '@wallet/entity';

import { Despesas } from '@despesas/entity';

import { Transferencias } from '@transference/entity';

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
  userDespesa!: Despesas[];

  @OneToMany(() => Receitas, (receitas) => receitas.user)
  userReceita!: Receitas[];

  @OneToMany(() => Transferencias, (transferencias) => transferencias.user)
  userTransferencia!: Transferencias[];

  @OneToMany(() => Carteiras, (carteiras) => carteiras.user)
  userCarteiras!: Carteiras[];

  @OneToMany(() => Categorias, (categorias) => categorias.user)
  userCategorias!: Categorias[];
}
