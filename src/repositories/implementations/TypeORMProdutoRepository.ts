import { Repository } from 'typeorm';
import { Produto } from '../../entities/Produto';
import type {
  AtualizarProdutoInput,
  CriarProdutoInput,
  IProdutoRepository,
} from '../IProdutoRepository';

export class TypeORMProdutoRepository implements IProdutoRepository {
  constructor(private readonly repository: Repository<Produto>) {}

  async listarTodos(): Promise<Produto[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async buscarPorId(id: number): Promise<Produto | null> {
    return this.repository.findOne({ where: { id } });
  }

  async criar(dados: CriarProdutoInput): Promise<Produto> {
    const entidade = this.repository.create({
      nome: dados.nome,
      descricao: dados.descricao ?? null,
      preco: dados.preco,
      categoria: dados.categoria,
      disponivel: dados.disponivel ?? true,
    });
    return this.repository.save(entidade);
  }

  async atualizar(
    id: number,
    dados: AtualizarProdutoInput,
  ): Promise<Produto | null> {
    const existente = await this.buscarPorId(id);
    if (!existente) {
      return null;
    }
    if (dados.nome !== undefined) existente.nome = dados.nome;
    if (dados.descricao !== undefined) existente.descricao = dados.descricao;
    if (dados.preco !== undefined) existente.preco = dados.preco;
    if (dados.categoria !== undefined) existente.categoria = dados.categoria;
    if (dados.disponivel !== undefined) existente.disponivel = dados.disponivel;
    return this.repository.save(existente);
  }

  async remover(id: number): Promise<boolean> {
    const resultado = await this.repository.delete(id);
    return (resultado.affected ?? 0) > 0;
  }
}
