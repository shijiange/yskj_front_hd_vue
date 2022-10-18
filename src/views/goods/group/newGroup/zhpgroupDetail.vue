<!-- 珍惠拼 拼团详情 -->
<template>
  <div id="zhpgroupDetail">
    <c-title :hide="false" :text="'参团详情'"></c-title>
    <div class="content">
      <div class="goods_list">
        <div class="goods_box">
          <div class="goods_img">
            <img :src="goods.thumb" @click="gotoUrl('zhpGroup', { id: aid })" />
          </div>
          <ul class="goods_info">
            <li class="name" style="-webkit-box-orient: vertical;">
              {{ goods.title }}
            </li>
            <li class="price">
              <span>{{ $i18n.t("money") }}</span
              >{{ goods.group_price }}<span style="text-decoration: line-through;">{{ $i18n.t("money") }}{{ goods.price }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="into_group">
        <div class="title">
          <div class="line_left"></div>
          <span>{{ active_status }}</span>
          <div class="line_right"></div>
        </div>
        <div class="time" v-if="status != null && status != 2">
          <van-count-down :time="countDownTime" class="bottom_time" format="DD天HH时mm分ss秒" @finish="countDownEnd">
            <template #default="timeData">
              <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }}</em
              >天
              <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }} </em>
              <b>:</b>
              <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }} </em>
              <b>:</b>
              <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }} </em>
            </template>
          </van-count-down>
        </div>
        <!-- 按钮 进行中：邀请好友||去参团 ； 未开始||已结束：更多活动 -->
        <button type="button" class="btn" @click="clickBtn()">{{ btnTest }}</button>
      </div>
      <div class="group_user">
        <h2>参团组员</h2>
        <van-swipe @change="onChangeMember" style="height: 50px;" :autoplay="1200" :show-indicators="false" vertical v-if="!this.fun.isTextEmpty(Participants)">
          <van-swipe-item v-for="(item, index) in Participants" :key="index">
            <div class="user_box">
              <div class="user" v-for="(child, i) in item" :key="i">
                <div class="img">
                  <img :src="child.avatar" />
                </div>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
        <div v-if="!this.$store.state.isloadding && this.fun.isTextEmpty(Participants)">暂无参团人员</div>
      </div>
      <div class="group_user">
        <h2>历史拼中记录</h2>
        <van-swipe @change="onChangeWinMember" style="height: 50px;" :autoplay="1200" :show-indicators="false" vertical v-if="!this.fun.isTextEmpty(activiyWinMember)">
          <van-swipe-item v-for="(item, index) in activiyWinMember" :key="index">
            <div class="user_box">
              <div class="user" v-for="(child, i) in item" :key="i">
                <div class="img">
                  <img :src="child.avatar" />
                </div>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
        <div v-if="!this.$store.state.isloadding && this.fun.isTextEmpty(activiyWinMember)">暂无信息</div>
      </div>
      <div class="look_btn" @click="gotoUrl('home')" :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '100%' }">
        <button type="button">去商城逛逛</button>
      </div>
    </div>
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import { Toast } from "vant";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
export default {
  data() {
    return {
      aid: 0,
      goods: {
        title: "",
        thumb: "",
        price: "",
        group_price: ""
      },
      status: null,
      start_time: null,
      end_time: "",
      active_status: "", //活动状态文字
      timestamp: Date.parse(new Date()) / 1000, //获取当前时间戳
      countDownTime: 0,
      isAddGroup: false, //是否已参团
      btnTest: "更多活动",
      Participants: [], //参团人员
      activiyWinMember: [], //活动（非一轮）中奖人员
      showWechatshar: false,

      //more
      page_a: 1, //分页数，当前页数
      isLoadMore_a: true, //判断是否要加载更多的标志
      total_page_a: 0, //总页数

      page_b: 1, //分页数，当前页数
      isLoadMore_b: true, //判断是否要加载更多的标志
      total_page_b: 0 //总页数
    };
  },
  components: { yzWechatShareImg },
  computed: {},
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      // group_id: 团id
      $http
        .post("plugin.zhp-group-lottery.frontend.group.get-group", { group_id: this.$route.params.id }, ".")
        .then(response => {
          if (response.result === 1) {
            this.goods.title = response.data.goods_title;
            this.goods.thumb = response.data.goods_thumb;
            this.goods.price = response.data.goods_price;
            this.goods.group_price = response.data.group_price;
            this.start_time = Number(response.data.start_time);
            this.end_time = Number(response.data.end_time);
            this.aid = response.data.activity_id;
            if (this.timestamp < this.start_time) {
              //活动未开始
              this.status = 0;
              this.countDownTime = this.fun.getTimeDifference(this.start_time);
              if (response.data.member_group_info && response.data.member_group_info.order_id) {
                this.isAddGroup = true;
              }
              this.btnTest = this.isAddGroup ? "邀请好友" : "去参团";
            } else if (this.timestamp >= this.start_time && this.timestamp <= this.end_time) {
              //活动进行中
              this.status = 1;
              if (response.data.member_group_info && response.data.member_group_info.order_id) {
                this.isAddGroup = true;
              }
              this.btnTest = this.isAddGroup ? "邀请好友" : "去参团";
              this.countDownTime = this.fun.getTimeDifference(this.end_time);
            } else {
              this.status = 2;
            }
            this.active_status = this.status == 0 ? "距离活动开始时间" : this.status == 1 ? "距离本轮结束" : "活动已结束";
            this.getMembers(); //获取当前轮次参加会员
            this.getActiviyWinMember(); //当前活动中奖记录
            this.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid() },
              {
                title: that.fun.isTextEmpty(that.goods.activity_title) ? "拼团活动" : that.goods.activity_title,
                imgUrl: that.goods.thumb,
                description: ""
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clickBtn() {
      if (this.status != 2 && this.isAddGroup) {
        //活动进行中并已参团，邀请好友操作
        this.showWechatshar = true;
      } else if (this.status != 2 && !this.isAddGroup) {
        this.gotoUrl("zhpGroup", { id: this.aid });
      } else {
        this.gotoUrl("zhpGroupList");
      }
    },
    getMembers() {
      // 有分页
      $http
        .post("plugin.zhp-group-lottery.frontend.group.get-group-member", { group_id: this.$route.params.id }, ".")
        .then(response => {
          if (response.result === 1) {
            for (let i = 0; i < response.data.data.length; i += 5) {
              this.Participants.push(response.data.data.slice(i, i + 5));
            }
            this.isLoadMore_a = true;
            this.total_page_a = response.data.last_page;
            if (!this.total_page_a) {
              this.total_page_a = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeMember(index) {
      if (index == this.Participants.length - 2) {
        this.getMoreData("a");
      }
    },
    //获取更多数据，加载更多
    getMoreData(name) {
      if (!this[`isLoadMore_${name}`]) {
        return;
      }
      this[`isLoadMore_${name}`] = false;
      const that = this;
      if (that[`page_${name}`] >= that[`total_page_${name}`]) {
        return;
      } else {
        that[`page_${name}`] += 1;
        let url = name == "a" ? "plugin.zhp-group-lottery.frontend.group.get-group-member" : "plugin.zhp-group-lottery.frontend.group.get-activiy-member-win";
        $http
          .get(url, { group_id: this.$route.params.id, activity_id: this.aid, page: that[`page_${name}`] }, "加载中")
          .then(res => {
            that[`isLoadMore_${name}`] = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              let newArr = [];
              for (let i = 0; i < nextPageData.length; i += 5) {
                newArr.push(nextPageData.slice(i, i + 5));
              }
              if (name == "a") {
                that.Participants = that.Participants.concat(newArr); //进行数组拼接
              } else {
                that.activiyWinMember = that.activiyWinMember.concat(newArr); //进行数组拼接
              }
            } else {
              that[`page_${name}`] = that[`page_${name}`] - 1;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getActiviyWinMember() {
      // 有分页
      $http
        .post("plugin.zhp-group-lottery.frontend.group.get-activiy-member-win", { activity_id: this.aid }, ".")
        .then(response => {
          if (response.result === 1) {
            for (let i = 0; i < response.data.data.length; i += 5) {
              this.activiyWinMember.push(response.data.data.slice(i, i + 5));
            }
            this.isLoadMore_b = true;
            this.total_page_b = response.data.last_page;
            if (!this.total_page_b) {
              this.total_page_b = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeWinMember(index) {
      if (index == this.activiyWinMember.length - 2) {
        this.getMoreData("b");
      }
    },
    countDownEnd() {
      if (this.status != null) this.status += 1;
    },
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    }
  }
};
</script>
<style lang="scss" scoped>
#zhpgroupDetail {
  padding-bottom: 60px;

  .content {
    .goods_list {
      background: #fff;
      padding-left: 0.625rem;

      .goods_box {
        display: flex;
        padding: 0.625rem 0.625rem 0.625rem 0;
        border-bottom: solid 0.0625rem #ebebeb;

        .goods_img {
          width: 7.5rem;
          height: 7.5rem;
          background: #f2f2f2;
          overflow: hidden;
          border-radius: 0.25rem;
          margin-right: 0.625rem;

          img {
            width: 100%;
          }
        }

        .goods_info {
          width: 14.0625rem;
          text-align: left;

          .name {
            font-size: 14px;
            line-height: 1.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .price {
            font-size: 16px;
            margin-top: 0.375rem;
            color: #f15353;

            span {
              font-size: 12px;
            }

            span:last-child {
              color: #8c8c8c;
              margin-left: 0.625rem;
            }
          }

          .number {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 1.625rem;

            .left {
              display: flex;
              align-items: center;

              .iconfont {
                font-size: 1.5rem;
                color: #f15353;
                margin-right: 0.375rem;
              }

              span {
                // color: #f15353;
                font-size: 14px;
                // border-left: solid 0.0625rem #ebebeb;
                padding-left: 0.375rem;
              }
            }

            .go_group {
              height: 1.75rem;
              border-radius: 0.25rem;
              border: solid 0.0625rem #f15353;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: 0.625rem;
              color: #f15353;
              padding: 0 0.85rem;
            }
          }
        }
      }

      .goods_box:last-child {
        border: none;
      }
    }

    .into_group {
      margin-top: 0.625rem;
      background: #fff;
      padding: 0.875rem;

      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.625rem;

        .line_left,
        .line_right {
          border: solid 0.0625rem #f15353;
          width: 3.75rem;
        }

        span {
          margin: 0 1.25rem;
          font-size: 16px;
          color: #f15353;
        }
      }

      .time {
        em {
          background-color: #f15353;
          color: #fff;
        }
      }

      p {
        margin-top: 0.875rem;
        font-size: 14px;

        span {
          color: #f15353;
        }
      }

      .btn {
        margin-top: 1.25rem;
        width: 18.75rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        color: #fff;
        font-size: 16px;
        background: #f15353;
        border: none;
      }

      .endClass {
        background-color: #969799;
      }
    }

    .group_user {
      background: #fff;
      margin-top: 0.625rem;
      padding: 0.875rem 0.875rem 1.75rem 0.875rem;

      h2 {
        font-weight: normal;
        font-size: 15px;
        margin-bottom: 0.625rem;
        text-align: left;
      }

      .user_box {
        // margin-top: 1.25rem;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .user {
          position: relative;
          margin: 0 0.375rem 0;

          .img {
            width: 48px;
            height: 48px;
            background: #fafafa;
            border-radius: 2rem;
            border: dashed 0.0625rem #ebebeb;
            overflow: hidden;
            display: flex;

            img {
              width: 100%;
            }
          }

          .iconfont {
            width: 3rem;
            height: 3rem;
            font-size: 1.5rem;
            color: #ebebeb;
            position: absolute;
            line-height: 3rem;
            top: 0;
            left: 0;
          }

          span {
            width: 3rem;
            height: 1.25rem;
            line-height: 1.25rem;
            border-radius: 2rem;
            background: #ff8340;
            font-size: 12px;
            color: #fff;
            display: block;
            position: absolute;
            bottom: -0.625rem;
          }

          .current {
            border: solid 0.0625rem #ff8340;
          }
        }
      }
    }

    .look_btn {
      background: #fff;
      width: 100%;
      position: fixed;
      bottom: 0;
      border-top: solid 0.0625rem #ebebeb;
      padding: 0 0.875rem;

      button {
        border: none;
        background: #f15353;
        font-size: 16px;
        color: #fff;
        width: 100%;
        height: 2.5rem;
        border-radius: 0.375rem;
        margin: 0.375rem auto;
      }
    }
  }

  .mint-popup-4 {
    width: 100%;
  }

  .one_open {
    padding-bottom: 3.75rem;

    .img_price {
      display: flex;
      padding: 0.875rem;

      .goods {
        width: 5.875rem;
        height: 5.875rem;
        background: #f2f2f2;
        border: solid 0.0625rem #ebebeb;
        overflow: hidden;
        border-radius: 0.1875rem;
        position: absolute;
        top: -1.875rem;

        img {
          width: 100%;
        }
      }

      .price {
        margin-left: 6.875rem;
        text-align: left;

        .price_a {
          color: #f15353;
          font-size: 18px;
        }

        .price_b {
          color: #8c8c8c;
          font-size: 12px;
        }
      }
    }

    .icon_close {
      position: absolute;
      top: 0.25rem;
      right: 0;
      width: 2.5rem;
      height: 2.5rem;

      .iconfont {
        line-height: 2.5rem;
        font-size: 1.125rem;
        color: #999;
      }
    }

    .select_box {
      padding: 0.875rem 0.875rem 0 0.875rem;

      .select {
        border-top: solid 0.0625rem #ebebeb;
        display: flex;
        flex-wrap: wrap;
        padding: 0.875rem 0;

        li {
          width: 6.75rem;
          padding: 0.625rem 0;
          border: solid 0.0625rem #ebebeb;
          border-radius: 0.25rem;
          margin-right: 0.625rem;
          margin-bottom: 0.625rem;

          span {
            display: block;
            font-size: 14px;

            font {
              font-size: 18px;
            }
          }
        }

        li:nth-child(3n) {
          margin-right: 0;
        }

        .current {
          border: solid 0.0625rem #f15353;
          color: #f15353;
        }
      }

      .van-radio-group {
        display: flex;
        flex-wrap: wrap;

        .van-radio {
          margin-right: 0.3125rem;
          margin-bottom: 0.3125rem;
          background: #fff;
          border: 1px solid #bfcbd9;
          text-align: center;
          box-sizing: border-box;
          border-radius: 0.25rem;
        }

        .vantRadioshow {
          background-color: rgb(241, 83, 83);
          border-color: rgb(241, 83, 83);
          box-shadow: rgb(241, 83, 83) -1px 0 0 0;
        }
      }
    }

    .noVantRadio {
      padding: 0 1.25rem;

      .van-radio-group {
        .van-radio__label {
          padding: 2rem !important;
        }
      }

      dl {
        margin-bottom: 0.8rem;
        text-align: left;

        dt {
          margin-bottom: 0.5rem;
        }

        .van-radio-group {
          display: flex;
          flex-wrap: wrap;

          .van-radio {
            margin-right: 0.3125rem;
            margin-bottom: 0.3125rem;
            background: #fff;
            border: 1px solid #bfcbd9;
            text-align: center;
            box-sizing: border-box;
            border-radius: 0.25rem;
          }

          .vantRadioshow {
            background-color: rgb(241, 83, 83);
            border-color: rgb(241, 83, 83);
            box-shadow: rgb(241, 83, 83) -1px 0 0 0;
          }
        }
      }
    }

    .buy_number {
      margin: 0 0.875rem;
      height: 3.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: solid 0.0625rem #ebebeb;
      border-bottom: solid 0.0625rem #ebebeb;

      .num {
        border-radius: 0.1875rem;
        float: right;
        background-color: #fff;

        .leftnav {
          height: 1.75rem;
          width: 1.75rem;
          float: left;
          background-color: #f2f2f2;
          color: #999;
          text-align: center;
          border-radius: 0.1875rem;
          line-height: 1.75rem;
          font-size: 18px;
          font-weight: bold;
        }

        .shownum {
          height: 1.75rem;
          width: 2.25rem;
          float: left;
          border: 0;
          margin: 0;
          padding: 0;
          text-align: center;
          color: #333;
        }

        .rightnav {
          height: 1.75rem;
          width: 1.75rem;
          float: right;
          background-color: #f2f2f2;
          color: #999;
          text-align: center;
          border-radius: 0.1875rem;
          line-height: 1.75rem;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }

    .btn {
      background: #f15353;
      height: 3.125rem;
      width: 100%;
      color: #fff;
      font-size: 16px;
      position: fixed;
      bottom: 0;
      left: 0;
      border: none;
    }
  }
}
</style>
