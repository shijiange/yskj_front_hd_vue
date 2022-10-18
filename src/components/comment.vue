<!-- 评论组件（精选口碑） 下方为5个滚动评论-->
<template>
  <div id="comment">
    <!-- 精选口碑 -->
    <div class="evaTop">
      <div class="evaTitle">
        精选口碑&nbsp;&nbsp;<i style="color: #999; font-size: 12px;"> 好评率</i>
        <i style="color: #ed0606; font-size: 12px;"> {{score}}</i>
      </div>
      <div class="evaTo" style="color: #ed0606;" @click="gotoCommentList()">
        查看全部({{total}})&nbsp;
        <i class="fa fa-angle-right" style="font-size: 20px;"></i>
      </div>
    </div>
    <div class="ecaBottom"
         v-if="!fun.isTextEmpty(commentInfo)">
      <van-swipe :loop="false"
                 :width="215"
                 class="evaLoop"
                 :show-indicators='false'>
        <van-swipe-item v-for="item in commentInfo.slice(0,5)"
                        :key="item.id">
          <div class="evaLoopmain">
            <img :src="item.head_img_url"
                 alt="">
            <div class="user">
              <div class="username">{{item.nick_name}}</div>
              <div class="rate">
                <van-rate v-model="item.level"
                          style="text-align: left;"
                          :size="12"
                          disabled-color="#ff9900"
                          disabled />
              </div>
            </div>
            <div class="text"
                 style="-webkit-box-orient: vertical;">{{item.content}}</div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div v-if="fun.isTextEmpty(commentInfo)"
         style="padding: 0.875rem; color: #999;">抱歉，暂无评论 ~</div>
  </div>
</template>

<script>
export default {
  props: ["commentInfo", "goods_id", "isCup", "score", "total", "type"],
  data() {
    return {};
  },
  methods: {
    gotoCommentList() {
      if (this.type == 2) {
        this.$router.push(
          this.fun.getUrl("o2oStore_v2", {
            store_id: this.$route.params.store_id,
            fromHome: 1,
            activeType: "comment"
          })
        );
      } else {
        this.$emit("RouterTo", true);
      }
    }
  }
};
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#comment {
  margin-top: 0.75rem;
  background: #fff;

  .evaTop {
    padding: 0 0.75rem;
    height: 2.375rem;
    line-height: 2.375rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .evaTo {
      display: flex;
      align-items: center;
    }
  }

  .ecaBottom {
    .evaLoop {
      text-align: left;

      .evaLoopmain {
        display: flex;
        flex-wrap: wrap;
        padding: 0.875rem 0.625rem;
        width: 200px;
        height: 6.25rem;
        overflow: hidden;
        margin: 0.875rem;
        margin-top: 0.5rem;
        -moz-box-shadow: 0 3px 15px #e6e6e6;
        -webkit-box-shadow: 0 3px 15px #e6e6e6;
        box-shadow: 0 3px 15px #e6e6e6;
        border-radius: 6px;

        img {
          width: 1.875rem;
          height: 1.875rem;
          border-radius: 100%;
          margin-right: 0.5rem;
        }

        .user {
          flex: 8;

          .username {
            width: 5rem;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }
        }

        .text {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
}
</style>
