<template>

  <v-dialog v-model="dialog"
            fullscreen
            overlay-color="white"
            transition="dialog-bottom-transition">
    <v-toolbar dark
               flat
               color="dark">
      <v-btn icon
             dark
             @click="closeConfig">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-toolbar-title>Settings</v-toolbar-title>
      <v-btn text
             @click="showHelp"
             class="pa-0">
        <v-icon color="blue">
          mdi-help-circle
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text
               @click="AddItem"
               color="primary">Add</v-btn>
        <v-btn text
               @click="RemoveItem"
               color="red">Remove</v-btn>
        <!-- <v-btn text
                       @click="importdata">导入</v-btn>   -->
        <v-btn text
               @click="document.getElementById('filesinput').click()">导入
          <v-file-input hide-input
                        multiple
                        class="d-none"
                        id="filesinput"
                        truncate-length="50"
                        @change="fileChange"></v-file-input>

        </v-btn>
        <!-- open-on-hover -->
        <v-menu bottom
                color="white"
                :close-on-content-click="false"
                :nudge-width="400"
                v-model="exportmenu"
                offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text
                   dark
                   v-bind="attrs"
                   v-on="on">
              导出
            </v-btn>
          </template>
          <v-card class="pa-md-6">
            <v-select v-model="selectedconfigs"
                      :items="configs"
                      label="请选择"
                      return-object
                      item-text="tabname"
                      item-value="tabname"
                      multiple>
              <template v-slot:prepend-item>
                <v-list-item ripple
                             @mousedown.prevent
                             @click="toggle">
                  <!-- <v-list-item-action>
                                    <v-icon :color="selectedconfigs.length > 0 ? 'indigo darken-4' : ''">
                                        {{ icon }}
                                    </v-icon>
                                </v-list-item-action> -->
                  <v-list-item-content>
                    <v-list-item-title>
                      Select All
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>

            </v-select>
            <v-card-actions>
              <v-spacer>

              </v-spacer>
              <v-btn text
                     @click="exportSelectdata"
                     color="primary">
                确认导出
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-btn text
               @click="exportCurrentdata">导出当前</v-btn>
        <!-- <v-btn text
                       @click="exportdata">导出全部</v-btn> -->
        <v-btn dark
               text
               @click="Save">
          Save -> localStorage
        </v-btn>
      </v-toolbar-items>
      <template v-slot:extension>

        <v-tabs v-model="tab"
                grow
                center-active
                align-with-title>
          <v-tab v-for="(item,index) in configs"
                 :key="index">
            <!-- <v-text>{{tablable}}</v-text> -->
            {{item.tabname}}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(item,index) in configs"
                  :key="index">
        <v-form ref="form"
                class="pa-3"
                lazy-validation>
          <v-text-field label="配置名称"
                        outlined
                        @change="tabnameChange"
                        :value="item.tabname"
                        dense>
          </v-text-field>
          <v-textarea outlined
                      fill-height
                      label="配置"
                      hide-details="auto"
                      height=500
                      v-model="item.text">
          </v-textarea>
          <!-- <v-card-text>{{item.text}}</v-card-text> -->
        </v-form>
      </v-tab-item>
    </v-tabs-items>
    <jch ref="jch1"> </jch>
  </v-dialog>
</template>
<script>
import {
  saveJSON, formatJson
} from '@/Helper/Common'
import jch from './AlterDialog/JsonConfigHelper.vue'

export default {
  data() {
    return {
      document,
      tab: null,
      dialog: false,
      tablable: "12",
      configs: [],
      selectedconfigs: [],
      exportmenu: false,
      isSelecting: false
    }
  },
  components: {
    jch
  },
  computed: {
    IsSelectAll() {
      return this.selectedconfigs.length === this.configs.length
    }
  },
  mounted: function () {
    var temp = window.localStorage.getItem("webspconfig");
    temp && (this.configs = JSON.parse(temp));
    this.configs.forEach(element => {
        
      element.text = formatJson(element.text, () => {

      });
    });
  },
  methods: {
    handDialog(e) {
      this.dialog = e || true;
    },
    showHelp() {
      this.$refs.jch1.handDialog(true);
    },
    Save() {
      // console.log(JSON.stringify(this.configs));
      window.localStorage.setItem("webspconfig", JSON.stringify(this.configs));
      alert("保存成功");
    },
    closeConfig() {

      //   window.localStorage.setItem("webspconfig", JSON.stringify(this.configs));
      this.$parent.refreshconfig();
      this.dialog = false;

    },
    tabnameChange(val) {
      if (this.tab != null) {
        this.configs[this.tab].tabname = val;
      }
    },
    AddItem() {

      if (!this.configs) {
        this.configs = [];
      }
      var name = (this.configs.length + 1).toString();
      var temp = {
        tabname: name,
        text: ''
      };
      this.configs.push(temp);
    },
    RemoveItem() {
      if (!this.configs) {
        return;
      }
      this.configs.splice(this.tab, 1);
    },
    importdata() {

    },
    exportdata() {
      this.configs.forEach(element => {
        saveJSON(element.text, element.tabname + '.json');
      });
    },
    exportCurrentdata() {
      if (!this.configs) {
        return;
      }
      var element = this.configs[this.tab];
      saveJSON(element.text, element.tabname + '.json');

    },
    exportSelectdata() {
      this.selectedconfigs.forEach(element => {
        saveJSON(element.text, element.tabname + '.json');
      });
    },
    fileChange(files) {

      var current = this;
      if (files) {
        files.forEach(file => {
          var reader = new FileReader(); //这是核心,读取操作就是由它完成.
          reader.readAsText(file); //读取文件的内容,也可以读取文件的URL
          reader.onload = function () {
            //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可

            let temp = {
              tabname: file.name.slice(0, file.name.length - 5),
              text: this.result
            };
            current.configs.push(temp);
          }
        });
      }
    },
    toggle() {
      this.$nextTick(() => {
        if (this.IsSelectAll) {
          this.selectedconfigs = []
        } else {
          this.selectedconfigs = this.configs.slice()
        }
      })
    },
  }
}
</script>
<style slot-scope>
.v-dialog {
  background: white;
}
</style>