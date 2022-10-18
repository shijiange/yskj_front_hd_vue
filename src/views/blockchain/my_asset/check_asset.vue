<template>
  <div id="check_asset">
    <c-title :hide="false"
             :text="'查看'+lang.capital_name"></c-title>
    <div id="content">
      <div class="content_a">
        <div class="top_a"
             v-if="homeData.digitization">
          <ul class="name">
            <li>
              <span>{{homeData.digitization.digitization_name || ' '}}</span>
              <router-link :to="fun.getUrl('Assessment',{asset_id: asset_id})">
                详情<i class="fa fa-angle-right"></i>
              </router-link>
            </li>
            <li>
              <span>可用：{{homeData.digitization.hold_usable || 0}}</span>
              <span>冻结：{{homeData.digitization.hold_froze || 0}}</span>
            </li>
          </ul>
        </div>

        <div class="top_b"
             v-if="homeData.income">
          <ul class="sum">
            <li>
              <span><em>{{$i18n.t('money')}}</em>{{homeData.income.income_amount || 0}}</span>
              <span>累计{{lang.bonus_name || '分红'}}</span>
            </li>
            <li>
              <span><em>{{$i18n.t('money')}}</em>{{homeData.income.retain_income || 0}}</span>
              <span>未{{fun.initWithdrawal()}}{{lang.bonus_name || '分红'}}</span>
            </li>
          </ul>
        </div>
        <div class="top_c">
          <ul class="list">
            <li @click="toPage('IncomeRecord')">
              <i class="iconfont icon-import_detail"></i>
              <span>进出明细</span>
              <i class="fa fa-angle-right"></i>
            </li>
            <li @click="toPage('BuyingRecord')">
              <i class="iconfont icon-asset_record"></i>
              <span>{{lang.capital_name || '资产'}}记录</span>
              <i class="fa fa-angle-right"></i>
            </li>
          </ul>
        </div>
      </div>
      <div class="content_b">
        <div class="title">
          <span class="block"></span>
          <h1>进账汇总</h1>
        </div>
        <div class="list_box">
          <ul class="box_item">
            <li v-for="(item,i) in Income" :key='i'>
              <span>{{item.mark_name || ' '}}</span>
              <span>{{item.count || 0}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="content_c">
        <div class="title">
          <span class="block"></span>
          <h1>出账汇总</h1>
        </div>
        <div class="list_box">
          <ul class="box_item">
            <li v-for="(item,i) in Outcome" :key='i'>
              <span>{{item.mark_name || ' '}}</span>
              <span>{{item.count || 0}}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 底部菜单 -->
      <div class="botton_menu" :style="{width: fun.getPhoneEnv() == 3?'375px':`${clientWidths}px`}">
        <button @click="toPage('TransHome')"><i class="iconfont icon-home-line1"></i>首页</button>
        <button @click="toPage('AssetTrans')" v-if="btn.transfer === 1">转让</button>
        <!--<button @click="toPage('AssetSale')" v-if="btn.sell === 1">卖出</button>-->
        <!--<button @click="toPage('Buying')" v-if="can_subscribe" class="orange">{{lang.subscription_name}}</button>-->
      </div>
    </div>
  </div>
</template>

<script>
import check_asset_controller from "./check_asset_controller";

export default check_asset_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#check_asset {
  #content {
    padding-bottom: 3.5rem;

    .content_a {
      background-color: #f7a145;

      .top_a {
        padding: 0.625rem 0.875rem;

        .name {
          li:first-child {
            line-height: 2.25rem;
            font-size: 18px;
            display: flex;
            justify-content: space-between;
            color: #fff;

            a {
              font-size: 14px;
              display: flex;
              padding: 0.125rem 0.625rem;

              i {
                color: #fff;
                line-height: 2.25rem;
                margin-left: 0.625rem;
                font-size: 1.25rem;
              }
            }
          }

          li:last-child {
            color: #fff;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            line-height: 1.5rem;
          }
        }
      }

      .top_b {
        background: #fff;
        padding: 1rem 0;
        border-radius: 0.625rem 0.625rem 0 0;

        .sum {
          display: flex;

          li {
            width: 50%;
            text-align: center;

            span:first-child {
              line-height: 1.875rem;
              font-size: 20px;
              display: block;

              em {
                font-size: 14px;
              }
            }

            span:last-child {
              color: #8c8c8c;
              font-size: 14px;
            }
          }
        }
      }

      .top_c {
        background: #fff;
        border-top: solid 0.0625rem #ebebeb;
        border-bottom: solid 0.0625rem #ebebeb;

        .list {
          padding-left: 0.875rem;

          li {
            line-height: 2.75rem;
            height: 2.75rem;
            border-bottom: solid 0.0625rem #ebebeb;
            display: flex;
            font-size: 16px;
            position: relative;

            i:first-child {
              color: #666;
              font-size: 28px;
              line-height: 2.75rem;
              margin-right: 0.25rem;
            }

            i:last-child {
              color: #c9c9c9;
              font-size: 1.5rem;
              line-height: 2.75rem;
              position: absolute;
              right: 0.875rem;
            }
          }

          li:last-child {
            border: none;
          }
        }
      }
    }

    .content_b,
    .content_c {
      background: #fff;
      margin-top: 0.625rem;

      .title {
        display: flex;
        align-items: center;
        padding: 0 0.875rem;
        text-align: left;
        height: 2.5rem;
        line-height: 2.5rem;

        .block {
          display: block;
          width: 0.25rem;
          height: 0.875rem;
          background: #f7a145;
          margin-right: 0.5rem;
        }

        h1 {
          font-size: 16px;
        }
      }

      .list_box {
        .box_item {
          display: flex;
          flex-wrap: wrap;
          border-top: solid 0.0625rem #ebebeb;
          border-bottom: solid 0.0625rem #ebebeb;

          li {
            width: 50%;
            border-right: solid 0.0625rem #ebebeb;
            border-bottom: solid 0.0625rem #ebebeb;
            padding: 0.625rem;
            text-align: left;

            span:first-child {
              color: #8c8c8c;
              font-size: 14px;
              display: block;
              line-height: 1.625rem;
            }

            span:last-child {
              font-size: 20px;
              display: block;
              line-height: 1.625rem;
            }
          }

          li:nth-child(2n) {
            border-right: none;
          }
        }
      }
    }

    .botton_menu {
      z-index: 100;
      box-shadow: 0 0 0.375rem #ccc;
      width: 100%;
      display: flex;
      position: fixed;
      bottom: 0;
      border-top: solid 0.0625rem #ebebeb;
      background: #fff;
      height: 3.125rem;

      button {
        border: none;
        flex: 1;
        height: 3.125rem;
        border-radius: 0;
        padding: 0;
        font-size: 16px;
        border-right: solid 0.0625rem #ebebeb;
        background: #fff;
        color: #f7a145;
      }

      button:first-child {
        background: #fff;
        font-size: 14px;
        color: #666;

        i {
          font-size: 1.25rem;
          color: #666;
        }
      }

      .orange {
        background: #f7a145;
        color: #fff;
        border-right: none;
      }
    }
  }
}
</style>
