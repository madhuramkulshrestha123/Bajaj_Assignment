require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dbConnection = require('./utils/database');
const ApiCall = require('./models/ApiCall');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

dbConnection.connect();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: process.env.CORS_CREDENTIALS === 'true'
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

const USER_INFO = {
    user_id: `${process.env.USER_FULL_NAME || 'piyush_torawane'}_${process.env.USER_BIRTH_DATE || '29082002'}`,
    email: process.env.USER_EMAIL || 'piyush.torawane@example.com',
    roll_number: process.env.USER_ROLL_NUMBER || '21BCE123'
};

function processData(data) {
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;
    const allAlphabets = [];


    data.forEach(item => {
        const str = String(item);
        

        if (!isNaN(str) && !isNaN(parseFloat(str)) && str.trim() !== '') {
            const num = parseInt(str);
            if (num % 2 === 0) {
                evenNumbers.push(str);
            } else {
                oddNumbers.push(str);
            }
            sum += num;
        }

        else if (/^[a-zA-Z]+$/.test(str)) {
            alphabets.push(str.toUpperCase());

            for (let char of str) {
                allAlphabets.push(char.toLowerCase());
            }
        }

        else {
            specialCharacters.push(str);
        }
    });


    let concatString = '';
    allAlphabets.reverse();
    for (let i = 0; i < allAlphabets.length; i++) {
        if (i % 2 === 0) {
            concatString += allAlphabets[i].toLowerCase();
        } else {
            concatString += allAlphabets[i].toUpperCase();
        }
    }

    return {
        oddNumbers,
        evenNumbers,
        alphabets,
        specialCharacters,
        sum: sum.toString(),
        concatString
    };
}

async function logApiCall(requestData, responseData, metadata) {
    try {
        if (!dbConnection.isConnected) {
            console.warn('⚠️  Database not connected, skipping API call logging');
            return;
        }

        const apiCallLog = new ApiCall({
            request_data: requestData,
            response_data: responseData,
            ip_address: metadata.ip,
            user_agent: metadata.userAgent,
            processing_time_ms: metadata.processingTime,
            request_id: metadata.requestId
        });

        await apiCallLog.save();
        console.log(`📊 API call logged: ${metadata.requestId}`);
    } catch (error) {
        console.error('❌ Error logging API call:', error.message);

    }
}

app.post('/bfhl', async (req, res) => {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    try {
        const { data } = req.body;


        if (!data || !Array.isArray(data)) {
            const errorResponse = {
                is_success: false,
                error: "Invalid input: 'data' must be an array"
            };
            

            const metadata = {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
                processingTime: Date.now() - startTime,
                requestId
            };
            
            await logApiCall(data || [], errorResponse, metadata);
            
            return res.status(400).json(errorResponse);
        }


        const processedData = processData(data);


        const response = {
            is_success: true,
            user_id: USER_INFO.user_id,
            email: USER_INFO.email,
            roll_number: USER_INFO.roll_number,
            odd_numbers: processedData.oddNumbers,
            even_numbers: processedData.evenNumbers,
            alphabets: processedData.alphabets,
            special_characters: processedData.specialCharacters,
            sum: processedData.sum,
            concat_string: processedData.concatString
        };


        const metadata = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            processingTime: Date.now() - startTime,
            requestId
        };
        
        await logApiCall(data, response, metadata);
        
        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        
        const errorResponse = {
            is_success: false,
            error: "Internal server error"
        };
        

        const metadata = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            processingTime: Date.now() - startTime,
            requestId
        };
        
        await logApiCall(req.body?.data || [], errorResponse, metadata);
        
        res.status(500).json(errorResponse);
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
    const dbStatus = dbConnection.getConnectionStatus();
    
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
            connected: dbStatus.isConnected,
            name: dbStatus.name,
            readyState: dbStatus.readyState
        },
        memory: process.memoryUsage(),
        environment: NODE_ENV
    });
});

app.get('/api-logs', async (req, res) => {
    try {
        if (!dbConnection.isConnected) {
            return res.status(503).json({
                error: 'Database not connected',
                is_success: false
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const total = await ApiCall.countDocuments();
        

        const logs = await ApiCall.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        res.status(200).json({
            is_success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            database_info: dbConnection.getConnectionStatus()
        });

    } catch (error) {
        console.error('Error fetching API logs:', error);
        res.status(500).json({
            error: 'Failed to fetch API logs',
            is_success: false
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        is_success: false,
        error: 'Something went wrong!'
    });
});

app.use((req, res) => {
    res.status(404).json({
        is_success: false,
        error: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${NODE_ENV}`);
    console.log(`🔗 API endpoint: http://localhost:${PORT}${process.env.API_BASE_PATH || '/bfhl'}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`👤 User ID: ${USER_INFO.user_id}`);
    console.log(`📊 API Logs: http://localhost:${PORT}/api-logs`);
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await dbConnection.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await dbConnection.disconnect();
    process.exit(0);
});

module.exports = app;