<template>
  <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
          <h1>Works</h1>
          <v-container v-for="app in items" :key="app">
              <WorkCard :work="app"></WorkCard>
          </v-container>
      </v-col>
  </v-row>
</template>

<script>
import RoutineTreeImage from "~/components/RoutineTreeImage.vue"
import WorkCard from "../components/WorkCard.vue"

export default {
    name: "WorksPage",
    data() {
        return {
            items: [
                {
                    name: "RoutineTree",
                    img: require("../static/RoutineTree.png"),
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
    components: { RoutineTreeImage, WorkCard }
}
</script>