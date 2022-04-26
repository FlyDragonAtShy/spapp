<template>
  <!-- <v-navigation-drawer color="grey-darken-2" permanent></v-navigation-drawer> -->
  <v-container fluid fill-height>
    <v-row fill-height>
      <v-col cols="3">
        <!-- <v-card>
                <v-card-header>
                  <v-card-header-text>串口配置</v-card-header-text>
                </v-card-header>
                <v-card-text>
                  <v-select
                  v-model="select"
                  :items="items"
                  :rules="[v => !!v || 'Item is required']"
                  label="Item"
                  required
                ></v-select>
                </v-card-text>
              </v-card> -->
        <v-form ref="form" lazy-validation>
          <!-- <v-select v-model="Spselect"
                                :items="SpList"
                                label="串口"
                                :dense="comboxdense"
                                :disabled="SpIsOpen"
                                :rules="[v => !!v || 'Item is required']"
                                outlined></v-select> -->
          <v-select
            v-model="BaudRate"
            :items="BaudRates"
            :rules="[(v) => !!v || 'Item is required']"
            label="波特率"
            :dense="comboxdense"
            :disabled="SpIsOpen"
            outlined
            required
          >
          </v-select>
          <v-select
            v-model="Parity"
            :items="Paritys"
            :dense="comboxdense"
            :disabled="SpIsOpen"
            item-text="text"
            item-value="value"
            outlined
            return-object
            label="校验位"
          ></v-select>
          <v-select
            v-model="DataBitse"
            :items="DataBitses"
            :dense="comboxdense"
            outlined
            :disabled="SpIsOpen"
            :rules="[(v) => !!v || 'Item is required']"
            label="数据位"
            required
          ></v-select>
          <v-select
            v-model="StopBitse"
            :items="StopBitses"
            :dense="comboxdense"
            :disabled="SpIsOpen"
            item-text="text"
            item-value="value"
            outlined
            return-object
            label="停止位"
            required
          ></v-select>
          <v-select
            v-model="selectedFilter"
            :items="Spfilters"
            :dense="comboxdense"
            return-object
            item-text="text"
            item-value="text"
            outlined
            :rules="[(v) => !!v || 'Item is required']"
            label="过滤器"
            required
          ></v-select>
          <div class="text-center">
            <v-btn
              depressed
              @click="OpenSp"
              :color="SpIsOpen ? 'error' : 'primary'"
              >{{ OpenSptext }}</v-btn
            >
          </div>
        </v-form>
        <!-- <v-row class="mt-5">
          <v-col cols="12">
            <v-tabs vertical v-model="WriteData">
              <v-tab v-for="(item, index) in WriteDatas" :key="index">{{
                item.index
              }}</v-tab>

              <v-tab-item v-for="(item, index) in WriteDatas" :key="index">
                <v-textarea
                  outlined
                  class="ma-2"
                  label="串口数据"
                  :disabled="!SpIsOpen"
                  hide-details="auto"
                  v-model="item.text"
                ></v-textarea>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row> -->
        <!-- <v-row>
          <v-col class="mt-0 text-center" cols="6">
            <v-btn @click="ClearRecord" color="error"> 清空</v-btn>
          </v-col>
          <v-col class="mt-0 text-center" cols="6">
            <v-btn
              :disabled="!SpIsOpen"
              :color="SpIsOpen ? 'primary' : ''"
              @click="Write"
            >
              发送</v-btn
            >
          </v-col>
        </v-row> -->
      </v-col>
      <v-col cols="9">
        <div style="height: 90%">
          <v-list class="overflow-y-auto" dense max-height="500">
            <v-list-item v-for="(item, index) in chatlogs" :key="index">
              <div
                :class="[
                  { 'red--text': item.IsSend == false },
                  { 'green--text': item.IsSend == true },
                ]"
              >
                {{ item.text }}
              </div>
            </v-list-item>
          </v-list>
        </div>
        <!-- <div class="grid-container" style="height: 8%">
          <div>
            <v-select
              :dense="comboxdense"
              outlined
              v-model="selectedConfig"
              :items="configs"
              return-object
              item-text="tabname"
              item-value="tabname"
              label="配置"
            >
            </v-select>
          </div>
          <div>
            <v-btn @click="Editconfig">编辑配置</v-btn>
          </div>
          <div>
            <v-checkbox
              class="mt-0"
              v-model="IsAccurate"
              label="精确匹配"
            ></v-checkbox>
          </div>
        </div> -->
      </v-col>
    </v-row>
    <nsb ref="nsb1"></nsb>
    <configedit ref="configedit1"></configedit>
    <closesp ref="closesp1"></closesp>
  </v-container>
  <!-- <v-card height="200px"></v-card> -->
