<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr v-for="(item, i) in records" :key="i">
          <td :style="{width: firstColWidth < 0 ? undefined : firstColWidth}">{{ item.col1 }}</td>
          <td>{{ item.col2 }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

export interface TwoColomnsRecord{
    col1: any
    col2: any
}

@Component
export default class TwoColomnsTable extends Vue {
    @Prop({default:[]})
    private records!:TwoColomnsRecord[]
}
</script>