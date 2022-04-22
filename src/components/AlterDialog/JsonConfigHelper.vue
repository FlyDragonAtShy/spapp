<template>
  <div class="text-center">
    <v-dialog v-model="dialog"
              height=800
              width="600">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          配置文件格式如下，请严格遵守，别瞎搞
        </v-card-title>
        <v-card-text>
          <v-textarea outlined
                      class="ma-2"
                      label="json"
                      height="400"
                      v-model="jsontemp"
                      hide-details="auto">
          </v-textarea>
          <div class="text-h6"
               style="color:red">{{fool}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 text
                 @click="dialog = false">
            已知晓
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>
<script>
import { formatJson, SaveToLocal, GetFromLocal } from '@/Helper/Common'
export default {
  data() {
    return {
      dialog: false,
      jsontemp: '',
      readcount: "readcount",
      fool: ''
    }
  },
  methods: {
    handDialog(e) {
      this.dialog = e;
      if (e) {
        let countstr = GetFromLocal(this.readcount);
        let count = countstr ? parseInt(countstr) : 0;
        if (count > 3) {
          this.fool = `这么简单的配置你竟然要看 ${count} 次，我怀疑你脑壳有问题ヽ(•ω•。)ノ`;
          SaveToLocal(this.readcount, ++count);
        } else if (count == 0) {
          SaveToLocal(this.readcount, 1);
        } else {
          this.fool = "";
          SaveToLocal(this.readcount, ++count);
        }
      }
    }
  },
  created: function () {

    this.jsontemp = ' {"Lists": [{"Name": "", "Receive": "","Send": [ ""]}]}';
    this.jsontemp = formatJson(this.jsontemp);


  }
}
</script>