<template>
  <v-card>
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-btn
        small
        @click="reorderSanads"
        class="teal white--text mr-1"
      >مرتب کردن کد اسناد بر اساس تاریخ</v-btn>
    </v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.remain="{ item }">{{ getRemain(item) | toMoney}}</template>
        <template #item.settle="{ item }">
          <v-btn color="light-blue white--text" :to="toSettle(item)" text>تسویه</v-btn>
        </template>
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SanadsList",
  props: {
    type: {
      default: "all",
    },
  },
  data() {
    return {
      filters: {},
    };
  },
  computed: {
    url() {
      switch (this.type) {
        case "all":
          return "reports/lists/sanads";
        case "unbalanced":
          return "reports/lists/sanads/unbalanced";
        case "empty":
          return "reports/lists/sanads/empty";
      }
    },
    title() {
      switch (this.type) {
        case "all":
          return "لیست اسناد";
        case "unbalanced":
          return "لیست اسناد نامتوازن";
        case "empty":
          return "لیست اسناد خالی";
      }
    },
    headers() {
      let headers = [
        {
          text: "عطف",
          value: "lcoal_id",
        },
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "بدهکار",
          value: "bed",
        },
        {
          text: "بستانکار",
          value: "bes",
        },
        {
          text: "تاریخ",
          value: "date",
        },
        {
          text: "سیستمی",
          value: "is_auto_created",
          type: "boolean",
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
      ];

      headers.push({
        text: "جزئیات",
        value: "detail",
        sortable: false,
        filterable: false,
      });

      return headers;
    },
  },
  methods: {
    to(item) {
      return {
        name: "SanadForm",
        params: {
          id: item.id,
        },
      };
    },

    reorderSanads() {
      this.request({
        url: this.endpoint("sanads/reorder"),
        method: "post",
        success: (data) => {
          this.successNotify();
          this.$refs.datatable.getDataFromApi();
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>