<template>
  <AboutTemplate :data="data" />
</template>
<script lang="ts" setup>
import AboutTemplate, {
  AboutTemplateData
} from '~/components/templates/AboutTemplate.vue'

const data: AboutTemplateData = {
  pageTitle: 'Shun Yamazaki (sYamaz)',
  introAvatar: require('~/static/sYamaz.jpeg'),
  introHeadline: 'Corporate developer',
  introDescription:
      'Shun is a developer based in Japan. He is focusing on daily development and improving his skills to achieve his goal of becoming a full-stack engineer.',
  bioTitle: 'Biography',
  bioRecords: [
    {
      col1: '1990',
      col2: 'Born in Tokyo, Japan. And moved to Ibaraki.'
    },
    {
      col1: '2013',
      col2: "Completed bachelor's degree in Electrical, Electronic and Computer Engineering at Tokyo University of Science."
    },
    {
      col1: '2013',
      col2: 'Work as a developer at Orientalmotor co., ltd.'
    },
    {
      col1: '2022',
      col2: 'Work as a developer at Z-kai inc.'
    }
  ],
  hobbyTitle: 'Hobby',
  hobbyItems: ['Music🎵', ' Guitar🎸', 'Ramen🍜', 'Travel🛫'],
  webTitle: 'Web',
  webLinks: [
    {
      icon: 'mdi-twitter',
      name: 'Twitter(@ShunYamazaki5)',
      url: 'https://twitter.com/ShunYamazaki5'
    },
    {
      icon: 'mdi-github',
      name: 'GitHub(sYamaz)',
      url: 'https://github.com/sYamaz'
    },
    {
      icon: '',
      name: 'Qiita(sYamaz)',
      url: 'https://qiita.com/sYamaz'
    }
  ]
}
</script>
