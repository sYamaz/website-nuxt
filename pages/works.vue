<template>
  <CardListViewTemplate :data="data" />
</template>

<script lang="ts" setup>
import CardListViewTemplate, {
  CardListViewTemplateData
} from '../components/templates/CardListViewTemplate.vue'

const data: CardListViewTemplateData = {
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

</script>
