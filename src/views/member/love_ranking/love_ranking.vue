<template>
  <div class="page">
    <c-title text="爱心值排行榜"></c-title>
    <div class="wrapper">
      <div class="bg"></div>
      <div class="content">
        <div class="userInfo">
          <p class="c1">我的成绩</p>
          <div class="c2">
            <img :src="userObj.avatar" alt="" />
          </div>
          <p class="c3">
            {{ userObj.nickname }}
          </p>
          <p class="c4">第{{ userObj.countNO }}名</p>
          <p class="c5">
            {{ userObj.countLove }}
          </p>
        </div>
        <div class="listData">
          <div class="item head">
            <p class="c1">排名</p>
            <p class="c2">头像</p>
            <p class="c3">
              昵称
            </p>
            <p class="c4">
              爱心值
            </p>
            <p class="c5">
              查看
            </p>
          </div>
          <div class="item child" v-for="(item, key) in listData" :key="item.member_id">
            <div class="c1" v-if="key == 0">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/axzph_level1@2x.png" alt="" />
            </div>
            <div class="c1" v-else-if="key == 1">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/axzph_level2@2x.png" alt="" />
            </div>
            <div class="c1" v-else-if="key == 2">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/axzph_level3@2x.png" alt="" />
            </div>
            <div class="c1" v-else style="letter-spacing: 0.044rem; color: #b4b6b8; font-size: 0.688rem;">NO.{{ key + 1 }}</div>
            <div class="c2">
              <img :src="item.has_one_member ? item.has_one_member.avatar : ''" alt="" />
            </div>
            <p class="c3">
              {{ item.has_one_member ? item.has_one_member.nickname : "" }}
            </p>
            <p class="c4">
              {{ item.total_amount }}
            </p>
            <p class="c5" @click="toCard(item.has_one_business_card)">
              <i style="color: #000;" class="iconfont icon-axph_read"></i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";

/*
  toCard(item) {
        this.$router.push(
          this.fun.getUrl(
            "BusinessCard",
            {},
            { mark_id: item.card_id, mark: "card" }
          )
        );
      },

  */

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      userObj: {},
      listData: [],
      love_title: "爱心值排行榜",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.initData();
    this.getListData();
  },
  methods: {
    initData() {
      this.shareFlag = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    async getListData() {
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      let res = await $http.get("plugin.love-ranking.api.index.index");
      Toast.clear();

      let love_ranking = res.data.getSet.love_ranking;
      console.log(love_ranking);
      let listData = love_ranking.ranking.data;
      this.total_page = love_ranking.ranking.last_page;
      if (love_ranking.ranking.current_page >= love_ranking.ranking.last_page) {
        this.isLoadMore = false;
      }

      let obj = {};
      obj.avatar = love_ranking.information.avatar;
      obj.nickname = love_ranking.information.nickname;
      obj.countLove = love_ranking.countLove;
      obj.countNO = love_ranking.countNO;
      this.listData = listData;
      this.userObj = obj;

      if (res.data.getSet.love_title != "") {
        this.fun.setWXTitle(res.data.getSet.love_title);
        this.love_title = res.data.getSet.love_title;
      }
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.love-ranking.api.index.index", {
            page: this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            let love_ranking = res.data.getSet.love_ranking;
            if (love_ranking.ranking.current_page >= love_ranking.ranking.last_page) {
              this.isLoadMore = false;
            }

            this.listData.push(...love_ranking.ranking.data);
            /*
                      this.isLoadMore = true;
                      if (res.result === 1) {
                        var nextPageData = res.data.list.data;

                        this.listData = this.listData.concat(nextPageData);
                        //this.status = res.data.status;
                      } else {
                        this.page = this.page - 1;
                        this.isLoadMore = false;
                        console.log(res.msg);
              }
              */
          });
      }
    },
    toCard(item) {
      if (!item || typeof item == "undefined" || !item.id) {
        Toast("该会员没有对应的名片");
        return;
      }
      this.$router.push(this.fun.getUrl("BusinessCard", {}, { mark_id: item.id, mark: "card" }));
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background-color: rgb(249, 249, 249);
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.wrapper {
  position: relative;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 12rem;
    background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/axphb_bg@2x.png);
    background-size: cover;
  }

  .content {
    position: absolute;
    width: 100%;
    min-height: calc(100vh - 2.938rem - 11rem);
    top: 11rem;
    left: 0;
    background: #fff;
    border-radius: 1rem 1rem 0 0;
    padding: 1rem;

    .userInfo {
      height: 4rem;
      padding: 1rem;
      background-color: #fff;
      box-shadow: 0.1rem 0.1rem 0.5rem 0.5rem rgba(101, 101, 101, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .c1 {
        width: 2rem;
        height: 2rem;
        color: #018ced;
        font-size: 1rem;
      }

      .c2 {
        width: 2rem;
        height: 2rem;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
      }

      .c3 {
        width: 6.2rem;
        font-size: 0.875rem;
        color: #171732;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .c4 {
        display: flex;
        align-items: center;
        height: 2rem;
        height: 0.813rem;
        color: #018ced;
      }

      .c5 {
        height: 2rem;
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        color: #018ced;
      }
    }

    .listData {
      padding-top: 2rem;

      .item {
        display: grid;
        grid-template-columns: 2.3rem 2.3rem 1fr 3.5rem 3rem;
        grid-column-gap: 1.2rem;
        height: 3rem;

        .c1 {
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 2rem;
            height: 2rem;
          }
        }

        .c3 {
          letter-spacing: 0.044rem;
          color: #2c2f32;
          width: 6rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .c4 {
          font-size: 0.875rem;
          letter-spacing: 0.044rem;
          color: #000;
        }
      }

      .head {
        color: #b4b6b8;
        height: 2rem;
        align-items: flex-start;

        .c3,
        .c4,
        .c5 {
          font-size: 0.875rem;
          color: #b4b6b8;
        }
      }

      .child {
        .c2 {
          width: 2rem;
          height: 3rem;

          img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
          }
        }

        .c2,
        .c3,
        .c4,
        .c5 {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
