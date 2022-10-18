<template>
  <div id="card_goods">
    <!--<c-title :hide="false" :text="'名片选择商品'"></c-title>-->
    <div class="search_box">
      <i class="fa fa-angle-left" @click="goBack"></i>

      <div class="text_box">
        <i class="iconfont icon-sousuo1"></i>
        <form @submit.prevent action="#">
          <input
            type="search"
            v-model="inputs"
            placeholder="请输入当前分类商品"
            @keypress="enterSearch"
          />
        </form>
      </div>
      <span @click="getData">搜索</span>
    </div>
    <div class="title">
      <div class="line_left"></div>
      <h1>搜索结果</h1>
      <div class="line-right"></div>
    </div>
    <div class="goods_list">
      <div
        class="goods_box"
        v-for="(item,i) in goodList" :key='i'
        @click="toGood(item.goods_id)"
      >
        <div class="goods_img">
          <img :src="item.thumb" />
        </div>
        <ul class="goods_text">
          <li class="name" style="-webkit-box-orient: vertical;">
            {{ item.title | escapeTitle }}
          </li>
          <li class="sum">
            <span><font>{{$i18n.t('money')}}</font>{{ item.price }}</span>
            <i
              class="iconfont icon-record_go"
              @click.stop="chooseGoods(item)"
              v-if="chooseGood.includes(item.goods_id)"
            ></i>
            <i
              class="iconfont no_current"
              @click.stop="chooseGoods(item)"
              v-if="!chooseGood.includes(item.goods_id)"
            ></i>
          </li>
        </ul>
      </div>
    </div>

    <!-- 弹窗 -->
    <van-popup v-model="show1" position="center" round style="width: 80%;">
      <div class="tips_box">
        <p class="text">
          您选择的商品数量超过8件，请先删除后再重新选择！
        </p>
        <button type="button" @click="show1 = false">确定</button>
      </div>
    </van-popup>

    <div class="card_goods_btm">
      <p>
        已选<span>{{ chooseGood.length }}</span
        >件商品
      </p>
      <button type="button" @click="sureChoose">确定选择</button>
    </div>
  </div>
</template>

<script>
import card_goods_controller from "./card_goods_controller";

export default card_goods_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_goods {
  padding-top: 40px;
  padding-bottom: 60px;

  .tips_box {
    background: #fff;
    border-radius: 0.375rem;
    height: 10.5rem;

    .text {
      padding: 2.25rem 0.875rem;
      font-size: 16px;
    }

    button {
      border: none;
      color: #50a6f9;
      font-size: 16px;
      width: 100%;
      height: 2.875rem;
      line-height: 2.875rem;
      border-top: solid 0.0625rem #ebebeb;
    }
  }

  .search_box {
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
    background: #fff;
    height: 2.75rem;
    line-height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .fa {
      font-size: 1.5rem;
      color: #333;
      width: 2.5rem;
    }

    .text_box {
      width: 17.5rem;
      border-radius: 1rem;
      height: 1.75rem;
      display: flex;
      align-items: center;
      background: #f2f2f2;
      padding: 0 0.625rem;

      .iconfont {
        font-size: 1rem;
        color: #999;
        margin-right: 0.625rem;
      }

      form {
        width: 100%;
      }

      input {
        border: none;
        width: 90%;
      }
    }

    span {
      width: 3.75rem;
      font-size: 16px;
    }
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;

    .line_left,
    .line-right {
      width: 6.25rem;
      height: 0.0625rem;
      background: #ebebeb;
    }

    h1 {
      font-size: 15px;
      color: #999;
      margin: 0 0.875rem;
    }
  }

  .goods_list {
    padding: 0.625rem 0.9375rem;
    background: #fff;

    .goods_box {
      background: #fafafa;
      padding: 0.625rem;
      display: flex;
      margin-bottom: 0.625rem;

      .goods_img {
        width: 5.25rem;
        height: 5.25rem;
        overflow: hidden;
        margin-right: 0.625rem;
        background: #f2f2f2;

        img {
          width: 100%;
        }
      }

      .goods_text {
        width: 14.4375rem;
        position: relative;

        .name {
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 15px;
          text-align: left;
        }

        .sum {
          position: absolute;
          bottom: 0;
          display: flex;
          line-height: 1.5rem;
          width: 100%;
          justify-content: space-between;

          span {
            color: #f15353;
            font-size: 16px;

            font {
              font-size: 12px;
            }
          }

          .icon-record_go {
            font-size: 0.875rem;
            color: #fff;
            width: 1.5rem;
            height: 1.5rem;
            line-height: 1.5rem;
            border: solid 0.0625rem #50a6f9;
            border-radius: 2rem;
            background: #50a6f9;
          }

          .no_current {
            font-size: 0.875rem;
            color: #ccc;
            width: 1.5rem;
            height: 1.5rem;
            line-height: 1.5rem;
            border: solid 0.0625rem #ccc;
            border-radius: 2rem;
            background: #fff;
          }
        }
      }
    }
  }

  .card_goods_btm {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3.0625rem;
    border-top: solid 0.0625rem #ebebeb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;

    p {
      padding: 0 0.625rem;
      font-size: 16px;

      span {
        color: #f15353;
        margin: 0 0.25rem;
      }
    }

    button {
      border: none;
      background: #50a6f9;
      color: #fff;
      border-radius: 0;
      width: 6.875rem;
      height: 100%;
      font-size: 16px;
    }
  }
}
</style>
