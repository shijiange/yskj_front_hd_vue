<template>
  <div id="goodsinfo" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" text=""></c-title>
    <!-- 自提点（杨朗）start -->
    <div v-if="is_open_package_deliver && !show_address">
      <van-tabs v-model="selfCarrySelected" v-if="!fun.isTextEmpty(selfCarryType)">
        <template v-for="item in selfCarryType">
          <van-tab :name="item.dispatch_type_id" :key="item.dispatch_type_id">
            <span slot="title" @click="requestByAddress(item.dispatch_type_id)">{{ item.name }}</span>
          </van-tab>
        </template>
      </van-tabs>

      <div>
        <div v-show="selfCarrySelected == 8">
          <div class="addr" v-if="!fun.isTextEmpty(defaultSelfCarry)">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              {{ deliverName }}:{{ defaultSelfCarry.deliver_name }} {{ defaultSelfCarry.deliver_mobile }}
              <br/>
              <span>{{ defaultSelfCarry.full_address }}</span>
            </p>
            <span
              style="border: 1px solid #f15353;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
  color: #f15353;
"
              @click.stop="replaceZT"
            >更换</span
            >
          </div>
          <div class="addr" v-if="fun.isTextEmpty(defaultSelfCarry)">
            <div v-if="!isQuest_ing">
              抱歉，您所在地区暂无{{ deliverName }}，或<i style="color: #f15353;" @click="replaceZT">手动切换位置</i>
            </div>
            <div v-if="isQuest_ing">正在获取您附近{{ deliverName }}信息 ...</div>
          </div>

          <div style="height: 0.3125rem;"></div>
          <van-field class="van-inp" label="提货人姓名" v-model="distributionUserName" placeholder="请输入提货人姓名" center
                     clearable/>
          <van-field class="van-inp" label="提货人手机" v-model="distributionUserMobile" placeholder="请输入提货人手机" center
                     clearable/>
          <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
          <div style="height: 0.3125rem;"></div>
        </div>
        <div v-show="selfCarrySelected == 1">
          <div class="addr" @click="showAddressFun" v-if="!show_address">
            <i class="fa fa-map-marker"></i>
            <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
              收件人:{{ realname }} {{ mobile }}
              <br/>
              <span>{{ address }}</span>
            </p>
            <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
            <i v-show="realname" class="fa fa-angle-right"></i>
          </div>
          <div style="height: 0.3125rem;"></div>
        </div>
      </div>
    </div>
    <!-- 自提点（杨朗 end -->

    <!-- 快递地址选择器 -->
    <yz-address-list v-model="showAddress" v-on:confirm="confirmSelectAddress" :options="yzAddressListOptions"></yz-address-list>
    <!-- 快递地址选择器 end -->

    <div class="recipients" v-for="(item, index) in order_data" :key="index">
      <div class="top" v-for="(g, i) in item.order_goods" :key="i">
        <div class="img">
          <img :src="g.thumb" alt=""/>
        </div>
        <div class="top_right">
          <div class="titles">{{ g.title | escapeTitle }}</div>
          <div class="specification">规格：{{ g.goods_option_title }} x{{ g.total }}</div>
        </div>
      </div>
      <div class="leaveWords">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          maxlength="50"
          placeholder="买家留言：50字以内（选填）"
          v-model.lazy="note[item.pre_id]"
          @change="noteHandle($event, item, note[item.pre_id])"
        ></textarea>
      </div>
    </div>
    <div class="posbtn set-pc-style">
      <div class="btn " @click="submit">提交订单</div>
    </div>
  </div>
</template>

<script>
import cloudOrder_controller from "./cloudOrder_controller";

