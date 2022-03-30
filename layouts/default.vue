<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :color="$vuetify.theme.dark ? 'dark' : undefined"
      fixed
      app
    >
      
      <v-toolbar-title v-text="title"/>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon v-if="$vuetify.theme.dark">mdi-white-balance-sunny</v-icon>
        <v-icon v-if="$vuetify.theme.dark !== true">mdi-weather-night</v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-nav-icon :href="sourceUrl"><v-icon>mdi-github</v-icon></v-app-bar-nav-icon>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="true"
      app
    >
      <v-spacer></v-spacer>
      <span>&copy; {{ new Date().getFullYear() }} Shun Yamazaki. All Rights Reserved.</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: false,
      items: [
        {
          title: 'About',
          to: '/'
        },
        {
          title: "Works",
          to: "/works"
        }
      ],
      title: 'Shun Yamazaki',
      sourceUrl: "https://github.com/sYamaz/website-nuxt",
    }
  }
}
</script>
