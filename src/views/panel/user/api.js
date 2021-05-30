import {
  mapState
} from "vuex";
export default {
  methods: {
    getUsers(reload, callback) {
      this.fillStore({
        url: 'companies/companyUsers/',
        storeKey: 'companyUsers',
        reload: reload,
        callback: callback
      })
    },
  },
  computed: {
    ...mapState([
      'companyUsers',
    ]),
    users() {
      return this.companyUsers.map(o => o.user);
    },
  }
}