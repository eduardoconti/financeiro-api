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
  id: number;

  @Column('text', { nullable: false })
  descricao: string;

  @OneToMany(() => Despesas, (despesas) => despesas.categoria, {
    nullable: false,
  })
  categoria: Despesas[];

  @ManyToOne(() => Users, (users) => users.id, { nullable: false })
  user: Users;
}
