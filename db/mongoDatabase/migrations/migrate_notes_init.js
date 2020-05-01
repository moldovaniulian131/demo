module.exports = {
	async up(db) {
		await db.createCollection('notes');
	},

	async down(db) {
		await db.collection('notes').drop();
	},
};