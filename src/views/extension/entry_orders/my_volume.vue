<template>
  <div>
    <c-title :hide="false"
             :text="integral ? integral : '我的零售'"></c-title>
    <div class="contaier">
      <div class="header">
        <van-tabs v-model="activeName">
          <van-tab name="0">
            <span @click="chooseActive('0')" slot="title">全部</span>
          </van-tab>
          <van-tab name="1">
            <span @click="chooseActive('1')" slot="title">零售中</span>
          </van-tab>
          <van-tab name="2">
            <span @click="chooseActive('2')" slot="title">零售成功</span>
          </van-tab>
        </van-tabs>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <div class="order">
          <ul>
            <li v-for="(item,index) in info"
                :key="index">
              <div class="merge_title">
                <span>队列：{{item.id}}</span>
                <span>{{item.status_name}}</span>
              </div>
              <div class="order_info">
                <div class="left_box">
                  <img :src="item.goods_thumb"
                       alt=""/>
                </div>
                <div class="right_box">
                  <div class="top_title"
                       style="-webkit-box-orient: vertical;">
                    {{item.goods_title}}
                  </div>
                  <div class="bot_box">
                    <span>{{$i18n.t("money")}}{{item.goods_price}}</span>
                    <span>{{item.created_at}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <p style="margin: 1.5rem 0; color: #9e9e9e;"
             v-if="isNoMore">没有更多</p>
          <img src="../../../assets/images/blank.png"
               alt=""
               v-if="isNO"
               style="width: 5rem; margin-top: 5rem;">
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import my_volume_controller from "./my_volume_controller";

export default my_volume_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .contaier {
    .order {
      ul {
        li {
          width: 100%;
          background-color: #fff;
          margin-top: 0.4rem;

          .merge_title {
            display: flex;
            height: 2.625rem;
            justify-content: space-between;
            padding: 0.5rem 0.84rem 0 0.88rem;

            span:nth-child(1) {
              font-size: 14px;
              color: #333;
              font-weight: bold;
            }

            span:nth-child(2) {
              font-size: 14px;
              color: #f15353;
            }
          }

          .order_info {
            display: flex;
            width: 100%;
            padding: 0 0.78rem 1rem;

            .left_box {
              width: 3.63rem;
              height: 3.63rem;
              margin-right: 0.78rem;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .right_box {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              .top_title {
                width: 100%;
                text-align: left;
                font-size: 15px;
                line-height: 1.13rem;
                color: #333;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
              }

              .bot_box {
                display: flex;
                justify-content: space-between;

                span:nth-child(1) {
                  width: 2.94rem;
                  font-size: 16px;
                  font-weight: bold;
                  color: #333;
                }

                span:nth-child(2) {
                  width: 9.13rem;
                  height: 0.56rem;
                  font-size: 12px;
                  color: #8c8c8c;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
