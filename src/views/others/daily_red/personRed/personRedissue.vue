<template>
  <div id="personRedissue">
    <c-title :hide="false" text="发红包" />
    <div class="txtTop" @click="selectShow = true">
      {{ redpackTypeTxt }}
      <van-icon name="arrow-down" />
    </div>
    <div class="minbox">
      <div class="minboxLeft">红包个数</div>
      <div class="minboxRight">
        <van-field @input="numInp" type="digit" v-model="redpack_date.number" placeholder="填写个数" input-align="right" />
        个
      </div>
    </div>
    <div class="minbox" style="margin-top: 0.94rem;">
      <div class="minboxLeft">
        <div class="dtext" v-if="redpack_date.redpack_type == 1">拼</div>
        {{ redpack_date.redpack_type == 1 ? "总金额" : "单个金额" }}
      </div>
      <div class="minboxRight" v-if="redpack_date.redpack_type == 1">
        <van-field @blur="unitInp" v-model="redpack_date.amount_total" type="number" placeholder="请输入金额" input-align="right" />
        <div class="rightTxt">{{balance_name}}</div>
      </div>
      <!-- 单个金额 -->
      <div class="minboxRight" v-else>
        <van-field @input="totalInp" v-model="redpack_date.unit_amount" type="number" placeholder="请输入金额" input-align="right" />
        <div class="rightTxt">{{balance_name}}</div>
      </div>
    </div>
    <div class="minbox" style="margin-top: 0.94rem;">
      <div class="minboxLeft">红包时间</div>
      <div class="minboxRight">
        <van-field v-model="valid_hours" placeholder="请输入时间" :readonly="true" input-align="right" />
        <!-- <div class="rightTxt">小时</div> -->
      </div>
    </div>
    <div class="timeText">超时时间未领取的部分，剩余返回</div>
    <div class="textArea">
      <van-field v-model="redpack_date.title" rows="3" autosize type="textarea" placeholder="红包来袭~" show-word-limit style="background-color: #fff; height: 4.38rem;" />
    </div>
    <div class="uploadImg">
      <div class="uptxt">红包图标（选填)</div>
      <yz_uploader :customPadding="'none'" :customText="customText" :boxSelect="'#f2f2f2'" v-model="redpack_date.thumb" :max_count=1></yz_uploader>
    </div>
    <div class="selectBox" v-if="child_receive">
      <van-checkbox v-model="redpack_date.child_receive" @change="checkSelect">只限团队成员可领</van-checkbox>
    </div>
    <div class="redPrice">
      <div class="priceTxt">总金额</div>
      <div class="price" v-if="redpack_date.amount_total">￥{{ redpack_date.amount_total }}</div>
      <div class="price" v-else>￥0.00</div>
    </div>
    <div class="tabbtn">
      <div @click="tapRedbtn">发红包</div>
    </div>
    <van-action-sheet v-model="selectShow" :actions="actions" @select="onSelect" cancel-text="取消" close-on-click-action />
  </div>
</template>
<script>
import personRedissue_controller from "./personRedissue_controller";

export default personRedissue_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#personRedissue {
  padding-bottom: 2rem;

  .tabbtn {
    width: 100%;
    height: 2.5rem;
    margin-top: 2.91rem;
    margin-bottom: 1rem;

    div {
      width: 20.31rem;
      height: 2.5rem;
      background-color: #ef3532;
      border-radius: 1.25rem;
      font-size: 0.94rem;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
    }
  }

  .redPrice {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 2.1rem;

    .priceTxt {
      font-size: 1.19rem;
      font-weight: 600;
    }

    .price {
      margin-top: 1.16rem;
      font-size: 1.13rem;
      color: #f69a00;
    }
  }

  .selectBox {
    margin-left: 1.09rem;
    margin-top: 2.07rem;
  }

  .uploadImg {
    margin-top: 1.63rem;
    text-align: left;
    margin-left: 1.09rem;
    font-size: 0.94rem;

    .uptxt {
      margin-bottom: 0.69rem;
    }

    .imgUploader {
      background: none;
    }
  }

  .textArea {
    width: 21.88rem;
    height: 4.38rem;
    background-color: #fff;
    border-radius: 0.47rem;
    margin: 0 auto;
    margin-top: 1.31rem;
  }

  .timeText {
    font-size: 0.69rem;
    color: #f14e4e;
    text-align: left;
    padding-left: 0.94rem;
    padding-top: 0.5rem;
  }

  .minbox {
    width: 21.88rem;
    height: 3.13rem;
    background-color: #fff;
    border-radius: 0.47rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.13rem 0.94rem;
    margin: 0 auto;

    .minboxLeft {
      display: flex;
      align-items: center;

      .dtext {
        width: 1.31rem;
        height: 1.31rem;
        background-color: #f69a00;
        border-radius: 0.13rem;
        font-size: 0.88rem;
        color: #fff;
        margin-right: 0.38rem;
      }
    }

    .minboxRight {
      display: flex;
      align-items: center;

      .rightTxt {
        white-space: nowrap;
      }
    }
  }

  .txtTop {
    margin-left: 1.06rem;
    margin-top: 0.88rem;
    margin-bottom: 0.72rem;
    font-size: 0.75rem;
    text-align: left;
    color: #f69a00;
    display: flex;
    align-items: center;

    i {
      color: #f69a00;
      margin-left: 0.34rem;
    }
  }
}
</style>
