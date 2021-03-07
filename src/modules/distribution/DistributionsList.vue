<template>
  <v-card>
    <v-card-title>لیست تحویل ها</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
import DistributionApiMixin from "@/modules/distribution/api";
import UserApiMixin from "@/views/panel/user/api";
export default {
  name: "DistributionsList",
  mixins: [DistributionApiMixin, UserApiMixin],
  props: {},
  data() {
    return {
      url: "distributions/lists/distributions",
      filters: {},
    };
  },
  computed: {
    headers() {
      let headers = [
        {
          text: "عطف",
          value: "local_id",
        },
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "تاریخ",
          value: "date",
        },
        {
          text: "ساعت",
          value: "time",
        },
        {
          text: "ماشین",
          value: "car",
          items: this.cars.map((o) => {
            return { text: o.car_number, value: o.id };
          }),
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
        {
          text: "کاربر",
          value: "created_by",
          items: this.users.map((o) => {
            return { text: o.name, value: o.id };
          }),
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
  mounted() {
    this.getCars();
    this.getUsers();
  },
  methods: {
    to(item) {
      return {
        name: "DistributionForm",
        params: {
          id: item.id,
        },
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>