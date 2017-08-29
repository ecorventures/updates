const Release = new NGN.DATA.Model({
  autoid: true,
  prefix: 'release-',

  fields: {
    platform: String,
    arch: Number,
    version: String,
    url: String,
    notes: String,
    releaseDate: Date,
    releases: null // windows release file content
  },

  virtuals: {
    tag: function () {
      console.log('tag is deprecated. Use version instead.')
      return this.version
    },

    os: function () {
      if (this.platform === 'windows') {
        return 'win'
      }

      return this.platform.toLowerCase()
    }
  }
})

const ReleaseHistory = new NGN.DATA.Store({
  model: Release,
  allowDuplicates: false
})
