<!-- 评论组件（精选口碑） 下方为5个滚动评论-->
<template>
  <div id="comment">
    <!-- 精选口碑 -->
    <div class="evaTop">
      <div class="evaTitle">
        精选口碑&nbsp;
        <span style="color: #ed0606;" v-if="num > 0">({{num}})&nbsp;</span>
      </div>
      <div class="evaTo" style="color: #ed0606;" @click="gotoCommentList()">
        <span>
          <i style="color: #999;"> 好评率</i>
          <i style="color: #ed0606; font-weight: bold;">{{ rate?rate:'100%' }}</i>
        </span>
        <i class="fa fa-angle-right" style="font-size: 20px;"></i>
      </div>
    </div>
    <!--<div class="ecaBottom" v-if="!fun.isTextEmpty(commentInfo)">-->
      <!--<van-swipe :loop="false" :width="215" class="evaLoop" :show-indicators="false">-->
        <!--<van-swipe-item v-for="item in commentInfo.slice(0, 5)" :key="item.id">-->
          <!--<div class="evaLoopmain">-->
            <!--<img :src="item.head_img_url" alt="" />-->
            <!--<div class="user">-->
              <!--<div class="username">{{ item.nick_name }}</div>-->
              <!--<div class="rate">-->
                <!--<van-rate v-model="item.level" style="text-align: left;" :size="12" disabled-color="#ff9900" disabled />-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="text" style="-webkit-box-orient: vertical;">{{ item.content }}</div>-->
          <!--</div>-->
        <!--</van-swipe-item>-->
      <!--</van-swipe>-->
    <!--</div>-->
    <div class="reputation-items" v-if="!fun.isTextEmpty(commentInfo)">
      <div class="reputation-item" v-for="item in commentInfo.slice(0, praiseNum)" :key="item.id">

        <div class="reputation-face">
          <img :src="item.head_img_url" alt="">
          <div class="face-right">
            <div class="username">
              <span>{{ item.nick_name }}</span>
              <span style="margin-left: 0.5rem">{{ item.level_name }}</span>
            </div>
            <div class="time">{{ item.created_at }}</div>
            <!-- <van-rate v-model="item.level" style="text-align: left;" :size="12" disabled-color="#ff9900" disabled /> <span style="color: #f90;">{{item.level}}分</span> -->
          </div>
        </div>

        <div class="reputation-content">
          <div class="comment">{{ item.content }}</div>
          <div class="commentImg" v-if="item.images.length > 0">
            <viewer :images="item.images">
              <img v-for="(img, i) in item.images" :key="i" :src="img" alt="">
            </viewer>
          </div>
        </div>
      </div>
      <div class="default-praise" v-if="is_show_default_praise">默认好评已隐藏~</div>
    </div>
    <div v-if="fun.isTextEmpty(commentInfo)" style="padding: 0.875rem; color: #999;">抱歉，暂无评论 ~</div>
  </div>
</template>

<script>
export default {
  props: ["commentInfo", "goods_id", "rate","num", "is_show_default_praise"],
  data() {
    return {
      praiseNum:''
    };
  },
   mounted() {
    this.ready();

  },
  methods: {
    ready(){
      $http.get("goods.comment.getPraiseNum").then(response => {
           if(response.result === 1){
             //console.log(response.data.praiseNum);
             this.praiseNum = response.data.praiseNum ? response.data.praiseNum : 5;
           }
      });
    },
    gotoCommentList() {
      this.$emit("RouterTo", true);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#comment {
  background: #fff;
  border-radius: 10px;
  margin: 10px;

  .evaTop {
    padding: 0 0.75rem;
    height: 2.375rem;
    line-height: 2.375rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .evaTitle {
      font-weight: bold;
      color: #1f1f1f;
    }

    .evaTo {
      display: flex;
      align-items: center;
      cursor: default;
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
          line-height: 1.25rem;
        }
      }
    }
  }

  .reputation-items {
    padding: 0.5rem;

    .reputation-item {
      display: flex;
      flex-direction: column;

      .reputation-face {
        display: flex;
        margin-bottom: 0.5rem;

        img {
          flex: 0 0 1.75rem;
          width: 1.75rem;
          height: 1.75rem;
        }

        .face-right {
          flex: 1;
          text-align: left;
          margin-left: 0.5rem;
        }

        .username, .time {
          font-size: 12px;
          color: #7b7b7b;
        }

        .time {
          margin-top: 0.3rem;
        }
      }

      .reputation-content {
        text-align: left;
        margin-left: 2.5rem;

        .comment {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .commentImg {
          margin-top: 0.5rem;

          img {
            margin: 0.2rem;
            width: 4rem;
            height: 4rem;
          }
        }
      }
    }

    .reputation-item:not(:first-child) {
      margin-top: 1rem;
    }

    .reputation-item:not(:last-child) {
      border-bottom: 1px solid #f2f2f2;
    }

    .default-praise {
      padding: 0.5rem;
      color: rgb(153, 153, 153);
      text-align: center;
    }
  }
}
</style>
