<template>
  <div id="video-list">
    <img style="width: 5rem; padding-top: 3rem; display: inherit;" src="../assets/images/blank.png" alt="" v-if="fun.isTextEmpty(list)" />
    <div class="video-list" :style="{ margin: isDiy ? '0.5rem' : '' }">
      <ul ref="newArray1" :class="`zq-waterfall-left-video${id}`">
        <li @click="toVideo(item)" v-for="(item, i) in newArray1" :key="i">
          <img class="video-img" :src="item.cover" alt="" />
          <p>{{ item.title }}</p>
          <div class="people" v-if="item.member">
            <img :src="item.member.avatar" alt="" />
            <span>{{ item.member.nickname }}</span>
          </div>
          <img class="play" src="../assets/images/home_play@2x.png" alt="" />
        </li>
      </ul>
      <ul ref="newArray2" :class="`zq-waterfall-right-video${id}`">
        <li @click="toVideo(item)" v-for="(item, i) in newArray2" :key="i">
          <img class="video-img" :src="item.cover" alt="" />
          <p>{{ item.title }}</p>
          <div class="people" v-if="item.member">
            <img :src="item.member.avatar" alt="" />
            <span>{{ item.member.nickname }}</span>
          </div>
          <img class="play" src="../assets/images/home_play@2x.png" alt="" />
        </li>
      </ul>
      <div class="load" v-if="!showLoading">
        <img src="../assets/images/video-loading.gif" alt="loading" />
      </div>

      <div v-if="isDiy && !moreTextHidden">
        <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="isLoadMore" @click="getMoreData">{{ $i18n.t("加载更多") }}</div>
        <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="!isLoadMore">{{ $i18n.t("没有更多了") }}~</div>
      </div>

      <div style="height: 3rem;" v-if="!isDiy"></div>
    </div>
  </div>
</template>

<script>
import { SwipeItem } from 'vant';
export default {
  props: {
    //弹窗是否显示，默认不显示
    showLoading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    card_id: {
      type: [String, Number],
      default: 0
    },
    isDiy: {
      type: Boolean,
      default: false
    },
    isLoadMore: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: 0
    },
    moreTextHidden: {
      type: Boolean,
      default: false
    },
    fatherTitleFather:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      newArray1: [],
      newArray2: []
    };
  },
  watch: {
    list: function(newVal, oldVal) {
      // console.log(newVal, oldVal);
      let oldLength = oldVal.length;
      this.sort(oldLength, newVal);
    }
  },
  mounted() {
    if (this.isDiy) {
      this.sort(0, this.list);
    }
  },
  methods: {
    getMoreData() {
      this.$emit("getMore", true);
    },
    toVideo(item) {
      let page = this.list.findIndex((value, index, arr) => {
        return value.id === item.id;
      });
      //页数
      page = Math.ceil((page + 1) / 12);
      if (this.isDiy) {
        zhuge.track(this.fatherTitleFather+'-点击视频',{
            '视频标题':item.title,
            '视频id':''+item.id,
            '发布人':item.member.nickname,
            '发布人id':item.member.uid,
            '分类id':item.category_id
        });
        this.$router.push(this.fun.getUrl("VideoDetail", {}, { vid: item.id }));
      } else {
        zhuge.track(this.fatherTitleFather+'-点击视频',{
            '视频标题':item.title,
            '视频id':''+item.id,
            '发布人':item.member.nickname,
            '发布人id':item.member.uid,
            '分类id':item.category_id
        });
        this.$router.push(this.fun.getUrl("VideoDetail", {}, { vid: item.id, page: page, from: "card", card_id: this.card_id }));
      }
    },
    sort(arg, list) {
      let that = this;
      let index = arg || 0;
      if (list.length > index) {
        that.getImg(
          list[index].cover,
          function(w, h, r) {
            let boxA = 0;
            let boxB = 0;

            if (document.getElementsByClassName(`zq-waterfall-left-video${that.id}`)[0]) {
              boxA = document.getElementsByClassName(`zq-waterfall-left-video${that.id}`)[0].clientHeight;
            }

            if (document.getElementsByClassName(`zq-waterfall-right-video${that.id}`)[0]) {
              boxB = document.getElementsByClassName(`zq-waterfall-right-video${that.id}`)[0].clientHeight;
            }

            if (boxA <= boxB) {
              that.newArray1.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list); //加载完再递归
              });
            } else {
              that.newArray2.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list);
              });
            }
          },
          function() {
            list[index].cover = "https://www.yunzmall.com/addons/yun_shop/static/app/img/agreen_video@2x.png";
            that.$nextTick(() => {
              that.sort(index + 1, list);
            });
          }
        );
      }
      if (list.length - 1 == index) {
        this.$emit("loadMore", true);
      }
    },
    // 图片加载完回调
    getImg(url, callback, callback2) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(img.width, img.height, Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          callback2();
        };
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#video-list {
  width: 100%;

  .load {
    text-align: center;

    img {
      width: 3rem;
    }
  }
}

.video-list {
  margin: 0.5rem 0.5rem 3.5rem 0.5rem;
  text-align: left;

  /* display: flex; */
  ul {
    vertical-align: top;
    display: inline-block;

    /* display: flex; */

    /* flex-direction: column; */

    /* flex-wrap: wrap; */
    width: 48%;
  }

  li {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }

  .play {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  ul:first-child {
    margin-right: 0.7rem;
  }

  p {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    padding: 5px 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .video-img {
    width: 100%;
    height: auto;
  }

  .people {
    display: flex;
    padding: 5px;

    img {
      flex: 0 0 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      margin: 0 5px;
    }

    span {
      flex: 1;
      line-height: 1.5rem;
      margin: 0 5px;
      font-size: 11px;
      color: #8c8c8c;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
