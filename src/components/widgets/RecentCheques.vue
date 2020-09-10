<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.request({
      url: this.endpoint("reports/lists/cheques"),
      method: "get",
      params: {
        limit: 10,
        offset: 0,
        status__in: ["bounced", "notPassed"],
      },
      success: (data) => {
        console.log(data);
      },
    });
  },
};
</script>