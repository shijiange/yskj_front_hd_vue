<!-- 0.1元拼团
插件描述：点击发起拼团，展开弹窗选中层级后，点击支付弹出支付方式直接支付0.1元，成功拼团详情页
 -->
<template>
  <div id="u_groupWork">
    <div class="u_groupWork-box">
      <div class="u_groupWork-left">
        <div class="u_groupWork_title">参与拼团</div>
        <div class="u_groupWork_num">该活动您还剩余 {{ goods_info.surplus }} 次开团机会</div>
      </div>
      <van-button type="danger" size="small" color="#f14e4e" :disabled="groupWork_disabled" v-if="goods_info.group_open == 1" @click.stop="showSpecs">发起拼团</van-button>
    </div>

    <van-popup v-model="groupWorkPopup" position="bottom" class="mint-popup-4 set-pc-styleLeft" round :close-on-click-overlay="false" get-container="#appMain">
      <div class="u_groupWork-specifications">
        <div class="icon_close" @click.stop="groupWorkPopup = flase">
          <i class="iconfont icon-close11"></i>
        </div>
        <div class="shopimg">
          <div id="chooser_img">
            <img :src="goodsInfo && goodsInfo.thumb" />
          </div>
          <div class="right">
            <div class="price" :style="{ color: `#f14e4e` }">
              <em style="font-size: 10px;">{{ $i18n.t("money") }}</em> <span id="option_price"> {{ popPrice || (goodsInfo && goods_info.min_price) }}<em style="font-size: 10px;">起</em></span>
            </div>
            <div class="option">库存{{ goodsInfo && goods_info.stock }}</div>
            <div class="option" style="color: #000;">{{ goodsDescription }}</div>
          </div>
        </div>

        <div class="select_box noVantRadio" v-if="!this.fun.isTextEmpty(goods_info.specs)" style="padding-top: 0;">
          <van-radio-group v-model="groupModel" checked-color="#f15353" class="select" style="padding-bottom: 0;">
            <van-radio :disabled="item.status != 2" :class="{ vantRadioshow: groupModel == item.id }" @click="selectGroup(item)" v-for="(item, i) in goods_info.specs" :name="item.id" :key="i">
              <div style="padding: 0.25rem 0.8rem;">
                <p>{{ $i18n.t("money") }}{{ item.min_price }} 起</p>
                <p>{{ item.person }}人团</p>
              </div>
            </van-radio>
          </van-radio-group>
        </div>

        <div></div>
        <van-button type="danger" color="#f15353" size="large" id="btsmall" block @click.stop="getPayData">
          <template #default>
            0.1元开/参团金<br />
            该金额为支付开/参团费用，非商品金额
          </template>
        </van-button>
      </div>
    </van-popup>

    <!-- 支付 -->
    <pay-keyboard :payKeyboardShow.sync="payKeyboardShow" @complete="payComplete"></pay-keyboard>
    <van-popup v-model="Payshow" class="set-pc-styleLeft" position="bottom" :overlay="true" get-container="#appMain">
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
import payKeyboard from "components/payKeyboard";
import { yzPay } from "../../../../utils/yz_pay"; //引入支付方法
import { payKeyboardAsync } from "utils/payKeyboard";
export default {
  props: {
    goods_info: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [yzPay],
  data() {
    return {
      timestamp: Date.parse(new Date()) / 1000, //获取当前时间戳
      groupModel: 0,
      Payshow: false,
      btnData: [], //支付方式集合
      payKeyboardShow: false, //键盘显示
      groupWorkPopup: false,
      popPrice: null, //层级价格
      goodsDescription: "请选择层级", //选了层级
      isPlaying: false, //防止重复支付，
      rewardMoney: 0.1, //支付金额
      money: 0.1 //支付金额
    };
  },

  activated() {
    this.init();
  },

  components: { payKeyboard },

  computed: {
    goodsInfo() {
      return this.goods_info.goods_info;
    },
    groupWork_disabled() {
      //是否禁用，活动未开始、已结束
      if (!this.goods_info.end_time || this.goods_info.end_time == "") {
        //不限时
        return false;
      } else if (this.fun.getTimeDifference(this.goods_info.end_time) == 0) {
        //已结束
        return true;
      } else if (this.fun.getTimeDifference(this.goods_info.start_time) > 0) {
        //未开始
        return true;
      }
      return false;
    }
  },

  mounted() {},

  methods: {
    init() {
      this.groupWorkPopup = false;
      this.Payshow = false;
      this.payKeyboardShow = false;
      this.groupModel = 0;
      this.isPlaying = false;
    },
    showSpecs() {
      if (Number(this.goods_info.surplus) === 0) {
        //没次数
        this.$toast("开团次数已用完，请升级等级");
        return;
      }
      this.groupWorkPopup = true;
    },
    rewardPayCancelBtn() {
      this.Payshow = false;
    },
    selectGroup(e) {
      if (e.status != 2) {
        let text = e.status == 3 ? "已结束" : "未开始";
        this.$toast(text);
        return;
      }
      this.popPrice = e.min_price;
      this.goodsDescription = `${e.person}人团`;
    },
    //获取支付类型参数
    getPayData() {
      if (!this.groupModel) {
        this.$toast("请选择开团层级！");
        return;
      }
      $http
        .get("plugin.group-work.frontend.modules.alliance.controllers.pay.button", {})
        .then(response => {
          if (response.result == 1) {
            this.btnData = response.data.buttons;
            this.groupWorkPopup = false;
            this.Payshow = true;
          }
        })
        .catch(error => {
          console.log(error);
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
    //支付
    async payPost(data) {
      if (this.isPlaying) {
        return;
      }
      this.Payshow = false;
      let json = {
        pay_type: data.value,
        spec_id: this.groupModel,
        alliance_id: 0
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
            this.handleOtherPay(data, response, "groupWork");
            this.Payshow = false;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          this.$dialog.alert({ message: error });
        });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#u_groupWork {
  .u_groupWork-box {
    height: 3.438rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.625rem;
    background: #fff;
    margin-top: 0.625rem;

    .u_groupWork-left {
      flex: 1;
      text-align: left;

      .u_groupWork_num {
        font-size: 12px;
        color: #f14e4e;
        padding-top: 0.125rem;
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
<style lang="scss" rel="stylesheet/scss">
.u_groupWork-specifications {
  position: relative;
  width: 100%;
  text-align: center;

  .shopimg {
    display: flex;

    #chooser_img {
      width: 4.75rem;
      height: 4.75rem;
      margin: 0.875rem;

      img {
        width: 4.75rem;
        height: 4.75rem;
        object-fit: cover;
        border-radius: 0.375rem;
      }
    }

    .right {
      text-align: left;
      flex: 1;
      margin: 0.875rem 0;

      .price {
        color: #f15353;
        font-size: 16px;
        line-height: 1.875rem;
        height: 1.875rem;
        overflow: hidden;

        span {
          font-size: 18px;
        }
      }

      .option {
        color: #999;
        font-size: 10px;
        line-height: 1rem;
        height: 1rem;
        overflow: hidden;
      }
    }
  }

  .el-radio-button,
  .el-radio-button__inner {
    margin-right: 0.3125rem;
    margin-bottom: 0.3125rem;
  }

  .el-radio-group .el-radio-button .el-radio-button__inner {
    border-radius: 0.25rem;
  }

  .el-radio-button--small .el-radio-button__inner {
    background: red;
  }

  .num {
    margin-top: 1rem;
    border-radius: 0.1875rem;
    float: right;
    background-color: #fff;
  }

  .num .leftnav {
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

  .num .shownum {
    height: 1.75rem;
    width: 2.25rem;
    float: left;
    border: 0;
    margin: 0;
    padding: 0;
    text-align: center;
    color: #333;
  }

  .num .rightnav {
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

  .el-row {
    border-top: solid 0.0625rem #f2f2f2;
    border-bottom: solid 0.0625rem #f2f2f2;
    margin: 1.25rem 0.875rem;
    padding: 0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;

    #num {
      height: 3.75rem;
      line-height: 3.75rem;
      text-align: left;
    }
  }

  .van-row {
    margin: 1.25rem 0.875rem;
    padding: 0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    #num {
      line-height: 2.75rem;
      text-align: left;
      flex: 1;
    }
  }

  .icon_close {
    position: absolute;
    top: 0;
    right: 0;
    width: 2.5rem;
    height: 2.5rem;

    i {
      line-height: 2.5rem;
      font-size: 1.125rem;
      color: #999;
    }
  }

  .noVantRadio {
    .van-radio-group {
      display: flex;
      flex-wrap: wrap;

      .van-radio {
        margin-right: 0.3125rem;
        margin-bottom: 0.3125rem;
        background: #fff;
        border: 1px solid #fb4a4a;
        text-align: center;
        box-sizing: border-box;
        border-radius: 0.25rem;
        color: #fb4a4a;
      }

      /deep/.vantRadioshow {
        background-color: rgb(241, 83, 83);
        border-color: rgb(241, 83, 83);
        // box-shadow: rgb(241, 83, 83) -1px 0px 0px 0px;
        .van-radio__label {
          color: #fff !important;
        }
      }

      /deep/.van-radio__label {
        color: inherit;
      }
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

  #btsmall {
    width: 94%;
    border-radius: 0.375rem;
    height: 3.0625rem;
    font-size: 16px;
    margin: 0.375rem auto;
    display: inline-block;
  }
}
</style>
