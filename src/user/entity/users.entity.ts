import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { Earning } from '@earning/entity';

import { Category } from '@category/entity';
import { SubCategory } from '@category/entity/sub-category.entity';

import { Carteiras } from '@wallet/entity';

import { Despesa } from '@expense/entity';

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

  @OneToMany(() => Despesa, despesas => despesas.user)
  userDespesa?: Despesa[];

  @OneToMany(() => Earning, receitas => receitas.user)
  userReceita?: Earning[];

  @OneToMany(() => Transferencias, transferencias => transferencias.user)
  userTransferencia?: Transferencias[];

  @OneToMany(() => Carteiras, carteiras => carteiras.user)
  userCarteiras?: Carteiras[];

  @OneToMany(() => Category, categorias => categorias.user)
  userCategorias?: Category[];

  @OneToMany(() => SubCategory, categorias => categorias.user)
  userSubCategories?: SubCategory[];

  constructor(partial: Partial<Users>) {
    Object.assign(this, partial);
  }

  static build(partial: Partial<Users>): Users {
    return new Users(partial);
  }
}
