<template>
  <v-card>
    <v-card-title v-show="!isPrinting">
      <v-row no-gutters>
        <v-col
          cols="12"
          class="mt-1 text-left d-flex flex-column flex-md-row justify-end"
          v-if="showExportBtns"
        >
          <v-text-field
            v-if="searchable && false"
            v-model="search"
            max-width="300px"
            append-icon="search"
            label="جستوجو"
            single-line
            hide-details
          />
          <v-btn @click="exportTo('html')" class="export-btn block">چاپ</v-btn>
          <v-btn @click="exportTo('pdf')" class="export-btn mt-2 mt-sm-0 mr-md-1">خروجی PDF</v-btn>
          <v-btn @click="exportTo('xlsx')" class="export-btn mt-2 mt-sm-0 mr-md-1">خروجی اکسل</v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      id="datatable"
      ref="datatable"
      v-bind="$attrs"
      :show-select="!isPrinting"
      :headers="headersWithFilter"
      :items="tableItems"
      :options.sync="options"
      :server-items-length="totalItems"
      :loading="loading"
      v-model="selectedItems"
      :search="search"
      :disable-pagination="isPrinting"
      :disable-sort="isPrinting"
      :hide-default-footer="isPrinting"
      :footer-props="{ showFirstLastPage: true }"
      v-on="$listeners"
      :mobile-breakpoint="0"
    >
      <!-- Add row number field -->
      <template #item.rowNumber="{ item }">{{ getRowNumber(item) }}</template>

      <!-- Add detail icon -->
      <template #item.detail="{ item }">
        <v-btn @click="$emit('detail', item)" color="light-blue white--text" icon>
          <v-icon>fa-external-link-alt</v-icon>
        </v-btn>
      </template>

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
                <v-row v-if="isBoolean(header)">
                  <v-col cols="12">
                    <v-autocomplete
                      :label="header.text"
                      :items="getBooleanFilterItems(header)"
                      clearable
                      :value="filters[`${header.value}`]"
                      @input="emitFilter(`${header.value}`, $event)"
                    />
                  </v-col>
                </v-row>
                <v-row v-else-if="!header.items">
                  <v-col cols="12">
                    <component
                      :is="getFilterField(header)"
                      :label="`جستوجو${serverProcessing?'ی دقیق':''}`"
                      :value="filters[`${header.value}`]"
                      @input="emitFilter(`${header.value}`, $event)"
                      clearable
                    />
                  </v-col>

                  <template v-if="serverProcessing">
                    <v-col cols="12">
                      <component
                        :is="getFilterField(header)"
                        label="جستوجو"
                        :value="filters[`${header.value}__icontains`]"
                        @input="emitFilter(`${header.value}__icontains`, $event)"
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
                  </template>
                </v-row>
                <v-row v-else>
                  <v-col cols="12">
                    <v-autocomplete
                      :label="header.text"
                      :items="header.items"
                      clearable
                      :value="filters[`${header.value}`]"
                      @input="emitFilter(`${header.value}`, $event)"
                    />
                  </v-col>
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

      <template #header.rowNumber>
        <span v-if="isPrinting">#</span>
        <v-btn v-else @click="clearAllFilters" icon title="خالی کردن فیلتر ها">
          <v-icon class>$clearFiltersIcon</v-icon>
        </v-btn>
      </template>

      <!-- Mask Data -->
      <template v-for="header in headers" v-slot:[getItemSlot(header.value)]="{ item }">
        <!-- numeric -->
        <template v-if="isNumber(header)">{{ getItemValue(item, header.value) | toMoney }}</template>

        <!-- select -->
        <template v-else-if="isSelect(header)">{{ getSelectItemValue(header, item) }}</template>

        <!-- boolean -->
        <template v-else-if="isBoolean(header)">
          <v-icon v-if="item[header.value]">fa-check</v-icon>
          <v-icon v-else>fa-times</v-icon>
        </template>

        <!-- date -->
        <template v-else-if="isDate(header)">
          <span class="nowrap">{{ getItemValue(item, header.value) }}</span>
        </template>

        <!-- other-->
        <template v-else>
          <truncate :value="getItemValue(item, header.value)" />
        </template>
      </template>

      <template v-if="apiResponse" v-slot:body.append="{ headers }">
        <template v-for="sum, i in [apiResponse.page_sum, apiResponse.sum]">
          <tr v-if="sum">
            <td v-for="header in headers" class="text-center">
              <template v-if="header.value == 'rowNumber'">{{ i == 0?"جمع این صفحه":"جمع"}}</template>
              <template v-else>{{ sum[header.value] | toMoney }}</template>
            </td>
          </tr>
        </template>
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
import _ from "lodash";
import Truncate from "./Truncate";

