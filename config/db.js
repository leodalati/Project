// Read MongoDB connection string from environment variable for security.
module.exports = {
	URI: process.env.MONGODB_URI || ''
};