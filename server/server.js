const express = require('express')
const cors =  require('cors')
const path = require('path')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const moment = require('moment-timezone')
const app = express();
const port =5000;


app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true,
    methods: ['POST','GET']
}))
app.use(session({
    name: 'userID',
    secret: 'ektasecret',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 1000*60*60*24,
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production' ? true : false
    }
}))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'expenses'
})

db.connect((err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('Conncted to Database')
    }
})

app.get('/login',(req,res)=>{
    if(req.session.userID){
    const currentTime = moment.tz('Asia/Dhaka').format('HH:mm');
    const currentDate = moment.tz('Asia/Dhaka').format('DD-MM-YYYY');
        res.send({loggedIn:true, user: req.session.userID})
    }
    else{
        res.send({loggedIn:false, user:null})
    }
})

app.post('/create_user',  async (req,res)=>{
    const name = req.body.Name
    const email = req.body.Email
    const username = req.body.Username
    const dbname = req.body.dbname
    const password = req.body.Password
    const sr = 10;
    const hashedPassword = await bcrypt.hash(password, sr)
    const values = [name,username,email,hashedPassword,dbname]
    const sql1 = `SELECT * FROM users WHERE Email = ?`
    const sql2 = `SELECT * FROM users WHERE Username = ?`
    const sql3 = `INSERT INTO users (Name, Username, Email, Password,dbname) VALUES (?, ?, ?, ?, ?);`
    const sql4 = `CREATE TABLE IF NOT EXISTS ${dbname}(ID INT AUTO_INCREMENT PRIMARY KEY,
    Amount INT(255) NOT NULL,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    Reason VARCHAR(255) NOT NULL,
    Explination TEXT NOT NULL DEFAULT 'Not Available',
    Type VARCHAR(50) NOT NULL)`

    db.query(sql2,[username], (err, result)=>{
        if(err){
            return res.status(500).json({message: 'Internal Server Error'})
        }
        if(result.length>0){
            return res.status(410).json({message:"Username Already Exists"})
        }

        db.query(sql1,[email],(err,result)=>{
            if(err){
                return res.status(500).json({message: 'Internal Server Error'})
            }
            if(result.length>0){
            return res.status(409).json({message:"Email Already Exists"})
            }
            db.query(sql3,values, (err)=>{
                if(err){
                    return res.status(500).json({message: 'Internal Server Error'})
                }
                db.query(sql4,(err)=>{
                    if(err){
                        return res.status(404).json({message:'Unsuccessful'})
                    }
                    return res.status(201).json({message:"Successful"})
                })
                
            })
        })
    })    
})

app.post('/login', async (req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        let params = 'Username'
        if(username.includes('@')){
        params = 'Email'
        }

        sql = `SELECT * FROM users WHERE ${params}=?`
        db.query(sql,[username],async (err,result)=>{
            if(err){
                return res.status(500).json({message:'Internal Server Error'})
            }
            const user = result[0]
            if(result.length<1){
                return res.status(404).json({message:'Wrong Username or Email'})
            }
            const isMatch = await bcrypt.compare(password,user.Password)
            if(!isMatch){
                return res.status(401).json({message:'Wrong Password'})
            }
            else{
                req.session.userID = user.dbname
                return res.status(200).json({message:'login successful'})
            }
        })

    } catch (err) {
        console.error("server error")
           return res.status(500).json({message: " Internal Server Error"})
    }

})
app.get('/user_data/:dbname',(req,res)=>{
    const dbaname = req.params.dbname
    const sql = 'SELECT Name,Username,Email,dbname FROM users WHERE dbname=?'

    db.query(sql,[dbaname],(err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:'Internal Server Error'})
        }
        return res.json(result[0])
    })
})

app.get('/cash_data/:dbname',(req,res)=>{
    const dbaname = req.params.dbname
    const sql = `SELECT * FROM ${dbaname}`

    db.query(sql,(err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:'Internal Server Error'})
        }
        return res.json(result)
    })
})

app.post('/update_user', async (req,res)=>{
    const name = req.body.Name
    const email = req.body.Email
    const username = req.body.Username
    const prevpass = req.body.Password
    const sr = 10;
    const password = await bcrypt.hash(prevpass,sr)
    const dbname = req.body.dbname
    const conPass = req.body.confirmPassword
    let values = [name,username,email,password,dbname]
    let sql = `UPDATE users SET Name=?, Username=?, Email=?, Password=? WHERE dbname=?`
    if(prevpass===''){
        values = [name,username,email,dbname]
        sql = `UPDATE users SET Name=?, Username=?, Email=? WHERE dbname=?`
    }
    const sql2='SELECT * FROM users WHERE dbname=?'

    db.query(sql2,[dbname], async (err,result)=>{
        if(err){
            return res.status(500).json({message:'Internal Server Error'})
        }
        const user = result[0]

        const isMatch = await bcrypt.compare(conPass,user.Password)
        if(!isMatch){
            return res.status(401).json({message:'wrong Password'})
        }

        db.query(sql, values,(err)=>{
            if(err){
                return res.status(500).json({message:'Internal Server Error'})
            }
            return res.status(200).json({message:'Update Successful'})
        })
    

    })

})

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).json({message:'Internal server Error'})
        }
        res.clearCookie('userID',{path:'/'})
        return res.status(200).json({message:'Logged out Successfully'})
    })
})

app.put('/update_budget', (req, res) => {
    const dbname = req.body.db; 
    const ID = req.body.ID;
    const currentdate = moment.tz('Asia/Dhaka').format('YYYY-MM-DD')
    const currenttime = moment.tz('Asia/Dhaka').format('HH:mm:ss')
    const values= [currentdate,currenttime,ID]
    const sql = `UPDATE ${dbname} SET Type = 'expense', Date = ?, Time=? WHERE ID = ?`;
    db.query(sql, values, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.status(200).json({ message: 'Updated Successfully' });
    });
});


app.delete('/delete/:id',(req,res)=>{ 
    const id = req.params.id
    const dbdel = req.query.DBname
    const sql = `DELETE FROM ${dbdel} WHERE ID=? `

    db.query(sql, [id], (err) => {
        if(err){
            return res.status(500).json({message: 'Failed to delete'})
        }
        return res.status(200).json({message:'Deleted Successfully'})
    })
} )


app.listen(port, ()=>{
    console.log('Connected to Server')
})
