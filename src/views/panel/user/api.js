export default {
  methods: {
    getUsers(callback) {
      this.request({
        url: this.endpoint(`users/list`),
        method: "get",
        success: data => {
          callback(data);
        }
      });
    },
  },
}