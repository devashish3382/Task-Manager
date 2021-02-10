const egmail = require('@sendgrid/mail');
egmail.setApiKey(process.env.SANDBOX_API_KEY);
const sendInitialEmail = (email,name)=>{
  name = name[0].toUpperCase()+name.slice(1,name.length);
  egmail.send({
    to:email,
    from:"deva3382@hotmail.com",
    subject:"Welcome to abc",
    text:`Hi ${name}, thanks for joining We are glad to onboard you`
  })
}
const sendLastEmail = (email,name)=>{
  name.split(' ');
  name = name[0].toUpperCase()+name.slice(1,name.length);
  egmail.send({
    to:email,
    from:"deva3382@hotmail.com",
    subject:"We will miss you",
    text:`Hi ${name},Thanks for being with abc looking forward to host you again`
  });
}
module.exports = {sendInitialEmail,sendLastEmail};