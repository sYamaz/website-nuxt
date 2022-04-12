<template>
  <v-container>
    <page-headline :title="headline"></page-headline>
    <v-container>
        <v-row>
            <v-col cols="1" class="ml-4 mr-4">
                <v-avatar alt="sYamaz" s size="64">
                    <img src="../static/sYamaz.jpeg">
                </v-avatar>
            </v-col>
            <v-col class="ml-8">
                <h3>Corporate developer</h3>
                <p> Shun is a developer based in Japan. He is focusing on daily development and improving his skills to achieve his goal of becoming a full-stack engineer.</p>
            </v-col>
        </v-row>
    
    
    </v-container>
  </v-container>
</template>

<script>
import PageHeadline from './atoms/PageHeadline.vue'
export default {
  components: { PageHeadline },
    name: "SelfIntroduction",
    data() {
        return {
            headline : "Shun Yamazaki (sYamaz)"
        }
    }
}
</script>

<style>

</style>