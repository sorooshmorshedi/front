<template>
  <v-card>
    <v-card-title>قیمت ها و واحد های کالا ها</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-btn
            @click="changePricesDialog = true"
            color="light-blue white--text"
          >تغییر قیمت موارد فیلتر شده</v-btn>
        </v-col>
        <v-col cols="12">
          <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable"></m-datatable>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog
      v-model="changePricesDialog"
      scrollable
      max-width="500px"
      transition="dialog-transition"
      @click:outside="item = {}"
    >
      <v-card>
        <v-card-title>تغییر گروهی قیمت کالا ها</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-radio-group v-model="item.is_increase" row>
                <v-radio label="افزایش" :value="true"></v-radio>
                <v-radio label="کاهش" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" md="6">
              <v-radio-group v-model="item.is_percent" row>
                <v-radio label="درصد" :value="true"></v-radio>
                <v-radio label="مبلغ" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <template v-if="item.is_percent != undefined">
              <v-col cols="12" v-if="item.is_percent">
                <money label="درصد" v-model="item.percent" />
              </v-col>
              <v-col cols="12" v-else>
                <money label="مبلغ" v-model="item.percent" />
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="w-100px" color="green white--text">ثبت</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "TransfersList",

  data() {
    return {
      filters: {},
      url: "reports/lists/salePrices",
      changePricesDialog: false,
      item: {},
    };
  },
  computed: {
    headers() {
      let headers = [
        {
          text: "کد کالا",
          value: "ware.code",
        },
        {
          text: "نام کالا",
          value: "ware.name",
        },
        {
          text: "واحد",
          value: "unit.name",
        },
        {
          text: "واحد اصلی",
          value: "mainUnit.name",
        },
        {
          text: "ضریب تبدیل",
          value: "conversion_factor",
          type: "numeric",
        },
        {
          text: "نوع قیمت",
          value: "type.name",
        },
        {
          text: "قیمت",
          value: "price",
        },
      ];

      return headers;
    },
  },
  created() {
    this.filters.type = this.type;
  },
  methods: {
    updatePrices() {
      this.request({
        url: this.endpoint(`wares/sortInventory`),
        method: "post",
        success: () => {
          this.successNotify();
          this.$refs.datatable.getDataFromApi();
        },
        error: (error) => {
          this.errors = error.response.data[0]["messages"];
          this.errorDialog = true;
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>