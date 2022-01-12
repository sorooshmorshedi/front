<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <m-datatable
        :headers="headers"
        :apiUrl="url"
        :filters.sync="filters"
        ref="datatable"
        @dblclick:row="(e, row) => $router.push(to(row.item))"
      >
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TransfersList",
  data() {
    return {
      filters: {},
      url: "reports/lists/transfers",
    };
  },
  computed: {
    title() {
      return "لیست انتقال ها";
    },
    headers() {
      let headers = [
        {
          text: "شماره",
          value: "code",
          type: "number",
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "توضیحات",
          value: "explanation",
          type: "text",
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
  created() {
    this.filters.type = this.type;
  },
  methods: {
    to(item) {
      return {
        name: "TransferForm",
        params: {
          id: item.id,
        },
      };
    },
  },
};
</script>

<style scoped lang="scss"></style>
