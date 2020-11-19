
<template>
  <article-edit :is-edit="false" />
</template>

<script>
import ArticleEdit from './components/ArticleEdit'
export default {
  name: 'CreateArticle',
  components: { ArticleEdit }
}
</script>
