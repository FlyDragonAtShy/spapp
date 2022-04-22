<template>
  <v-app>
    <v-app-bar app
               dark
               density="compact">
      <v-app-bar-title>GTinny</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn text
             href="https://gitee.com/GTinny/SPAuto"
             target="blank">gitee</v-btn>
      <v-btn class="mr-3"
             :disabled=true
             text>Github</v-btn>
      <!-- <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
    </v-app-bar>

    <v-main>
      <MainView/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import MainView from './components/MainView.vue'
export default {
  name: 'App',

  components: {
    MainView,
  },

  data: () => ({
    //
  }),
};
</script>