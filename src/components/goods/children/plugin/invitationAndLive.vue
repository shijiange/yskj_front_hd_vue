<template>
  <div class="good-item-box">
    <div class="posts-live-tabs">
      <div class="tabs-item" v-for="tab in tabList" :key="tab.id" :class="[ isPost == tab.id ? 'active' : '']" @click="changeTab(tab)">{{tab.name}}</div>
    </div>
    <div class="posts-out-box" v-if="isPost == 1">
      <van-swipe class="my-swipe"  indicator-color="red">
        <van-swipe-item v-for="(value,i) in min_micro" class="my-swipe-item" :key="i">
          <div class="posts-box">
            <div class="posts-item" @click="goMicro(item.stick_id)" v-for="(item,index) in value" :key="index" v-if="item.url" :style="{ backgroundImage: `url(${item.url})` }"> </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="live-room" v-if="isPost == 2">
      <van-swipe class="my-swipe"  indicator-color="red">
        <van-swipe-item v-for="(value,i) in recordsList" class="my-swipe-item" :key="i">
          <div class="live-room-item" v-for="(item,index) in value" :key="index" @click="gotoRoom(item.play_type,item.id,item.back_id)">
            <div class="live-bg">
              <img :src="item.cover || blankImage" alt="">
              <div class="live-top">
                <div v-if="item.play_type != 3" :class="[item.play_type == 1 ? 'living' : 'isBack']" >{{item.play_type == 1?'直播中':'回放'}}</div>
                <div v-if="item.play_type == 3" :class="['living']" >预告</div>
                <div v-if="item.play_type != 3" class="live-num">{{item.view_num}}人观看</div>
                <div class="goods_icon">
                  <i class="iconfont icon-customform_list_2"></i><span>{{item.goods_num}}</span>
                </div>
              </div>
              <div class="live-title">
                {{item.title}}
              </div>
            </div>
            <div class="user">
              <div class="user-photo">
                <img :src="item.avatar" alt="" />
              </div>
              <div class="user-name"><span>{{item.nickname}}</span></div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="posts-live-all"  v-if="isPost == 1" @click="tapShow">
      <div class="text">查看全部</div>
      <i class="iconfont icon-advertise-next"></i>
    </div>

    <van-popup :overlay="false" get-container="#app" v-model="showPop" position="right" :style="{ width: '100%', height: '100%', zIndex: '999' }">
      <van-nav-bar title="关联微贴" left-arrow @click-left="showPop = false" :fixed="true" />
      <div class="post-main">
        <div class="post-item" v-for="(item, ind) in micro_communities.list" :key="ind" @click="goMicro(item.id)">
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
    </van-popup>
  </div>
</template>

