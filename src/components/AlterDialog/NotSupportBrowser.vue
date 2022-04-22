<template>
    <div class="text-center">
        <v-dialog v-model="dialog"
                  width="500">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    浏览器不受支持
                </v-card-title>
                <v-card-text>
                    <div class="text-h6 pa-12">当前浏览器不支持串口操作，
                        <a target="blank"
                           href="https://caniuse.com/?search=serialport">查看支持列表</a>
                    </div>

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
export default {
    data() {
        return {
            dialog: false,
        }
    },
    methods: {
        handDialog(e) {
            this.dialog = e;
        }
    }
}
</script>