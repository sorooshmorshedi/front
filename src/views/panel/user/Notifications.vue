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

    <notification-dialog
      :item="item"
      :detailDialog.sync="detailDialog"
      @statusChanged="$refs.datatable.getDataFromApi()"
    />
  </v-card>
</template>

<script>
import NotificationDialog from "./NotificationDialog.vue";
export default {
  name: "Notifications",
  components: { NotificationDialog },
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
      this.item = item;
      this.detailDialog = true;
    },
    getItemClass(item) {
      if (item.status_codename == "ur") return "grey lighten-3 clickable";
      return "white clickable";
    },
  },
};
</script>

<style lang="scss">
.clickable {
  cursor: pointer;
}
</style>