export default cloudOrder_controller;
</script>
<style lang="scss" rel="stylesheet/scss">
  #goodsinfo.pcStyle {
    .pc_popup {
      .yd-popup {
        width: 375px !important;
        right: 50%;
        margin-right: -187.5px;
      }
    }

    .m-dialog {
      width: 375px;
      left: 50%;
      margin-left: -187.5px;
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  #goodsinfo {
    input {
      border: none;
    }

    .title {
      line-height: 2.25rem;
      background-color: #f7f7f7;
      color: #f15353;
      text-align: left;
      padding: 0 0.875rem;

      span {
        margin-left: 0.625rem;
      }
    }

    .addr {
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      align-items: center;
      background: #fff;
      padding: 0.875rem;

      .icon {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        align-items: center;
        background: #fff;

        .fa-map-marker {
          line-height: 1.5rem;
          margin-right: 0.625rem;
          font-size: 22px;
          color: #333;
          padding-right: 0.5rem;
        }

        .fa-angle-right {
          line-height: 1.5rem;
          font-size: 24px;
          color: #c9c9c9;
        }

        p {
          flex: 6;
          text-align: justify;
          font-weight: bold;
          padding-right: 1rem;
          color: #333;
          font-size: 16px;

          span {
            font-weight: normal;
            color: #666;
            display: -webkit-box;
            font-size: 14px;
            margin-top: 0.375rem;
          }
        }
      }
    }
  }

  .dis_warn {
    text-align: left;
    padding: 0.25rem 0.875rem;
    background: #fff;
    color: #f15353;
    font-size: 0.75rem;
    border-top: 0.0625rem solid #ebebeb;
  }

  .recipients {
    width: 100%;
    height: 11rem;
    margin-top: 0.625rem;
    background-color: #fff;
    padding: 0.938rem 0.875rem 0.938rem 0.969rem;

    .top {
      display: flex;
      justify-content: space-between;

      .img {
        width: 4.375rem;
        height: 4.406rem;
        background-color: #666;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .top_right {
        flex: 1;
        margin-left: 0.656rem;

        .titles {
          text-align: left;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          font-size: 0.875rem;
          color: #333;
        }

        .specification {
          color: #666;
          font-size: 0.75rem;
          text-align: left;
          margin-top: 0.3rem;
        }
      }
    }

    .leaveWords {
      width: 100%;
      height: 3.813rem;
      background-color: #f8f8f8;
      border-radius: 0.313rem;
      margin-top: 0.906rem;

      textarea {
        width: 100%;
        height: 3.813rem;
        background-color: #f8f8f8;
        border-radius: 0.313rem;
        border: none;
      }
    }
  }

  .add-info {
    overflow-y: scroll;
    width: 100%;
    background: #fff;
    max-height: 50vh;
    padding-top: 0.625rem;
  }

  .addr {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    align-items: center;
    background: #fff;
    padding: 0.875rem;

    p {
      flex: 6;
      text-align: justify;
      font-weight: bold;
      padding-right: 1rem;
      color: #333;
      font-size: 16px;
      margin-left: 0.916rem;

      span {
        font-weight: normal;
        color: #666;
        display: -webkit-box;
        font-size: 14px;
        margin-top: 0.375rem;
      }
    }

    i {
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      align-items: center;
      background: #fff;
      font-size: 22px;

      .fa-map-marker {
        line-height: 1.5rem;
        margin-right: 0.625rem;
        font-size: 22px;
        color: #333;
        padding-right: 0.5rem;
      }

      .fa-angle-right {
        line-height: 1.5rem;
        font-size: 24px;
        color: #c9c9c9;
      }
    }
  }

  .posbtn {
    position: fixed;
    bottom: 1.69rem;
    left: 0;
    width: 100%;
    height: 2.5rem;
    border-radius: 1.25rem;

    .btn {
      margin: 0 2rem;
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 0.938rem;
      color: #fff;
      background-color: #f14e4e;
      border-radius: 1.25rem;
    }
  }

  .set-address {
    .van-cell {
      padding: 10px 12px;

      .van-cell__title {
        flex: none;
        color: #555;
        text-align: left;
      }

      .van-cell__value {
        input {
          color: #555;
          width: 100%;
        }
      }
    }

    /deep/ .van-cell:active {
      background-color: #fff !important;
    }
  }

  .van-inp.van-cell {
    font-size: 16px;

    /deep/ .van-field__label {
      color: #333;
    }

    /deep/ input::placeholder {
      color: #555;
    }
  }
</style>
