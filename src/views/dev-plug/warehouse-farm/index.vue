<!-- 圈仓农场 -->
<template>
  <div id="warehouse-farm-index">
    <c-title :hide="false" text="圈仓"> </c-title>
    <div class="main">
      <div class="member-info absolute-cell " v-if="info.name">
        <img :src="info.name.avatar || ''" alt="" />
        <div class="nickname">{{ info.name.nickname || "" }}</div>
      </div>
      <!-- 右侧侧边栏 -->
      <div class="right-nav-list absolute-cell flex-column">
        <div class="nav-item-img" @click.stop="openPopup('showDynamic', true)">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/dynamic.png" alt="" />
          <div class="text" style="font-size:12px;">动态</div>
        </div>
        <div class="nav-item-img" @click.stop="openPopup('showRank', true)">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/rank.png" alt="" />
          <div class="text" style="font-size:12px;">好友排行</div>
        </div>
        <div class="nav-item-img" @click.stop="toUrl('orderlist', { status: 0, orderType: 'warehouseTakeDelivery' })">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/record.png" alt="" />
          <div class="text" style="font-size:12px;">提货记录</div>
        </div>
      </div>
      <!-- 左侧侧边栏 -->
      <div class="left-nav-list absolute-cell flex-column">
        <div class="nav-item-img" @click.stop="openPopup('showAnnouncement', true)">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/announcement.png" alt="" />
          <div class="text">公告</div>
        </div>
      </div>
      <!-- 底部侧边栏 -->
      <div class="bottom-nav-list set-pc-style">
        <div class="nav-item-img" @click.stop="toUrl('warehouseFarmBuyGift')">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/Gift-box.png" alt="" />
          <div class="text text-color-1">买礼盒</div>
        </div>
        <div class="nav-item-img" @click.stop="toUrl('warehouseFarmGift')">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/gift.png" alt="" />
          <div class="text text-color-2">送礼物</div>
        </div>
        <div class="nav-item-img" @click.stop="toUrl('warehouseFarmExtract')">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/receive.png" alt="" />
          <div class="text text-color-3">提礼物</div>
        </div>
      </div>
      <!-- 栏杆、房屋背景 -->
      <!-- <div class="railing-bg left-railing absolute-cell"></div>
      <div class="railing-bg right-railing absolute-cell"></div> -->
      <!--  -->
      <div
        class="icon-box"
        v-for="(item, index) in iconOption"
        :style="{ bottom: item.bottom, left: item.left, right: item.right }"
        :key="index"
        @click.stop="toUrl('warehouseFarmBuyGift', { id: info.types[index].id })"
      >
        <img :src="item.icon" alt="" :style="{ width: item.width }" />
        <div class="text-box" v-if="info.types && info.types[index]" :style="{ top: item.text == 'top' ? item.textTop : 'auto', bottom: item.text == 'bottom' ? '-0.5rem' : 'auto' }">
          <div class="name">{{ info.types[index].name }}库存</div>
          <div class="num" v-if="Number(info.types[index].nums_all) > 0">{{ info.types[index].nums_all }}</div>
        </div>
      </div>
    </div>

    <van-popup v-model="showAnnouncement" round closeable close-icon="close" :style="{ width: '18rem!important' }">
      <div class="announcement-box">
        <div class="title">公告</div>
        <template v-if="!info.announcement">暂无公告内容 ~</template>
        <div class="content" v-html="info.announcement"></div>
      </div>
    </van-popup>
    <van-popup v-model="showDynamic" closeable close-icon="close" position="bottom" :style="{ height: '70%', backgroundColor: 'transparent' }">
      <div class="dynamic-box">
        <div class="title">动态</div>
        <div class="content">
          <van-pull-refresh v-model="dynamic_refreshing" @refresh="onRefresh('dynamic_')">
            <van-list v-model="dynamic_loading" :finished="dynamic_finished" finished-text="没有更多了" @load="onLoad('dynamic_')">
              <div class="circle-left todayDynamic-box" v-if="todayDynamic.length > 0">
                <div class="data-circle">今天</div>
                <div class="dynamic-list flex-column" v-for="(item, index) in todayDynamic" :key="index">
                  <div class="time">{{ item.created_at }}</div>
                  <div class="text">{{ item.dynamic_state }}</div>
                  <div class="chip"></div>
                </div>
              </div>
              <div class="circle-left beforeDynamic-box">
                <div class="data-circle">更早</div>
                <div class="dynamic-list flex-column" v-for="(item, index) in beforeDynamic" :key="index">
                  <div class="time">{{ item.created_at }}</div>
                  <div class="text">{{ item.dynamic_state }}</div>
                  <div class="chip"></div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showRank" closeable close-icon="close" position="bottom" :style="{ height: '70%', backgroundColor: 'transparent' }">
      <div class="rank-box">
        <div class="title">好友排行</div>
        <div class="content">
          <van-pull-refresh v-model="rank_refreshing" @refresh="onRefresh('rank_')">
            <van-list v-model="rank_loading" :finished="rank_finished" finished-text="没有更多了" @load="onLoad('rank_')">
              <div class="rank-list self-bg-color" v-if="rank_self">
                <div class="rank-num">
                  <div>{{ rank_self.rank }}</div>
                </div>
                <div class="rank-conten">
                  <div class="img"><img :src="rank_self.avatar" alt="" /></div>
                  <div class="member-info flex-column">
                    <div class="nickname">自己</div>
                    <div class="total">总库存：{{ rank_self.stock || "0" }}</div>
                  </div>
                </div>
              </div>
              <div class="rank-list " v-for="(item, index) in rank_list" :key="index">
                <div class="rank-num">
                  <div v-show="index == 0"><img class="medal" src="../../../assets/images/skin/gold_medal.png" alt="" /></div>
                  <div v-show="index == 1"><img class="medal" src="../../../assets/images/skin/silver_medal.png" alt="" /></div>
                  <div v-show="index == 2"><img class="medal" src="../../../assets/images/skin/copper_medal.png" alt="" /></div>
                  <div v-show="index > 2">{{ index + 1 }}</div>
                </div>
                <div class="rank-conten">
                  <div class="img"><img :src="item.avatar" alt="" /></div>
                  <div class="member-info flex-column">
                    <div class="nickname">{{ item.nickname }}</div>
                    <div class="total">总库存：{{ item.nums }}</div>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showReward" class="van-popup-transparent" :close-on-click-overlay="false">
      <div class="reward-box rollback" v-if="showReward">
        <img class="avatar" :src="gift.avatar || ''" alt="" />
        <div class="nickname">{{ gift.nickname || "---" }}</div>
        <div class="reward-text">{{ gift.msg ? gift.msg : "给你发来了一个" }}</div>
        <img
          v-if="!gift.msg"
          class="open-reward"
          @click="toUrl('warehouseFarmGiftDetail', { mode: 'give' }, { id: gift.markId })"
          src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/open-reward.png"
          alt=""
        />
      </div>
      <div class="iconfont icon-close11 clone-reward-btn" @click.stop="cloneReward"></div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconOption: [
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/cabbage.png",
          name: "菜",
          width: "8rem",
          bottom: "13.125rem",
          left: "1rem",
          right: "auto",
          text: "bottom"
        },
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/eggs.png",
          name: "肉蛋",
          width: "6.75rem",
          bottom: "15.875rem",
          right: "1.875rem",
          left: "auto",
          text: "top",
          textTop: "0rem"
        },
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/well.png",
          name: "水",
          width: "4.125rem",
          bottom: "19.75rem",
          right: "6.5rem",
          left: "auto",
          text: "top",
          textTop: "-2rem",
          zIndex: 1
        },
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/milk.png",
          name: "牛奶",
          width: "9.875rem",
          bottom: "21.375rem",
          left: "0",
          right: "auto",
          text: "bottom"
        },
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/seasoning.png",
          name: "调料",
          width: "5.25rem",
          bottom: "8.875rem",
          left: "0.875rem",
          right: "auto",
          text: "bottom"
        },
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/Rice.png",
          name: "大米",
          width: "5rem",
          bottom: "17rem",
          left: "0",
          right: "auto",
          text: "bottom"
        },
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/flour.png",
          name: "面粉",
          width: "5rem",
          bottom: "11.25rem",
          right: "1.875rem",
          left: "auto",
          text: "bottom"
        },
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/liquor.png",
          name: "酒",
          width: "3.875rem",
          bottom: "7.75rem",
          left: "5.875rem",
          right: "auto",
          text: "bottom"
        },
        {
          icon: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/delivery.png",
          name: "快递仓",
          width: "5.5rem",
          bottom: "24.875rem",
          left: "11.5rem",
          right: "auto",
          text: "top",
          textTop: "1rem"
        }
      ],
      showAnnouncement: false, //广告弹窗
      showDynamic: false, //动态弹窗
      showRank: false, //排行榜弹窗
      showReward: false, //红包弹窗
      info: {},
      gift: {}, //是否有红包信息
      // 排行榜数据
      rank_loading: false,
      rank_finished: false,
      rank_refreshing: false,
      rank_page: 1,
      rank_list: [],
      rank_self: {},
      //动态数据
      dynamic_loading: false,
      dynamic_finished: false,
      dynamic_refreshing: false,
      dynamic_page: 1,
      dynamic_list: [],
      dynamic_self: {},

      todayDynamic: [], //当天动态
      beforeDynamic: [] //以前的动态信息
    };
  },

  activated() {
    this.showAnnouncement = false;
    this.getData();
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    getData() {
      let _json = {};
      if (this.$route.query.markId) {
        _json.gift_key = this.$route.query.markId;
      }
      $http
        .get("plugin.warehouse.frontend.controllers.center.index", _json)
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
            this.gift = response.data.gift || {};
            if (this.$route.query.markId) {
              this.gift.markId = this.$route.query.markId;
            }
            this.showReward = response.data.gift && response.data.gift.judge ? true : false;
            this.fun.wxShare(
              "",
              {},
              {
                title: (response.data.share_info && response.data.share_info.title) || null,
                imgUrl: (response.data.share_info && response.data.share_info.thumb) || null,
                description: (response.data.share_info && response.data.share_info.detail) || null
              }
            );
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cloneReward() {
      this.showReward = false;
      this.$router.replace(this.fun.getUrl("warehouseFarmIndex", {}, {}));
    },
    openPopup(name, check = false) {
      if (name) this[name] = check;
    },
    toUrl(_name, _params = {}, _query = {}) {
      if (_name) this.$router.push(this.fun.getUrl(_name, _params, _query));
    },

    onLoad(_tag) {
      let _url = "plugin.warehouse.frontend.controllers.center.rank";
      if (_tag == "dynamic_") {
        _url = "plugin.warehouse.frontend.controllers.center.dynamic-state";
      }
      $http
        .get(_url, { page: this[`${_tag}page`] })
        .then(response => {
          this[`${_tag}loading`] = false;
          if (this[`${_tag}refreshing`]) this[`${_tag}refreshing`] = false;
          if (response.result === 1) {
            if (_tag == "dynamic_") {
              if (this[`${_tag}page`] == 1) {
                this.todayDynamic = [];
                this.beforeDynamic = [];
              }
              let _datalist = response.data.list.data;
              _datalist.forEach(item => {
                if (this.isToday(item.created_at)) {
                  this.todayDynamic.push(item);
                } else {
                  this.beforeDynamic.push(item);
                }
              });
            } else {
              this[`${_tag}list`] = this[`${_tag}list`].concat(response.data.list.data);
            }
            this[`${_tag}self`] = response.data.self;
            if (response.data.list.current_page == response.data.list.last_page) {
              this[`${_tag}finished`] = true;
            } else {
              this[`${_tag}page`] = this[`${_tag}page`] + 1;
            }
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    isToday(date) {
      //是否为当天数据
      return new Date(date).toDateString() === new Date().toDateString();
    },
    onRefresh(_tag) {
      // 重新加载数据
      this[`${_tag}loading`] = true; // 将 loading 设置为 true，表示处于加载状态
      this[`${_tag}page`] = 1;
      this[`${_tag}list`] = [];
      this[`${_tag}finished`] = false;
      this.todayDynamic = [];
      this.beforeDynamic = [];
      this.onLoad(_tag);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#warehouse-farm-index {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .absolute-cell {
    position: absolute;
    z-index: 99;
    .text {
      color: #fff;
    }
  }
  .flex-column {
    display: flex;
    flex-direction: column;
  }
  .main {
    position: relative;
    height: calc(100% - 40px);
    width: 100%;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/bg_1.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: bottom;
    background-color: #b5faff;
    .member-info {
      left: 1rem;
      top: 1.5rem;
      height: 1.75rem;
      background-color: rgba($color: #000000, $alpha: 0.5);
      border-radius: 0.875rem;
      color: #fff;
      display: flex;
      align-items: center;
      padding: 0 0.5rem 0 0.25rem;
      max-width: 10rem;

      img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        margin-right: 0.25rem;
      }
      .nickname {
        flex: 1;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
    }
    .right-nav-list {
      right: 1rem;
      top: 1.5rem;
      .nav-item-img {
        margin-bottom: 1rem;
        img {
          width: 2.5rem;
        }
        .text {
          text-shadow: 0px 0px 2px #000000;
          // font-weight: bold;
        }
      }
    }
    .left-nav-list {
      left: 1rem;
      top: 4.375rem;

      .nav-item-img {
        margin-bottom: 1.375rem;
        img {
          width: 2.5rem;
        }
        .text {
          // text-shadow: -1px 1px 0 #123904, 1px 1px 0 #123904, 1px -1px 0 #123904, -1px -1px 0 #123904;
          text-shadow: 0px 0px 2px #000000;
          font-size: 12px;
        }
      }
    }
    .bottom-nav-list {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      bottom: 1.875rem;
      display: flex;
      justify-content: space-around;
      color: #fff;
      img {
        width: 3.125rem;
      }
      .text {
        text-shadow: 0px 0px 2px #000000;
      }
      .text-color-1 {
        // text-shadow: -1px 1px 0 #3f8455, 1px 1px 0 #3f8455, 1px -1px 0 #3f8455, -1px -1px 0 #3f8455;
      }
      .text-color-2 {
        // text-shadow: -1px 1px 0 #278db0, 1px 1px 0 #278db0, 1px -1px 0 #278db0, -1px -1px 0 #278db0;
      }
      .text-color-3 {
        // text-shadow: -1px 1px 0 #c98103, 1px 1px 0 #c98103, 1px -1px 0 #c98103, -1px -1px 0 #c98103;
      }
    }
    .railing-bg {
      background-size: 100% auto;
      background-repeat: no-repeat;
      z-index: 0;
    }
    .left-railing {
      width: 9rem;
      height: 16rem;
      left: 0;
      bottom: 8.3125rem;
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/railing.png");
    }
    .right-railing {
      width: 12rem;
      height: 12rem;
      right: -6px;
      bottom: 15rem;
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/home.png");
    }
    .icon-box {
      position: absolute;
      img {
        height: auto;
      }
      .text-box {
        position: absolute;
        display: flex;
        flex-direction: column;
        border-radius: 1rem;
        color: #fff;
        background: rgba(18, 42, 13, 0.3);
        z-index: 99;
        right: 0;
        padding: 0 0.875rem;
        font-size: 10px;
      }
    }
  }
  .announcement-box {
    width: 18rem;
    min-height: 18rem;
    max-height: 24rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/announcement-bg.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    .title {
      font-size: 20px;
      color: #fff;
      font-weight: 600;
      padding: 0 0 3.5rem;
    }
    .content {
      flex: 1;
      padding-bottom: 1rem;
      overflow-y: scroll;
    }
    /deep/img {
      max-width: 100%;
    }
  }
  .rank-box,
  .dynamic-box {
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/dynamic-bg.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .title {
      height: 3.125rem;
      line-height: 3.125rem;
      font-size: 20px;
      color: #fff;
      font-weight: 600;
    }
    .content {
      flex: 1;
      background-color: #fff;
      overflow: scroll;
    }
  }
  .dynamic-box {
    .content {
      padding: 2rem 1.625rem;
      .dynamic-list {
        background-color: #ececec;
        border-radius: 0.375rem;
        padding: 0.875rem 1.125rem;
        margin-bottom: 0.75rem;
        text-align: left;
        position: relative;
        .time {
          font-size: 12px;
          color: #787878;
        }
        .text {
          padding-top: 0.875rem;
          font-size: 14px;
          line-height: 14px;
        }
        .chip {
          position: absolute;
          left: -6px;
          display: inline-block;
          width: 0;
          height: 0;
          border-style: solid;
          transform: rotate(0deg);
          border-width: 6px 6px 6px 0;
          border-color: transparent #ececec transparent transparent;
        }
      }
      .circle-left {
        position: relative;
        padding-left: 3rem;
        .data-circle {
          position: absolute;
          left: 0;
          top: 0;
          width: 1.875rem;
          height: 1.875rem;
          line-height: 1.875rem;
          border-radius: 50%;
          font-size: 12px;
        }
      }
      .todayDynamic-box {
        .data-circle {
          background-color: #92cf51;
          color: #fff;
        }
        &::before {
          position: absolute;
          content: "";
          width: 1px;
          left: 15px;
          top: 40px;
          height: calc(100% - 40px);
          background: #d3d3d3;
        }
      }
      .beforeDynamic-box {
        .data-circle {
          background-color: #cdcbcb;
          color: #666666;
        }
      }
    }
  }
  .rank-box {
    .rank-list {
      display: flex;
      align-items: center;
      .rank-num {
        width: 3.625rem;
        text-align: center;
        .medal {
          width: 1.25rem;
        }
      }
      .rank-conten {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
        border-bottom: 1px solid #f1f1f1;
        margin-right: 1rem;
      }
      .img {
        width: 2.625rem;
        height: 2.625rem;
        background-color: #787878;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .member-info {
        flex: 1;
        height: 2.625rem;
        text-align: left;
        overflow: hidden;
        margin: 0.938rem 0 0.938rem 0.75rem;
        justify-content: space-between;

        .nickname {
          font-size: 16px;
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */
        }
        .total {
          color: #949494;
          font-size: 12px;
        }
      }
    }
  }

  .self-bg-color {
    background-color: #f0ffe0;
  }

  /deep/.van-popup__close-icon {
    color: #fff;
  }

  .reward-box {
    width: 18.25rem;
    height: 23.625rem;
    margin: 0 auto;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/warehouse-farm/rewardbg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    .avatar {
      width: 2.875rem;
      height: 2.875rem;
      border-radius: 50%;
      margin: 3.35rem auto 0;
    }
    .nickname {
      color: #fefefe;
      text-shadow: 1px 1px 2px #333333;
      padding: 0 0.875rem;
      margin-top: 0.625rem;
    }
    .reward-text {
      color: #ffdb8d;
      margin-top: 1.25rem;
      font-size: 16px;
      text-shadow: 2px 1px 2px #83070c;
    }
    .open-reward {
      width: 6.125rem;
      height: 6.125rem;
      margin: 2.5rem auto 0;
    }
  }

  .clone-reward-btn {
    color: #fff;
    width: 1.75rem;
    height: 1.75rem;
    line-height: 1.75rem;
    font-size: 14px;
    border: 1px solid;
    margin: 12px auto;
    border-radius: 50%;
  }

  .van-popup-transparent {
    background-color: transparent;
  }

  .rollback {
    transition: transform 2s;
    transform-style: preserve-3d;
    animation: PacketRollback 0.5s 0.5s both linear;
  }

  @keyframes PacketRollback {
    0% {
      transform: rotateY(0deg) scale(0);
    }

    30% {
      transform: rotateY(90deg) scale(0.3);
    }

    60% {
      transform: rotateY(180deg) scale(0.6);
    }

    80% {
      transform: rotateY(270deg) scale(0.7);
    }

    to {
      transform: rotateY(360deg) scale(1);
    }
  }
}
</style>
