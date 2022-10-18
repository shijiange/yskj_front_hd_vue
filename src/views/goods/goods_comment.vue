<template>
  <div>
    <c-title :hide="false" :text="'全部评价'">
    </c-title>
    <c-commentlist v-on:clickMore="getCommentData" :list="third_content" :noMoreComment="noMoreComment" v-if="showComment"></c-commentlist>
  </div>
</template>

<script>
import cCommentlist from "components/goods/children/commentList";
export default {
  data() {
    return {};
  },
  components: {
    cCommentlist
  },
  methods: {
    //获取评论数据
    getCommentData() {
      let json = {
        goods_id: goods_id,
        page: this.commentPage
      };
      $http.get("goods.comment.get-comment", json, "获取中...").then(
        (response)=> {
          if (response.result === 1) {
            if (response.data.data.length < 20) {
              this.noMoreComment = true;
            }
            this.commentPage += 1;
            if (!this.third_content) {
              this.third_content = [];
            }
            this.third_content = [...this.third_content, ...response.data.data];
            // this.showComment = true;
            this.is_third_content = true;
            this.$store.commit("setShowComment", true);
            // this.third_content = response.data.data;
          } else {
            this.is_third_content = false; //复位
          }
        },
        (response)=> {
          this.is_third_content = false; //复位
          console.log(response);
        }
      );
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>