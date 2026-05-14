import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from './database/data-source';
import { Produto } from './entities/Produto';
import { TypeORMProdutoRepository } from './repositories/implementations/TypeORMProdutoRepository';
import { CreateProductValidator } from './services/product/validation/CreateProductValidator';
import { UpdateProductValidator } from './services/product/validation/UpdateProductValidator';
import { ListProductsService } from './services/product/ListProductsService';
import { CreateProductService } from './services/product/CreateProductService';
import { UpdateProductService } from './services/product/UpdateProductService';
import { DeleteProductService } from './services/product/DeleteProductService';
import { ListProductsController } from './controllers/product/ListProductsController';
import { CreateProductController } from './controllers/product/CreateProductController';
import { UpdateProductController } from './controllers/product/UpdateProductController';
import { DeleteProductController } from './controllers/product/DeleteProductController';
import { createApp } from './app';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

async function bootstrap(): Promise<void> {
  await AppDataSource.initialize();

  const produtoRepository = new TypeORMProdutoRepository(
    AppDataSource.getRepository(Produto),
  );

  const createProductValidator = new CreateProductValidator();
  const updateProductValidator = new UpdateProductValidator();

  const listProductsService = new ListProductsService(produtoRepository);
  const createProductService = new CreateProductService(
    produtoRepository,
    createProductValidator,
  );
  const updateProductService = new UpdateProductService(
    produtoRepository,
    updateProductValidator,
  );
  const deleteProductService = new DeleteProductService(produtoRepository);

  const controllers = {
    listProducts: new ListProductsController(listProductsService),
    createProduct: new CreateProductController(createProductService),
    updateProduct: new UpdateProductController(updateProductService),
    deleteProduct: new DeleteProductController(deleteProductService),
  };

  const app = createApp(controllers);

  app.listen(PORT, () => {
    console.log(`> API Restaurante Online — http://localhost:${PORT}`);
    console.log(`> GET    http://localhost:${PORT}/api/produtos`);
    console.log(`> POST   http://localhost:${PORT}/api/produtos`);
    console.log(`> PUT    http://localhost:${PORT}/api/produtos/:id`);
    console.log(`> DELETE http://localhost:${PORT}/api/produtos/:id`);
    console.log(`> Swagger UI  http://localhost:${PORT}/api-docs`);
    console.log(`> OpenAPI JSON http://localhost:${PORT}/openapi.json`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
