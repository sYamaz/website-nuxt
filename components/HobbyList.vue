<template>
  <v-container>
      <section-headline :title="headline"/>
      <v-container>
      <p>
          <span>Music🎵, Guitar🎸, Ramen🍜, Travel🛫</span>
      </p>
      </v-container>
  </v-container>
</template>

<script>
import SectionHeadline from './atoms/SectionHeadline.vue'
export default {
  components: { SectionHeadline },
    name:"HobbyList",
    data() {
        return {
            headline: "Hobby"
        }
    }
}
</script>
