import {
  mapState
} from "vuex";

export default {
  data() {
    return {}
  },
  methods: {
    getChequebooks(reload = false) {
      if (!reload && this.chequebooks.length) return;
      return this.request({
        url: this.endpoint(`reports/lists/chequebooks`),
        method: 'get',
        success: data => {
          this.$store.commit('setChequebooks', data);
        }
      })
    },
  },
  computed: {
    ...mapState({
      chequebooks: state => state.chequebooks
    })
  }
}