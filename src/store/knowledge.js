/**
 * Created by zhong on 16/10/15.
 */

 export default {
  state: {
    baseArticle:{},
    base_id:""
  },
  mutations: {
    setBaseArticle(state, data) {
      state.baseArticle = data.res;
      state.base_id = data.base_id;
    }
  },
  actions: {},
  getters: {}

};




