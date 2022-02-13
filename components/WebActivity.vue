<template>
  <v-container>
      <h1>Web</h1>
        <v-container v-for="item in items" v-bind:key="item">
            <v-btn class="info--text" :href="item.url" flat>{{item.name}}</v-btn>
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
                name: "Twitter(@ShunYamazaki5)",
                url: "https://twitter.com/ShunYamazaki5"
            },
            {
                name: "GitHub(sYamaz)",
                url: "https://github.com/sYamaz"
            },
            {
                name: "Qiita(sYamaz)",
                url: "https://qiita.com/sYamaz"
            }
        ]
        }
    }
}
</script>