<!-- 拼团详情页 -->
<template>
  <div id="group-work-detail">
    <c-title :hide="false" :text="'拼团详情'"></c-title>
    <div class="content">
      <div class="goods_list">
        <div class="goods_box">
          <div class="goods_img">
            <img :src="goods.thumb || ''" @click="gotoUrl('groupWorkGood', { id: activity_id })" />
          </div>
          <ul class="goods_info">
            <li class="name" style="-webkit-box-orient: vertical;">
              {{ goods.title || "" }}
            </li>
            <li class="price">
              <span>{{ $i18n.t("money") }}</span
              >{{ goods.group_price || "" }}<span style="text-decoration: line-through;">{{ $i18n.t("money") }}{{ goods.price || "" }}</span>
            </li>
            <li class="number">
              <div class="left">
                <span>{{ goods.pay }}人付款</span>
              </div>

              <div class="go_group">{{ goods.person }}人拼团</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="into_group">
        <div class="title" v-if="status == 1">
          <div class="line_left"></div>
          <span>距结束</span>
          <div class="line_right"></div>
        </div>
        <div class="time" v-if="status && status == 1" style="margin-bottom: 0.5rem;">
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
        <div class="title">
          <span v-html="active_status"></span>
        </div>
        <!-- 按钮 进行中：邀请好友||去参团 ； 未开始||已结束：更多活动 -->
        <button type="button" class="btn" @click="clickBtn()">{{ btnTest }}</button>
      </div>
      <div class="group_user">
        <h2>参团组员</h2>
        <van-swipe style="height: 65px;" :autoplay="1500" :show-indicators="false" vertical v-if="!this.fun.isTextEmpty(Participants)">
          <van-swipe-item v-for="(item, index) in Participants" :key="index">
            <div class="user_box">
              <div class="user" v-for="child in item" :key="child.id">
                <div :class="['img', { 'reward-border': child.status == 2 }]">
                  <div class="reward" v-if="child.status == 2"></div>
                  <img :src="child.thumb" />
                  <div class="grouper" v-if="child.is_head">团长</div>
                </div>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
        <div v-if="!this.$store.state.isloadding && this.fun.isTextEmpty(Participants)">暂无参团人员</div>
      </div>

      <div class="look_btn set-pc-style" @click="gotoUrl('home')">
        <button type="button">去商城逛逛</button>
      </div>
    </div>
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>

    <yzSpecs ref="yzSpecs" :goods="goods" disable-stepper-input v-model="popupSpecs">
      <template v-slot:sku-header-other
        ><div style="line-height: 24px; font-size: 12px;">{{ goods.person }}人团</div>
      </template>
      <template v-slot:sku-body-bottom>
        <div class="select_box noVantRadio" v-if="!fun.isTextEmpty(groupLevel)" style="padding-top: 0;">
          <van-radio-group v-model="groupModel" checked-color="#f15353" class="select" style="padding-bottom: 0;">
            <van-radio class="vantRadioshow" v-for="(item, i) in groupLevel" :name="item.id" :key="i">
              <div style="padding: 0.25rem 0.8rem;">
                <p>{{ $i18n.t("money") }}{{ item.min_price }} 起</p>
                <p>{{ item.person }}人团</p>
              </div>
            </van-radio>
          </van-radio-group>
        </div>
      </template>
      <template v-slot:sku-buy-btn>
        <van-button type="danger" size="large" id="btsmall" block @click.stop="getPayData" style="font-size: 12px;">
          <template #default>
            0.1元开/参团金<br />
            该金额为支付开/参团费用，非商品金额
          </template>
        </van-button>
      </template>
    </yzSpecs>

    <!-- 支付 -->
    <pay-keyboard :payKeyboardShow.sync="payKeyboardShow" @complete="payComplete"></pay-keyboard>
    <van-popup v-model="Payshow" position="bottom" class="set-pc-styleLeft" :overlay="true" get-container="#appMain">
      <div class="rewardPay">
        <div class="payMode">
          <ul>
            <li @click="payPost(item)" v-for="(item, index) in btnData" :key="index">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="cancel" @click="rewardPayCancelBtn">取消</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import yzSpecs from "./component/specs";
