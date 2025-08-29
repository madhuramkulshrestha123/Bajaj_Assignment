# Bajaj Assignment - REST API

A REST API built with Node.js and Express.js that processes data arrays and returns categorized results.

## 🚀 Features

- **POST /bfhl**: Main endpoint that processes data arrays
- **GET /bfhl**: Returns operation code (for testing)
- **GET /api-logs**: View all stored API call logs with pagination
- **GET /health**: Health check with database status
- **MongoDB Integration**: All API calls are logged to MongoDB
- **Simple Web UI**: Test the API directly from the browser
- **Error Handling**: Graceful error handling with proper status codes
- **CORS Enabled**: Cross-origin requests supported

## 📊 API Specification

### POST /bfhl

**Request Format:**
```json
{
  "data": ["a","1","334","4","R", "$"]
}
```

**Response Format:**
```json
{
  "is_success": true,
  "user_id": "user_29082002",
  "email": "user@example.com",
  "roll_number": "21BCE10828",
  "odd_numbers": ["1"],
  "even_numbers": ["334","4"],
  "alphabets": ["A","R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd bajaj-assignment-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your actual details
   # Update USER_FULL_NAME, USER_BIRTH_DATE, USER_EMAIL, USER_ROLL_NUMBER
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - API: `http://localhost:3000/bfhl`
   - Web UI: `http://localhost:3000`
   - API Logs: `http://localhost:3000/api-logs`
   - Health Check: `http://localhost:3000/health`

## 📋 MongoDB Integration

### Database Logging
All API calls are automatically logged to MongoDB with the following information:
- **Request Data**: Input array sent to the API
- **Response Data**: Complete API response
- **Metadata**: IP address, user agent, processing time, unique request ID
- **Timestamps**: When the request was made

### API Logs Endpoint
View stored API calls at `/api-logs` with:
- **Pagination**: `?page=1&limit=10`
- **Recent First**: Sorted by timestamp (newest first)
- **Database Status**: Connection information included

Example: `http://localhost:3000/api-logs?page=1&limit=5`

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

### Deploy to Railway

1. **Connect your GitHub repository to Railway**
2. **Railway will automatically detect and deploy your Node.js app**

### Deploy to Render

1. **Connect your GitHub repository to Render**
2. **Set build command:** `npm install`
3. **Set start command:** `npm start`

### Environment Variables

The following environment variables can be configured in your `.env` file:

**Required:**
- `USER_FULL_NAME`: Your first name and last name (e.g., "piyush_torawane")
- `USER_BIRTH_DATE`: Your birth date in ddmmyyyy format (e.g., "29082002")
- `USER_EMAIL`: Your email address
- `USER_ROLL_NUMBER`: Your college roll number
- `DATABASE_URL`: MongoDB connection string (required for API logging)

**Optional:**
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: CORS origin settings
- `API_BASE_PATH`: API base path (default: /bfhl)

Copy `.env.example` to `.env` and update with your details.

## 🧪 Testing

### Manual Testing with Web UI

1. Visit `http://localhost:3000`
2. Use the provided examples or enter your own data
3. Click "Submit Request" to test the API

### Testing with cURL

```bash
# Example A
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["a","1","334","4","R", "$"]}'

# Example B
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["2","a", "y", "4", "&", "-", "*", "5","92","b"]}'

# Example C
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A","ABcD","DOE"]}'
```

### Testing with Postman

1. **Method:** POST
2. **URL:** `http://localhost:3000/bfhl`
3. **Headers:** `Content-Type: application/json`
4. **Body:** Raw JSON with your data array

## 📋 API Logic

The API processes each element in the input array and categorizes them as follows:

1. **Numbers**: Separated into odd and even arrays (returned as strings)
2. **Alphabets**: Converted to uppercase
3. **Special Characters**: Everything that's not a number or alphabet
4. **Sum**: Sum of all numbers (returned as string)
5. **Concatenation**: All alphabetic characters in reverse order with alternating case

### User Information

User information is now configured via environment variables in the `.env` file. Update the following variables:

```bash
USER_FULL_NAME=your_firstname_lastname
USER_BIRTH_DATE=ddmmyyyy
USER_EMAIL=your.email@example.com
USER_ROLL_NUMBER=YOUR123
```

The system will automatically format the `user_id` as `{USER_FULL_NAME}_{USER_BIRTH_DATE}`.

## 📁 Project Structure

```
bajaj-assignment-api/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env               # Environment variables (create from .env.example)
├── .env.example       # Environment variables template
├── vercel.json        # Vercel deployment config
├── .gitignore         # Git ignore file
├── test-api.js        # API test script
├── models/
│   └── ApiCall.js     # MongoDB schema for API logs
├── utils/
│   └── database.js    # Database connection utility
├── public/
│   └── index.html     # Web UI for testing
└── README.md          # This file
```

## 🐛 Error Handling

The API handles various error scenarios:

- **400 Bad Request**: Invalid input format
- **404 Not Found**: Invalid endpoints
- **500 Internal Server Error**: Server errors

## 📝 Examples

### Example A
**Input:** `["a","1","334","4","R", "$"]`
**Output:** Odd: ["1"], Even: ["334","4"], Alphabets: ["A","R"], Special: ["$"], Sum: "339", Concat: "Ra"

### Example B
**Input:** `["2","a", "y", "4", "&", "-", "*", "5","92","b"]`
**Output:** Odd: ["5"], Even: ["2","4","92"], Alphabets: ["A","Y","B"], Special: ["&","-","*"], Sum: "103", Concat: "ByA"

### Example C
**Input:** `["A","ABcD","DOE"]`
**Output:** Odd: [], Even: [], Alphabets: ["A","ABCD","DOE"], Special: [], Sum: "0", Concat: "EoDdCbAa"

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- Email: your.email@example.com
- Roll Number: YOUR123

---

**API Endpoint for Submission:** `https://your-deployment-url.com/bfhl`
