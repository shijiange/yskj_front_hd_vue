<template>
  <div id="chain_shop">
    <c-title :hide="false"
             text='连锁店首页'></c-title>
    <div id="header">
      <div class="header_user">
        <div class="img">
          <img :src="shop_info.avatar">
        </div>
        <ul class="name">
          <li>{{shop_info.nickname}}</li>
        </ul>
        <div class="btn"
             @click="gotoIncome">
          <i class="iconfont icon-income-cashb"></i>
          <span>{{this.fun.initWithdrawal()}}</span>
        </div>
      </div>
      <div class="header_info">
        <ul>
          <li>门店数</li>
          <li>{{shop_amount.store_count}}<span>个</span></li>
        </ul>
        <ul>
          <li>订单数</li>
          <li>{{shop_amount.order_count}}<span>个</span></li>
        </ul>
        <ul>
          <li>订单金额</li>
          <li><span>{{$i18n.t('money')}}</span>{{shop_amount.order_price}}</li>
        </ul>
        <ul>
          <li>{{income_name_text}}</li>
          <li><span>{{$i18n.t('money')}}</span>{{shop_amount.amount_total}}</li>
        </ul>
      </div>
    </div>
    <div id="shop_list">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <ul v-for="(item,i) in shopListArr"
            @click="goToShop(item.id)"
			:key='i'>
          <div class="img">
            <img :src="item.thumb?item.thumb:require('../../../assets/images/photo-mr.jpg')">
          </div>
          <li class="name">
            {{item.store_name}}
          </li>
          <i class="fa fa-angle-right"></i>
        </ul>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import controller from "./chain_shop_index_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#chain_shop {
  #header {
    background-color: #fff;

    .header_user {
      display: flex;
      padding: 1.25rem 0.625rem;
      align-items: center;
      position: relative;

      .img {
        width: 3.5rem;
        height: 3.5rem;
        border: solid 0.125rem #f5f5f5;
        border-radius: 1.75rem;
        margin-right: 0.625rem;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .name {
        li {
          font-size: 18px;
          font-weight: bold;
        }
      }

      .btn {
        position: absolute;
        right: 0.625rem;
        display: flex;
        width: 5rem;
        height: 1.875rem;
        line-height: 1.875rem;
        border: solid 0.0625rem #ebebeb;
        border-radius: 1rem;
        padding: 0 0.625rem;

        i {
          color: #f15353;
          font-size: 1.375rem;
          margin-right: 0.375rem;
        }

        span {
          font-size: 14px;
        }
      }
    }

    .header_info {
      border-top: solid 0.0625rem #ebebeb;
      display: flex;
      padding: 0.625rem 0;

      ul {
        width: 25%;
        padding-left: 0.8rem;

        li {
          text-align: left;
          line-height: 1.875rem;
        }

        li:first-child {
          color: #8c8c8c;
          font-size: 15px;
        }

        li:last-child {
          font-size: 18px;

          span {
            font-size: 15px;
          }
        }
      }
    }
  }

  #shop_list {
    margin-top: 0.625rem;
    background-color: #fff;
    padding-left: 0.875rem;
    border-top: solid 0.0625rem #ebebeb;
    border-bottom: solid 0.0625rem #ebebeb;

    ul:last-child {
      border: none;
    }

    ul {
      display: flex;
      padding: 0.875rem 0;
      align-items: center;
      border-bottom: solid 0.0625rem #ebebeb;
      padding-right: 0.875rem;

      .img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 1.25rem;
        overflow: hidden;
        margin-right: 0.625rem;

        img {
          width: 100%;
          height: inherit;
        }
      }

      li {
        font-size: 16px;
      }

      i {
        position: absolute;
        right: 0.875rem;
        font-size: 28px;
        color: #c9c9c9;
      }
    }
  }
}
</style>
