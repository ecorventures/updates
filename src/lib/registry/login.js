login = new NGNX.VIEW.Registry({
  parent: main,
  namespace: 'login.',
  selector: '.login',

  properties: {
    loggedIn: {
      type: Boolean,
      default: false
    }
  },

  references: {
    urlField: 'input[name="url"]',
    usernameField: 'input[name="username"]',
    passwordField: 'input[name="password"]',
    loginButton: 'button'
  },

  states: {
    default: function () {
      this.self.element.classList.remove('loading')
    },

    authenticating: function () {
      this.self.element.classList.add('loading')
    }
  },

  reactions: {
    login: 'default'
  },

  init () {
    this.on('login', (url, username, password) => {
      NGN.NET.get({
        url: `${url}/manifest`,
        username: username,
        password: password
      }, (res) => {
        if (res.status !== 200) {
          console.log(res.status, res.responseText)
        } else {
          this.parent.properties.url = url
          this.parent.properties.user = username
          this.parent.properties.pass = password

          ReleaseHistory.once('load', () => this.parent.state = 'report')
          ReleaseHistory.load(JSON.parse(res.responseText))
        }

        this.state = 'default'
      })
    })

    this.ref.loginButton.on('click', () => {
      this.state = 'authenticating'

      this.emit(
        'login',
        this.ref.urlField.value,
        this.ref.usernameField.value,
        this.ref.passwordField.value
      )
    })

    let defaultUser = NGN.coalesce(localStorage.getItem('serviceUser'))
    let defaultUrl = NGN.coalesce(localStorage.getItem('serviceUrl'))

    if (defaultUrl !== null) {
      this.ref.urlField.value = defaultUrl

      if (defaultUser !== null) {
        this.ref.usernameField.value = defaultUser
        this.ref.passwordField.element.focus()
      }
    }
  }
})
