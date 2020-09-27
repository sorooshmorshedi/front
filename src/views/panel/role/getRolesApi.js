export default {
  methods: {
    getRoles(setRoles) {
      this.request({
        url: this.endpoint(`users/roles/list`),
        method: "get",
        success: data => {
          setRoles(data);
        }
      })
    },
  },
}