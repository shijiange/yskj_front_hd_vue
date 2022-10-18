<template>
  <div id="GoodsComment">
    <template v-if="istype == 'comment'">
      <van-nav-bar title="全部评价" class="pcStyle_ydT">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" color="#333" @click.native="CloseComment" />
          </span>
        </template>
      </van-nav-bar>
      <c-commentlist v-on:clickMore="getCommentData" :list="third_content" :noMoreComment="noMoreComment"></c-commentlist>
    </template>

    <template v-if="istype == 'micro'">
      <van-nav-bar title="关联微贴" left-arrow @click-left="CloseComment" :fixed="true" />
      <div class="post-main">
        <div class="post-item" v-for="(item, ind) in micro_communities" :key="ind" @click="goMicro(item.id)">
          <div class="post-message">
            <div class="post-face" v-if="item.has_one_stick_user">
              <img :src="item.has_one_stick_user.avatar" alt="" />
              <div class="username" v-if="item.has_one_stick_user">{{ item.has_one_stick_user.nickname }}</div>
            </div>

            <div class="post-content">
              <div class="comment">{{ item.title }}</div>
              <div class="commentImg">
                <img :src="value.url" alt="" v-for="(value, i) in item.has_many_image" :key="i" />
              </div>
            </div>
          </div>
          <div class="post-foot">
            <div class="post-comment">
              <i class="iconfont icon-fontclass-pinglun1"></i>
              {{ item.comment_num }}
            </div>
            <div class="post-good" :class="['post-like']">
              <i class="iconfont icon-fontclass-dianzan"></i>
              {{ item.praise_num }}
            </div>
          </div>
        </div>
        <div v-if="page < last_page" class="none" @click="getMore">点击加载更多</div>
      </div>
    </template>
  </div>
</template>
<script>
import cCommentlist from "components/goods/children/commentList";
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1,
      last_page: 1,
      micro_communities: [],
      commentPage: 1,
      comment_last_page: 1,
      noMoreComment: false,
      third_content: [],
      istype: "comment"
    };
  },
  activated() {
    this.istype = this.$route.params.istype;
    if (this.$route.params.istype == "micro") {
      this.fun.setWXTitle("关联微贴");
      this.getMicro();
    } else {
      this.fun.setWXTitle("全部评价");
      this.getCommentData();
    }
  },
  methods: {
    init() {
      this.page = 1;
      this.last_page = 1;
      this.micro_communities = [];
      this.commentPage = 1;
      this.third_content = [];
    },
    CloseComment() {
      this.$router.go(-1);
    },
    //获取评论数据
    getCommentData() {
      let that = this;
      let json = {
        goods_id: this.$route.params.gid,
        page: this.commentPage
      };
      $http.get("goods.comment.get-comment", json, "获取中...").then(
        (response)=> {
          if (response.result === 1) {
            if (response.data.data.length < 20) {
              that.noMoreComment = true;
            }
            that.commentPage += 1;
            that.comment_last_page = response.data.last_page;
            if (!that.third_content) {
              that.third_content = [];
            }
            that.third_content = [...that.third_content, ...response.data.data];
          } else {
            that.noMoreComment = true;
          }
        });
    },
    getMicro() {
      this.page = 1;
      this.last_page = 1;
      $http.post("plugin.micro-communities.api.goods.index", { page: this.page, goods_id: this.$route.params.gid }, "").then(response => {
        if (response.result == 1) {
          this.micro_communities = response.data.data;
          this.last_page = response.data.last_page;
          console.log(this.micro_communities);
        } else {
          this.$toast(response.msg);
        }
      });
    },
    goMicro(_id) {
      this.$router.push(
        this.fun.getUrl("microCommentDetails", {
          stickId: _id
        })
      );
    },
    getMoreData() {
      if (this.$route.params.istype == "micro") {
        this.getMoreMicro();
      } else {
        this.getMoreComment();
      }
    },
    getMoreMicro() {
      if(this.page >= this.last_page){
        return;
      }
      this.page = this.page + 1;
      $http.post("plugin.micro-communities.api.goods.index", { page: this.page, goods_id: this.goodsid }, ".").then(response => {
        if (response.result == 1) {
          this.micro_communities = this.micro_communities.concat(response.data.data);
          this.last_page = response.data.last_page;
        } else {
          this.$toast(response.msg);
        }
      });
    },
    getMoreComment() {
      if (this.commentPage >= this.comment_last_page) {
        return;
      }
      let that = this;
      let json = {
        goods_id: this.$route.params.gid,
        page: this.commentPage
      };
      $http.get("goods.comment.get-comment", json, "获取中...").then(
        function (response) {
          if (response.result === 1) {
            if (response.data.data.length < 20) {
              that.noMoreComment = true;
            }
            that.commentPage += 1;
            if (!that.third_content) {
              that.third_content = [];
            }
            that.third_content = [...that.third_content, ...response.data.data];
            // that.$store.commit("setShowComment", true);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    }
  },
  components: {
    cCommentlist
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
/* 微贴弹窗 */
.post-main {
  background-color: #f5f5f5;
  padding: 3rem 0 1rem 0;
  height: 100vh;
  overflow-y: scroll;

  .post-item {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background-color: #fff;

    .post-message {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .post-face {
      display: flex;
      align-items: center;
      margin: 0 0.2rem 0.5rem 0;

      .username {
        font-weight: bold;
        margin-left: 0.5rem;
      }

      img {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .post-content {
      text-align: left;

      .comment {
        margin: 0.5rem 0 0 0.5rem;
      }

      .commentImg {
        img {
          margin: 0.3rem;
          width: 6rem;
          height: 6rem;
          border-radius: 5px;
          object-fit: contain;
        }
      }
    }

    .post-foot {
      margin-top: 0.625rem;
      display: flex;
      justify-content: flex-end;

      .post-comment {
        margin-right: 2.5rem;
        font-weight: 700;
        color: #929292;
      }

      .post-good {
        font-weight: 700;
        color: #929292;
      }

      .post-like {
        color: #ff9600;
      }
    }
  }
}
</style>