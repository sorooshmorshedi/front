import {
  mapState
} from "vuex";
export default {
  methods: {
    getUsers(reload, callback) {
      this.fillStore({
        url: 'users/list',
        storeKey: 'users',
        reload: reload,
        callback: callback
      })
    },
  },
  computed: {
    ...mapState([
      'users',
    ]),
  }
}