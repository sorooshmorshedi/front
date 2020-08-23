<template>
  <v-card>
    <v-card-title v-show="!isPrinting">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-if="searchable"
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
      id="datatable"
      :show-select="!isPrinting"
      :headers="headersWithFilter"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :loading="loading"
      v-model="selectedItems"
      :search.sync="search"
      :disable-pagination="isPrinting"
      :disable-sort="isPrinting"
      :hide-default-footer="isPrinting"
    >
      <!-- Add row number field -->
      <template
        #item.rowNumber="{ item }"
      >{{ (options.page - 1) * options.itemsPerPage + items.indexOf(item) + 1}}</template>

      <!-- Add Filter btn and menu to headers -->
      <template v-for="header in headersWithFilter" v-slot:[getHeaderSlot(header.value)]="{header}">
        <template v-if="header.filterable != false && !isPrinting">
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
                <v-row v-if="!header.items">
                  <v-col cols="12">
                    <component
                      :is="getFilterField(header)"
                      label="جستوجو"
                      :value="filters[`${header.value}__icontains`]"
                      @input="emitFilter(`${header.value}__icontains`, $event)"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12">
                    <component
                      :is="getFilterField(header)"
                      label="جستوجوی دقیق"
                      :value="filters[`${header.value}`]"
                      @input="emitFilter(`${header.value}`, $event)"
                      clearable
                    />
                  </v-col>
                  <template v-if="hasRangeFilter(header)">
                    <v-col cols="12" md="6">
                      <component
                        :is="getFilterField(header)"
                        label="از"
                        :value="filters[`${header.value}__gte`]"
                        @input="emitFilter(`${header.value}__gte`, $event)"
                        clearable
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <component
                        :is="getFilterField(header)"
                        label="تا"
                        :value="filters[`${header.value}__lte`]"
                        @input="emitFilter(`${header.value}__lte`, $event)"
                        clearable
                      />
                    </v-col>
                  </template>
                </v-row>
                <v-row v-else>
                  <v-autocomplete
                    :label="header.text"
                    :items="header.items"
                    clearable
                    :value="filters[`${header.value}`]"
                    @input="emitFilter(`${header.value}`, $event)"
                  />
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

      <!-- Mask Data -->
      <template v-for="header in headers" v-slot:[getItemSlot(header.value)]="{ item }">
        <!-- numeric -->
        <template v-if="isNumber(header)">{{ getItemValue(item, header.value) | toMoney }}</template>

        <!-- select -->
        <template
          v-else-if="isSelect(header)"
        >{{ header.items.filter(o => o.value == getItemValue(item, header.value))[0].text }}</template>

        <!-- boolean -->
        <template v-else-if="isBoolean(header)">
          <v-icon v-if="item[header.value]">fa-check</v-icon>
          <v-icon v-else>fa-times</v-icon>
        </template>

        <!-- other-->
        <template v-else>{{ getItemValue(item, header.value) }}</template>
      </template>

      <!-- Pass user templates to vuetify data table -->
      <template v-for="(index, name) in $slots" v-slot:[name]>
        <slot :name="name" />
      </template>
      <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
        <slot :name="name" v-bind="data"></slot>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import XLSX from "xlsx";
import { jsPDF } from "jspdf";

