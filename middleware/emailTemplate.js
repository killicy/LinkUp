module.exports = {

  confirm: (user,token) => ({
    subject: 'Hello ' + user + ', Welcome to LinkUp!',
    html: `
      <a href='http://localhost:3000/Confirmation/${token}'>
        click to confirm email
      </a>
    `,
    text: `Copy and paste this link: http://localhost:3000/Confirmation/${token}`
  })

}
