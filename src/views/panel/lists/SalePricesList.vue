<template>
  <v-card>
    <v-card-title>قیمت ها و واحد های کالا ها</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-btn
              depressed
              class="rounded-lg"
              @click="changeSalePricesDialog = true"
              color="secondary white--text"
          >تغییر قیمت موارد فیلتر شده
          </v-btn
          >
          <v-btn
              depressed
              @click="salePriceChangesDialog = true"
              color="primary white--text"
              class="mr-1 mt-1 mt-md-0 rounded-lg"
          >تاریخچه تغییر قیمت کالاها
          </v-btn
          >
        </v-col>
        <v-col cols="12">
          <m-datatable
              :headers="headers"
              :apiUrl="url"
              :filters.sync="filters"
              ref="datatable"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog
        v-model="salePriceChangesDialog"
        scrollable
        max-width="800px"
        transition="dialog-transition"
    >
      <v-card>
        <v-card-title>تاریخچه تغییر قیمت کالا ها</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <m-datatable
                  :headers="salePriceChangesHeaders"
                  :apiUrl="salePriceChangesUrl"
                  :filters.sync="salePriceChangesFilters"
                  ref="salePriceChangesDatatable"
              >
                <template #item.created_at="{ item }">{{
                    item.date | toJalali("jYYYY/jMM/jDD HH:mm")
                  }}
                </template>
                <template #item.detail="{ item }">
                  <v-btn @click="showWareSalePriceChanges(item)" color="info"
                  >جزئیات
                  </v-btn
                  >
                </template>
              </m-datatable>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="wareSalePriceChangesDialog"
        scrollable
        max-width="1200px"
        transition="dialog-transition"
    >
      <v-card v-if="salePriceChange">
        <v-card-title>جزئیات تغییر قیمت کالا ها</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <m-datatable
                  :headers="wareSalePriceChangesHeaders"
                  :apiUrl="wareSalePriceChangesUrl"
                  :filters.sync="wareSalePriceChangesFilters"
                  ref="wareSalePriceChangesDatatable"
              >
                <!-- <template #item.created_at="{ item }">{{ item.date | toJalali }}</template>
                <template #item.detail="{ item }">
                  <v-btn @click="showWareSalePriceChanges(item)" color="info">جزئیات</v-btn>
                </template>-->
              </m-datatable>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="changeSalePricesDialog"
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
            <money
                v-if="item.is_percent != undefined"
                :label="item.is_percent ? 'درصد' : 'مبلغ'"
                v-model="item.rate"
            />
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              @click="submitChangeSalePrice"
              class="w-100px"
              color="green white--text"
          >ثبت
          </v-btn
          >
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

      changeSalePricesDialog: false,
      item: {},

      salePriceChangesUrl: "reports/lists/salePriceChanges",
      salePriceChangesDialog: false,
      salePriceChangesFilters: {},

      wareSalePriceChangesUrl: "reports/lists/wareSalePriceChanges",
      wareSalePriceChangesDialog: false,
      wareSalePriceChangesFilters: {},

      salePriceChange: null,
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
    salePriceChangesHeaders() {
      return [
        {
          text: "تاریخ",
          value: "created_at",
          type: "date",
        },
        {
          text: "کاربر",
          value: "created_by.name",
        },
        {
          text: "مقدار",
          value: "rate",
          type: "numeric",
        },
        {
          text: "نحوه تغییر",
          value: "is_percent",
          type: "select",
          items: [
            {
              text: "درصد",
              value: true,
            },
            {
              text: "مبلغ",
              value: false,
            },
          ],
        },
        {
          text: "نوع تغییر",
          value: "is_increase",
          type: "select",
          items: [
            {
              text: "افزایش",
              value: true,
            },
            {
              text: "کاهش",
              value: false,
            },
          ],
        },
        {
          text: "جزئیات",
          value: "detail",
        },
      ];
    },
    wareSalePriceChangesHeaders() {
      return [
        {
          text: "کد کالا",
          value: "salePrice.ware.code",
        },
        {
          text: "نام کالا",
          value: "salePrice.ware.name",
        },
        {
          text: "واحد",
          value: "salePrice.unit.name",
        },
        {
          text: "واحد اصلی",
          value: "salePrice.mainUnit.name",
        },
        {
          text: "ضریب تبدیل",
          value: "salePrice.conversion_factor",
          type: "numeric",
        },
        {
          text: "نوع قیمت",
          value: "salePrice.type.name",
        },
        {
          text: "قیمت قبل",
          value: "previous_price",
          type: "numeric",
        },
        {
          text: "قیمت جدید",
          value: "new_price",
          type: "numeric",
        },
        {
          text: "قیمت فعلی",
          value: "salePrice.price",
          type: "numeric",
        },
      ];
    },
  },
  created() {
    this.filters.type = this.type;
  },
  methods: {
    showWareSalePriceChanges(item) {
      this.salePriceChange = item;
      this.wareSalePriceChangesFilters = {salePriceChange: item.id};
      this.wareSalePriceChangesDialog = true;
    },
    submitChangeSalePrice() {
      this.request({
        url: this.endpoint(`wares/changeSalePrices`),
        method: "put",
        data: {
          operation: this.item,
          filters: this.$refs.datatable.getFilters(),
        },
        success: () => {
          this.successNotify();
          this.$refs.datatable.getDataFromApi();
          this.$refs.salePriceChangesDatatable.getDataFromApi();
          this.changeSalePricesDialog = false;
          this.item = {};
        },
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
