const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/bfhl';

const testCases = [
    {
        name: 'Example A',
        data: ["a","1","334","4","R", "$"],
        expected: {
            odd_numbers: ["1"],
            even_numbers: ["334","4"],
            alphabets: ["A","R"],
            special_characters: ["$"],
            sum: "339",
            concat_string: "Ra"
        }
    },
    {
        name: 'Example B',
        data: ["2","a", "y", "4", "&", "-", "*", "5","92","b"],
        expected: {
            odd_numbers: ["5"],
            even_numbers: ["2","4","92"],
            alphabets: ["A", "Y", "B"],
            special_characters: ["&", "-", "*"],
            sum: "103",
            concat_string: "ByA"
        }
    },
    {
        name: 'Example C',
        data: ["A","ABcD","DOE"],
        expected: {
            odd_numbers: [],
            even_numbers: [],
            alphabets: ["A","ABCD","DOE"],
            special_characters: [],
            sum: "0",
            concat_string: "EoDdCbAa"
        }
    }
];

async function runTests() {
    console.log('🚀 Starting API Tests...\n');
    
    for (const testCase of testCases) {
        console.log(`📋 Testing ${testCase.name}:`);
        console.log(`Input: ${JSON.stringify(testCase.data)}`);
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: testCase.data })
            });
            
            const result = await response.json();
            
            if (response.ok && result.is_success) {
                console.log('✅ Request successful');
                console.log(`📊 Response:`, JSON.stringify(result, null, 2));
                
                // Validate key fields
                const checks = [
                    { field: 'odd_numbers', expected: testCase.expected.odd_numbers },
                    { field: 'even_numbers', expected: testCase.expected.even_numbers },
                    { field: 'alphabets', expected: testCase.expected.alphabets },
                    { field: 'special_characters', expected: testCase.expected.special_characters },
                    { field: 'sum', expected: testCase.expected.sum },
                    { field: 'concat_string', expected: testCase.expected.concat_string }
                ];
                
                let allPassed = true;
                for (const check of checks) {
                    const actual = result[check.field];
                    const expected = check.expected;
                    const passed = JSON.stringify(actual) === JSON.stringify(expected);
                    
                    if (passed) {
                        console.log(`  ✅ ${check.field}: PASS`);
                    } else {
                        console.log(`  ❌ ${check.field}: FAIL`);
                        console.log(`     Expected: ${JSON.stringify(expected)}`);
                        console.log(`     Actual: ${JSON.stringify(actual)}`);
                        allPassed = false;
                    }
                }
                
                if (allPassed) {
                    console.log(`🎉 ${testCase.name} - ALL CHECKS PASSED!`);
                } else {
                    console.log(`⚠️  ${testCase.name} - SOME CHECKS FAILED!`);
                }
                
            } else {
                console.log('❌ Request failed');
                console.log('Response:', JSON.stringify(result, null, 2));
            }
            
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
        
        console.log('─'.repeat(80));
    }
    
    console.log('🏁 Tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests };