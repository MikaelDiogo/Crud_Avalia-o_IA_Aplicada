import type { Produto } from '../../entities/Produto';
import type { IProdutoRepository } from '../../repositories/IProdutoRepository';

export interface IListProductsService {
  execute(): Promise<Produto[]>;
}

export class ListProductsService implements IListProductsService {
  constructor(private readonly produtos: IProdutoRepository) {}

  async execute(): Promise<Produto[]> {
    return this.produtos.listarTodos();
  }
}
