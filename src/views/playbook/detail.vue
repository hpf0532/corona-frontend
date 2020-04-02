<template>
  <div class="app-container">
    <table v-loading="dataLoading" class="table table-bordered text-nowrap">
      <tbody>
        <tr>
          <td class="t-title">PlayBook</td>
          <td class="t-body">{{ playbookDetail.name }}</td>
        </tr>
        <tr>
          <td class="t-title">作者</td>
          <td class="t-body">{{ playbookDetail.author }}</td>
        </tr>
        <tr>
          <td class="t-title">描述信息</td>
          <td class="t-body">{{ playbookDetail.information }}</td>
        </tr>
        <tr>
          <td class="t-title">内容</td>
          <td class="t-body" style="padding:0px 12px">
            <pre v-highlightjs="playbookDetail.detail" style="margin:0px">
                                <code class="yaml" />
                            </pre>
          </td>
        </tr>
      </tbody>

    </table>
  </div>
</template>
<script>
import { getPlayBookDetail } from '@/api/inventory'
export default {
  data() {
    return {
      id: '',
      dataLoading: true,
      playbookDetail: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.dataLoading = true
      this.id = this.$route.params.id
      this.playbookDetail = await getPlayBookDetail(this.id)
      this.dataLoading = false
    }
    // async getData() {
    //   this.dataLoading = true
    //   const data = await getPlayBookDetail()
    //   const items = data.items
    //   this.list = items.map(v => {
    //     this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
    //     v.originalName = v.name //  will be used when user click the cancel botton
    //     v.originalDesc = v.description
    //     return v
    //   })
    //   this.listLoading = false
    // },
  }

}
</script>

<style>
.t-title {
    width: 30%;
    font-weight: bold;
    background-color: #88cae8c4;
}
.t-body {
    background-color: #bddbbee0;
}
</style>
