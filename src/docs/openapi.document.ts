/**
 * Especificação OpenAPI 3.0 da API Restaurante Online (gestão de cardápio / produtos).
 * Interface interativa: `GET /api-docs` após subir o servidor.
 */
export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Restaurante Online — API de Cardápio',
    version: '1.0.0',
    description: [
      'API **REST** para o sistema *Restaurante Online*, disciplina de Inteligência Artificial Aplicada.',
      '',
      '### Escopo',
      '- **CRUD** completo sobre a entidade **produto** (itens do cardápio).',
      '- Persistência em **PostgreSQL** (ex.: Supabase) via **TypeORM**.',
      '',
      '### Regras de negócio (resumo)',
      '- `nome`, `categoria` e `preco` são **obrigatórios** na criação.',
      '- `preco` deve ser **maior que zero** (não aceita zero nem negativo).',
      '- `descricao` é opcional; `disponivel` default **true** na criação.',
      '- Na atualização (`PUT`), o corpo é **parcial**: envie apenas os campos a alterar.',
      '- Erros de validação retornam **400** com `{ error: string }`; recurso inexistente em **404**.',
      '',
      '### Convenções',
      '- Prefixo base das rotas de dados: `/api`.',
      '- Datas no JSON seguem **ISO 8601** (ex.: `createdAt`).',
    ].join('\n'),
    contact: {
      name: 'Documentação acadêmica',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description:
        'Servidor local padrão (`PORT` no `.env`; omitir ou 3001 se não definido).',
    },
    {
      url: '/',
      description:
        'Mesmo esquema/host/porta de onde abriu o Swagger (útil se `PORT` for outro).',
    },
  ],
  tags: [
    {
      name: 'Produtos',
      description:
        'Operações sobre itens do cardápio: listagem pública da coleção, criação, atualização parcial e exclusão.',
    },
  ],
  paths: {
    '/api/produtos': {
      get: {
        tags: ['Produtos'],
        summary: 'Listar todos os produtos',
        description:
          'Retorna **todos** os registros da tabela `produtos`, ordenados por `id` ascendente. ' +
          'Útil para montar o cardápio (lista ou grid) no front-end ou para área administrativa.',
        operationId: 'listarProdutos',
        responses: {
          '200': {
            description:
              'Lista obtida com sucesso. Pode ser um array vazio se ainda não existir nenhum produto cadastrado.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Produto' },
                },
                examples: {
                  comItens: {
                    summary: 'Cardápio com dois itens',
                    value: [
                      {
                        id: 1,
                        nome: 'Água mineral',
                        descricao: 'Garrafa 500ml',
                        preco: 3.5,
                        categoria: 'Bebidas',
                        disponivel: true,
                        createdAt: '2026-05-12T14:00:00.000Z',
                      },
                      {
                        id: 2,
                        nome: 'Hambúrguer artesanal',
                        descricao: null,
                        preco: 24.9,
                        categoria: 'Lanches',
                        disponivel: false,
                        createdAt: '2026-05-12T14:05:00.000Z',
                      },
                    ],
                  },
                },
              },
            },
          },
          '500': {
            description: 'Falha interna (ex.: indisponibilidade do banco).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Produtos'],
        summary: 'Cadastrar novo produto',
        description:
          'Cria um novo item no cardápio (**Create** do CRUD). ' +
          'Os campos obrigatórios devem vir preenchidos; caso contrário a API responde **400** ' +
          'com mensagem explicando o problema (vários erros podem vir concatenados na mesma mensagem).',
        operationId: 'criarProduto',
        requestBody: {
          required: true,
          description:
            'Corpo JSON. `preco` aceita número ou string numérica (ex.: `"12.90"`). ' +
            '`disponivel` omitido equivale a **true**.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CriarProdutoRequest' },
              examples: {
                pratoCompleto: {
                  summary: 'Prato com descrição',
                  value: {
                    nome: 'Feijoada',
                    descricao: 'Acompanha arroz, couve e laranja.',
                    preco: 32,
                    categoria: 'Pratos',
                    disponivel: true,
                  },
                },
                bebidaMinima: {
                  summary: 'Bebida (campos mínimos)',
                  value: {
                    nome: 'Suco natural Laranja',
                    preco: 8,
                    categoria: 'Bebidas',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description:
              'Produto criado. O corpo é o registro persistido, incluindo `id` e `createdAt` gerados pelo banco.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produto' },
              },
            },
          },
          '400': {
            description:
              'Requisição inválida: corpo ausente ou não objeto JSON, campos obrigatórios vazios, ' +
              'preço zero/negativo/não numérico, `disponivel` com tipo incorreto, ou limites de tamanho ' +
              '(`nome` máx. 100 caracteres, `categoria` máx. 50).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
                examples: {
                  precoInvalido: {
                    summary: 'Preço inválido',
                    value: { error: 'O preço deve ser um número maior que zero.' },
                  },
                  obrigatorios: {
                    summary: 'Campos obrigatórios',
                    value: { error: 'nome é obrigatório. categoria é obrigatória.' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Erro interno não tratado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
              },
            },
          },
        },
      },
    },
    '/api/produtos/{id}': {
      put: {
        tags: ['Produtos'],
        summary: 'Atualizar produto existente',
        description:
          'Atualização **parcial** (**Update**): envie apenas os campos que deseja alterar ' +
          '(ex.: só `preco` e `disponivel`). ' +
          'O `id` na URL deve ser um inteiro positivo. Se o produto não existir, retorna **404**.',
        operationId: 'atualizarProduto',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description:
              'Identificador numérico do produto (chave primária). Apenas dígitos, sem espaços.',
            schema: { type: 'integer', minimum: 1, example: 1 },
          },
        ],
        requestBody: {
          required: true,
          description:
            'Objeto JSON com **pelo menos um** campo a atualizar. Mesmas regras de tipo e validação ' +
            'dos campos presentes (ex.: `preco` > 0 se enviado).',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AtualizarProdutoRequest' },
              examples: {
                precoEDisponibilidade: {
                  summary: 'Alterar preço e disponibilidade',
                  value: { preco: 29.9, disponivel: true },
                },
                apenasDescricao: {
                  summary: 'Atualizar só a descrição',
                  value: { descricao: 'Nova descrição do prato.' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Produto atualizado; corpo completo do registro após persistência.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produto' },
              },
            },
          },
          '400': {
            description:
              '`id` inválido na URL, corpo vazio, JSON inválido, validação de campo ' +
              '(nome/categoria vazios se enviados, preço inválido, etc.).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
                examples: {
                  idInvalido: {
                    summary: 'ID mal formado',
                    value: { error: 'Identificador de produto inválido.' },
                  },
                  corpoVazio: {
                    summary: 'Nenhum campo no JSON',
                    value: { error: 'Nenhum campo informado para atualização.' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Não existe produto com o `id` informado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
                example: { error: 'Produto não encontrado.' },
              },
            },
          },
          '500': {
            description: 'Erro interno.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Remover produto',
        description:
          'Exclusão definitiva do registro (**Delete** do CRUD). ' +
          'Resposta **204** sem corpo em caso de sucesso. `id` inválido → **404** se não existir; **400** se o parâmetro não for um inteiro válido.',
        operationId: 'removerProduto',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador do produto a remover.',
            schema: { type: 'integer', minimum: 1, example: 2 },
          },
        ],
        responses: {
          '204': {
            description:
              'Produto removido com sucesso. Não há conteúdo no corpo da resposta.',
          },
          '400': {
            description: '`id` na URL não é um número inteiro positivo válido.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
                example: { error: 'Identificador de produto inválido.' },
              },
            },
          },
          '404': {
            description: 'Produto inexistente.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
                example: { error: 'Produto não encontrado.' },
              },
            },
          },
          '500': {
            description: 'Erro interno.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErroApi' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ErroApi: {
        type: 'object',
        description:
          'Formato padrão de erro retornado pela aplicação (validação, recurso não encontrado).',
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            description: 'Mensagem legível para o utilizador ou para depuração.',
            example: 'O preço deve ser um número maior que zero.',
          },
        },
      },
      Produto: {
        type: 'object',
        description: 'Representação de um item do cardápio persistido na base de dados.',
        required: [
          'id',
          'nome',
          'descricao',
          'preco',
          'categoria',
          'disponivel',
          'createdAt',
        ],
        properties: {
          id: {
            type: 'integer',
            description: 'Chave primária (auto-incremento no PostgreSQL).',
            example: 1,
          },
          nome: {
            type: 'string',
            maxLength: 100,
            description: 'Nome comercial do item (obrigatório na criação).',
            example: 'Refrigerante lata',
          },
          descricao: {
            type: 'string',
            nullable: true,
            description: 'Texto livre opcional; pode ser `null`.',
            example: '350ml, gelado.',
          },
          preco: {
            type: 'number',
            format: 'double',
            description:
              'Valor unitário em moeda da aplicação. Sempre > 0 após validação. No JSON costuma aparecer como número.',
            example: 5.5,
            minimum: 0.01,
          },
          categoria: {
            type: 'string',
            maxLength: 50,
            description:
              'Agrupamento lógico (ex.: Bebidas, Lanches, Pratos). Obrigatório na criação.',
            example: 'Bebidas',
          },
          disponivel: {
            type: 'boolean',
            description:
              'Se `false`, o item pode ser ocultado do cardápio público (regra de apresentação fica a cargo do front).',
            example: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data/hora de criação do registro (timezone do servidor / coluna `timestamptz`).',
            example: '2026-05-12T10:30:00.000Z',
          },
        },
      },
      CriarProdutoRequest: {
        type: 'object',
        description: 'Payload para `POST /api/produtos`.',
        required: ['nome', 'preco', 'categoria'],
        properties: {
          nome: {
            type: 'string',
            maxLength: 100,
            description: 'Obrigatório; não pode ser só espaços.',
          },
          descricao: {
            type: 'string',
            nullable: true,
            description: 'Opcional. Pode ser omitido ou `null`.',
          },
          preco: {
            oneOf: [{ type: 'number' }, { type: 'string' }],
            description:
              'Obrigatório; número **estritamente maior que zero**. String numérica também é aceite.',
            example: 15.9,
          },
          categoria: {
            type: 'string',
            maxLength: 50,
            description: 'Obrigatório; exemplos: Bebidas, Lanches, Pratos.',
          },
          disponivel: {
            type: 'boolean',
            description: 'Opcional; predefinição **true** se omitido.',
            default: true,
          },
        },
      },
      AtualizarProdutoRequest: {
        type: 'object',
        description:
          'Payload para `PUT /api/produtos/{id}`. Todos os campos são opcionais, mas **pelo menos um** deve ser enviado.',
        minProperties: 1,
        properties: {
          nome: { type: 'string', maxLength: 100 },
          descricao: { type: 'string', nullable: true },
          preco: {
            oneOf: [{ type: 'number' }, { type: 'string' }],
            description: 'Se presente, deve ser > 0.',
          },
          categoria: { type: 'string', maxLength: 50 },
          disponivel: {
            type: 'boolean',
            description: 'Deve ser booleano; não use string `"true"`.',
          },
        },
      },
    },
  },
} as const;
