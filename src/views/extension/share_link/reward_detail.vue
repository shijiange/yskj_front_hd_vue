<template>
  <div id="reward_detail">
    <c-title :hide="false" :text="'奖励统计'"
             tolink='IntegralGetRecord'>
    </c-title>
    <div id="content_box">
      <div class="box">
        <ul class="data_line">
          <li class="data_a">
            <ul>
              <li><span>{{$i18n.t('money')}}</span>{{amount_total.sum.toFixed(2)}}</li>
              <li>{{amount_total.name}}</li>
            </ul>
          </li>
          <li class="data_a">
            <ul>
              <li><span>{{$i18n.t('money')}}</span>{{amount_surplus.sum.toFixed(2)}}</li>
              <li>{{amount_surplus.name}}</li>
            </ul>
          </li>
        </ul>
        <ul class="data_line">
          <li class="data_a">
            <ul>
              <li><span>{{$i18n.t('money')}}</span>{{amount_finish.sum.toFixed(2)}}</li>
              <li>{{amount_finish.name}}</li>
            </ul>
          </li>
          <li class="data_a">
            <ul>
              <li><span>{{$i18n.t('money')}}</span>{{exchange_point.sum.toFixed(2)}}</li>
              <li>{{exchange_point.name}}</li>
            </ul>
          </li>
        </ul>
        <ul class="data_line">
          <li class="data_a">
            <ul>
              <li><span>{{$i18n.t('money')}}</span>{{exchange_love.sum}}</li>
              <li>{{exchange_love.name}}</li>
            </ul>
          </li>
          <!-- <li class="data_a">
              <ul>
                  <li><span>{{$i18n.t('money')}}</span>1252.25</li>
                  <li>累计奖励</li>
              </ul>
          </li> -->
        </ul>
      </div>
      <div class="center">
        <ul>
          <li>已{{exchange_point_amount.name}}：<span>{{$i18n.t('money')}}{{exchange_point_amount.sum.toFixed(2)}}</span></li>
          <li>已{{exchange_love_amount.name}}：<span>{{$i18n.t('money')}}{{exchange_love_amount.sum.toFixed(2)}}</span></li>
        </ul>
      </div>
      <div class="tips">
        <ul>
          <!--<li>累计奖励=待奖励+已奖励+已兑换{{point_name}}金额+已兑换{{love_name}}金额；</li>-->
          <li>兑换{{point_name}}/{{love_name}}=用于兑换的奖励数量*当期{{point_name}}/{{love_name}}兑换比例；</li>
          <li>已兑换{{point_name}}/{{love_name}}数量为累计用于兑换{{point_name}}/{{love_name}}的奖励数量总和。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import reward_detail_controller from "./reward_detail_controller";

export default reward_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #reward_detail {
    background-color: #fff;

    #content_box {
      .box {
        .data_line {
          display: flex;
          border-bottom: solid 0.0625rem #ebebeb;

          .data_a {
            width: 50%;

            ul:first-child {
              border-right: solid 0.0625rem #ebebeb;
            }

            ul {
              padding: 0.625rem 0.875rem;
              text-align: left;

              li:first-child {
                height: 1.625rem;
                line-height: 1.625rem;
                font-size: 20px;
                font-weight: bold;
                color: #f15353;

                span {
                  font-size: 14px;
                }
              }

              li:last-child {
                line-height: 1.5rem;
                font-size: 14px;
                color: #8c8c8c;
              }
            }
          }
        }
      }

      .center {
        padding: 0.625rem 0;

        ul {
          padding: 0 0.875rem;

          li {
            line-height: 1.875rem;
            font-size: 16px;
            text-align: left;

            span {
              color: #f15353;
            }
          }
        }
      }

      .tips {
        background-color: #fafafa;
        padding: 0.625rem 0;

        ul {
          li {
            padding: 0 0.875rem;
            text-align: left;
            font-size: 15px;
            color: #8c8c8c;
          }

          li::before {
            margin-right: 0.25rem;
            color: #f15353;
            content: '*';
          }
        }
      }
    }
  }
</style>