<script>
export default {
  props: ["goods_info","min_micro","tabList", "recordsList"],
  data() {
    return {
      isPost: 1,
      blankImage: 'https://www.yunzmall.com/addons/yun_shop/static/app/img/agreen_video@2x.png',
      goodsid: '',
      showPop: false,
      micro_communities: [],
      page: 1,
      last_page: 1,
    };
  },
  mounted() {
    this.isPost = this.tabList[0].id;
    this.goodsid = this.goods_info.get_goods.id;
  },
  methods:{
    changeTab(tab) {
      this.isPost = tab.id;
    },
    tapShow() {
      this.$router.push(this.fun.getUrl("goodsComment",{gid:this.goodsid,istype:'micro'}));
      // this.page = 1;
      // this.last_page = 1;
      // $http.post("plugin.micro-communities.api.goods.index", { page: this.page, goods_id: this.goodsid }, "").then(response => {
      //   if (response.result == 1) {
      //     this.showPop = true;
      //     this.micro_communities.list = response.data.data;
      //     this.last_page = response.data.last_page;
      //   } else {
      //     this.$toast(response.msg);
      //   }
      // });
    },
    // getMore() {
    //   this.page = this.page + 1;
    //   $http.post("plugin.micro-communities.api.goods.index", { page: this.page, goods_id: this.goodsid }, ".").then(response => {
    //     if (response.result == 1) {
    //       this.micro_communities.list = this.micro_communities.list.concat(response.data.data);
    //       this.last_page = response.data.last_page;
    //     } else {
    //       this.$toast(response.msg);
    //     }
    //   });
    // },
    gotoRoom(type,rid,bid){
      if(type == 1){
        //直播中，跳转到主播间
        console.log("直播中，跳转到主播间");
        this.$router.push(this.fun.getUrl("livePage", {id:rid, type:'livePlay'}, {from: 'back'}));
      }else if(type == 2){
        //直播回放中，跳转到主播间
        console.log("直播回放中，跳转到主播间回放");
        this.$router.push(this.fun.getUrl("livePage", {id:rid,backid:bid,type:'playBack'}, {from: 'back'}));
      }else if(type == 3){
        //预告页面
        console.log("预告页面");
        this.$router.push(this.fun.getUrl("foreshow", {id:rid}));
      }else{
        console.log("error:::");
      }
    },
    goMicro(_id) {
      this.$router.push(
        this.fun.getUrl("microCommentDetails", {
          stickId: _id
        })
      );
    },
    goMicroPage() {
      this.$router.push(this.fun.getUrl("MicroIndex"));
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .good-item-box {
    background: #fff;
    border-radius: 10px;
    margin: 10px;
  }

  .posts-live-tabs {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 3.5rem;
    padding-bottom: 0.7rem;

    .tabs-item {
      font-size: 0.875rem;
      font-weight: bold;
      color: #aaa;

      &.active {
        position: relative;
        color: #484848;

        &::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -0.469rem;
          transform: translateX(-50%);
          display: block;
          width: 2.063rem;
          height: 0.25rem;
          background-color: #f14e4e;
          border-radius: 0.125rem;
        }
      }
    }
  }

  /* 微贴 */
  .posts-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 0.3rem;
    row-gap: 0.3rem;
    margin: 0 0.75rem 0.75rem 0.75rem;

    .posts-item {
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  /* 直播 */
  .live-room {
    padding-bottom: 10px;

    .my-swipe-item {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
      padding-bottom: 0.9375rem;

      .live-room-item {
        position: relative;
        margin: 0 0 1rem 0;

        .live-bg {
          width: 10.625rem;
          height: 13.125rem;
          position: relative;

          img {
            border-radius: 0.8125rem;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .live-top {
            position: absolute;
            top: 0.625rem;
            left: 0.3125rem;
            display: flex;

            .living {
              width: 2.375rem;
              height: 1.25rem;
              line-height: 1.25rem;
              font-size: 0.6875rem;
              text-align: center;
              background-color: #ff2c29;
              border-radius: 0.25rem;
              color: #fff;
            }

            .isBack {
              width: 2.375rem;
              height: 1.25rem;
              line-height: 1.25rem;
              font-size: 0.6875rem;
              text-align: center;
              background-color: #999;
              border-radius: 0.25rem;
              color: #fff;
            }

            .live-num {
              width: 3.8125rem;
              height: 1.25rem;
              line-height: 1.25rem;
              font-size: 0.6875rem;
              text-align: center;
              background-color: rgba(0, 0, 0, 0.11);
              border-radius: 0.25rem;
              color: #fff;
            }

            .goods_icon {
              font-size: 12px;
              height: 1.25rem;
              line-height: 1.25rem;
              position: relative;
              margin-left: 1.25rem;

              i {
                font-size: 1.625rem;
                color: #ffa303;
              }

              span {
                position: absolute;
                background-color: #fff;
                border-radius: 5px;
                color: #f00;
                right: -9px;
                height: 0.875rem;
                line-height: 0.875rem;
                font-size: 10px;
                padding: 0 3px;
              }
            }
          }

          .live-title {
            position: absolute;
            bottom: 0.9375rem;
            left: 0.3125rem;
            font-size: 0.875rem;
            text-align: left;
            margin-right: 0.4375rem;
            color: #fff;
          }
        }

        .user {
          position: absolute;
          bottom: -1.125rem;
          display: flex;
          align-items: flex-end;
          margin-left: 0.375rem;

          .user-photo {
            width: 1.75rem;
            height: 1.75rem;

            img {
              border: solid 2px #fff;
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }

          .user-name {
            margin-left: 0.125rem;
            font-size: 0.75rem;
          }
        }
      }
    }
  }

  /deep/ .van-swipe__indicators {
    bottom: 1px;

    .van-swipe__indicator {
      width: 0.25rem;
      height: 0.25rem;
      background-color: #c2c2c2;
      border-radius: 50%;
      margin: 0 0.375rem;
      opacity: 1;
    }

    .van-swipe__indicator--active {
      margin: 0 0.375rem;
      width: 0.5rem;
      height: 0.25rem;
      border-radius: 0.125rem;
    }
  }

  .posts-live-all {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem 0.906rem 1.031rem 0.875rem;

    .text {
      font-size: 0.813rem;
      font-weight: bold;
      color: #5e5e5e;
    }

    .icon-advertise-next {
      color: #616161;
    }
  }

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