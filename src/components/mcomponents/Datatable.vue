<template>
  <div>
    <div class="fixed-head">
      <table class="table table-striped table-bordered ">
        <thead>
          <tr>
            <th></th>
            <th v-for="(col, i) in cols" :key="i">
              <input v-for="(filter, j) in col.filters" :key="j" class="form-control" :type="col.type" :placeholder="'فیلتر ' + col.th" v-model="filters[filter]">
            </th>
          </tr>
          <tr>
            <th>#</th>
            <th v-for="(col, i) in cols" :key="i" @click="orderBy(col)">
              <span style="margin-left: 5px;">
                <i class="fas" :class="orderClass(col)"></i>
              </span>
              {{ col.th }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i">
            <td> {{ offset+i+1 }} </td>
            <td v-for="(col, j) in cols" :key="j">
              {{ item[col.td] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Page navigation rtl">
        <ul class="pagination justify-content-center">
          <li class="page-item " :class="{disabled: offset == 0}">
            <a @click.prevent="previousPage()" class="page-link " href="#">
              <i class="fas fa-angle-double-right  "></i>
            </a>
          </li>
          <li class="page-item" v-for="(page, i) in pages.pages" :key="i" :class="{active: page == pages.currentPage}">
            <a v-if="page == -1" @click.prevent class="page-link" href="#">...</a>
            <a v-else @click.prevent="goToPage(page)" class="page-link" href="#">{{ page+1 }}</a>
          </li>
          <li class="page-item" :class="{disabled: offset + limit >= count}">
            <a class="page-link" href="#" @click.prevent="nextPage()">
              <i class="fas fa-angle-double-left"></i>
            </a>
          </li>
        </ul>
    </nav>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "Datatable",
  props: ["url", "routerName", "cols"],
  data() {
    return {
      items: [],
      limit: 10,
      offset: 0,
      count: 0,
      filters: {},
      order: "",
      debouncedGetData: null
    };
  },
  created() {
    this.getData();
    this.debouncedGetData = _.debounce(this.getData, 300);
  },
  mounted() {},
  watch: {
    filters: {
      handler() {
        this.debouncedGetData();
      },
      deep: true
    },
    order() {
      this.debouncedGetData();
    }
  },
  computed: {
    pages() {
      let pages = [];
      let currentPage = this.offset / this.limit;
      let lastPage = Math.floor(this.count / this.limit);

      let pageLinkLimit = 2;

      if (currentPage >= 3) pages.push(-1);
      for (let i = currentPage - pageLinkLimit; i <= currentPage; i++) {
        if (i < 0) continue;
        pages.push(i);
      }

      for (
        let i = currentPage + 1;
        i <= currentPage + pageLinkLimit && i <= lastPage;
        i++
      )
        pages.push(i);
      if (pages[pages.length - 1] != lastPage) pages.push(-1);

      return {
        currentPage,
        pages
      };
    }
  },
  methods: {
    getData() {
      console.log("get data");
      this.request({
        url: this.url,
        method: "get",
        params: {
          limit: this.limit,
          offset: this.offset,
          ordering: this.order,
          ...this.filters
        },
        success: data => {
          this.count = data.count;
          this.items = data.results;
        }
      });
    },
    orderBy(col) {
      if (this.order == col.td) this.order = `-${col.td}`;
      else if (this.order == `-${col.td}`) this.order = "";
      else this.order = col.td;
      console.log("ordered by ", this.order);
    },
    orderClass(col) {
      let td = col.td;
      if (this.order == td) return { "fa-sort-up": true };
      if (this.order == `-${td}`) return { "fa-sort-down": true };
      return { "fa-sort": true };
    },
    nextPage() {
      this.offset += this.limit;
      this.getData();
    },
    previousPage() {
      this.offset -= this.limit;
      this.getData();
    },
    goToPage(n) {
      this.offset = this.limit * n;
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.fixed-head {
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}

.fixed-head thead tr:nth-child(2) {
  th {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    background-color: #eee;
    cursor: pointer;
  }
}

.fa-sort {
  color: rgba(0, 0, 0, 0.3);
}
</style>
