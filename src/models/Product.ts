import * as mongoose from 'mongoose';
import toJsonHelper from '../helpers/mongoose/toJsonHelper';
import * as validators from '../helpers/mongoose/validators';
import { normalizedValidator } from '../helpers/mongoose/normalizedValidator';
import * as timestamps from 'mongoose-timestamp';
import {
	PRODUCT_TITLE_LENGTH_25_80,
} from '../constants';
import {NoteDefinition, NoteModelSchema} from './Note';

export interface ProductDefinition extends mongoose.Schema {
	_id: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  price?: string;
  notes?: NoteDefinition[];
}

export const ProductModelSchema: mongoose.Schema = new mongoose.Schema({
	id: {
		type: String,
		required: false,
	},
	title: {
		type: String,
		required: true,
		validate: [
			{
				validator: validators.length(25, 80),
				msg: PRODUCT_TITLE_LENGTH_25_80,
			},
		],
	},
	price: {
		type: String,
		required: false,
	},
	notes: [{
		type: NoteModelSchema,
		required: false,
	}],
});

ProductModelSchema.plugin(timestamps);

export const ProductModel: any = normalizedValidator(
	'Product',
	(() => {
		try {
			return mongoose.model('Product');
		} catch (_err) {
			mongoose.model('Product', ProductModelSchema, 'products');

			return mongoose.model('Product');
		}
	})(),
);

ProductModelSchema.set('toJSON', toJsonHelper());
		