<template>
  <v-card>
    <BiographyTable></BiographyTable>
    <HobbyList></HobbyList>
    <WebActivity></WebActivity>
  </v-card>  
</template>

<script>
import BiographyTable from "~/components/BiographyTable.vue";
import HobbyList from "~/components/HobbyList.vue";
import WebActivity from "~/components/WebActivity.vue";
export default {
    name: "IndexPage",
    components: { BiographyTable, HobbyList, WebActivity }
}
</script>
