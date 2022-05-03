<template>
  <v-list style="padding:0px">
    <v-list-item v-for="data in datas" :key="data" class="pa-0">
        <LinkButton :linkData="data"/>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import LinkButton, { LinkData } from "../atoms/LinkButton.vue"

@Component({components:{
    LinkButton
}})
export default class LinkButtonStack extends Vue {
    @Prop({default:[
        {
            icon: '',
            name: 'A',
            url: ''
        },
        {
            icon: '',
            name: 'BBBB',
            url: ''
        },
    ]})
    private datas!:LinkData[]
}
</script>