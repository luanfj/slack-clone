interface IMailConfig {
  driver: 'ethereal'

  defaults: {
    from: {
      email: string
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'mailgun@sandbox6530ab320b2c409991f28b1981df1b5b.mailgun.org',
      name: 'Equipe GoBarber'
    }
  }
} as IMailConfig
