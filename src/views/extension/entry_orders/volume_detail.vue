<template>
  <div>
    <c-title :hide="false"
             :text="integral ? integral : '批发券明细'">
    </c-title>
    <div class="contair">
      <div class="header">
        <van-tabs v-model="activeName">
          <van-tab name="0">
            <span @click="chooseActive('0')" slot="title">全部</span>
          </van-tab>
          <van-tab name="1">
            <span @click="chooseActive('1')" slot="title">零售</span>
          </van-tab>
          <van-tab name="2">
            <span @click="chooseActive('2')" slot="title">自用</span>
          </van-tab>
        </van-tabs>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <div class="info">
          <ul>
            <li v-for="item in info"
                :key="item.id">
              <div class="info_back">
                <div class="img">
                  <img :src="item.goods_thumb"
                       alt=""/>
                </div>
                <div class="back_title">
                  {{item.goods_title}}【{{item.amount}}{{$i18n.t("元")}}】
                </div>
                <div class="back_status">
                  {{item.used_type_name}}
                </div>
              </div>
              <div class="info_time">
                <div class="order_sn">订单号：{{item.order_sn}}</div>
                <div class="order_time">时间：{{item.created_at}}</div>
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
import volume_detail_controller from "./volume_detail_controller";

export default volume_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .contair {
    .info {
      ul {
        li {
          width: 100%;
          background-color: #fff;
          margin-top: 0.425rem;
          padding: 0.75rem 1.06rem;

          .info_back {
            display: flex;
            line-height: 2.13rem;
            padding-bottom: 0.825rem;
            font-size: 0.875rem;

            .img {
              width: 2.13rem;
              height: 2.13rem;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .back_title {
              width: 70%;
              text-align: left;
              padding-left: 0.4rem;
              color: #333;
              overflow: hidden; /* 超出部分隐藏 */
              text-overflow: ellipsis; /* 超出部分显示省略号 */
              white-space: nowrap; /* 规定段落中的文本不进行换行 */
            }

            .back_status {
              flex: 1;
              text-align: right;
              color: #f15353;
            }
          }

          .info_time {
            width: 100%;
            height: 2.53rem;
            text-align: left;
            font-size: 0.75rem;
            color: #8c8c8c;

            .order_sn {
              margin-bottom: 0.3rem;
            }
          }
        }
      }
    }
  }
</style>
