<template>
  <div id="cloudOrderDetail">
    <c-title :hide="false" :text="'订单详情'"> </c-title>
    <div class="box">
      <div class="tops">
        <div class="addr" >
          <i class="fa fa-map-marker"></i>
          <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
            收件人：{{info.address_info.realname}}
            <br />
            <span>{{info.address_info.address}}</span>
          </p>
        </div>
      </div>
      <div class="recipients" v-if="info.has_many_order_goods">
        <div class="top" v-for="(item,index) in info.has_many_order_goods" :key="index">
          <div class="img">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="top_right">
            <div class="titles">{{item.title}}</div>
            <div class="specification">规格：{{item.total?`x${item.total}`:""}}</div>
          </div>
        </div>
      </div>
      <div class="orderMum">
        <div class="number">
          <span>订单编号</span>
          <p>{{info.order_sn}}</p>
        </div>
        <div class="payment">
          <span>交易状态</span>
          <p>{{info.status_name}}</p>
          <!-- <p>交易完成</p> -->
        </div>
      </div>
      <div class="leaveText" v-if="info.note">
        {{info.note || ''}}
      </div>
    </div>
  </div>
</template>

<script>
import cloudOrderDetail_controller from './cloudOrderDetail_controller';

export default cloudOrderDetail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.box {
  padding: 0.875rem 0.969rem 0 0.875rem;

  .tops {
    width: 21.563rem;
    height: 3.813rem;
    background-color: #fff;
    border-radius: 0.625rem;
    margin: 0 auto;
  }

  .orderMum {
    width: 21.563rem;
    height: 3.938rem;
    background-color: #fff;
    border-radius: 0.625rem;
    margin: 0 auto;
    margin-top: 0.625rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .number {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      margin: 0 0.625rem;

      span {
        color: #999;
      }

      p {
        color: #202020;
      }
    }

    .payment {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      margin: 0 0.625rem;

      span {
        color: #999;
      }

      p {
        color: #f14e4e;
      }
    }
  }

  .leaveText {
    width: 21.563rem;
    background-color: #fff;
    border-radius: 0.625rem;
    margin: 0 auto;
    margin-top: 0.625rem;
    text-align: left;
    padding: 0.875rem 0.656rem;
    display: flex;
    align-items: center;
    line-height: 1.125rem;
  }
}

.addr {
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  align-items: center;
  background: #fff;
  padding: 0.875rem;
  border-radius: 0.625rem;
  background-color: #fff;

  i {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    align-items: center;
    background: #fff;
    font-size: 1.2rem;

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
      font-size: 0.875rem;

      span {
        font-weight: normal;
        color: #333;
        display: -webkit-box;
        font-size: 0.875rem;
        margin-top: 0.375rem;
      }
    }
  }
}

.recipients {
  border-radius: 0.625rem;
  width: 100%;
  margin-top: 0.625rem;
  background-color: #fff;
  padding: 0.938rem 0.875rem 0.938rem 0.969rem;

  .top {
    display: flex;
    justify-content: space-between;

    .img {
      width: 4.375rem;
      height: 4.406rem;

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
</style>