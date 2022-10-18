<template>
  <div id="extend_helper_record">
    <c-title :hide="false"
             text="推广记录"></c-title>
    <div class="content">
      <div class="item" v-for="(item,index) in datas" :key="index">
        <div class="top" @click="toPage(item)">
          <div class='test'>
            <span>推广ID:{{item.id}}</span>
            <span>{{item.created_at}}</span>
          </div>
          <div class="connect">
            <div class="img">
              <img :src="item.share_img" alt="">
            </div>
            <div class="text-box">
              <p class="title">{{item.share_title}}</p>
              <p class="discrete">{{item.share_desc}}</p>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="times">点击次数 {{item.browse_amount}}</div>
          <div class="copy-btn"
               v-clipboard:copy="fun.getSiteRoot()+'/addons/yun_shop/?menu#/popular_assistant/'+item.id+'?i='+fun.getKeyByI()+'&mid='+item.member_id"
               v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接
          </div>
        </div>
      </div>
    </div>
    <div class="create-btn"
         :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div class="btn" @click="toCreate">
        创建连接
      </div>
    </div>
  </div>
</template>
<script>
import extend_helper_record_controller from "./extend_helper_record_controller";

export default extend_helper_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #extend_helper_record {
    .content {
      padding-bottom: 4rem;

      .item {
        background-color: #fff;
        margin-top: 0.75rem;

        .top {
          padding: 1rem;
          border-bottom: solid 1px #f3f3f3;

          .test {
            display: flex;
            justify-content: space-between;
            color: #666;
            margin-bottom: 1.1875rem;
            text-align: left;
          }

          .connect {
            text-align: left;
            display: flex;
          }

          .img {
            flex: 0 0 5rem;
            height: 5rem;
            margin-right: 1rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 8px;
            }
          }

          .text-box {
            padding: 0.2rem 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .title {
              font-size: 15px;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }

            .discrete {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              color: #999;
            }
          }
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          align-items: center;

          .times {
            color: #ff2c29;
            font-size: 15px;
            font-weight: bold;
          }

          .copy-btn {
            width: 4.9375rem;
            height: 1.625rem;
            background-color: rgba(255, 44, 41, 0.1);
            border-radius: 0.8125rem;
            box-sizing: border-box;
            color: #ff2c29;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .create-btn {
      background-color: #fff;
      height: 3.0625rem;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;

      .btn {
        width: 17.5rem;
        height: 2.5rem;
        background-color: #ff2c29;
        border-radius: 1.25rem;
        color: #fff;
        font-size: 18px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }

      &.pcStyle {
        width: 375px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

</style>
