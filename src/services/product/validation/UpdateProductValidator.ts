import { AppError } from '../../../errors/AppError';
import type { AtualizarProdutoInput } from '../../../repositories/IProdutoRepository';
import { coercePreco } from './coercePreco';
import {
  PRODUCT_CATEGORY_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
} from './productFieldLimits';

export interface IUpdateProductValidator {
  parseAndValidate(corpo: unknown): AtualizarProdutoInput;
}

/**
 * Responsável apenas por normalizar e validar o payload de atualização parcial.
 */
export class UpdateProductValidator implements IUpdateProductValidator {
  parseAndValidate(corpo: unknown): AtualizarProdutoInput {
    const dados = this.parse(corpo);
    if (Object.keys(dados).length === 0) {
      throw new AppError(400, 'Nenhum campo informado para atualização.');
    }
    if (dados.preco !== undefined) {
      this.assertPositivePrice(dados.preco);
    }
    if (dados.nome !== undefined) {
      this.assertNome(dados.nome);
    }
    if (dados.categoria !== undefined) {
      this.assertCategoria(dados.categoria);
    }
    return dados;
  }

  private parse(corpo: unknown): AtualizarProdutoInput {
    if (corpo === null || typeof corpo !== 'object') {
      throw new AppError(400, 'Corpo da requisição deve ser um objeto JSON.');
    }
    const o = corpo as Record<string, unknown>;
    const dados: AtualizarProdutoInput = {};
    if ('nome' in o) {
      dados.nome = typeof o.nome === 'string' ? o.nome : '';
    }
    if ('descricao' in o) {
      dados.descricao =
        o.descricao === null ? null : String(o.descricao ?? '');
    }
    if ('preco' in o) {
      dados.preco = coercePreco(o.preco);
    }
    if ('categoria' in o) {
      dados.categoria = typeof o.categoria === 'string' ? o.categoria : '';
    }
    if ('disponivel' in o) {
      if (typeof o.disponivel !== 'boolean') {
        throw new AppError(400, 'Campo disponivel deve ser booleano.');
      }
      dados.disponivel = o.disponivel;
    }
    if ('imagemUrl' in o) {
        dados.imagemUrl = typeof o.imagemUrl === 'string' ? o.imagemUrl : null;
    }
    return dados;
  }

  private assertPositivePrice(preco: number): void {
    if (!Number.isFinite(preco) || preco <= 0) {
      throw new AppError(400, 'O preço deve ser um número maior que zero.');
    }
  }

  private assertNome(nome: string): void {
    if (!nome.trim()) {
      throw new AppError(400, 'nome não pode ser vazio.');
    }
    if (nome.length > PRODUCT_NAME_MAX_LENGTH) {
      throw new AppError(
        400,
        `nome deve ter no máximo ${PRODUCT_NAME_MAX_LENGTH} caracteres.`,
      );
    }
  }

  private assertCategoria(categoria: string): void {
    if (!categoria.trim()) {
      throw new AppError(400, 'categoria não pode ser vazia.');
    }
    if (categoria.length > PRODUCT_CATEGORY_MAX_LENGTH) {
      throw new AppError(
        400,
        `categoria deve ter no máximo ${PRODUCT_CATEGORY_MAX_LENGTH} caracteres.`,
      );
    }
  }
}
