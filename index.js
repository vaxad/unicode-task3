const express = require('express')
const app=express()
app.use(express.json())
const cors=require('cors')
const connectDB=require('./db')

connectDB()

app.use(cors())

app.get('/',(req,res)=>{
    res.send('server working')
})

app.use('/word',require('./word'))

app.listen(4000,()=>{
    console.log('server up')
})

//service live at https://unicode-task3.onrender.com/