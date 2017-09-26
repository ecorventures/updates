const report = new NGNX.VIEW.Registry({
  parent: main,
  namespace: 'report.',
  selector: '.report',

  references: {
    serverLabel: '#update_server',
    table: 'table',
    rows: 'table tbody',
    refreshButton: '.refresh_button'
  },

  templates: {
    row: './assets/templates/release-row.html'
  },

  states: {
    visible: function () {
      this.ref.serverLabel.element.innerHTML = this.parent.properties.url
      console.log(this.parent.properties.url)
    }
  },

  reactions: {
    report: 'visible'
  },

  init () {
    ReleaseHistory.on('load', () => {
      let versions = []

      ReleaseHistory.records.forEach(record => {
        this.render(
          'row',
          {
            url: record.url,
            file: record.url.split(/\/|\\/).pop(),
            version: record.version,
            release: (new Date(record.releaseDate)).toLocaleString(),
            notes: record.notes,
            platforms: `${record.platform === 'darwin' ? 'macOS' : 'Windows'} ${record.arch}bit`
          },
          this.ref.rows.element,
          'beforeend'
        )
      })
    })

    this.ref.refreshButton.on('click', () => {
      this.ref.refreshButton.element.classList.add('disabled')
      this.ref.table.element.classList.add('disabled')

      ReleaseHistory.once('clear', () => {
        NGN.NET.put({
          url: `${this.parent.properties.url}/manifest/release`,
          username: this.parent.properties.user,
          password: this.parent.properties.pass
        }, (res) => {
          if (res.status !== 200) {
            console.log(res.status, res.responseText)
          } else {
            NGN.slice(this.ref.rows.element.children).forEach(child => NGN.DOM.destroy(child))

            ReleaseHistory.once('load', () => {
              this.ref.refreshButton.element.classList.remove('disabled')
              this.ref.table.element.classList.remove('disabled')
            })
            ReleaseHistory.load(JSON.parse(res.responseText))
          }
        })
      })

      ReleaseHistory.clear()
    })
  }
})
