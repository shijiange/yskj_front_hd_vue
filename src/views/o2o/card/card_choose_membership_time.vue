<template>
  <div id="choose_cycle">
    <c-title :hide="false" text='选择周期'></c-title>
    <div id="content">
        <div class="header">
            <div class="user">
                <img :src="thumb?thumb:require('../../../assets/images/photo-mr.jpg')" style="width: 100%; height: 100%;">
            </div>
            <ul class="name">
                <li>{{nickname}}</li>
                <li>等级名称：{{level_name}}</li>
            </ul>
        </div>
        <div class="time" v-if="isOpen">
            <i class="iconfont icon-naozhong"></i>
            <span>{{date}}到期，购买后有效期将顺延</span>
        </div>
        <div class="meal">
            <h1>会员套餐</h1>
            <ul class="meal_list">
                <li :class="{current:index==currentIndex}" v-for="(item,index) in priceArr" @click="toggle(index,item)" :key='index'>
                    <span>
                        <i class="iconfont icon-submit"></i>
                        <i class="iconfont icon-info-unselect" v-if="false"></i>{{item.time}}天</span>
                    <span><font v-if="item.market_price!=item.price">{{item.market_price}}{{$i18n.t('元')}}</font>{{item.price}}{{$i18n.t('元')}}</span>
                </li>

            </ul>
        </div>
        <div class="btn">
            <button type="button" @click="open()">{{isOpen?"立即续费":"立即开通"}}</button>
        </div>
    </div>

  </div>
</template>

<script>
import controller from "./card_choose_membership_time_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #choose_cycle {
    #content {
      .header {
        background: #3b3b4f;
        padding: 1.25rem;
        display: flex;

        .user {
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 1.875rem;
          border: solid 0.125rem #fff;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        .name {
          text-align: left;
          color: #fff;
          margin-left: 0.625rem;

          li:first-child {
            line-height: 1.875rem;
            font-size: 18px;
            font-weight: bold;
            max-width: 15rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          li:last-child {
            font-size: 14px;
            line-height: 1.875rem;
          }
        }
      }

      .time {
        height: 2.25rem;
        line-height: 2.25rem;
        display: flex;
        text-align: left;
        padding: 0 1.25rem;
        background: rgba(59, 59, 79, 0.8);
        color: #f5d59c;
        font-size: 14px;

        i {
          font-size: 1.125rem;
          color: #f5d59c;
          line-height: 2.25rem;
          margin-right: 0.625rem;
        }
      }

      .meal {
        background: #fff;

        h1 {
          line-height: 3.125rem;
          font-size: 18px;
          padding: 0 0.875rem;
          text-align: left;
        }

        .meal_list {
          padding: 0.625rem 0.875rem;

          li {
            line-height: 2.5rem;
            display: flex;
            justify-content: space-between;
            padding: 0 0.625rem;
            font-size: 16px;
            margin: 0.375rem 0;

            span:first-child {
              display: flex;

              i {
                font-size: 1.5rem;
                color: #ccc;
                line-height: 2.5rem;
                margin-right: 0.625rem;
              }
            }

            span:last-child {
              font {
                text-decoration: line-through;
                color: #8c8c8c;
                margin-right: 0.625rem;
              }
            }
          }

          .current {
            background: rgba(218, 172, 94, 0.1);
            border-radius: 0.1875rem;

            span:first-child {
              i {
                color: #333;
              }
            }
          }
        }
      }

      .btn {
        margin-top: 1.25rem;

        button {
          width: 18.75rem;
          height: 2.625rem;
          border-radius: 0.375rem;
          background: #3b3b4f;
          color: #fff;
          font-size: 18px;
          border: none;
        }
      }
    }
  }
</style>