import payKeyboard from "components/payKeyboard";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
import { payKeyboardAsync } from "utils/payKeyboard";
export default {
  mixins: [yzPay],
  data() {
    return {
      aid: this.$route.params.aid, //团状ID
      activity_id: this.$route.params.id, //活动ID
      goods: {},
      // status: null, //参团中奖状态：1:未中奖，2:已中奖
      status: null, //团状态1:拼团中，2:拼团成功，-1:拼团失败
      spec_status: null, //该层级活动状态
      end_time: "",
      active_status: "", //活动状态文字
      timestamp: Date.parse(new Date()) / 1000, //获取当前时间戳
      countDownTime: 0,
      btnTest: "加载中...",
      Participants: [], //参团人员
      joinMember: [],
      showWechatshar: false,
      popupSpecs: false,
      groupLevel: [],

      Payshow: false,
      btnData: [], //支付方式集合,
      payKeyboardShow: false, //键盘显示
      isPlaying: false, //防止重复支付
      rewardMoney: 0.1, //支付金额
      money: 0.1, //支付金额

      shareConfig: {}
    };
  },
  components: { yzWechatShareImg, yzSpecs, payKeyboard },
  computed: {},
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    getData() {
      $http
        .post("plugin.group-work.frontend.modules.alliance.controllers.detail.index", { alliance_id: this.$route.params.aid }, ".")
        .then(response => {
          if (response.result === 1) {
            let recordData = response.data.record;
            this.groupModel = recordData.spec_id;

            this.goods["title"] = recordData.title;
            this.goods["thumb"] = recordData.thumb;
            this.goods["price"] = recordData.price;
            this.goods["group_price"] = recordData.activity_price;
            this.goods["person"] = recordData.person;
            this.goods["pay"] = recordData.person - recordData.disparity;

            // this.alliance_id = recordData.alliance_id;
            this.status = recordData.status; //团状态1:拼团中，2:拼团成功，-1:拼团失败
            this.spec_status = recordData.spec_status;
            // this.activity_status = recordData.activity_status; //团状态1:拼团中，2:拼团成功，-1:拼团失败
            this.joinMember = recordData.activity_detail;
            for (let i = 0; i < recordData.activity_detail.length; i += 5) {
              this.Participants.push(recordData.activity_detail.slice(i, i + 5));
            }
            if (this.status == 1) {
              //拼团中
              console.log(this.fun.getTimeDifference(recordData.end_time));
              this.countDownTime = this.fun.getTimeDifference(recordData.end_time);
              this.btnTest = this.isJoined() ? "邀请好友" : "我要参团";
            } else {
              //2:拼团成功，-1:拼团失败
              this.btnTest = "我要开团";
            }
            this.active_status = this.isWarnText(recordData.disparity);
            if (Number(this.spec_status) == 3) {
              this.btnTest = "已结束";
            }
            this.shareConfig["desc_title"] = recordData.desc_title;
            this.shareConfig["desc_content"] = recordData.desc_content;
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: this.fun.isTextEmpty(recordData.desc_title) ? "拼团活动" : recordData.desc_title,
                imgUrl: this.goods.thumb,
                description: recordData.desc_content
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
    isJoined() {
      //本人是否已参团
      let uid = window.localStorage.getItem("uid");
      let join = this.joinMember.findIndex(v => {
        return v.uid == uid;
      });
      return join > -1 ? true : false;
    },
    isWarnText(_disparity) {
      //处理不同状态下显示文字
      let isPeopleOk = Number(_disparity) == 0 ? true : false; //是否已达到人数
      if (this.status == 1) {
        return `<div style="color:#333;">拼团中，离成团还差<em style="color:#f15353;">${_disparity}</em>人</div>`;
      }
      if (this.status == 2) {
        return `该团已拼团成功`;
      }
      if (this.status == -1) {
        let text = isPeopleOk ? "未中奖" : "未达到拼团人数，拼团失败";
        return text;
      }
    },
    clickBtn() {
      if (Number(this.spec_status) == 3) {
        this.$toast("已结束");
        this.gotoUrl("groupWorkIndex");
        return;
      }
      if (this.status == 1) {
        //活动进行中
        if (this.isJoined()) {
          //已参团，邀请好友操作
          if (this.fun.getTyep() == 7) {
            let uid = window.localStorage.getItem("uid");
            let _links = this.fun.isMid(document.location.href, uid);
            let json = {
              title: this.shareConfig.desc_title || "", // 分享标题
              desc: this.shareConfig.desc_content || "", // 分享描述
              link: _links, // 分享链接
              imgUrl: this.goods.thumb || "" // 分享图标
            };
            YDB.Share(json.title, json.desc, json.imgUrl, json.link, "Sharesback");
            return;
          } else {
            this.showWechatshar = true;
          }
        } else if (!this.isJoined()) {
          this.getGoods(); //没参团过
        }
      } else {
        this.gotoUrl("groupWorkGood", { id: this.$route.params.id });
      }
    },
    countDownEnd() {
      this.initData();
      this.getData();
    },
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    },
    getGoods() {
      $http
        .post("plugin.group-work.frontend.modules.goods.controllers.detail.index", { record_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.goods.id = response.data.goods_id;
            this.groupLevel = response.data.specs.filter(v => {
              if (v.id == this.groupModel) {
                this.goods["price"] = v.min_price;
                this.goods["person"] = v.person;
                return v;
              }
            }); //过滤层级，只显示之前开团参团支付的层级
            this.goods["stock"] = response.data.stock;
            this.popupSpecs = true;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取支付类型参数
    getPayData() {
      $http
        .get("plugin.group-work.frontend.modules.alliance.controllers.pay.button", {})
        .then(response => {
          if (response.result == 1) {
            this.btnData = response.data.buttons;
            this.popupSpecs = false;
            this.Payshow = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //支付
    async payPost(data) {
      if (this.isPlaying) {
        return;
      }
      this.Payshow = false;
      let json = {
        pay_type: data.value,
        spec_id: this.groupModel,
        alliance_id: this.$route.params.aid
      };
      if (data.need_password) {
        let pass = await this.getPayKeyboardPassword();
        json.password = pass;
      }
      this.isPlaying = true;
      $http
        .get("plugin.group-work.frontend.modules.alliance.controllers.apply.index", json, "支付中...")
        .then(response => {
          this.isPlaying = false;
          if (response.result == 1) {
            this.Payshow = false;
            this.handleOtherPay(data, response, "groupWork");
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          this.$dialog.alert({ message: error });
        });
    },
    getPayKeyboardPassword() {
      this.payKeyboardShow = true;
      return new Promise((resove, reject) => {
        payKeyboardAsync.addCompleteFn(pass => {
          resove(pass);
        });
      });
    },
    payComplete(text) {
      console.log(text, "页面");
      payKeyboardAsync.complete(text);
    },
    rewardPayCancelBtn() {
      this.Payshow = false;
    },
    initData() {
      this.Participants = [];
      this.joinMember = [];
      this.showWechatshar = false;
      this.popupSpecs = false;
      this.Payshow = false;
      this.payKeyboardShow = false;
      this.isPlaying = false;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#group-work-detail {
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
        align-items: center;
        height: 100%;
        flex-wrap: wrap;

        .user {
          position: relative;
          margin: 0 0.375rem 0;

          .img {
            width: 48px;
            height: 48px;
            border: dashed 0.0625rem #ebebeb;
            border-radius: 50%;
            display: flex;

            img {
              width: 48px;
              height: 48px;
              border-radius: 2rem;
              overflow: hidden;
            }
          }

          .reward-border {
            border: solid 0.063rem #ecd22a;
          }

          .reward::before {
            position: absolute;
            content: "";
            top: -0.8rem;
            left: 50%;
            transform: translateX(-46%);
            width: 2.7rem;
            height: 1.3rem;
            background-image: url("../../../assets/images/group_reward.png");
            background-size: contain;
            background-repeat: no-repeat;
          }

          .grouper {
            background: #ff8340;
            color: #fff;
            width: 38px;
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            border-radius: 0.5rem;
            font-size: 10px;
            margin-left: 5px;
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
}

.rewardPay {
  background-color: #f2f2f2;

  .content {
    background-color: #fff;

    span {
      color: #1c96fe;
    }

    text-align: left;
    padding: 0.6rem;
    min-height: 3.44rem;
    font-size: 0.8rem;
    line-height: 1rem;
    width: 100%;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }

  .payMode {
    ul {
      li {
        background-color: #fff;
        height: 3.44rem;
        border-bottom: 0.06rem solid #eee;
        font-size: 1rem;
        color: #333;
        line-height: 3.44rem;
      }

      li:last-of-type {
        border-bottom: none;
        margin-bottom: 0.69rem;
      }
    }
  }

  .cancel {
    background-color: #fff;
    height: 3.44rem;
    border-bottom: 0.06rem solid #eee;
    font-size: 1rem;
    color: #333;
    line-height: 3.44rem;
  }
}
</style>
