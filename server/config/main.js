module.exports = {  
    // Secret key for JWT signing and encryption
    'secret': 'My_Secret_KEY',
    // Database connection information
    'database': 'mongodb://localhost:27017/babelomics',
    // Setting port for server
    'port': process.env.PORT || 3000  
}