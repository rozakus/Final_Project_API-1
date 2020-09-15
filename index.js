const express = require('express'); //framework REST API
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

//SETUP EXPRESS
const app = express();
dotenv.config()

//Setup Middleware
app.use(bodyParser.json());
app.use(cors());

//connect database
// const db = require('./database')
// db.connect((err) => {
//     if (err) {
//         console.log('error connecting : ' + err);
//         return;
//     }
//     console.log(`database is connected at ID : ${db.threadId}`)
// })

//home route
app.get('/', (req, res) => {
    res.status(200).send(`<h1>FINAL PROJECT API</h1>`)
})

//apply router
const { userRouter } = require('./routers')
app.use('/api', userRouter)

// bind or host in localhost
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running at PORT : ${PORT}`))