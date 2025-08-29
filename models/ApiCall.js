const mongoose = require('mongoose');

const apiCallSchema = new mongoose.Schema({
    request_data: {
        type: Array,
        required: true
    },
    response_data: {
        is_success: {
            type: Boolean,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        roll_number: {
            type: String,
            required: true
        },
        odd_numbers: [String],
        even_numbers: [String],
        alphabets: [String],
        special_characters: [String],
        sum: String,
        concat_string: String
    },
    ip_address: {
        type: String,
        required: false
    },
    user_agent: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    processing_time_ms: {
        type: Number,
        required: false
    },
    request_id: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    collection: 'api_calls'
});

apiCallSchema.index({ timestamp: -1 });
apiCallSchema.index({ 'response_data.user_id': 1 });

const ApiCall = mongoose.model('ApiCall', apiCallSchema);

module.exports = ApiCall;