</template>
<script>
import nsb from "./AlterDialog/NotSupportBrowser.vue";
import configedit from "./ConfigEdit.vue";
import closesp from "./AlterDialog/CloseSp.vue";
import {
  formatDate,
  uint8ArrayToHex,
  HexStringToArray,
  hexToString,
} from "@/Helper/Common";
import Enumerable from "linq";

export default {
  data: () => ({
    drawer: false,
    disablelookup: true,
    chatlog: "",
    chatlogs: [],
    SpIsOpen: false,
    OpenSptext: "打开串口",
    WriteData: null,
    WriteDatas: [
      {
        index: 0,
        text: "",
      },
      {
        index: 1,
        text: "",
      },
      {
        index: 2,
        text: "",
      },
    ],
    group: null,
    port: {},
    writerobj: null,
    Readerobj: null,
    comboxdense: true,
    flowIndex: 0,
    SpList: ["COM1", "COM2", "COM3"],
    Spselect: "",
    IsAccurate: false,
    Paritys: [
      {
        value: "none",
        text: "无",
      },
      {
        value: "even",
        text: "奇校验",
      },
      {
        value: "odd",
        text: "偶校验",
      },
    ],
    Parity: {
      value: "none",
      text: "无",
    },
    StopBitses: [
      {
        value: 1,
        text: "1",
      },

      {
        value: 2,
        text: "2",
      },
    ],
    StopBitse: {
      value: 1,
      text: "1",
    },
    BaudRates: [2400, 4800, 9600, 14400, 19200],
    BaudRate: 9600,
    DataBitses: [7, 8],
    DataBitse: 8,
    configs: [],
    selectedConfig: null,
    Spfilters: [
      {
        start: "68",
        end: "16",
        text: "标准协议",
      },
      {
        start: "FF55",
        end: "FFAA",
        text: "报警器",
      },
      {
        start: "BB",
        end: "0D",
        text: "基板",
      },
      {
        start: "7A72",
        end: "AA",
        text: "10协议",
      },
      {
        start: "",
        end: "",
        text: "无",
      },
    ],

    selectedFilter: {
      start: "",
      end: "",
      text: "无",
    },
    ReceiveCache: "", //接收数据缓存区
    curruntReceiveWeight: "",
    curruntReceiveCode: "",
    lastTime: 0,
  }),
  components: {
    nsb,
    configedit,
    closesp,
  },

  mounted: function () {
    this.refreshconfig();
    this.InitSpConfig();
    if ("serial" in navigator) {
      navigator.serial.getPorts().then((res) => {
        if (res && res.length > 0) {
          this.$refs.closesp1.handDialog(true);

          // this.port = res[0];
          // this.port.open({
          //     baudRate: this.BaudRate,
          //     dataBits: this.DataBitse,
          //     parity: this.Parity.value,
          //     stopBits: this.StopBitse.value
          // });
          // this.OpenReadStream();
          // this.SpIsOpen = true;
          // console.log('init port info');
          // console.log(this.port);
        }
      });

      // console.log(ports);

      // The Web Serial API is supported.
    } else {
      this.$refs.nsb1.handDialog(true);
      return;
      //show dialog
    }
  },
  created: function () {
    window.addEventListener("keypress", (e) => {
      e = e || window.event;
      var currCode = e.keyCode || e.which || e.charCode;
      var currTime = new Date().getTime();
      if (this.lastTime > 0) {
        if (currTime - this.lastTime <= 100) {
          this.curruntReceiveCode += String.fromCharCode(currCode);
        } else if (currTime - this.lastTime > 500) {
          // 输入间隔500毫秒清空
          this.ClearBarCode();
        }
      } // 第一次按键
      else {
        this.curruntReceiveCode = String.fromCharCode(currCode);
      }
      this.lastTime = currTime;

      if (currCode == 13) {
        // 回车
        if (this.curruntReceiveCode && this.curruntReceiveCode.length > 5) {
          console.log(this.curruntReceiveCode);

          axios({
            method: "post",
            url: "https://armour-netease.vercel.app/search?keywords=%E6%B5%B7%E9%98%94%E5%A4%A9%E7%A9%BA",
          })
            .then((response) => {
              this.AddMessage(
                "success   编号：" +
                  this.curruntReceiveCode +
                  ",重量：" +
                  this.curruntReceiveWeight
              ,true);
              console.log(response);
              // 回车输入后清空
              this.ClearBarCode();
            })
            .catch((error) => {
              this.AddMessage(
                "failed   编号：" +
                  this.curruntReceiveCode +
                  ",重量：" +
                  this.curruntReceiveWeight
              ,true);
              console.log(error);
            });
        }
      }
    });
  },
  methods: {
    async OpenSp() {
      if (this.SpIsOpen) {
        this.$refs.closesp1.handDialog(true);

        // await this.port.close();
        this.SpIsOpen = false;
        return;
      }
      this.port = await navigator.serial.requestPort();

      this.port.addEventListener("connect", (event) => {
        //不奏效 暂未解决
        console.log("连接成功");
        // debugger
        // this.Spconnect(event);
      });
      // this.port.addEventListener('disconnect', event => {
      //     this.Spdisconnect(event);
      // });
      try {
        await this.port.open({
          baudRate: this.BaudRate,
          dataBits: this.DataBitse,
          parity: this.Parity.value,
          stopBits: this.StopBitse.value,
        });
        // const ports = navigator.serial.getPorts();
        // console.log(ports);
        this.SaveSpConfig();
        this.SpIsOpen = true;
        console.log("real port info");

        console.log(this.port);
      } catch (error) {
        this.SpIsOpen = false;
        return;
      }
      this.OpenReadStream();
    },
    async OpenReadStream() {
      while (this.port.readable) {
        if (this.Readerobj == null)
          this.Readerobj = this.port.readable.getReader();

        try {
          while (typeof x === "undefined") {
            const { value, done } = await this.Readerobj.read();
            if (done) {
              // Allow the serial port to be closed later.
              this.Readerobj.releaseLock();
              break;
            }
            if (value) {
              console.log(value);

              var receiveStr = hexToString(uint8ArrayToHex(value));
              //过滤不完整数据
              receiveStr = this.filterData(receiveStr);
              if (!receiveStr) break;
              this.AddMessage(receiveStr, false);
              if (this.selectedConfig) {
                var CurrentRuleConfig = JSON.parse(
                  this.selectedConfig.text
                ).Lists;
                if (this.IsAccurate) {
                  var rule = Enumerable.from(CurrentRuleConfig).firstOrDefault(
                    (c) => c.Receive == receiveStr
                  );
                  if (rule) {
                    for (let index = 0; index < rule.Send.length; index++) {
                      this.WriteStr(rule.Send[index], rule.Name);
                    }
                  }
                } else {
                  if (
                    CurrentRuleConfig &&
                    CurrentRuleConfig.length > this.flowIndex
                  ) {
                    CurrentRuleConfig[this.flowIndex].Send.forEach(
                      (element) => {
                        this.WriteStr(
                          element,
                          CurrentRuleConfig[this.flowIndex].Name
                        );
                      }
                    );
                    this.flowIndex++;
                  }
                }
              }
              // console.log();
            }
          }
        } catch (error) {
          console.log(error);
          // TODO: Handle non-fatal read error.
        }
      }
    },
    async Write() {
      if (this.WriteData == null) return;
      this.WriteStr(this.WriteDatas[this.WriteData].text);
    },
    async WriteStr(str, name) {
      if (this.writerobj == null)
        this.writerobj = this.port.writable.getWriter();
      var data = HexStringToArray(str);
      if (data && data != "") {
        this.AddMessage(str, true, name);
        await this.writerobj.write(data);
        // this.chatlog += `${formatDate(new Date(), 'hh:mm:ss')} 发送(${name}):\r${str} \r`;
      }
    },

    AddMessage(Message, IsSend, Name) {
      var type = IsSend ? "发送" : "接收";
      Name || (Name = "");
      var mess = `${formatDate(
        new Date(),
        "hh:mm:ss"
      )} ${type} (${Name}):\r${Message} \r`;
      this.chatlog += mess;
      this.chatlogs.push({
        IsSend: IsSend,
        text: mess,
      });
    },
    ClearRecord() {
      this.chatlog = "";
      this.flowIndex = 0;
      this.ReceiveCache = "";
      this.chatlogs = [];
    },
    Editconfig() {
      this.$refs.configedit1.handDialog(true);
    },
    refreshconfig() {
      var text = window.localStorage.getItem("webspconfig");
      text && (this.configs = JSON.parse(text));
    },
    filterData2(str) {
      if (!str) return null;
      if (!this.selectedFilter.start) return str;
      str = this.ReceiveCache + str;
      if (
        str.slice(0, this.selectedFilter.start.length) ==
          this.selectedFilter.start &&
        str.slice(-this.selectedFilter.end.length) == this.selectedFilter.end
      ) {
        this.ReceiveCache = "";
        return str;
      } else {
        this.ReceiveCache += str;
        return null;
      }
    },
    filterData(str) {
      if (!str) return null;
      if (str.indexOf("\n") != -1) {
        var temp = (this.ReceiveCache += str);
        this.ReceiveCache = "";
        this.curruntReceiveWeight = temp;
        return temp;
      } else {
        this.ReceiveCache += str;
        return null;
      }
    },
    ClearBarCode() {
      this.curruntReceiveCode = "";
      this.lastTime = 0;
    },
    SaveSpConfig() {
      window.localStorage.setItem("sp_Parity", JSON.stringify(this.Parity));
      window.localStorage.setItem(
        "sp_StopBitse",
        JSON.stringify(this.StopBitse)
      );
      window.localStorage.setItem("sp_BaudRate", this.BaudRate);
      window.localStorage.setItem("sp_DataBitse", this.DataBitse);
    },
    InitSpConfig() {
      if (window.localStorage.getItem("sp_Parity")) {
        this.Parity = JSON.parse(window.localStorage.getItem("sp_Parity"));
        this.StopBitse = JSON.parse(
          window.localStorage.getItem("sp_StopBitse")
        );
        this.BaudRate = parseInt(window.localStorage.getItem("sp_BaudRate"));
        this.DataBitse = parseInt(window.localStorage.getItem("sp_DataBitse"));
      }
    },
  },
  watch: {
    group() {
      this.drawer = false;
    },
    SpIsOpen: function (val, oldVal) {
      this.OpenSptext = val ? "关闭串口" : "打开串口";
    },
  },
};
</script>
<style slot-scope>
v-select {
  /* max-height: 10px;
  font-size: 5px; */
  height: 30;
}

v-container {
  align-items: inherit;
}

.v-tab {
  min-width: 25px;
  width: 30px;
}
.grid-container {
  display: grid;
  justify-content: flex-end;
  grid-template-columns: auto auto auto; /* 设置网格宽度小于容器宽度 */
  grid-gap: 10px;
  padding: 10px;
}

.grid-container > div {
  padding: 10px 10px;
}
</style>