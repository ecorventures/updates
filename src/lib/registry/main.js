main = new NGNX.VIEW.Registry({
  selector: 'main',
  namespace: 'main.',

  properties: {
    url: String,
    user: String,
    pass: String
  },

  references: {
    cycle: 'chassis-cycle',
    login: 'chassis-cycle > section:first-of-type',
    report: 'chassis-cycle > section:last-of-type'
  },

  states: {
    login: function () {
      this.ref.cycle.element.first()
    },

    report: function () {
      this.ref.cycle.element.last()
    }
  },

  initialState: 'login',

  init () {
    this.on('property.url.changed', (delta) => {
      localStorage.setItem('serviceUrl', delta.new)
    })

    this.on('property.user.changed', (delta) => {
      localStorage.setItem('serviceUser', delta.new)
    })
  }
})
