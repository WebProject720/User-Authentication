require('dotenv').config();
const { default: mongoose } = require('mongoose');
const mongo = require('mongoose');
try {
    mongo.connect(process.env.DATABASE_URL).then((e) => {
        console.log("Database Connected");
        return mongo;
    }).catch((e) => {
        console.log("Catch ERROR : ", e);
    })
    const db = mongoose.connection;
    db.on('disconnected', () => {
        console.log("Database is default disconnected");
    })
    db.on('err', (e) => {
        console.log("While connected to Database got ERROR : ", e);
    })
} catch (err) {
    console.log("ERROR", err);
}
