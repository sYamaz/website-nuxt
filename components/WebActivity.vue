<template>
  <v-container>
      <section-headline :title="headline"/>
        <v-container v-for="item in items" v-bind:key="item">
            <link-button :linkData="item"/>
        </v-container>
  </v-container>
</template>

<script>
import LinkButton from './atoms/LinkButton.vue'
import SectionHeadline from './atoms/SectionHeadline.vue'
export default {
  components: { SectionHeadline, LinkButton },
    name:"WebActiviry",
    data() {
        return {
        headline: "Web",
        items:[
            {
                icon: "mdi-twitter",
                name: "Twitter(@ShunYamazaki5)",
                url: "https://twitter.com/ShunYamazaki5"
            },
            {
                icon: "mdi-github",
                name: "GitHub(sYamaz)",
                url: "https://github.com/sYamaz"
            },
            {
                icon:"",
                name: "Qiita(sYamaz)",
                url: "https://qiita.com/sYamaz"
            }
        ]
        }
    }
}
</script>