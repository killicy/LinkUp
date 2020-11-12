const nodemailer = require('nodemailer')

// The credentials for the email account.

const credentials = {
  host: 'smtp.yahoo.com',
  port: 465,
  service:'yahoo',
  auth: {
    user: 'linkeduphelpdesk@gmail.com',
    pass: 'ddwvfseoimdcumwx'
  }
}

module.exports = async (to, content) => {

  let transporter = nodemailer.createTransport({
    host: 'smtp.yahoo.com',
    port: 465,
    service:'yahoo',
    auth: {
      user: 'linkupregistration@yahoo.com', // generated ethereal user
      pass: 'ddwvfseoimdcumwx', // generated ethereal password
    },
  });

  const contacts = {
    from: "linkupregistration@yahoo.com", // sender address
    to: "tumblingpebble@gmail.com", // list of receivers
  }


  const email = Object.assign({}, content, contacts)

  let info = await transporter.sendMail(email);

  console.log("Message sent: %s", info.messageId);

}

  // create reusable transporter object using the default SMTP transport
