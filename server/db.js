const mongoose = require('mongoose');

async function main() {
    

    await mongoose.connect(process.env.DB_CONNECTION);
    

}

module.exports=main;