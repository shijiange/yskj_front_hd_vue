<template>
  <div id="reward_process">
    <c-title :hide="false" :text="WXtitle"
             tolink='IntegralGetRecord'>
    </c-title>
    <div id="reward_header">
      <div class="header_box">
        <div class="img">
          <img :src="info.source_thumb">
        </div>
        <div class="head_name">
          <span>{{info.source_name}}</span>
          <!--<span class="title">会员等级：{{level_name}}级</span>-->
        </div>
      </div>
      <div class="reward_box">
        <ul class="reward_a">
          <li>{{info.order_count}}</li>
          <li>累计订单</li>
        </ul>
        <ul class="reward_b">
          <li><span>{{$i18n.t('money')}}</span>{{info.amount_finish}}</li>
          <li>累计奖励</li>
        </ul>
        <ul class="reward_b">
          <li><span>{{$i18n.t('money')}}</span>{{info.amount_surplus}}</li>
          <li>待奖励</li>
        </ul>
      </div>
    </div>
    <div id="content">
      <div class="goods_box" v-for="(item,i) in list" :key='i'>
        <div class="img">
          <img :src="item.has_one_member.avatar">
        </div>
        <ul class="name">
          <li class="goods_a">
            <span>{{item.has_one_member.nickname}}</span>
            <span>{{$i18n.t('money')}}{{item.amount_surplus}}</span>
          </li>
          <li class="goods_b">
            <span>{{item.created_at}}</span>
            <span>{{item.status_name}}</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import reward_process_controller from "./reward_process_controller";

export default reward_process_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #reward_process {
    #reward_header {
      background-color: #fff;

      .header_box {
        display: flex;
        align-items: center;
        padding: 1.25rem 0.875rem;
        border-bottom: solid 0.0625rem #ebebeb;

        .img {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 1.75rem;
          overflow: hidden;
          border: solid 0.0625rem #ebebeb;
          margin-right: 0.625rem;
          background-color: #f8f8f8;

          img {
            width: 100%;
          }
        }

        .head_name {
          text-align: left;

          span {
            width: 17.5625rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .title {
            color: #999;
            font-size: 16px;
            font-weight: normal;
          }
        }

        span {
          display: block;
          font-size: 16px;
          font-weight: bold;
        }
      }

      .reward_box {
        display: flex;
        padding: 0.75rem 0;

        .reward_a,
        .reward_b,
        .reward_c {
          width: 33.33%;
          text-align: center;

          li {
            span {
              font-size: 14px;
            }
          }

          li:first-child {
            height: 1.625rem;
            line-height: 1.625rem;
            font-size: 18px;
            font-weight: bold;
          }

          li:last-child {
            line-height: 1.5rem;
            color: #8c8c8c;
            font-size: 14px;
          }
        }
        // .reward_c{
        //   width: 33.33%;
        //   line-height:3.125rem;
        //   font-size:16px;

        //   li{
        //     display: flex;
        //     justify-content: flex-end;
        //     padding-right:0.875rem;
        //     width: 100%;
        //     i{
        //       font-size:1.75rem;
        //       line-height: 3.125rem;
        //       color:#666;
        //       margin-left:0.625rem;
        //     }
        //   }

        // }
      }
    }

    #content {
      margin-top: 0.625rem;
      background-color: #fff;

      .goods_box {
        display: flex;
        padding: 0.875rem;
        border-bottom: solid 0.0625rem #ebebeb;

        .img {
          width: 3rem;
          height: 3rem;
          border-radius: 1.5rem;
          overflow: hidden;
          margin-right: 0.625rem;
          background-color: #f8f8f8;

          img {
            width: 100%;
          }
        }

        .name {
          width: 17.5625rem;

          .goods_a {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            line-height: 1.75rem;

            span:last-child {
              color: #f15353;
            }
          }

          .goods_b {
            line-height: 1.25rem;
            display: flex;
            justify-content: space-between;
            font-size: 15px;
            color: #8c8c8c;
          }
        }
      }
    }
  }
</style>
