const report = new NGNX.VIEW.Registry({
  parent: main,
  namespace: 'report.',
  selector: '.report',

  references: {
    serverLabel: '#update_server',
    rows: 'table tbody'
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
          'afterbegin'
        )
      })
    })
  }
})
