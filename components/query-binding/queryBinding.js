export default {
  props: {
    itemObject: {}
  },
  computed: {
    urlQuery() {
      return this.$route.query;
    }
  },
  watch: {
    urlQuery() {
      this.setDefaults(this.urlQuery);
    },
    itemObject() {
      this.setDefaults(this.urlQuery);
    },
  },
  created() {
    this.EventBus.$on('get:accounts', () => this.setDefaults(this.urlQuery))
    this.EventBus.$on('get:wares', () => this.setDefaults(this.urlQuery))
  },

  mounted() {
    this.setDefaults(this.urlQuery)
  },
  methods: {
    /*
      Set default fields with data urlQuery
    */
    setDefaults(data) {
      this.$nextTick(() => {

        if (this.itemObject) {
          this.item = this.itemObject;
        }
        for (let key in data) {
          let path = key.split('.')
          let lastObject = path.slice(0, path.length - 1).reduce((o, i) => o[i], this)
          let lastKey = path[path.length - 1];
          let value = data[key]

          if (isNaN(value)) {
            lastObject[lastKey] = value
          } else {
            lastObject[lastKey] = Number(data[key])
          }
        }
      })
    },

  },
}