export default {
  props: {
    apiUrl: {
      default: null,
    },
    showExportBtns: {
      default: true,
    },
    exportUrl: {
      default: null,
    },
    headers: {
      required: true,
    },
    filters: {
      default() {
        return {};
      },
    },
    searchable: {
      default: true,
    },
    previousApiData: {
      default: null,
    },
    currentApiData: {
      default: null,
    },
    items: {
      default() {
        return [];
      },
    },
  },
  components: {
    Truncate,
  },
  data() {
    return {
      filterMenus: {},
      search: "",
      totalItems: -1,
      tableItems: this.items,
      selectedItems: [],
      loading: false,
      options: {},
      apiResponse: null,

      numericValues: ["bed", "bes", "value", "fee", "price", "count"],
      booleanValues: ["is_auto_created"],

      d: {},
    };
  },
  computed: {
    hasDetail() {
      return this.$listeners && this.$listeners.detail;
    },
    filterTypes() {
      let filterTypes = [
        {
          getKey: (valueName) => valueName,
        },
        {
          key: "icontains",
        },
        {
          key: "gte",
        },
        {
          key: "lte",
        },
      ];
      for (let filterType of filterTypes) {
        if (!filterType.getKey) {
          filterType.getKey = (valueName) => `${valueName}__${filterType.key}`;
        }
      }
      return filterTypes;
    },
    headersWithFilter() {
      let filter = (propertyName) => {
        return (value) => {
          if (!this.filters[propertyName]) return true;
          return String(value).includes(this.filters[propertyName]);
        };
      };

      let headers = this.headers.filter((h) => {
        if (h.show == false) return false;
        if (this.isPrinting && h.hideInExport == true) return false;
        return true;
      });

      headers = [
        {
          text: "#",
          value: "rowNumber",
          sortable: false,
          filterable: false,
        },
        ...headers.map((o) => {
          o.align = "center";
          return o;
        }),
      ];

      if (this.hasDetail) {
        headers.push({
          text: "",
          value: "detail",
          sortable: false,
          filterable: false,
          visible: false,
        });
      }

      for (let header of headers) {
        header.filter = filter(header.value);
      }

      return headers;
    },
    serverProcessing() {
      return this.apiUrl != null;
    },
    serverExport() {
      return this.exportUrl != null;
    },
  },
  watch: {
    items() {
      this.tableItems = this.items;
    },
    apiUrl() {
      if (this.serverProcessing) this.d.getDataFromApi();
    },
    options: {
      handler() {
        if (this.serverProcessing) this.d.getDataFromApi();
      },
      deep: true,
    },
    filters: {
      handler() {
        this.options.page = 1;
        if (this.serverProcessing) this.d.getDataFromApi();
      },
      deep: true,
    },
    search() {
      if (this.serverProcessing) this.d.getDataFromApi();
    },
  },
  created() {
    this.d.getDataFromApi = _.debounce(this.getDataFromApi, 500);
  },
  mounted() {
    if (this.serverProcessing) this.d.getDataFromApi();
  },
  methods: {
    getBooleanFilterItems(header) {
      return [
        {
          text: header.text,
          value: true,
        },
        {
          text: "غیر " + header.text,
          value: false,
        },
      ];
    },
    getSelectItemValue(header, item) {
      let value = header.items.filter(
        (o) => o.value == this.getItemValue(item, header.value)
      );
      if (value.length) return value[0].text;
      return "";
    },
    getRowNumber(item) {
      let datatable = this.$refs.datatable;
      if (datatable) {
        let prev_page = (this.options.page - 1) * this.options.itemsPerPage;
        return (
          datatable.$children[0].computedItems.indexOf(item) + 1 + prev_page
        );
      } else {
        return "";
      }
    },
    hasRangeFilter(header) {
      return (
        header.showRangeFilter || this.isNumber(header) || this.isDate(header)
      );
    },
    emitFilter(key, value) {
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
    clearAllFilters() {
      let newFilters = { ...this.filters };
      Object.keys(newFilters).forEach((key) => {
        newFilters[key] = "";
      });
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
      if (sortBy && sortBy.length === 1 && sortDesc.length === 1) {
        ordering = `${sortDesc[0] ? "-" : ""}${sortBy[0].replaceAll(
          ".",
          "__"
        )}`;
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
          ...this.getFilters(),
        },
        success: (data) => {
          this.$emit("update:previousApiData", this.currentApiData);
          this.$emit("update:currentApiData", data);

          if (this.serverProcessing) {
            this.totalItems = data.count;
          } else {
            this.totalItems = undefined;
          }
          this.apiResponse = data;
          this.tableItems = data.results;
          this.loading = false;
        },
      });
    },
    getFilters() {
      let filters = {};
      for (let filterKey of Object.keys(this.filters)) {
        filters[filterKey.replaceAll(".", "__")] = this.filters[filterKey];
      }
      return filters;
    },
    getExportUrl(outputFormat) {
      let exportUrl = this.exportUrl || this.apiUrl;
      let url = "";
      if (exportUrl.includes("?")) {
        url = exportUrl.replace("?", `/${outputFormat}?`);
      } else {
        url = `${exportUrl}${
          exportUrl.endsWith("/") ? "" : "/"
        }${outputFormat}?`;
      }
      url = this.endpoint(url);
      return url;
    },
    exportTo(outputFormat) {
      this.$store.commit("setIsPrinting", true);
      this.$nextTick(() => {
        if (this.serverProcessing || this.serverExport) {
          let url = this.getExportUrl(outputFormat);
          if (this.selectedItems.length) {
            url += "id__in=" + this.selectedItems.map((o) => o.id).join(",");
          } else {
            let filters = {
              ...this.filters,
              search: this.search,
            };
            Object.keys(filters).forEach((k) => {
              if (this.filters[k] != undefined)
                url += k.replaceAll(".", "__") + "=" + this.filters[k] + "&";
            });
            url += `headers=${JSON.stringify(
              this.headers.filter((o) => o.hideInExport != true)
            )}&`;
          }
          if (url[url.length - 1] != "&") url += "&";
          url += "token=" + this.token;

          this.downloadUrl(url);
        } else {
          if (outputFormat == "html") {
            this.print();
          } else if (outputFormat == "pdf") {
            this.print();
            return;
            let doc = new jsPDF();

            doc.html(document.body, {
              callback: function (doc) {
                doc.page = 1;
                doc.save();
              },
            });
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
        this.$store.commit("setIsPrinting", false);
      });
    },
    getItemValue(item, dotNotationString) {
      let value = dotNotationString.split(".").reduce((o, i) => {
        if (o) return o[i];
        return null;
      }, item);

      return value;
    },
  },
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
.nowrap {
  white-space: nowrap;
}
</style>