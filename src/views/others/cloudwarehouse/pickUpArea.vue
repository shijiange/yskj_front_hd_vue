<template>
  <div id="pickuparea">
    <c-title :hide="false" :text="'云仓'" > </c-title>
    <div class="topicon" @click="goback">
      <van-icon name="arrow-left" />
    </div>
    <div class="tabnav">
      <van-tabs v-model="active" @change="onClick">
        <van-tab title="提货区" name="1"></van-tab>
        <van-tab title="封存区" name="2"></van-tab>
      </van-tabs>
    </div>
    <div class="list">
      <div class="search-box">
        <form @submit.prevent action="#">
          <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="search"></i>
          <input
            type="search"
            ref="search_input"
            placeholder="搜索订单"
            @keypress="enterSearch"
            v-model="inputs"
            @click="hidebox"
          />
        </form>
      </div>
      <div class="shopList" v-for="(item, ind) in list" :key="ind" @click="tapDetail(item.goods_id)">
        <div class="left">
          <img :src="item.thumb" alt="" />
        </div>
        <div class="right">
          <div class="title">{{ item.title }}</div>
          <div class="shopKu">
            <div class="kuMum">库存{{ active == 1 ? item.deposit_stock : item.seal_stock }}</div>
            <div class="btn" v-if="active == 1">提货</div>
            <div class="btn" v-if="active == 2" @click.stop="getCondition(item.goods_id)">解冻</div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="show" round="true">
      <div class="popupBox">
        <div class="poptop">
          <span>解冻条件</span>
          <van-icon name="cross" @click="closeShow"/>
        </div>
        <div class="popConten">
          <span class="popContenSpan">直推下级购买以下任意{{ info.get_condition }}件商品可解封一次</span>
          <div class="box">
            <div class="boxlis" v-for="(item, index) in info.has_many_appoint_goods" :key="index" @click="togoods(item.id)">
              <div class="img">
                <img :src="item.thumb" alt="" />
              </div>
              <div class="bottomlis">
                <span>{{ item.title }}</span>
                <p>{{ $i18n.t('money') }}{{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import pickUpArea_controller from './pickUpArea_controller';

export default pickUpArea_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#pickuparea {
  /* .tabnav { */

  /* } */

  .topicon {
    position: absolute;
    top: 55px;
    left: 0.938rem;
    z-index: 10;
  }

  .list {
    background: #fff;
    padding-top: 1.063rem;
    padding-bottom: 1.25rem;

    .search-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin: 0 0.938rem 1.25rem;
      background-color: #f2f2f2;
      height: 1.875rem;
      line-height: 1.875rem;
      border-radius: 0.938rem;

      input {
        flex: 1;
        line-height: 1.75rem;
        border: none;
        color: #333;
        margin-left: 2.5rem;
      }

      i {
        position: absolute;
        left: 1rem;
        flex: 0 0 1.5rem;
      }
    }

    .shopList {
      height: 5.75rem;
      margin: 0.344rem;
      border-bottom: 0.031rem #f5f5f5 solid;
      display: flex;
      justify-content: space-between;

      .left {
        width: 4.375rem;
        height: 4.406rem;
        margin-left: 0.594rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        flex: 1;
        padding-left: 0.5rem;
        display: flex;
        flex-direction: column;

        .title {
          text-align: left;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .shopKu {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.375rem;

          .kuMum {
            font-size: 0.75rem;
            line-height: 1.125rem;
            letter-spacing: 0;
            color: #666;
          }

          .btn {
            width: 4.688rem;
            height: 1.438rem;
            background-color: #f14e4e;
            border-radius: 0.719rem;
            font-size: 0.813rem;
            color: #fff;
            line-height: 1.438rem;
          }
        }
      }
    }
  }
}

.popupBox {
  width: 18.25rem;
  height: 24.688rem;
  background-color: #fff;
  border-radius: 0.625rem;

  .popConten {
    flex: 1;
    overflow-y: scroll;

    .popContenSpan {
      line-height: 2rem;
    }

    .box {
      margin: 0 0.969rem 0 0.906rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .box .boxlis:nth-child(3n) {
      margin-top: 0.625rem;
    }

    .boxlis {
      width: 7.813rem;
      height: 11.75rem;
      background-color: #fff;
      border-radius: 0.313rem;
      border: solid 0.031rem #ededed;
      display: flex;
      flex-direction: column;

      .img {
        width: 7.813rem;
        height: 7.813rem;
        border-radius: 0.313rem 0.313rem 0 0;

        img {
          width: 100%;
          height: 100%;
          border-radius: 0.313rem 0.313rem 0 0;
        }
      }

      .bottomlis {
        flex: 1;
        padding: 0.5rem 0.594rem;
        font-size: 0.75rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        span {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-align: left;
        }

        p {
          text-align: left;
          color: #f14e4e;
        }
      }
    }
  }

  .poptop {
    width: 100%;
    height: 3.094rem;
    line-height: 3.094rem;
    position: relative;
    border-bottom: 1px solid #f2f2f2;

    span {
      font-size: 1rem;
      color: #202020;
    }

    i {
      position: absolute;
      top: 0.938rem;
      right: 0.938rem;
    }
  }
}
</style>