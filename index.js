const express=require('express')
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/upload',express.static('images'))


const model=require('./model')

const userRoute=require('./routes/user')
const adminRoute=require('./routes/admin')

app.use('/',userRoute)
app.use('/admin',adminRoute)

app.listen(3000, function () {
    console.log("Running");
})



