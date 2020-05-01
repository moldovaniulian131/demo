import express from 'express';
import ProductsController from '../controllers/ProductsController';
import handleAsyncRoutes from '../middlewares/handleAsyncRoutes';
import applyServerless from '../helpers/serverless/applyServerless';
import ErrorHandler from '../utils/ErrorHandler';
import {
	AuthorizedRequest,
	UnauthorizedRequest,
} from '../helpers/cognitoExpress/typesX';
import handleAccountAuth from '../middlewares/handleAccountAuth';
import handleResourcePermissions from '../middlewares/cognitoResourcePermissions';
import handleMetadata from '../middlewares/handleMetadata';
import {
	PRODUCT_DATA_NOT_PROVIDED,
	PRODUCT_ID_NOT_PROVIDED,
} from '../constants';

export const handler = (app: express.Application): express.Application => {
	const products = new ProductsController();

	app.get(
		'/products',
		handleAccountAuth(),
		handleResourcePermissions({
			requiredGroups: ['superAdmin','regularUser'],
		}),
		handleMetadata({
			metadata: {
				'regularUser': {
					'propertiesToHide': [
						'notes',
					],
				},
			},
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				metadata,
			} = req;
			
			return await products.getAll(metadata);
		}),
	);

	app.post(
		'/products',
		handleAccountAuth(),
		handleResourcePermissions({
			requiredGroups: ['superAdmin'],
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				normalizedData,
			} = req;

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(PRODUCT_DATA_NOT_PROVIDED);
			}
			
			if (Array.isArray(normalizedData)) {
				return await products.bulkAdd(normalizedData);
			} else {
				return await products.add(normalizedData);
			}
		}),
	);

	app.post(
		'/products/filter',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				normalizedData: {
					pagination,
					filters,
					sorting,
				},
			} = req;

			return await products.getFilteredData(
				pagination,
				filters,
				sorting,
			);
		}),
	);

	app.get(
		'/products/:productId',
		handleAsyncRoutes(async (req: UnauthorizedRequest) => {
			const {
				params: {
					productId,
				},
			} = req;

			if (!productId) {
				throw ErrorHandler.badRequest(PRODUCT_ID_NOT_PROVIDED);
			}

			return await products.getById(productId);
		}),
	);

	app.delete(
		'/products/:productId',
		handleAccountAuth(),
		handleResourcePermissions({
			requiredGroups: ['superAdmin'],
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				params: {
					productId,
				},
				metadata,
			} = req;

			if (!productId) {
				throw ErrorHandler.badRequest(PRODUCT_ID_NOT_PROVIDED);
			}

			return await products.remove(productId, metadata);
		}),
	);

	app.put(
		'/products/:productId',
		handleAccountAuth(),
		handleResourcePermissions({
			requiredGroups: ['superAdmin'],
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				params: {
					productId,
				},
				normalizedData,
				metadata,
			} = req;

			if (!productId) {
				throw ErrorHandler.badRequest(PRODUCT_ID_NOT_PROVIDED);
			}

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(PRODUCT_DATA_NOT_PROVIDED);
			}

			return await products.update(productId, normalizedData, metadata);
		}),
	);

	app.patch(
		'/products/:productId',
		handleAccountAuth(),
		handleResourcePermissions({
			requiredGroups: ['superAdmin'],
		}),
		handleAsyncRoutes(async (req: AuthorizedRequest) => {
			const {
				params: {
					productId,
				},
				normalizedData,
				metadata,
			} = req;

			if (!productId) {
				throw ErrorHandler.badRequest(PRODUCT_ID_NOT_PROVIDED);
			}

			if (!Object.keys(normalizedData).length) {
				throw ErrorHandler.badRequest(PRODUCT_DATA_NOT_PROVIDED);
			}

			return await products.patch(productId, normalizedData, metadata);
		}),
	);

	return app;
};


export const serverlessHandler = applyServerless(handler);
