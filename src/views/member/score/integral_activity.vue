<template>
  <div id="integral_active">
    <c-title :hide="false" :text="integral?integral:'积分'"
             tolink='IntegralGetRecord'
             :totext="'领取记录'">
    </c-title>
    <div id="content">
      <div class="active_box">
        <div class="active">
          <ul class="active_num">
            <li>{{activity_total}}</li>
            <li>发布活动总数</li>
          </ul>
          <div class="active_btn" @click="toIntegralGeneralization">
            <i class="iconfont icon-life-game-plus"></i>
            <span>创建活动</span>
          </div>
        </div>
        <ul class="integral">
          <li>
            <span>{{activity_point}}</span>
            <span>赠送总数</span>
          </li>
          <li>
            <span>{{activity_used}}</span>
            <span>已领取总数</span>
          </li>
          <li>
            <span>{{activity_stock}}</span>
            <span>已过期总数</span>
          </li>
        </ul>
      </div>
      <div class="integral_box">
        <h1>
          <div class="spare"></div>
          {{integral?integral:'积分'}}
        </h1>
        <div class="list" @click="toIntegralRecord(activity.id)" :key='i' v-for="(activity,i) in dataList">
          <div class="active_name">
            <i class="iconfont icon-liwu"></i>
            <span>{{activity.name}}</span>
            <i @click.stop="toIntegralPresent(activity.id)" class="iconfont icon-share"></i>
          </div>
          <ul class="active_give">
            <li>
              <span>每人赠送</span>
              <span>{{activity.average}}</span>
            </li>
            <li>
              <span>赠送人数</span>
              <span>{{activity.total}}</span>
            </li>
          </ul>
          <ul class="detail">
            <li v-show="activity.validity_at">有限期：{{activity.validity_at}}</li>
            <li v-show="!activity.validity_at"></li>
            <li>
              <span>明细</span>
              <i class="fa fa-angle-right"></i>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import integral_activity_controller from "./integral_activity_controller";

export default integral_activity_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #integral_active {
    #content {
      .active_box {
        background-color: #f15353;
        margin-bottom: 0.625rem;
        color: #fff;

        .active {
          padding: 0.875rem;
          display: flex;
          justify-content: space-between;

          .active_num {
            text-align: left;

            li:first-child {
              font-size: 26px;
              font-weight: bold;
            }

            li:last-child {
              font-size: 14px;
            }
          }

          .active_btn {
            margin-top: 0.8125rem;
            background-color: #fff;
            // width: 8.75rem;
            height: 1.625rem;
            padding: 0 0.625rem;
            line-height: 1.625rem;
            border-radius: 0.8125rem;
            color: #666;
            display: flex;
          }
        }

        .integral {
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          padding: 0.625rem 0;

          li {
            width: 33.33%;

            span {
              display: block;
              line-height: 1.5rem;
              font-size: 12px;
            }

            span:first-child {
              font-size: 18px;
            }
          }
        }
      }

      .integral_box {
        h1 {
          background-color: #fff;
          text-align: left;
          height: 2.5rem;
          line-height: 2.5rem;
          padding: 0 0.875rem;
          font-size: 16px;
          font-weight: bold;
          border-bottom: solid 0.0625rem #ebebeb;
          display: flex;

          .spare {
            width: 0.25rem;
            height: 1rem;
            border-radius: 0.0625rem;
            margin-right: 0.375rem;
            background: #f15353;
            margin-top: 0.75rem;
          }
        }

        .list {
          margin-bottom: 0.625rem;
          background: #fff;
          padding: 0.625rem 0;

          .active_name {
            height: 1.875rem;
            line-height: 1.875rem;
            padding: 0 0.875rem;
            display: flex;
            font-size: 14px;

            i:first-child {
              color: #666;
              margin-right: 0.625rem;
              font-size: 1.25rem;
            }

            .icon-share {
              width: 1.875rem;
              position: absolute;
              right: 0.875rem;
              color: #666;
              font-size: 1rem;
            }
          }

          .active_give {
            display: flex;
            padding: 0.625rem 0;

            li {
              width: 50%;
              text-align: center;
              font-size: 12px;

              span {
                display: block;
                line-height: 1.5rem;
              }

              span:last-child {
                font-size: 18px;
              }
            }
          }

          .detail {
            height: 1.875rem;
            line-height: 1.875rem;
            padding: 0 0.875rem;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            color: #8c8c8c;

            li {
              display: flex;

              i {
                font-size: 1.25rem;
                line-height: 1.875rem;
                margin-left: 0.375rem;
              }
            }
          }
        }
      }
    }
  }
</style>