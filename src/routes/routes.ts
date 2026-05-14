import { Router } from 'express';
import type { ListProductsController } from '../controllers/product/ListProductsController';
import type { CreateProductController } from '../controllers/product/CreateProductController';
import type { UpdateProductController } from '../controllers/product/UpdateProductController';
import type { DeleteProductController } from '../controllers/product/DeleteProductController';

export type ProductControllersBundle = {
  listProducts: ListProductsController;
  createProduct: CreateProductController;
  updateProduct: UpdateProductController;
  deleteProduct: DeleteProductController;
};

/**
 * Rotas HTTP da API REST (cardápio / produtos).
 * Prefixo base: `/api` (aplicado em app.ts).
 */
export function createRoutes(controllers: ProductControllersBundle): Router {
  const router = Router();

  router.get('/produtos', controllers.listProducts.handle);
  router.post('/produtos', controllers.createProduct.handle);
  router.put('/produtos/:id', controllers.updateProduct.handle);
  router.delete('/produtos/:id', controllers.deleteProduct.handle);

  return router;
}
