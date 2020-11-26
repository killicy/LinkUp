module.exports = {

  confirm: (user,token) => ({
    subject: 'Hello ' + user + ', Welcome to LinkUp!',
    html: `
      <a href='http://localhost:3000/Confirmation/${token}'>
        click to confirm email
      </a>
    `,
    text: `Copy and paste this link: http://localhost:3000/Confirmation/${token}`
  }),

  password: (user) => ({
    subject: 'Hello ' + user + ', Need a new Password?',
    html: `
      <a href='http://localhost:3000/PasswordRecovery/${user}'>
        click to set new password
      </a>
    `,
    text: `Copy and paste this link: http://localhost:3000/PasswordRecovery/${user}`
  })

}
