export default {
  methods: {
    fillStore({
      url,
      storeKey,
      reload = false,
      callback = null,
    }) {

      let storeData = this.$store.state[storeKey]
      if (!reload && storeData.length) return;
      if (!this.canGet(storeKey)) return;

      return this.request({
        url: this.endpoint(url),
        method: 'get',
        success: data => {
          let mutationKey = storeKey.charAt(0).toUpperCase() + storeKey.slice(1)
          this.$store.commit(`set${mutationKey}`, data);

          callback && callback();

          this.EventBus.$emit(`fetched:${storeKey}`);
          this.toggleIsGetting(storeKey)
        }
      })
    },
  }
}