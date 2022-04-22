<template>
    <div class="text-center">
        <v-dialog v-model="dialog" height=800
                  width="600">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    请手动关闭串口
                </v-card-title>
                <v-card-text>
                    <!-- <div class="text-h6 pa-12">

                    </div> -->
                    <v-img :src="require('@/assets/closesp.png')"
                           class="my-3"
                           contain
                           height="500" />

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