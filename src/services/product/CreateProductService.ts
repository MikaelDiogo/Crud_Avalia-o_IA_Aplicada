import type { Produto } from '../../entities/Produto';
import type { IProdutoRepository } from '../../repositories/IProdutoRepository';
import type { ICreateProductValidator } from './validation/CreateProductValidator';

export interface ICreateProductService {
  execute(body: unknown): Promise<Produto>;
}

export class CreateProductService implements ICreateProductService {
  constructor(
    private readonly produtos: IProdutoRepository,
    private readonly validator: ICreateProductValidator,
  ) {}

  async execute(body: unknown): Promise<Produto> {
    const dados = this.validator.parseAndValidate(body);
    return this.produtos.criar(dados);
  }
}
