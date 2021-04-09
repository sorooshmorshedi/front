import {
  mapState
} from "vuex";
export default {
  methods: {
    getDefaultTexts(reload, callback) {
      this.fillStore({
        url: 'home/defaultTexts',
        storeKey: 'defaultTexts',
        reload: reload,
        callback: callback
      })
    },
  },
  computed: {
    ...mapState([
      'defaultTexts',
    ]),
  }
}