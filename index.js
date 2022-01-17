const express = require('express')
const randomId = require('random-id');
const path = require('path');
var favicon = require('serve-favicon')



const { MongoClient } = require('mongodb');
const { all } = require('express/lib/application');
var Filter = require('bad-words'),
    filter = new Filter();

const app = express()
const PORT = process.env.PORT || 5000
const password = process.env.MONGO_PASSWORD || "password"
const uri = "mongodb+srv://heroku:" + password + "@chsclassmatcher.mpdh6.mongodb.net/chsclassmatcher?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const validsubjects = [
    '',     'ACCMA', 'ACCMAX', 'ANC',
    'BIO',  'BUS',   'CHE',    'D+T',
    'ECO',  'ENG',   'ENN',    'EXT',
    'FRE',  'GEO',   'INV',    'JAP',
    'LEG',  'MAA',   'MAS',    'MOD',
    'MUS1', 'MUS2',  'MXT.1',  'PDHPE',
    'PHY',  'SAC',   'SDD',    'SOR',
    'VIS'
  ]
const validnumbers = ["","1","2","3","4","5","6","6A","6B","7","8","9"]


async function get_db(){
    await client.connect()
    const DB = client.db("chsclassmatcher").collection("2022");
    const query = {};
    const options = {};
    const allDB = await DB.find(query, options);
    
    return await allDB.toArray()
    // console.log("lastaction")
    // console.log(lastaction)
    // return lastaction
    

}

app.use(express.urlencoded({extended: true}))
    .use(express.static(path.join(__dirname, 'public')))
    .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
    .set('views', __dirname)
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/home',{subjects:validsubjects,numbers:validnumbers}))
    .get('/api', async (req, res)  => res.send(await get_db()))
    .get('/db', (req, res) => res.render('pages/db'))

app.post('/', async (req, res) => {
    user = req.body
    user.id = randomId(5)
    console.log(user)
    console.log(subjectcheck(user.subjects))
    console.log(numbercheck(user.numbers))
    if (subjectcheck(user.subjects) && numbercheck(user.numbers)){
        await client.connect(async err => {
            const statesDB = client.db("chsclassmatcher").collection("2022");
            const entry = {
                userID:user.id,
                name:filter.clean(user.fullname),
                subjects:user.subjects,
                numbers:user.numbers
            }
            console.log("entry")
            console.log(entry)
            const result = await statesDB.insertOne(entry);
        });
    }
    res.cookie("id",user.id)
    res.render('pages/db')

})

function subjectcheck(e){
    if (!Array.isArray(e)){
        return false
    }
    for(i=0;i<e.length;i++){
        if (!validsubjects.includes(e[i])){
            return false
        }
    }
    return true
}
function numbercheck(e){
    if (!Array.isArray(e)){
        return false
    }
    for(i=0;i<e.length;i++){
        if (!validnumbers.includes(e[i])){
            return false
        }
    }
    return true
}
  
 
app.listen(PORT)