<template>
    <div class="page">
        <c-title :text="title" ></c-title>

        <div class="apply_info">
          <div class="title" v-if="shopkeeper!=1">申请信息</div>
          <div class="input-wrapper">
            <div class="red">*</div>
            <div class="text">姓名</div>
            <input type="text" v-model="name" placeholder="请输入姓名">
          </div>
          <div class="input-wrapper">
            <div class="red">*</div>
            <div class="text">手机号</div>
            <input type="text" v-model="mobile" placeholder="请输入联系电话">
          </div>
        </div>

        <div class="hr" v-if="shopkeeper!=1"></div>

        <div class="container" v-if="shopkeeper!=1">
          <div class="title">请选择购买商品</div>
          <div class="goods">
            <div class="good" v-for="item in goods_list" :key="item.id" @click="setGoodsId(item.id)" :class="{active:item.id == goods_id}">
              <div class="checkbox">
                <i class="iconfont icon-all_select_active"></i>
              </div>
              <div class="face">
                <img :src="item.thumb" alt="">
              </div>
              <div class="name">{{item.title}}</div>
              <div class="price">￥{{item.price}}</div>
            </div>
          </div>
        </div>

        <div style="height: 4rem;"></div>
        <div class="fixedBtns">
          <div class="btn" @click="sendApply">{{shopkeeper==1 ? '确认' : '立即支付' }}</div>
        </div>

    </div>
</template>

<script>
import orderImportApplyController from './order_import_apply_controller.js';

export default orderImportApplyController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: rgb(255, 255, 255); min-height: 100vh; }

  .apply_info {
    padding: 1.25rem 0.938rem 0.5rem;
    text-align: left;

    .title {
      display: flex;
      align-items: center;
      height: 0.938rem;
      padding-left: 0.469rem;
      margin-bottom: 0.25rem;
      font-size: 1rem;
      color: #f14e4e;
      border-left: 0.219rem solid #f14e4e;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      height: 2.4rem;

      .red {
        color: #f14e4e;
        font-size: 1.5rem;
        transform: translateY(0.3rem);
      }

      .text {
        padding-left: 0.3rem;
        font-size: 0.938rem;
        color: #333;
      }

      input {
        flex: 1;
        text-align: right;
        font-size: 0.938rem;
        color: #b8b8b8;
        border: none;
      }
    }
  }

  .hr {
    width: 100%;
    height: 0.625rem;
    background: #f2f2f2;
  }

  .container {
    padding: 1rem 0.938rem;
    text-align: left;

    .title {
      display: flex;
      align-items: center;
      height: 0.938rem;
      padding-left: 0.469rem;
      margin-bottom: 1.094rem;
      font-size: 1rem;
      color: #f14e4e;
      border-left: 0.219rem solid #f14e4e;
    }

    .goods {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 0.906rem;
      grid-row-gap: 0.813rem;

      .good {
        height: 15rem;
        border-radius: 0.313rem;
        border: solid 0.031rem #e3e3e3;
        position: relative;

        &.active {
          border-color: #f14e4e;

          .checkbox {
            color: #f14e4e;
          }
        }

        .checkbox {
          position: absolute;
          top: 0.4rem;
          right: 0.375rem;
          color: #d1d1d1;

          .iconfont {
            font-size: 1.2rem;
          }
        }

        .face {
          width: 100%;
          height: 10.375rem;
          background-color: #e9e9e9;
          border-radius: 0.313rem 0.313rem 0 0;

          img {
            width: 100%;
            height: 10.375rem;
            border-radius: 0.313rem 0.313rem 0 0;
          }
        }

        .name {
          padding: 0.6rem 0.5rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 0.813rem;
          color: #333;
        }

        .price {
          padding: 0.2rem 0.5rem 0;
          font-size: 0.938rem;
          color: #f14e4e;
        }
      }
    }
  }

  .fixedBtns {
    position: fixed;
    bottom: 0.844rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20rem;
      height: 2.5rem;
      font-size: 0.938rem;
      color: #fff;
      background-color: #f15353;
      border-radius: 0.313rem;
    }
  }

</style>