const mongoose = require('mongoose');

class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }

    async connect() {
        if (this.isConnected) {
            console.log('📊 MongoDB already connected');
            return;
        }

        try {
            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl) {
                console.warn('⚠️  DATABASE_URL not found in environment variables');
                return;
            }

            const options = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            await mongoose.connect(dbUrl, options);
            
            this.isConnected = true;
            console.log('✅ MongoDB connected successfully');
            console.log(`📊 Database: ${mongoose.connection.name}`);
            

            mongoose.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️  MongoDB disconnected');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconnected');
                this.isConnected = true;
            });

        } catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error.message);
            this.isConnected = false;

        }
    }

    async disconnect() {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.connection.close();
            this.isConnected = false;
            console.log('📊 MongoDB disconnected');
        } catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error.message);
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            name: mongoose.connection.name,
            host: mongoose.connection.host,
            port: mongoose.connection.port
        };
    }
}

const dbConnection = new DatabaseConnection();

module.exports = dbConnection;