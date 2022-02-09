const nodeMailer = require('nodemailer')

module.exports = (userName,email,text) => {
    const transporter = nodeMailer.createTransport({
        service : 'gmail',
        auth : {
            user : 'santhoshtedla@gmail.com',
            pass : 'santhoshtedla@123'
        }
    });
     
    var mailOptions = {
        from : 'santhoshtedla@gmail.com',
        to : email,
        subject : 'Registration update',
        text : text

    }
    
    transporter.sendMail(mailOptions , (err) => {
        if(err){
            console.log(err)
        }else{
            console.log('Email send To : ' + mailOptions.to)
        }
    })
}