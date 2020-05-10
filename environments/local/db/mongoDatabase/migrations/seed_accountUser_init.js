const mongoose = require('mongoose');

module.exports = {
	async up(db) {
		await db.collection('account_users').insertMany([
			{
				_id: new mongoose.Types.ObjectId('5eb7b9bc0f74fc00fd0bfbe5'),
				createdAt: new Date('2020-05-09T17:50:06.000Z'),
				updatedAt: new Date('2020-05-09T10:39:51.000Z'),
				email: 'Lucile.Rice6@gmail.com',
				username: 'Marshall.Bernhard',
				password: 'vCX_pAJ6grpqpSe',
				groups: ['Super Admin'],
			},
		]);
	},

	async down(db) {
		await db.collection('account_users').remove();
	},
};