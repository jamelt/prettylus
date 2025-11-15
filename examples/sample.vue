<template lang="pug">
.app-container
  header.app-header
    h1.title Welcome to Prettylus
    nav.navigation
      a(href="#features") Features
      a(href="#docs") Documentation
      a(href="#github") GitHub

  main.content
    section.hero
      h2 Beautiful Vue Components
      p Format your Vue SFCs with Stylus support seamlessly
      button.cta(@click="getStarted") Get Started

    section.features
      feature-card(
        :description="feature.description"
        :icon="feature.icon"
        :key="feature.id"
        :title="feature.title"
        v-for="feature in features"
      )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FeatureCard from './FeatureCard.vue'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
}

const features = ref<Feature[]>([
  {
    id: 'prettier',
    title: 'Prettier Integration',
    description: 'Formats your template and script blocks with Prettier',
    icon: '✨',
  },
  {
    id: 'stylus',
    title: 'Stylus Supremacy',
    description: 'Beautiful formatting for your Stylus styles',
    icon: '🎨',
  },
  {
    id: 'pug',
    title: 'Pug Support',
    description: 'Full support for Pug templates',
    icon: '🐕',
  },
  {
    id: 'typescript',
    title: 'TypeScript Ready',
    description: 'Works seamlessly with TypeScript',
    icon: '📘',
  },
])

const getStarted = () => {
  console.log('Getting started with Prettylus!')
  window.open('https://github.com/qnp/prettylus', '_blank')
}
</script>

<style lang="stylus" scoped>
// Variables
$primary-color = #42b883
$secondary-color = #35495e
$text-light = #666
$spacing-unit = 1rem
$max-width = 1200px

// Mixins
flex-center()
  display flex
  align-items center
  justify-content center

// Base styles
.app-container
  min-height 100vh
  font-family 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
  color $secondary-color

  .app-header
    background linear-gradient(135deg, $primary-color, $secondary-color)
    color white
    padding ($spacing-unit * 2) $spacing-unit
    box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)

    .title
      margin 0
      font-size 2.5rem
      font-weight 300
      text-align center

    .navigation
      flex-center()
      margin-top $spacing-unit
      gap ($spacing-unit * 2)

      a
        color white
        text-decoration none
        padding 0.5rem 1rem
        border-radius 4px
        transition all 0.3s ease

        &:hover
          background rgba(255, 255, 255, 0.1)
          transform translateY(-2px)

  .content
    max-width $max-width
    margin 0 auto
    padding ($spacing-unit * 2)

    .hero
      text-align center
      padding ($spacing-unit * 3) 0

      h2
        font-size 2rem
        margin-bottom $spacing-unit
        color $secondary-color

      p
        font-size 1.2rem
        color $text-light
        margin-bottom ($spacing-unit * 2)

      .cta
        background $primary-color
        color white
        border none
        padding 0.75rem 2rem
        font-size 1.1rem
        border-radius 50px
        cursor pointer
        transition all 0.3s ease
        box-shadow 0 4px 6px rgba(66, 184, 131, 0.3)

        &:hover
          background darken($primary-color, 10%)
          transform translateY(-2px)
          box-shadow 0 6px 12px rgba(66, 184, 131, 0.4)

        &:active
          transform translateY(0)

    .features
      display grid
      grid-template-columns repeat(auto-fit, minmax(250px, 1fr))
      gap ($spacing-unit * 2)
      margin-top ($spacing-unit * 3)
</style>

<style lang="stylus">
// Global styles (non-scoped)
*
  margin 0
  padding 0
  box-sizing border-box

body
  background #f5f5f5

::selection
  background $primary-color
  color white
</style>
