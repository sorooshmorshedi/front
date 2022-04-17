<template>
  <m-form
    :title="title"
    :items="items"
    :showList="showList"
    :cols="cols"
    :canSubmit="canSubmit"
    :canDelete="canDelete"
    :is-editing.sync="isEditing"
    :showListBtn="false"
    :show-navigation-btns="false"
    @click:row="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #header-btns>
      <template v-for="i in 3">
        <v-btn
          :key="i"
          v-if="i-1 != level"
          class="blue white--text mr-1 mt-1 mt-md-0"
          :to="`/panel/wares/${i-1}`"
        >تعریف {{ getWareTitle(i-1) }}</v-btn>
        <v-btn
          :key="i"
          v-else
          class="blue white--text mr-1 mt-1 mt-md-0"
          @click="clearForm"
        >تعریف {{ getWareTitle(i-1) }}</v-btn>
      </template>
      <v-btn
        class="blue white--text mr-1 mt-1 mt-md-0"
        :to="{name:'Wares', params: {level:3}}"
      >تعریف کالا</v-btn>
    </template>

    <template #default>
      <v-row>
        <v-col cols="12" md="6" v-if="level != 0">
          <v-autocomplete
            :return-object="true"
            :label="' * ' + getWareTitle(level - 1)"
            :items="parentItems"
            v-model="item.parent"
            item-text="name"
            :disabled="item.id != undefined || !isEditing"
            item-value="id"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" :md="level == 0?12:6">
          <v-text-field label="کد" v-model="item.code" disabled />
        </v-col>
        <v-col cols="12" :md="isWare?4:12">
          <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <template v-if="isWare">
          <v-col cols="12" md="4">
            <v-switch
              :disabled="item.id != undefined || !isEditing"
              label="کالای خدماتی"
              v-model="item.is_service"
              hint="کالای خدماتی انبار گردانی ندارد"
            ></v-switch>
          </v-col>
          <v-col cols="12" md="4">
            <v-switch
              v-if="isAdvari"
              :disabled="!isEditing"
              label="موجودی کالای منفی"
              v-model="item.check_inventory"
              :false-value="true"
              :true-value="false"
            ></v-switch>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn @click="pricesDialog = true" block color="cyan white--text">واحد و قیمت فروش</v-btn>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              label=" * نوع قیمت گذاری"
              :items="pricingTypes"
              v-model="item.pricingType"
              item-text="name"
              item-value="id"
              :disabled="!isEditing"
              :return-object="true"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              :return-object="false"
              label=" * انبار پیشفرض"
              :items="warehouses"
              v-model="item.warehouse"
              :disabled="!isEditing"
              item-text="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="بارکد" v-model="item.barcode" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="3">
            <money label="حداقل فروش" v-model="item.minSale" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="3">
            <money label="حداکثر فروش" v-model="item.maxSale" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="3">
            <money label="حداقل موجودی" v-model="item.minInventory" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="3">
            <money label="حداکثر موجودی" v-model="item.maxInventory" :disabled="!isEditing" />
          </v-col>
        </template>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>

      <v-dialog v-model="pricesDialog" scrollable max-width="1200px" transition="dialog-transition">
        <v-card>
          <v-card-title>
            واحد و قیمت فروش
            <span class="pr-1">{{ item.name }}</span>
          </v-card-title>

          <v-card-text>
            <input-table v-model="rows">
              <template #thead>
                <tr>
                  <th>#</th>
                  <th>واحد</th>
                  <th>ضریب تبدیل</th>
                  <th v-for="salePriceType in salePriceTypes">{{ salePriceType.name }}</th>
                  <th></th>
                </tr>
              </template>
              <template #tbody>
                <tr v-for="(row,i) in rows" :key="i">
                  <td class="tr-counter">{{ i+1 }}</td>
                  <td style="min-width: 100px">
                    <v-autocomplete
                      :return-object="false"
                      :items="units"
                      v-model="row.unit"
                      item-text="name"
                      item-value="id"
                      :disabled="!isEditing"
                    ></v-autocomplete>
                  </td>
                  <td>
                    <span v-if="i == 0">(واحد اصلی)</span>
                    <money v-else v-model="row.conversion_factor" :disabled="!isEditing" />
                  </td>
                  <td v-for="salePriceType in salePriceTypes" style="width: 150px">
                    <money :disabled="!isEditing" v-model="row.prices[salePriceType.id]" />
                  </td>
                  <td class="d-print-none">
                    <v-btn
                      v-if="i != rows.length-1"
                      @click="deleteRow(i)"
                      class="red--text"
                      icon
                      :disabled="!isEditing"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </input-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="pricesDialog = false" color="blue white--text w-100px">تایید</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </m-form>
</template>
<script>
import WareApiMixin from "@/mixin/wareApi";
import { MFormMixin } from "@/components/m-form";

export default {
  name: "Wares",
  mixins: [MFormMixin, WareApiMixin],
  props: {
    level: {
      requried: true,
    },
    showList: {
      default: true,
    },
  },
  data() {
    return {
      item: {},
      baseUrl: "wares/wares",
      permissionBasename: "ware",
      rowKey: "unit",
      pricesDialog: false,
      cols: [
        {
          text: "کد",
          value: "code",
        },
        {
          text: "نام",
          value: "name",
        },
      ],
    };
  },
  computed: {
    title() {
      return this.getWareTitle(this.level);
    },
    isWare() {
      return this.level == 3;
    },
    parentItems() {
      return this.wares.filter((o) => o.level == +this.level - 1);
    },
    items() {
      return this.wares.filter((o) => {
        return o.level == this.level;
      });
    },
    parents() {
      let parent = this.item.parent;
      let parents = [];
      let parentId = false;
      if (typeof parent == typeof 72) {
        parentId = parent;
      } else if (parent && parent.id) {
        parentId = parent.id;
      }
      while (parentId) {
        let parent = this.wares.filter((o) => o.id == parentId)[0];
        parents.push(parent.name);
        parentId = parent.parent;
      }
      return parents.reverse().join(" > ");
    },
  },
  methods: {
    getRowTemplate() {
      return {
        unit: null,
        conversion_factor: null,
        prices: {},
      };
    },
    getData() {
      this.getUnits();
      this.getSalePriceTypes();
      this.getWarehouses();
      this.getWares(true);
    },

    getWareTitle(level) {
      switch (Number(level)) {
        case 0:
          return "ماهیت";
        case 1:
          return "گروه";
        case 2:
          return "دسته بندی";
        case 3:
          return "کالا";
      }
    },
    setItem(item) {
      this.request({
        url: this.endpoint(`wares/wares/${item.id}`),
        method: "get",
        success: (data) => {
          item = data;
          if (item.salePrices.length) {
            this.rows = item.salePrices;
          } else {
            this.rows = [this.getRowTemplate()];
          }
          this.item = item;
        },
      });
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      item.level = this.level;
      item.salePrices = this.rows.map((o) => this.extractIds(o));
      return item;
    },
    getItemTemplate() {
      return {
        parent: null,
      };
    },
  },
};
</script>