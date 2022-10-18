<!-- 微社区 瀑布流组件 点击进入帖子详情页 -->
<template>
  <div id="Waterfalls_flow" :style="{ backgroundColor: datas ? datas.preview_color || '#f2f2f2' : '#f2f2f2' }" style="text-align: left">
    <img style="width: 5rem; padding: 2rem 0; display: inherit" src="../assets/images/blank.png" alt="" v-if="fun.isTextEmpty(list)" />
    <template v-if="!fun.isTextEmpty(list)">
      <ul ref="newArray1" :class="`zq-waterfall-left${id}`" v-if="newArray1.length > 0">
        <li v-for="item in newArray1" @click="jumpDetails(item.id)" :key="item.id">
          <div class="top" :class="{ 'text-bg': !item.has_many_image[0] }">
            <img v-if="item.has_many_image[0]" :src="item.has_many_image[0].url" alt="" />
            <div class="mic-content" v-if="!item.has_many_image[0]"><p v-html="item.contents"></p></div>
          </div>
          <div class="bottom">
            <div class="title">{{ item.title }}</div>
            <div class="content">
              <div class="headmessage" v-if="item.has_one_stick_user">
                <div class="left">
                  <img :src="item.has_one_stick_user.avatar" alt="" />
                </div>
                <div class="name">{{ item.has_one_stick_user.nickname }}</div>
              </div>
              <div class="thumbup">
                <div class="right">
                  <img src="../assets/images/micro_communities/detail_praise@2x.png" alt="" />
                </div>
                <div class="num">{{ item.praise_num }}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul ref="newArray2" :class="`zq-waterfall-right${id}`" v-if="newArray2.length > 0">
        <li v-for="item in newArray2" @click="jumpDetails(item.id)" :key="item.id">
          <div class="top" :class="{ 'text-bg': !item.has_many_image[0] }">
            <img v-if="item.has_many_image[0]" :src="item.has_many_image[0].url" alt="" />
            <div class="mic-content" v-if="!item.has_many_image[0]"><p v-html="item.contents"></p></div>
          </div>
          <div class="bottom">
            <div class="title">{{ item.title }}</div>
            <div class="content">
              <div class="headmessage" v-if="item.has_one_stick_user">
                <div class="left">
                  <img :src="item.has_one_stick_user.avatar" alt="" />
                </div>
                <div class="name">{{ item.has_one_stick_user.nickname }}</div>
              </div>
              <div class="thumbup">
                <div class="right">
                  <img src="../assets/images/micro_communities/detail_praise@2x.png" alt="" />
                </div>
                <div class="num">{{ item.praise_num }}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="load" v-if="!showLoading || imgLoading">
        <img src="../assets/images/video-loading.gif" alt="loading" />
      </div>

      <div v-if="isDiy">
        <div style="width: 100%; height: 40px; line-height: 40px; text-align: center" v-if="isLoadMore && showLoading && !imgLoading" @click="getMoreData">{{ $i18n.t("加载更多") }}</div>
        <div style="width: 100%; height: 40px; line-height: 40px; text-align: center" v-if="!isLoadMore && showLoading && !imgLoading">{{ $i18n.t("没有更多了") }}~</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ["list", "showLoading", "datas", "isDiy", "isLoadMore", "id", "nowClick", "isclick","fatherTitle","commodityTitle"],
  data() {
    return {
      newArray1: [],
      newArray2: [],
      propList: [],
      imgLoading: false, //图片是否加载完成
      isclicknow: false
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.imgLoading = false;
    this.newArray1 = [];
    this.newArray2 = [];
    this.propList = this.list;
    this.sort(0, this.propList);
  },
  activated() {
    this.imgLoading = false;
    this.newArray1 = [];
    this.newArray2 = [];
    this.propList = this.list;
    this.sort(0, this.propList);
  },
  methods: {
    getMoreData() {
      this.$emit("getMore", true);
    },
    sort(arg, list) {
      if (this.isclick === true) {
        this.newArray1 = [];
        this.newArray2 = [];
        this.$emit("isclickfun", false);
      }

      let that = this;
      let index = arg || 0;
      if (list && list.length > 0 && list.length > index) {
        this.imgLoading = true;
        if (list[index].has_many_image && list[index].has_many_image[0]) {
          that.getImg(
            list[index].has_many_image[0].url,
            function () {
              that.setArrays(list, index);
            },
            function () {
              that.imgLoading = false;
              list[index].has_many_image[0].url = "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/img_404.png";
              that.$nextTick(() => {
                that.sort(index, list);
              });
            }
          );
        } else {
          that.setArrays(list, index);
        }
      }
      if (list.length - 1 == index) {
        this.$emit("loadMore", true);
      }
    },
    setArrays(list, index) {
      let boxA = 0;
      let boxB = 0;
      if (document.getElementsByClassName(`zq-waterfall-left${this.id}`)[0]) {
        boxA = document.getElementsByClassName(`zq-waterfall-left${this.id}`)[0].clientHeight;
      }
      if (document.getElementsByClassName(`zq-waterfall-right${this.id}`)[0]) {
        boxB = document.getElementsByClassName(`zq-waterfall-right${this.id}`)[0].clientHeight;
      }
      if (boxA <= boxB) {
        this.newArray1.push(list[index]);
      } else {
        this.newArray2.push(list[index]);
      }
      this.$nextTick(() => {
        this.sort(index + 1, list);
      });
      this.imgLoading = false;
    },
    // 图片加载完回调
    getImg(url, callback, callback2) {
      let img = new Image();
      img.src = url;
      // console.log("完全加载完毕的事件================", img);
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function () {
          /* callback(img.width, img.height); */
          callback(img.width, img.height, Number(img.height) / Number(img.width));
        };
        img.onerror = function () {
          console.log("图片链接error:: 404", img);
          callback2();
        };
      }
    },
    jumpDetails(stick_id) {

       let that =this;
      this.newArray1.forEach((item)=>{      
        if(item.id === stick_id){  
          zhuge.track('通用-点击社区帖子',{
            '帖子标题':item.title,
            '帖子id':item.id,
            '发布人':item.has_one_stick_user.nickname,
            '发布人id':item.user_id,
            '帖子所属一级标签':item.has_one_category.cate_name,
            '帖子所属二级标签':item.has_one_category.name,
            '关键词':that.commodityTitle,
            '发布时间':item.created_at
          });

          zhuge.track(this.fatherTitle+'-点击帖子',{
            '帖子标题':item.title,
            '帖子id':item.id,
            '发布人':item.has_one_stick_user.nickname,
            '发布人id':item.user_id,
            '帖子所属一级标签':item.has_one_category.cate_name,
            '帖子所属二级标签':item.has_one_category.name,
            '关键词':that.commodityTitle,
            '发布时间':item.created_at
          });
        }
      });
      this.newArray2.forEach((item)=>{         
        if(item.id === stick_id){
          zhuge.track('通用-点击社区帖子',{
            '帖子标题':item.title,
            '帖子id':item.id,
            '发布人':item.has_one_stick_user.nickname,
            '发布人id':item.user_id,
            '帖子所属一级标签':item.has_one_category.cate_name,
            '帖子所属二级标签':item.has_one_category.name,
            '关键词':that.commodityTitle,
            '发布时间':item.created_at
          });

          zhuge.track(this.fatherTitle+'-点击帖子',{
            '帖子标题':item.title,
            '帖子id':item.id,
            '发布人':item.has_one_stick_user.nickname,
            '发布人id':item.user_id,
            '帖子所属一级标签':item.has_one_category.cate_name,
            '帖子所属二级标签':item.has_one_category.name,
            '关键词':that.commodityTitle,
            '发布时间':item.created_at
          });
        }
      });

      if (this.nowClick === true) {
        return;
      }
      this.$router.push(
        this.fun.getUrl("microCommentDetails", {
          stickId: stick_id
        })
      );
    }
  },

  watch: {
    list: function (newVal, oldVal) {
      let oldLength = oldVal ? oldVal.length : 1;
      this.sort(oldLength, newVal);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Waterfalls_flow {
  background: #fff;
  /* min-height: 90vh; */
  .load {
    text-align: center;

    img {
      width: 3rem;
    }
  }

  ul {
    vertical-align: top;
    display: inline-block;
    width: 46%;
    margin: 0.625rem 0 0.625rem 2.5%;

    li {
      border-radius: 0.38rem;
      width: 100%;
      background-color: #fff;
      padding-bottom: 0.69rem;
      margin-bottom: 0.75rem;
      overflow: hidden;

      .top {
        // display: flex;
        margin: 0;
        padding: 0;

        img {
          width: 100%;
          overflow: hidden;
          margin: 0;
          display: block;
        }
        .mic-content {
          font-size: 12px;
          line-height: 18px;
          color: #666;
          padding: 0.25rem;
          border-radius: 0.25rem;
          // width: 100%;
          // margin: 0.375rem;
          min-height: 48px;
          background: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
        }
      }

      .text-bg {
        padding: 0.375rem;
        background-color: red; /* 浏览器不支持时显示 */
        // background-image: linear-gradient(#e66465 60%, #ffffff 40%);
        background: linear-gradient(#e66465 5%, #ffffff 90%);
      }

      .bottom {
        padding: 0 0.375rem;

        .title {
          font-weight: 600;
          padding-top: 0.63rem;
          font-size: 0.84rem;
          line-height: 1rem;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: left;
          margin-bottom: 0.59rem;
        }

        .content {
          display: flex;
          justify-content: space-between;

          .headmessage {
            display: flex;

            .left {
              width: 1.13rem;
              height: 1.13rem;
              border-radius: 50%;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .name {
              width: 4rem;
              margin-left: 0.31rem;
              height: 1.13rem;
              line-height: 1.13rem;
              text-align: left;
              color: #8c8c8c;
              font-size: 0.69rem;
              overflow: hidden; /* 超出部分隐藏 */
              text-overflow: ellipsis; /* 超出部分显示省略号 */
              white-space: nowrap; /* 规定段落中的文本不进行换行 */
            }
          }

          .thumbup {
            display: flex;
            align-items: center;
            padding-top: 0.16rem;

            .right {
              width: 0.81rem;
              height: 0.84rem;
              margin-right: 0.38rem;

              img {
                width: 100%;
                height: 100%;
                display: block;
              }
            }

            .num {
              min-width: 2rem;
              max-width: 8rem;
              text-align: left;
              color: #333;
              font-size: 0.75rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
