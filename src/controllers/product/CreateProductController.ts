import type { Request, Response, NextFunction } from 'express';
import type { ICreateProductService } from '../../services/product/CreateProductService';

export class CreateProductController {
  constructor(private readonly createProduct: ICreateProductService) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const criado = await this.createProduct.execute(req.body);
      res.status(201).json(criado);
    } catch (e) {
      next(e);
    }
  };
}
