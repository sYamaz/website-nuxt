<template>
    <v-container>
  <v-row class="">
    <v-col cols="12" sm="2" style="max-width: fit-content;" class="pa-4">
      <v-avatar alt="sYamaz" s size="64">
        <img :src="avatarSrc" />
      </v-avatar>
    </v-col>
    <v-col class="" align-self="center">
      <SubContentHeadline :title="headline" />
      <p>{{description}}</p>
    </v-col>
  </v-row></v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SubContentHeadline from "~/components/atoms/SubContentHeadline.vue";
@Component({
  components: {
    SubContentHeadline,
  },
})
export default class AvatarDescriptionSection extends Vue {
  @Prop({ default: "headline" })
  private headline!: string;
  @Prop({ default: "description" })
  private description!: string;
  @Prop({ default: null })
  private avatarSrc!: any;
}
</script>