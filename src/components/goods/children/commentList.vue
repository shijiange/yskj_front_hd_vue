<!-- 评论列表页 -->
<template>
  <div id="commentList">
    <div class="pj" v-for="n in list" :key="n.id" >
      <div @click="toContentInfo(n)">
        <div layout="row" layout-align="start center" id="user">
          <div>
            <img :src="n.head_img_url" />
          </div>
          <div>
            <div style="width:100%;">{{ n.nick_name }}</div>
            <div class="level-name">{{ n.level_name }}</div>
          </div>
          <div>{{ n.created_at }}</div>
        </div>
        <div style="width: 100%; text-align: left;">
          <van-rate v-model="n.level" style="text-align: left;" disabled-color="#ff9900" disabled />
        </div>
        <p style="padding: 0.3rem 0;">
          <span v-if="n.content">{{ n.content }}</span>
          <span v-else style="color: #908a8a;">此用户没有填写评价</span>
        </p>
      </div>
      <div style="text-align: left; margin: 5px 0;" v-show="n.images && n.images.length > 0">
        <div style="padding: 0.3rem 0;">晒图：</div>
        <viewer :images="n.images">
          <img :src="item" v-for="(item, index) in n.images" class="comment-img" alt="" :key="index"/>
        </viewer>
      </div>
      <div v-if="n.append && !(n.append instanceof Array)" style="text-align: left;">
        <p class="last_day">
          <span class="append-class" v-if="n.append.diff_date && n.append.diff_date.value>0">{{n.append.diff_date.value}}{{n.append.diff_date.sku}}追评:</span>
          <span class="append-class" v-else>追评:</span>
          <span>{{ n.append.content }}</span>
        </p>
        <viewer :images="n.append.images" v-if="n.images">
          <img :src="item" v-for="(item, index) in n.append.images" class="comment-img" alt="" :key="index"/>
        </viewer>
      </div>

      <div class="comment">
        <span>评论数:{{ n.reply_count }}</span>
      </div>
    </div>
    <div class="moreBtn" style="width: 100%; padding: 0.7rem;" v-if="noMoreComment ? false : true">
      <div @click="getMoreComment">{{ $i18n.t("加载更多") }}</div>
    </div>
    <div v-if="fun.isTextEmpty(list)">
      <img src="../../../assets/images/blank.png" alt="" style="width: 5rem; margin-top: 3rem;" />
      <p style="color: #999;">抱歉，暂无评价 ~</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list", "noMoreComment"],
  data() {
    return {};
  },
  components: {},
  computed: {},
  mounted() {
    // console.log("展开评论", this.list,this.noMoreComment,this.isCup);
  },

  methods: {
    getMoreComment() {
      this.$emit("clickMore", true);
    },
    //获取评论数据
    getCommentData() {
      let that = this;
      let json = {
        goods_id: this.$route.params.id,
        page: this.commentPage,
        mid: this.fun.getKeyByMid()
      };
      // console.log(json);
      $http.get("goods.comment.get-comment", json, "获取中...").then(
        function(response) {
          // console.log(response.data);
          if (response.result === 1) {
            if (response.data.data.length < 20) {
              that.noMoreComment = true;
            }
            that.commentPage += 1;
            if (!that.contentList) {
              // console.log(!that.contentList);
              that.contentList = [];
            }
            that.contentList = [...that.contentList, ...response.data.data];
            // console.log(that.contentList);
            // that.contentList = response.data.data;
          } else {
            is_contentList = false; //复位
          }
        },
        function(response) {
          is_contentList = false; //复位
          console.log(response);
        }
      );
    },
    //跳转评论详情
    toContentInfo(data) {
      this.$router.push(
        this.fun.getUrl("CommentDetails", {
          order_id: data.order_id,
          goods_id: data.goods_id,
          order_goods_id: data.order_goods_id,
          comment_id: data.id,
          uid: data.uid
        })
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#commentList {
  height: 90vh;
  overflow-y: scroll;

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: #fff;
    z-index: 999;

    i {
      position: absolute;
      left: 16px;
      top: 6px;
      font-size: 24px;
    }

    p {
      line-height: 40px;
      font-size: 1rem;
      text-align: center;
      display: inline-block;
      width: 100%;
    }
  }

  .pj {
    background: #fff;
    padding: 0 0.625rem 2.5rem;
    margin-bottom: 0.3125rem;

    .el-rate {
      text-align: left;
      margin-bottom: 0.625rem;
    }

    .el-rate__item i.el-rate__icon.el-icon-star-on {
      font-size: 14px;
      margin-right: 0.375rem;
    }

    p {
      text-align: left;
      margin: 0;
      padding-bottom: 0.625rem;
    }

    // img {
    //   width: 100%;
    // }

    .last_day {
      display: flex;
      word-break: break-all;
      padding-top: 1.25rem;

      .append-class {
        float: right;
        color: #f15335;
        white-space: nowrap;
        padding-right: 0.3125rem;
      }
    }

    .comment > span {
      display: block;
      width: 4.6875rem;
      height: 1.125rem;
      line-height: 1.125rem;
      border-radius: 0.5rem;
      border: 0.0625rem solid #aaa;
      color: #666;
      float: right;
      font-size: 14px;
    }
  }

  #user {
    div:nth-child(1) {
      width: 8%;
      height: 0;
      padding-bottom: 11%;
      position: relative;
      overflow: hidden;
      flex: 1;
      margin-top: 0.625rem;

      img {
        width: 80%;
        border-radius: 50%;
        left: 0;
        height: auto;
        position: absolute;
      }

    }

    div:nth-child(2) {
      flex: 5;
      text-align: left;
      .level-name {
        color: #8c8c8c;
        margin-top: 0.3rem;
      }
    }

    div:nth-child(3) {
      color: #908a8a;
      font-size: 10px;
      padding-right: 0.625rem;
    }
  }

  .comment-img {
    display: inline-block;
    width:5rem;
    height:5rem;
    margin-right: 0.5rem;
    object-fit: cover;
  }
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>
