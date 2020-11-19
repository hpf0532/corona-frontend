
<template>
  <article-edit :is-edit="true" :is-draft="false" />
</template>

<script>
import ArticleEdit from './components/ArticleEdit'
export default {
  name: 'EditArticle',
  components: { ArticleEdit }
}
</script>
