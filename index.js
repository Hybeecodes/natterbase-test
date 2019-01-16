const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const user = "admin";
const pass = "admin";
const countries = ["Nigeria","Ghana","USA","Togo"];

const ensureLoggedIn = (req,res,next)=>{
    const authorization = req.headers.authorization;
    const authArr = authorization.split(' ');
    const token = authArr[1];
    if(!token){
        return res.status(401).send('Unauthorized')
    }else{
        const decoded = jwt.verify(token,'secret');
        if(decoded.username == user){
            next();
        }else{
            return res.status(401).send('Unauthorized');
        }
    }
}
app.post('/login',(req,res)=>{
    const { username, password } = req.body;
    if(username == '' || password == ''){
        return res.status(401).send('Invalid');
    }
    console.log
    if(username == user && password == pass){
        // return jwt
        const token = jwt.sign({username:username},'secret');
        res.status(200).send(token);
    }else{
        return res.status(401).send('Invalid Login');
    }
});
app.use(ensureLoggedIn);
app.get('/countries',(req,res)=>{
    res.status(200).send(countries);
})

app.put('/countries',(req,res)=>{
    const { country } = req.body;
    if(country == ''){
        res.status(400).send("Please Supply a country")
    }else{ 
        if(countries.includes(country)){
            res.status(400).send("Country Exists Already");
        }else{
            countries.push(country);
            res.status(200).send(countries);
        }
        
    }
})

app.delete('/countries',(req,res)=>{
    const { country } = req.body;
    if(country == ''){
        res.status(400).send("Please Supply a country");
    }else{
        const index = countries.indexOf(country)
        if(index > -1){
            countries.splice(index, 1);
            res.status(200).send(countries);
        }else{
            res.status(400).send("Country Not Found");
        }
        
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT);