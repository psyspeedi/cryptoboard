<template>
  <v-app>
    <!-- <v-navigation-drawer app>
      
    </v-navigation-drawer> -->

    <v-app-bar app>
      <h1 class="text-xl-h1">CryptoBoard</h1>
      <v-btn elevation="2">Log in / Sign in</v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  })
};
</script>

<style lang="scss">
  .v-toolbar__content {
    justify-content: space-between;   
  }
</style>>