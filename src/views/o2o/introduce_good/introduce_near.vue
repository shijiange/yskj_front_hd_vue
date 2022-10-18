<template>
  <div id="introduce_near" ref="introduce_near">
    <c-title :hide="false" text="门店附近推荐商品"></c-title>
    <div class="content">
        <div class="good-number">
            商品展示数量:<span>{{show_num}}</span>
        </div>
        <div class="without" v-if="datas.length<=0">
          <img src="../../../assets/images/wushangpin@2x.png">
          <div>暂无选择商品</div>
        </div>
        <div class="list" v-if="datas.length>0">
          <div class="item" v-for="(item,index) in datas" :key="index">
            <div class="img" v-if="!fun.isTextEmpty(item.has_one_goods)">
              <img :src="item.has_one_goods.change_thumb">
            </div>
            <div class="info" v-if="!fun.isTextEmpty(item.has_one_goods)">
              <div class="title" v-if="!fun.isTextEmpty(item.has_one_goods)">{{item.has_one_goods.title}}</div>
              <div class="bottom">
                <span class="money" v-if="!fun.isTextEmpty(item.has_one_goods)">{{$i18n.t('money')}}{{item.has_one_goods.price}}</span>
                <span class="delete" @click="del(item)">删除</span>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="add" @click="toAdd">
        <img src="../../../assets/images/zhibo_add@2x.png">
    </div>
  </div>
</template>

<script>
import introduce_near_controller from "./introduce_near_controller";

export default introduce_near_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#introduce_near {
  background-color: #fff;
  position: relative;

  .content {
    padding-bottom: 1rem;
    background-color: #fff;

    .list {
      margin-top: 1rem;
      padding: 0 0.7813rem;

      .item {
        display: flex;
        padding: 1rem;
        background-color: #fff;
        box-shadow: 0 0 0.3125rem 0	rgba(0, 0, 0, 0.1);
        border-radius: 0.3125rem;
        margin-bottom: 0.5rem;

        .img {
          display: flex;
          width: 3.75rem;
          height: 3.8125rem;
          border-radius: 0.3125rem;
          box-sizing: border-box;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
          margin-left: 0.5rem;
          flex: 1;

          .title {
            font-size: 14px;
            color: #000;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .bottom {
            display: flex;
            justify-content: space-between;

            .money {
              font-size: 12px;
              color: #f01414;
            }

            .delete {
              width: 4rem;
              font-size: 12px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 1rem;
              color: #f01414;
              border: solid 1px #f01414;
            }
          }
        }
      }
    }

    .good-number {
      font-size: 14px;
      text-align: left;
      padding-left: 0.7813rem;
      padding-top: 1rem;

      span {
        color: #f31515;
      }
    }

    .without {
      margin: 0 auto;
      margin-top: 2rem;

      img {
        display: inline-block;
        width: 4.375rem;
        height: 5.125rem;
      }

      div {
        margin-top: 1rem;
        color: #999;
        font-size: 14px;
      }
    }
  }

  .add {
    position: absolute;
    bottom: 3.8125rem;
    width: 2.625rem;
    height: 2.625rem;
    box-sizing: border-box;
    right: 1rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
