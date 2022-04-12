<template>
  <v-btn elevation="0" class="info--text" :href="linkData.url" flat>{{linkData.name}} <v-icon v-if="linkData.icon != ''">{{linkData.icon}}</v-icon></v-btn>
</template>

<script>
export default {
    name: "LinkButton",
    props: {
        linkData: {
            icon: "mdi-icon-name",
            name: "displayName",
            url: "url",
        }
    }
}
</script>