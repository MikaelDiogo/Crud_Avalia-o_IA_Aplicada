import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

const decimalPrecoTransformer = {
  to: (value: number): number => value,
  from: (value: string | null): number =>
    value === null || value === undefined ? NaN : parseFloat(value),
};

@Entity({ name: 'produtos' })
export class Produto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nome!: string;

  @Column({ type: 'text', nullable: true })
  descricao!: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalPrecoTransformer,
  })
  preco!: number;

  @Column({ type: 'varchar', length: 50 })
  categoria!: string;

  @Column({ type: 'boolean', default: true, name: 'disponivel' })
  disponivel!: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
