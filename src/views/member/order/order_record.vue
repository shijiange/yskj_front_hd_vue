<template>
  <section id="remittance-detail">
    <c-title :hide="false" text='汇款详情'></c-title>
    <section class="state">
      <span>{{order_state}}</span>
      <van-button @click.native="show1 = true" v-if="reason_data != null&&reason_data != ''">查看原因</van-button>
    </section>
    <section class="voucher">
      <!-- <span>汇款凭证：</span> -->
      <!-- <div class="img"></div> -->
      <!-- setting sun -->
      <div style="height: 50px; text-align: left; line-height: 50px;">
        <span style="font-size: 16px;">汇款凭证：</span>
      </div>
      <div style="width: 12.5rem; height: 10rem; margin: 0 auto; border: 1px dashed #c0ccda;">
        <img style="width: 100%; height: 100%;" :src="img_url"/>
      </div>


      <!-- <div style="height:50px;text-align:left;line-height:50px;">
  <span style="font-size:16px;">汇款凭证：</span>
</div>
<div>
  <div>
    <el-upload :action="uploadUrl" :on-preview="handlePreview" :limit="1" list-type="picture-card" :show-file-list="false" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleStoreSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus"></i>
    </el-upload>
  </div>
</div> -->
    </section>
    <div style="background: white; height: 50px;">
      <van-button type="danger" style="float: right; margin-right: 1.25rem;" @click="cancelTransfer()">{{btn_name}}
      </van-button>
      <!--<el-button type="danger" style="float: right;margin-right: 1.25rem;" @click="cancelTransfer()">{{btn_name}}</el-button>-->
    </div>
    <!-- <section class="info">
        <ul class="box">
            <li>
                <span>付款卡号</span>
                <span>{{user_information.card_number}}</span>
            </li>
            <li>
                <span>收款人</span>
                <span>{{user_information.payee}}</span>
            </li>
            <li>
                <span>汇款金额</span>
                <span>{{user_information.money}}</span>
            </li>
        </ul>
        <ul class="btn">
            <li>
                <button type="button" @click="completeEvent()">完成</button>
            </li>
            <li>
                <button type="button" @click="returnEvent()">返回</button>
            </li>
        </ul>

    </section> -->
    <!-- 弹窗 -->
    <van-popup v-model="show1" position="center" :style="{height:'240px',width:'80%'}">
      <section id="cause" style="background: white;">
        <h1>退款原因</h1>
        <ul>
          <!-- <li>1、由于您的亏款凭证模糊不清，无法进行审核，
              导致审核失败。</li>
              <li>2、汇款人信息有误，审核失败。</li> -->
          <!-- <li v-if="reason_data != ''">汇款成功<li> -->
          <li>{{reason_data}}</li>

        </ul>

      </section>
    </van-popup>
  </section>
</template>

<script>
import order_record_controller from "./order_record_controller.js";

export default order_record_controller;
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
  // setting sun
  .avatar {
    width: 100%;
    height: 100%;
  }

  #remittance-detail {
    .state {
      padding: 1.25rem;
      background-color: #f15353;
      color: #fff;
      font-size: 18px;
      text-align: left;
      position: relative;

      button {
        height: 1.5rem;
        line-height: 1.5rem;
        position: absolute;
        right: 1.25rem;
        top: 1.25rem;
        font-size: 12px;
        display: block;
        color: #fff;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 0.25rem;
        padding: 0 0.625rem;
      }
    }

    .voucher {
      background-color: #fff;
      margin-top: 0.625rem;
      padding: 0 0.875rem 1.25rem 0.875rem;

      span {
        font-weight: bold;
        font-size: 14px;
        display: block;
        line-height: 2.5rem;
        text-align: left;
      }

      .img {
        background-image: url(../../../assets/images/addless.png);
        background-repeat: no-repeat;
        background-size: 1.5rem;
        background-position: center center;
        width: 90%;
        margin: 0 auto;
        height: 5.5rem;
        background-color: #fafafa;
        border-radius: 0.25rem;
        border: dashed 0.0625rem #ebebeb;
      }
    }

    .info {
      margin-top: 0.625rem;
      background-color: #fff;

      .box {
        padding: 0.625rem 0;
        border-bottom: solid 0.0625rem #ebebeb;

        li {
          display: flex;
          justify-content: space-between;
          line-height: 1.875rem;
          font-size: 14px;
          padding: 0 0.875rem;

          span:first-child {
            color: #8c8c8c;
          }
        }
      }

      .btn {
        padding: 0.625rem 0;
        display: flex;

        li {
          flex: 1;

          button {
            width: 6.25rem;
            height: 1.875rem;
            border-radius: 0.9375rem;
            background-color: #f15353;
            color: #fff;
            font-size: 14px;
            border: none;
          }
        }
      }
    }

    #cause {
      height: 15rem;

      h1 {
        line-height: 2.5rem;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      ul {
        padding: 0.625rem 0.875rem;
        font-size: 14px;
        color: #8c8c8c;
        text-align: left;

        li {
          text-indent: -1.25rem;
          margin-left: 1.25rem;
          line-height: 1.5rem;
        }
      }
    }
  }
</style>


