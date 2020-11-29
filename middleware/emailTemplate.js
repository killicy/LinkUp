module.exports = {

  confirm: (user,token) => ({
    subject: 'Hello ' + user + ', Welcome to LinkUp!',
    html: `
      <a href='${process.env.REACT_APP_CLIENT_URL}/Confirmation/${token}'>
        click to confirm email
      </a>
    `,
    text: `Copy and paste this link: ${process.env.REACT_APP_CLIENT_URL}/Confirmation/${token}`
  }),

  password: (user, token) => ({
    subject: 'Hello ' + user + ', Need a new Password?',
    html: `
      <a href='${process.env.REACT_APP_CLIENT_URL}/PasswordRecovery/${token}'>
        click to set new password
      </a>
    `,
    text: `Copy and paste this link: ${process.env.REACT_APP_CLIENT_URL}/PasswordRecovery/${token}`
  })

}
