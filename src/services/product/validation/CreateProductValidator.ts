import { AppError } from '../../../errors/AppError';
import type { CriarProdutoInput } from '../../../repositories/IProdutoRepository';
import { coercePreco } from './coercePreco';
import {
  PRODUCT_CATEGORY_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
} from './productFieldLimits';

export interface ICreateProductValidator {
  parseAndValidate(corpo: unknown): CriarProdutoInput;
}

/**
 * Responsável apenas por normalizar e validar o payload de criação de produto.
 */
export class CreateProductValidator implements ICreateProductValidator {
  parseAndValidate(corpo: unknown): CriarProdutoInput {
    const dados = this.parse(corpo);
    this.assertRequiredFields(dados);
    this.assertPositivePrice(dados.preco);
    this.assertFieldLengths(dados.nome, dados.categoria);
    return dados;
  }

  private parse(corpo: unknown): CriarProdutoInput {
    if (corpo === null || typeof corpo !== 'object') {
      throw new AppError(400, 'Corpo da requisição deve ser um objeto JSON.');
    }
    const o = corpo as Record<string, unknown>;
    return {
      nome: typeof o.nome === 'string' ? o.nome : '',
      descricao:
        o.descricao === undefined || o.descricao === null
          ? null
          : String(o.descricao),
      preco: coercePreco(o.preco),
      categoria: typeof o.categoria === 'string' ? o.categoria : '',
      disponivel:
        typeof o.disponivel === 'boolean' ? o.disponivel : undefined,
    };
  }

  private assertRequiredFields(dados: CriarProdutoInput): void {
    const erros: string[] = [];
    if (!dados.nome.trim()) erros.push('nome é obrigatório.');
    if (!dados.categoria.trim()) erros.push('categoria é obrigatória.');
    if (!Number.isFinite(dados.preco)) {
      erros.push('preco é obrigatório e deve ser numérico.');
    }
    if (erros.length) {
      throw new AppError(400, erros.join(' '));
    }
  }

  private assertPositivePrice(preco: number): void {
    if (!Number.isFinite(preco) || preco <= 0) {
      throw new AppError(400, 'O preço deve ser um número maior que zero.');
    }
  }

  private assertFieldLengths(nome: string, categoria: string): void {
    if (nome.length > PRODUCT_NAME_MAX_LENGTH) {
      throw new AppError(
        400,
        `nome deve ter no máximo ${PRODUCT_NAME_MAX_LENGTH} caracteres.`,
      );
    }
    if (categoria.length > PRODUCT_CATEGORY_MAX_LENGTH) {
      throw new AppError(
        400,
        `categoria deve ter no máximo ${PRODUCT_CATEGORY_MAX_LENGTH} caracteres.`,
      );
    }
  }
}
