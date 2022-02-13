<template>
  <v-container>
      <h2>Web</h2>
        <v-container v-for="item in items" v-bind:key="item">
            <v-btn elevation="0" class="info--text" :href="item.url" flat>{{item.name}} <v-icon v-if="item.icon != ''">{{item.icon}}</v-icon></v-btn>
        </v-container>
  </v-container>
</template>

<script>
export default {
    name:"WebActiviry",
    data() {
        return {
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