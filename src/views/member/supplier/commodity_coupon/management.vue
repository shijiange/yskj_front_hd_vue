<template>
  <div id="coupon_management">
    <c-title :hide="false" :text="'优惠券管理'"></c-title>
    <section id="release-goods">
        <div class="release-a">
          <van-icon class="iconfont icon-block" custom color="#f15353" size="1.5rem"></van-icon>
        </div>
        <span>优惠券数量：{{coupon_length}}</span>
        <div class="release-b" v-if="is_publish==true">
          <router-link :to="fun.getUrl('CommodityCouponEdit',{id:'abc'})">发布优惠券</router-link>
        </div>
    </section>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
     <div class="coupon_list">
        <div class="coupon_box" v-for="(item,index) in coupon" :key="index">
              <div class="coupon_left">
                  <div class="left_item" v-if="item.coupon_method===1">
                      <p class="left_a type_a">{{item.deduct}}</p>
                      <p class="left_b">满{{item.enough}}立减</p>
                  </div>
                  <div class="left_item left_type" v-if="item.coupon_method===2">
                      <p class="left_a">{{item.discount}}<span>折</span></p>
                      <p class="left_b">满{{item.enough}}立享</p>
                  </div>
              </div>
              <div class="coupon_right">
                  <ul class="right_info">
                      <li class="info_a">{{item.name}}</li>
                      <li class="info_b">已使用：{{item.usetotal}}</li>
                      <li class="info_c">
                          <span>已发出：{{item.gettotal}}</span>
                          <span>剩余数量：{{item.lasttotal}}</span>
                          <i class="iconfont icon-more" @click="moreEvent(index)"></i>
                      </li>
                  </ul>
              </div>
              <div class="more" v-show="item.edit_active">
                <ul>
                  <li @click="Toedit(item.id)">
                    <van-icon class="iconfont icon-edit" custom color="#fff" size="1.125rem"></van-icon>
                    <span>编辑</span>
                  </li>
                  <li @click="commodityDelete(index)">
                    <van-icon class="iconfont icon-delete" custom color="#fff" size="1.125rem"></van-icon>
                    <span>删除</span>
                  </li>
                  <li @click="provide(item.id)">
                    <van-icon class="iconfont icon-grant" custom color="#fff" size="1.125rem"></van-icon>
                    <span>发放</span>
                  </li>
                </ul>
                <div class="icon">
                  <van-icon class="iconfont icon-down" custom size="1.5rem"></van-icon>
                </div>
              </div>
        </div>
    </div>
     </van-pull-refresh>
     <h2 v-if="isShowNoTest" class="isShowNoTest">暂无数据</h2>
  </div>
</template>

<script>
import management_controller from "./management_controller";

export default management_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#coupon_management {
  #release-goods {
    background-color: #fff;
    display: flex;
    font-size: 16px;
    position: relative;
    height: 3rem;
    line-height: 3rem;
    border-bottom: solid 0.0625rem #ebebeb;

    .release-a {
      width: 3rem;
      height: 3rem;
    }

    .release-b {
      position: absolute;
      right: 0.875rem;
      top: 0.6875rem;
      font-size: 14px;
      background-color: #f15353;
      height: 1.625rem;
      line-height: 1.625rem;
      padding: 0 0.625rem;
      display: block;
      border-radius: 0.8125rem;
      color: #fff;
    }
  }

  .coupon_list {
    padding: 0.9375rem;

    .coupon_box {
      width: 100%;
      height: 6.875rem;
      border-radius: 0.375rem;
      overflow: hidden;
      background: #fff;
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 0.9375rem;

      .coupon_left {
        width: 6.25rem;
        height: 100%;
        background: #ffb84c;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;

        .left_item {
          color: #fff;

          .left_a {
            font-size: 26px;
            line-height: 2rem;
            margin-bottom: 0.625rem;
          }

          .type_a::before {
            content: "\00A5";
            font-size: 16px;
            display: inline-block;
            vertical-align: text-top;
            margin-right: 0.1875rem;
          }
        }

        .left_type {
          .left_a {
            span {
              font-size: 14px;
            }
          }
        }
      }

      .coupon_left::after {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        right: -0.375rem;
        bottom: 0;
        content: "• • • • • • • • • • • • • ";
        line-height: 0.625rem;
        height: 6.875rem;
        width: 0.75rem;
        color: #fff;
        font-size: 1.5rem;
        overflow: hidden;
        z-index: 1;
      }

      .coupon_right {
        width: 15.3125rem;
        height: 100%;
        padding: 0.375rem 0.625rem;

        .right_info {
          .info_a {
            font-size: 15px;
            text-align: left;
            height: 2.5rem;
            margin-bottom: 0.625rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .info_b {
            color: #8c8c8c;
            font-size: 12px;
            text-align: left;
            line-height: 1.5rem;
          }

          .info_c {
            color: #8c8c8c;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            line-height: 1.5rem;

            span {
              margin-right: 1.25rem;
            }

            i {
              font-size: 1.125rem;
            }
          }
        }
      }

      .more {
        background: rgba(51, 51, 51, 0.9);
        border-radius: 0.25rem;
        color: #f0f0f0;
        width: 7.5rem;
        position: absolute;
        right: 0.375rem;
        top: 2.375rem;
        padding: 0.125rem 0;

        ul {
          display: flex;
          justify-content: center;

          li {
            flex: 1;
            text-align: center;
            font-size: 12px;

            i {
              display: block;
              margin-top: 0.125rem;
            }
          }
        }

        .icon {
          position: absolute;
          right: 0;
          top: 2rem;

          i {
            color: rgba(51, 51, 51, 0.9);
          }
        }
      }
    }
  }

  .isShowNoTest {
    padding: 10px 0;
    color: #666;
  }
}
</style>