export default {
  props: {
    apiUrl: {
      // default: null
      default: "reports/lists/sanads"
    },
    headers: {
      required: true
    },
    filters: {
      default: () => {}
    },
    searchable: {
      default: true
    },
    previousApiData: {
      default: null
    },
    currentApiData: {
      default: null
    }
  },
  data() {
    return {
      filterMenus: {},
      search: "",
      totalItems: 0,
      items: [],
      selectedItems: [],
      loading: true,
      showSelect: false,
      options: {},

      numericValues: ["code", "bed", "bes", "value", "fee", "price", "count"],
      booleanValues: ["is_auto_created"]
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
    headersWithFilter() {
      let filter = propertyName => {
        return value => {
          if (!this.filters[propertyName]) return true;
          return String(value).includes(this.filters[propertyName]);
        };
      };

      let headers = [
        {
          text: "#",
          value: "rowNumber",
          sortable: false,
          filterable: false
        },
        ...this.headers
      ];

      for (let header of headers) {
        header.filter = filter(header.value);
      }

      return headers;
    },
    serverProcessing() {
      return this.apiUrl != null;
    }
  },
  watch: {
    apiUrl() {
      this.getDataFromApi();
    },
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true
    },
    filters: {
      handler() {
        this.options.page = 1;
        this.getDataFromApi();
      },
      deep: true
    },
    search() {
      if (this.serverProcessing) this.getDataFromApi();
    }
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    hasRangeFilter(header) {
      return (
        header.showRangeFilter || this.isNumber(header) || this.isDate(header)
      );
    },
    emitFilter(key, value) {
      console.log(this.filters, key, value);
      let newFilters = { ...this.filters };
      newFilters[key] = value;
      this.$emit("update:filters", newFilters);
    },
    print() {
      this.$store.commit("setIsPrinting", true);
      this.$nextTick(() => {
        print();
        this.$store.commit("setIsPrinting", false);
      });
    },
    clearFilters(header) {
      let newFilters = { ...this.filters };
      for (const filterType of this.filterTypes) {
        newFilters[filterType.getKey(header.value)] = "";
      }
      this.$emit("update:filters", newFilters);
    },
    getFilterField(header) {
      if (this.isDate(header)) return "date";
      if (this.isNumber(header)) return "money";
      return "v-text-field";
    },
    isDate(header) {
      return header.value.includes("date");
    },
    isSelect(header) {
      return header.items != undefined;
    },
    isNumber(header) {
      let flag;
      if (header.type == "numeric") flag = true;
      else flag = this.numericValues.includes(header.value);
      if (flag) header.align = "center";
      return flag;
    },
    isBoolean(header) {
      let flag = false;
      if (header.type == "boolean") flag = true;
      else flag = this.booleanValues.includes(header.value);
      if (flag) header.align = "center";
      return flag;
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

      let limit = itemsPerPage;
      let offset = itemsPerPage * (page - 1);

      if (limit == -1) {
        limit = 5000;
        offset = 0;
      }

      this.request({
        url: this.endpoint(this.apiUrl),
        method: "get",
        params: {
          limit: limit,
          offset: offset,
          ordering: ordering,
          search: this.search,
          ...this.getFilters()
        },
        success: data => {
          this.$emit("update:previousApiData", this.currentApiData);
          this.$emit("update:currentApiData", data);

          if (this.serverProcessing) {
            this.totalItems = data.count;
          } else {
            this.totalItems = undefined;
          }
          this.items = data.results;
          this.loading = false;
        }
      });
    },
    getFilters() {
      let filters = {};
      for (let filterKey of Object.keys(this.filters)) {
        filters[filterKey.replace(".", "__")] = this.filters[filterKey];
      }
      return filters;
    },
    exportTo(outputFormat) {
      if (this.serverProcessing) {
        let url = this.endpoint(`${this.apiUrl}/${outputFormat}`) + "?";

        if (this.selectedItems.length) {
          url += "id__in=" + this.selectedItems.map(o => o.id).join(",");
        } else {
          Object.keys(this.filters).forEach(k => {
            url += k + "=" + this.filters[k] + "&";
          });
          url += "search=" + this.search;
        }
        url += "&token=" + this.token;

        let element = document.createElement("a");
        element.href = url;
        element.target = "_blank";
        element.rel = "noopener noreferrer";
        element.click();
        element.remove();
      } else {
        if (outputFormat == "html") {
          this.print();
          return;
          let doc = new jsPDF();

          doc.html(document.body, {
            callback: function(doc) {
              doc.page = 1;
              doc.save();
            }
          });
          // this.print();
        } else if (outputFormat == "xlsx") {
          let workbook = XLSX.utils.table_to_book(
            document.getElementById("datatable")
          );
          let wb = workbook;

          if (!wb.Workbook) wb.Workbook = {};
          if (!wb.Workbook.Views) wb.Workbook.Views = [];
          if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
          wb.Workbook.Views[0].RTL = true;
          XLSX.writeFile(workbook, "export.xlsx");
        }
      }
    },
    getItemValue(item, dotNotationString) {
      return dotNotationString.split(".").reduce((o, i) => {
        if (o) return o[i];
        return null;
      }, item);
    }
  }
};
</script>

<style>
table {
  page-break-inside: auto;
}
tr {
  page-break-inside: avoid;
  page-break-after: auto;
}
thead {
  display: table-header-group;
}
tfoot {
  display: table-footer-group;
}
@page {
  size: auto;
  margin: 0mm;
}
</style>