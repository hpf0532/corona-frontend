<template>
  <div class="app-container">
    <h2 style="color:#6E7174">草稿箱</h2>
    <draft-table />
  </div>

</template>
<script>
import { getDrafts } from '@/api/wiki'
import DraftTable from './components/DraftTable'
export default {
  name: 'DraftBox',
  components: { DraftTable },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    // this.getList()
  },
  methods: {
    async getList() {
      const data = await getDrafts()
      this.list = data.items
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
