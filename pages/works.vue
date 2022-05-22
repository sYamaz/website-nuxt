<template>
  <CardListViewTemplate :data="data" />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CardListViewTemplate, {
  CardListViewTemplateData
} from '../components/templates/CardListViewTemplate.vue'

@Component({
  components: {
    CardListViewTemplate
  }
})
export default class WorksPage extends Vue {
  private data: CardListViewTemplateData = {
    pageTitle: 'Works',
    works: [
      {
        name: 'RoutineTree',
        img: require('../static/RoutineTree.png'),
        text: 'Task management application that helps you accomplish your daily routine tasks.',
        platform: ['iOS'],
        status: 'Released',
        url: '',
        outerurl: 'https://syamaz.github.io/RoutineTree/',
        buttonName: 'Read more'
      },
      {
        name: 'My homepage',
        img: '',
        text: 'This website.',
        platform: ['Web'],
        status: 'Released',
        url: '/',
        outerurl: '',
        buttonName: 'Top page'
      }
    ]
  }
}
</script>
