
<template>
  <article-edit :is-edit="true" />
</template>

<script>
import ArticleEdit from './components/ArticleEdit'
export default {
  name: 'DraftView',
  components: { ArticleEdit }
}
</script>