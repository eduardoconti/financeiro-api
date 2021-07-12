import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Carteiras } from 'src/carteiras/entity/carteiras.entity';
import { Categorias } from 'src/categorias/entity/categorias.entity';
import { Despesas } from 'src/despesas/entity/despesas.entity';
import { Receitas } from 'src/receitas/entity/receitas.entity';
import { Transferencias } from 'src/transferencias/entity/transferencias.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity({ schema: 'public', name: 'users' })
export class Users {
  @PrimaryColumn('uuid')
  @ApiProperty()
  id: string;

  @Column('text', { nullable: false })
  @Exclude()
  password: string;

  @Column('text', { nullable: false, unique: true })
  @Exclude()
  login: string;

  @Column('text', { nullable: false })
  nome: string;

  @Column('integer', { default: 1 })
  @Exclude()
  status: number;

  @Column('integer', { default: 1 })
  @Exclude()
  perfil: number;

  @OneToMany(() => Despesas, (despesas) => despesas.user)
  userDespesa: Despesas[];

  @OneToMany(() => Receitas, (receitas) => receitas.user)
  userReceita: Receitas[];

  @OneToMany(() => Transferencias, (transferencias) => transferencias.user)
  userTransferencia: Transferencias[];

  @OneToMany(() => Carteiras, (carteiras) => carteiras.user)
  userCarteiras: Carteiras[];

  @OneToMany(() => Categorias, (categorias) => categorias.user)
  userCategorias: Categorias[];
}
