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
        url: this.endpoint(`cheques/chequebooks/`),
        method: 'get',
        success: data => {
          console.log(data);
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