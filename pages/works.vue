<template>
  <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
          <h1>Works</h1>
          <v-container v-for="app in items" :key="app">
              <v-card>
                  <v-card-title>{{app.name}}</v-card-title>
                  <v-card-media>
                      <v-img v-bind:src="app.img"></v-img>
                      
                  </v-card-media>
                  <v-card-text>{{app.text}}</v-card-text>
                  <v-card-subtitle>Platform: {{app.platform.join(", ")}}</v-card-subtitle>
                  <v-card-subtitle>Status: {{app.status}}</v-card-subtitle>
                  <v-divider></v-divider>
                  <v-card-actions>
                      <v-btn elevation="0" v-if="app.url != ''" :to="app.url"><span class="info--text">{{app.buttonName}}</span></v-btn>
                      <v-btn elevation="0" v-if="app.outerurl != ''" :href="app.outerurl"><span class="info--text">{{app.buttonName}}</span></v-btn>
                  </v-card-actions>
              </v-card>
          </v-container>
      </v-col>
  </v-row>
</template>

<script>
import RoutineTreeImage from "~/components/RoutineTreeImage.vue"
export default {
    name: "WorksPage",
    data() {
        return {
            items: [
                {
                    name: "RoutineTree",
                    img: "/RoutineTree.png",
                    text: "Task management application that helps you accomplish your daily routine tasks.",
                    platform: ["iOS"],
                    status: "In Review",
                    url: "",
                    outerurl: "https://syamaz.github.io/RoutineTree/",
                    buttonName: "Read more"
                },
                {
                    name: "My homepage",
                    img: "",
                    text: "This website.",
                    platform: ["Web"],
                    status: "Released",
                    url: "/",
                    outerurl: "",
                    buttonName: "Top page"
                }
            ]
        };
    },
    components: { RoutineTreeImage }
}
</script>