import * as mongoose from 'mongoose';
import toJsonHelper from '../helpers/mongoose/toJsonHelper';
import { normalizedValidator } from '../helpers/mongoose/normalizedValidator';
import * as timestamps from 'mongoose-timestamp';

export interface NoteDefinition extends mongoose.Schema {
	_id: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
}

export const NoteModelSchema: mongoose.Schema = new mongoose.Schema({
	id: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
});

NoteModelSchema.plugin(timestamps);

export const NoteModel: any = normalizedValidator(
	'Note',
	(() => {
		try {
			return mongoose.model('Note');
		} catch (_err) {
			mongoose.model('Note', NoteModelSchema, 'notes');

			return mongoose.model('Note');
		}
	})(),
);

NoteModelSchema.set('toJSON', toJsonHelper());
		