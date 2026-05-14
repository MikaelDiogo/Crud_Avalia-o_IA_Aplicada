import { AppError } from '../../errors/AppError';
import type { IProdutoRepository } from '../../repositories/IProdutoRepository';
import { assertValidProductId } from './validation/assertValidProductId';

export interface IDeleteProductService {
  execute(id: number): Promise<void>;
}

export class DeleteProductService implements IDeleteProductService {
  constructor(private readonly produtos: IProdutoRepository) {}

  async execute(id: number): Promise<void> {
    assertValidProductId(id);
    const removido = await this.produtos.remover(id);
    if (!removido) {
      throw new AppError(404, 'Produto não encontrado.');
    }
  }
}
