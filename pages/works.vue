<template>
  <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
          <page-headline :title="headline" />
          <v-container v-for="app in items" :key="app">
              <WorkCard :work="app"></WorkCard>
          </v-container>
      </v-col>
  </v-row>
</template>

<script>
import PageHeadline from '~/components/atoms/PageHeadline.vue';
import RoutineTreeImage from "~/components/RoutineTreeImage.vue"
import WorkCard from "~/components/organisms/WorkCard.vue"

export default {
    name: "WorksPage",
    data() {
        return {
            headline: "Works",
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
    components: { RoutineTreeImage, WorkCard, PageHeadline }
}
</script>