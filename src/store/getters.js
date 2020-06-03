const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  uid: state => state.user.uid,
  name: state => state.user.name,
  categoryList: state => state.wiki.categoryList,
  postList: state => state.wiki.postList,
  total: state => state.wiki.total,
  filterQuery: state => state.wiki.query

}
export default getters
