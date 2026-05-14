import { AppError } from '../../errors/AppError';
import type { Produto } from '../../entities/Produto';
import type { IProdutoRepository } from '../../repositories/IProdutoRepository';
import { assertValidProductId } from './validation/assertValidProductId';
import type { IUpdateProductValidator } from './validation/UpdateProductValidator';

export interface IUpdateProductService {
  execute(id: number, body: unknown): Promise<Produto>;
}

export class UpdateProductService implements IUpdateProductService {
  constructor(
    private readonly produtos: IProdutoRepository,
    private readonly validator: IUpdateProductValidator,
  ) {}

  async execute(id: number, body: unknown): Promise<Produto> {
    assertValidProductId(id);
    const dados = this.validator.parseAndValidate(body);
    const atualizado = await this.produtos.atualizar(id, dados);
    if (!atualizado) {
      throw new AppError(404, 'Produto não encontrado.');
    }
    return atualizado;
  }
}
