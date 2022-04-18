<template>
  <v-card>
    <v-card-title>لیست مناقصه ها</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
                   ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>

      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TenderList",
  props: {},
  data() {
    return {
      url: "reports/tender/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "شماره",
          value: "code",
          type: "numeric",

        },
        {
          text: "عنوان",
          value: "title",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "استان",
          value: "province",
        },

        {
          text: "شهر",
          value: "city",
        },
        {
          text: "مناقصه گزار",
          value: "bidder",
        },
        {
          text: "کد پستی مناقصه گزار",
          value: "bidder_postal_code",
          type: "numeric",

        },
        {
          text: "آدرس مناقصه گزار",
          value: "bidder_address",
        },


        {
          text: "مهلت دریافت اسناد",
          value: "received_deadline",
          type: "date",
        },
        {
          text: "مهلت ارسال پاکت های پیشنهاد",
          value: "send_offer_deadline",
          type: "date",
        },

        {
          text: "زمان بازگشایی پاکت ها",
          value: "opening_date",
          type: "date",
        },

        {
          text: "زمان اعتبار پیشنهاد",
          value: "offer_expiration",
          type: "date",
        },
        {
          text: "جزئیات",
          value: "detail",
          sortable: false,
          filterable: false,
        }

      ];
    },
  },
  mounted() {
  },
  methods: {
    to(item) {
      return {
        name: "TenderDetail",
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