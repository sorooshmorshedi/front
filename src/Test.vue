<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            max-width="300px"
            append-icon="search"
            label="جستوجو"
            single-line
            hide-details
          />
        </v-col>
        <v-col cols="12" md="8" class="mt-1 text-left">
          <v-btn @click="exportTo('html')" class="export-btn">چاپ</v-btn>
          <v-btn @click="exportTo('pdf')" class="export-btn mr-1">خروجی PDF</v-btn>
          <v-btn @click="exportTo('xlsx')" class="export-btn mr-1">خروجی اکسل</v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      :show-select="true"
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :loading="loading"
      v-model="selectedItems"
    >
      <!-- Add Filter btn and menu to headers -->
      <template v-for="header in headers" v-slot:[getHeaderSlot(header.value)]="{header}">
        <template v-if="header.filterable != false">
          <v-menu
            left
            offset-x
            offset-y
            :close-on-content-click="false"
            :key="header.value"
            v-model="filterMenus[header.value]"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click.stop
                :color="filters[header.value]?'indigo':''"
              >
                <v-icon x-small>fa fa-filter</v-icon>
              </v-btn>
            </template>
            <v-card dense max-width="360">
              <v-card-title>
                فیلتر
                {{ header.text }}
              </v-card-title>
              <v-card-text class="pt-0">
                <v-row>
                  <v-col cols="12">
                    <component
                      :is="getFilterField(header)"
                      label="جستوجو"
                      v-model="filters[`${header.value}__icontains`]"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12">
                    <component
                      :is="getFilterField(header)"
                      label="جستوجوی دقیق"
                      v-model="filters[`${header.value}`]"
                      clearable
                    />
                  </v-col>
                  <template v-if="isNumber(header) || isDate(header)">
                    <v-col cols="12" md="6">
                      <component
                        :is="getFilterField(header)"
                        label="از"
                        v-model.lazy="filters[`${header.value}__gte`]"
                        clearable
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <component
                        :is="getFilterField(header)"
                        label="تا"
                        v-model.lazy="filters[`${header.value}__lte`]"
                        clearable
                      />
                    </v-col>
                  </template>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="clearFilters(header)" color="red" outlined>حذف فیلتر ها</v-btn>
                <v-btn
                  @click="filterMenus[header.value] = false"
                  class="left"
                  color="blue white--text"
                >بستن</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </template>
        {{ header.text }}
      </template>

      <!-- Filter numeric data -->
      <template v-for="header in headers" v-slot:[getItemSlot(header.value)]="{ item }">
        <template v-if="isNumber(header)">{{ item[header.value] | toMoney}}</template>
        <template v-else>{{ item[header.value] }}</template>
      </template>

      <!-- Add row number field -->
      <template
        #item.rowNumber="{ item }"
      >{{ (options.page - 1) * options.itemsPerPage + items.indexOf(item) + 1}}</template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      filterMenus: {},
      search: "",
      filters: {},
      totalItems: 0,
      items: [],
      selectedItems: [],
      loading: true,
      showSelect: false,
      options: {}
    };
  },
  computed: {
    filterTypes() {
      let filterTypes = [
        {
          getKey: valueName => valueName
        },
        {
          key: "icontains"
        },
        {
          key: "gte"
        },
        {
          key: "lte"
        }
      ];
      for (let filterType of filterTypes) {
        if (!filterType.getKey) {
          filterType.getKey = valueName => `${valueName}__${filterType.key}`;
        }
      }
      return filterTypes;
    },
    headers() {
      let filter = propertyName => {
        return value => {
          if (!this.filters[propertyName]) return true;
          return String(value).includes(this.filters[propertyName]);
        };
      };

      let headers = [
        {
          text: "#",
          filterable: false,
          sortable: false,
          value: "rowNumber"
        },
        {
          text: "شماره",
          value: "code"
        },
        { text: "بدهکار", value: "bed" },
        { text: "بستانکار", value: "bes" },
        { text: "تاریخ", value: "date" },
        { text: "توضیحات", value: "explanation" }
      ];

      for (let header of headers) {
        this.$set(this.filters, header.value, "");
        header.filter = filter(header.value);
      }

      return headers;
    }
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true
    },
    filters: {
      handler() {
        this.getDataFromApi();
      },
      deep: true
    },
    search() {
      this.getDataFromApi();
    }
  },
  methods: {
    clearFilters(header) {
      for (const filterType of this.filterTypes) {
        this.filters[filterType.getKey(header.value)] = "";
      }
    },
    getFilterField(header) {
      if (this.isDate(header)) return "date";
      if (this.isNumber(header)) return "money";
      return "v-text-field";
    },
    isDate(header) {
      return header.value.includes("date");
    },
    isNumber(header) {
      return ["bed", "bes", "value", "fee", "price", "count"].includes(
        header.value
      );
    },
    getItemSlot(value) {
      return `item.${value}`;
    },
    getHeaderSlot(value) {
      return `header.${value}`;
    },
    getDataFromApi() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let ordering;
      if (sortBy.length === 1 && sortDesc.length === 1) {
        ordering = `${sortDesc[0] ? "-" : ""}${sortBy[0]}`;
      }

      this.request({
        url: this.endpoint("reports/lists/sanads"),
        method: "get",
        params: {
          limit: itemsPerPage,
          offset: itemsPerPage * (page - 1),
          ordering: ordering,
          search: this.search,
          ...this.filters
        },
        success: data => {
          this.totalItems = data.count;
          this.items = data.results;
          this.loading = false;
        }
      });
    },
    exportTo(outputFormat) {
      let url = this.endpoint(`reports/lists/sanads/${outputFormat}`) + "?";

      Object.keys(this.filters).forEach(k => {
        url += k + "=" + this.filters[k] + "&";
      });
      url += "search=" + this.search;
      url += "&token=" + this.token;

      let element = document.createElement("a");
      element.href = url;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
      element.click();
      element.delete();
    }
  }
};
</script>

<style>
</style>