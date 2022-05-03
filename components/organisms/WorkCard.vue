<template>
    <v-card>
        <v-card-title>{{ work.name }}</v-card-title>
        <v-card-media>
            <v-img v-bind:src="work.img"></v-img>
        </v-card-media>
        <v-card-text>{{ work.text }}</v-card-text>
        <v-card-subtitle>Platform: {{ work.platform.join(", ") }}</v-card-subtitle>
        <v-card-subtitle>Status: {{ work.status }}</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-actions>
            <LinkButton v-if="work.url !== ''" :linkData="{icon:'', name:work.buttonName, url:work.url}" />
            <LinkButton v-if="work.outerurl !== ''" :linkData="{icon:'', name:work.buttonName, url:work.outerurl}" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import LinkButton from "../atoms/LinkButton.vue"

export interface Work{
    name:string,
    img:any,
    text:string,
    platform:string[],
    status:string,
    url:string,
    outerurl:string,
    buttonName:string
}

@Component({
    components:{
        LinkButton
    }
})
export default class WorkCard extends Vue {
    @Prop({default: {
        name: 'name',
        img: '',
        platform: ['A', 'B'],
        status: 'Status',
    }})
    private work!:Work
}
</script>