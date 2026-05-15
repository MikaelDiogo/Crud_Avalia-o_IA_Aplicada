import type { Produto } from '../entities/Produto';

export type CriarProdutoInput = {
  nome: string;
  descricao?: string | null;
  preco: number;
  categoria: string;
  disponivel?: boolean;
  imagemUrl?: string | null;
};

export type AtualizarProdutoInput = Partial<
  Pick<CriarProdutoInput, 'nome' | 'descricao' | 'preco' | 'categoria' | 'disponivel' | 'imagemUrl'>
>;

export interface IProdutoRepository {
  listarTodos(): Promise<Produto[]>;
  buscarPorId(id: number): Promise<Produto | null>;
  criar(dados: CriarProdutoInput): Promise<Produto>;
  atualizar(id: number, dados: AtualizarProdutoInput): Promise<Produto | null>;
  remover(id: number): Promise<boolean>;
}
