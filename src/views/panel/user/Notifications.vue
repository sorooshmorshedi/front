<template>
  <v-card>
    <v-card-title>
      اعلان ها
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <m-datatable
        :headers="headers"
        :apiUrl="url"
        :filters.sync="filters"
        ref="datatable"
        :show-export-btns="false"
        @click:row="openDetailDialog"
        :item-class="getItemClass"
      ></m-datatable>
    </v-card-text>

    <v-dialog
      v-model="detailDialog"
      max-width="600px"
      transition="dialog-transition"
    >
      <v-card v-if="item">
        <v-card-title class="grey lighten-3">
          {{ item.title }}
          <v-spacer></v-spacer>
          <span dir="ltr" class="font-weight-light subtitle-1">{{ item.created_at }}</span>
        </v-card-title>

        <v-card-text class="py-3">
          <p> <pre>{{ item.explanation }}</pre> </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "Notifications",
  data() {
    return {
      filters: {},
      detailDialog: false,
      item: null,
    };
  },
  computed: {
    url() {
      return "users/notifications";
    },
    headers() {
      let headers = [
        {
          text: "عنوان",
          value: "title",
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
        {
          text: "تاریخ",
          value: "created_at",
          type: "date",
        },
        {
          text: "وضعیت",
          value: "status",
        },
      ];

      return headers;
    },
  },
  methods: {
    openDetailDialog(item) {
      this.changeStatus(item, "r");
      this.item = item;
      this.detailDialog = true;
    },
    getItemClass(item) {
      if (item.status_codename == "ur") return "grey lighten-3 clickable";
      return "white clickable";
    },
    changeStatus(item, status_codename) {
      if (item.status_codename == status_codename) return;
      this.request({
        url: this.endpoint("users/notifications/changeStatus"),
        method: "post",
        loading: false,
        data: {
          id: item.id,
          new_status: status_codename,
        },
        success: (data) => {
          this.$refs.datatable.getDataFromApi();
          let user = this.user
          user.unread_notifications_count -= 1
          this.$store.commit("setUser", user);
        },
      });
    },
  },
};
</script>

<style lang="scss">
.clickable {
  cursor: pointer;
}
pre {
  font-family: IRANSans !important;
  font-weight: normal;
}
</style>