                  <tr class="pt-10 green lighten-4">
                    <td class="text-center">
                      +
                    </td>
                    <td class="text-center">
                      <money v-if="item.tax_row.slice().reverse()[0]" v-model="from = item.tax_row.slice().reverse()[0].auto_from" disabled="true"></money>
                      <v-text-field
                          v-if="!item.tax_row.slice().reverse()[0]"
                          class="currency-input"
                          v-model="first"
                          disabled="true"
                      >
                      </v-text-field>

                    </td>
                    <td class="text-center">
                      <money v-model="to" :disabled="!isEditing"></money>
                    </td>
                    <td class="text-center">
                      <money
                          v-model="ratio"
                          v-if="item.tax_row.slice().reverse()[0]"
                          :disabled="!isEditing"
                      ></money>
                      <v-text-field
                          v-if="!item.tax_row.slice().reverse()[0]"
                          class="currency-input"
                          v-model="moaf"
                          disabled="true"
                      >
                      </v-text-field>

                    </td>
                    <td class="text-center" colspan="2">
                    </td>
                    <td class="text-center">
                      <v-btn
                          v-if="item.tax_row.slice().reverse()[0]"
                          color="green darken-2 white--text"
                          @click="add_row(item.id)"
                          :disabled="!isEditing"
                      >
                        ایجاد ردیف جدید
                      </v-btn>
                      <v-btn
                          v-if="!item.tax_row.slice().reverse()[0]"
                          color="green darken-2 white--text"
                          @click="add_row(item.id) ; goTo(item.id)"
                          :disabled="!isEditing"
                      >
                        ایجاد ردیف جدید
                      </v-btn>
                    </td>

                  </tr>


                    <td class="text-center">
                      <v-btn
                          text
                          color="error"
                          :disabled="!isEditing"
                          @click="delete_row(row.id)"
                      >
                        حذف
                      </v-btn>
                    </td>
