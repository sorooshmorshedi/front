<template>
  <m-form
    title="ماشین ها"
    :items="items"
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
    <template #default>
      <v-row>
        <v-col cols="12" md="6">
          <label>* شماره ماشین</label>
          <v-row no-gutters class="flex-row-reverse">
            <v-col cols="3">
              <div
                class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
              >
                <div class="v-input__control">
                  <div class="v-input__slot white">
                    <fieldset aria-hidden="true">
                      <legend style="width: 0px;">
                        <span>​</span>
                      </legend>
                    </fieldset>
                    <div class="v-text-field__slot ltr">
                      <input
                        id="car-number-1"
                        type="text"
                        v-model.lazy="carNumber[0]"
                        :disabled="!isEditing"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="2">
              <div
                class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
              >
                <div class="v-input__control">
                  <div class="v-input__slot white">
                    <fieldset aria-hidden="true">
                      <legend style="width: 0px;">
                        <span>​</span>
                      </legend>
                    </fieldset>
                    <div class="v-text-field__slot ltr">
                      <input
                        id="car-number-2"
                        type="text"
                        v-model.lazy="carNumber[1]"
                        :disabled="!isEditing"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div
                class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
              >
                <div class="v-input__control">
                  <div class="v-input__slot white">
                    <fieldset aria-hidden="true">
                      <legend style="width: 0px;">
                        <span>​</span>
                      </legend>
                    </fieldset>
                    <div class="v-text-field__slot ltr">
                      <input
                        id="car-number-3"
                        type="text"
                        v-model.lazy="carNumber[2]"
                        :disabled="!isEditing"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="4">
              <div
                class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
              >
                <div class="v-input__control">
                  <div class="v-input__slot white">
                    <fieldset aria-hidden="true">
                      <legend style="width: 0px;">
                        <span>​</span>
                      </legend>
                    </fieldset>
                    <div class="v-text-field__slot ltr">
                      <input
                        id="car-number-4"
                        type="text"
                        v-model.lazy="carNumber[3]"
                        :disabled="!isEditing"
                      />
                      <div class="v-text-field__suffix">ایران</div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-text-field label="* نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete
            label="* راننده"
            v-model="item.driver"
            :items="drivers"
            item-text="user.name"
            item-value="id"
            :return-object="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="* موزع"
            v-model="item.distributor"
            :items="distributors"
            item-text="user.name"
            item-value="id"
            :return-object="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import DistributionApiMixin from "@/modules/distribution/api";

export default {
  mixins: [MFormMixin, DistributionApiMixin],
  data() {
    return {
      baseUrl: "distributions/cars",
      permissionBasename: "car",
      appendSlash: true,
      carNumber: [null, null, null, null],
      cols: [
        {
          text: "شماره",
          value: "car_number",
        },
        {
          text: "نام",
          value: "name",
        },
        {
          text: "راننده",
          value: "driver.user.name",
        },
        {
          text: "موزع",
          value: "distributor.user.name",
        },
      ],
    };
  },
  computed: {
    items() {
      return this.cars;
    },
  },
  mounted() {
    IMask(document.getElementById("car-number-1"), {
      mask: "00",
    });
    IMask(document.getElementById("car-number-2"), {
      mask: "a",
    });
    IMask(document.getElementById("car-number-3"), {
      mask: "000",
    });
    IMask(document.getElementById("car-number-4"), {
      mask: "00",
    });
  },
  methods: {
    clearForm() {
      this.item = {};
      this.carNumber = [null, null, null, null];
    },
    getData() {
      this.getCars(true);
      this.getDrivers();
      this.getDistributors();
    },
    setItem(data) {
      let item = data;
      let carNumber = item.car_number;
      this.carNumber = carNumber.split(" ").reverse();
      this.item = item;
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      let car_number = this.copy(this.carNumber).reverse();
      item.car_number = car_number.join(" ");
      return item;
    },
  },
};
</script>