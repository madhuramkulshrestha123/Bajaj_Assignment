require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';



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
    user_id: `${process.env.USER_FULL_NAME || 'madhuram_kulshrestha'}_${process.env.USER_BIRTH_DATE || '17091999'}`,
    email: process.env.USER_EMAIL || 'madhuram@xyz.com',
    roll_number: process.env.USER_ROLL_NUMBER || 'ABCD123'
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
            concatString += allAlphabets[i].toUpperCase();
        } else {
            concatString += allAlphabets[i].toLowerCase();
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



app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' must be an array"
            });
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
        
        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Bajaj Assignment API',
        endpoints: {
            'POST /bfhl': 'Process data array',
            'GET /bfhl': 'Get operation code'
        }
    });
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
    console.log(`🔗 API endpoint: http://localhost:${PORT}/bfhl`);
    console.log(`👤 User ID: ${USER_INFO.user_id}`);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;