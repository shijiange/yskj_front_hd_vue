<template>
  <div id="card_index">
    <c-title :hide="false" :text='card_title'></c-title>
    <div id="content">
        <div class="content_a">
            <div class="card_equity">
                <div class="card_bg_a" v-if="!card_status" :style="{backgroundImage:'url(' +card_bk+ ')'}">
                    <p>您还未开通{{card_title}}，无法享受特权</p>
                    <button type="button" @click="gotoOpen">立即开通</button>
                </div>
                <div class="card_bg_b" v-if="card_status" :style="{backgroundImage:'url('+info.card_thumb+')'}">
                  <div class="top">
                      <div class="top_a">
                          <div class="img">
                              <img :src="info.thumb?info.thumb:require('../../../assets/images/photo-mr.jpg')" style="width: 100%; height: 100%;">
                          </div>
                          <ul class="text">
                              <li class="name">{{info.nickname}}</li>
                              <li class="grade">我的等级：{{info.level_name}}</li>
                          </ul>
                          <div class="all_vip">
                              <button type="button" @click="gotoOpen"><i class="iconfont icon-card_cap"></i>所有等级</button>
                          </div>
                          <!-- <span>{{info.nickname}}</span> -->
                      </div>
                      <!-- <p class="gold_card">{{info.level_name}}</p> -->
                  </div>
                    <p class="time">{{info.expire_date}}到期</p>
                    <div class="btn">
                        <button type="button" @click="gotoFare(info)">立即续费</button>
                        <!-- <button type="button" @click="gotoOpen">升级</button> -->
                    </div>

                </div>
                <h1>{{card_title}}<span>尊享权益/PRIVLEGE</span></h1>
            </div>
            <!-- <ul class="equity">
                <li>
                    <i class="iconfont icon-card_store"></i>
                    <span>门店特权</span>
                </li>
                <li>
                    <i class="iconfont icon-card_vip"></i>
                    <span>专属会员价</span>
                </li>
                <li>
                    <i class="iconfont icon-card_coupon"></i>
                    <span>专属礼券</span>
                </li>
                <li>
                    <i class="iconfont icon-card_more"></i>
                    <span>更多权益</span>
                </li>
            </ul> -->
        </div>

        <div v-if='info.text'>
          <router-link :to="fun.getUrl('couponLog')" tag="div" class="amount-box">
            <div class="amount-box-left">{{info.text}} <em>{{info.amount}}</em></div>
            <div class="amount-box-right">使用记录 <i class="fa fa-angle-right"></i></div>
          </router-link>
        </div>

        <div class="content_b" v-if="!fun.isTextEmpty(tabArr[0]) || !fun.isTextEmpty(tabArr[1])">
            <div class="tab_a" v-if="card_status">
                <ul class="tab_a_box" >
                    <!-- <li class="current">特权折扣</li>
                    <li>平日折扣</li>
                    <li>专属礼券</li> -->
                    <li v-for="(item,index) in tabArr" :class="{current:index==tabIndex}" @click="toggle(index)"
					:key='index'>{{item}}</li>
                </ul>
            </div>
            <!-- <transition name="fade"> -->
                <!-- 特权折扣 -->
                <div class="content_b_a" v-if="privilege_discount_show">
                    <div class="tab_b">
                        <ul class="tab_b_box">
                            <li v-for="(item,index) in pd_classfy_arr" :key='index' :class="{current:index==pd_index}" @click="pdClassfySearch(index,item.id)">{{item.name}}</li>
                        </ul>
                    </div>
                    <div class="tab_c">
                        <ul class="tab_c_box">
                            <li :key='index' v-for="(item,index) in pd_date_arr" :class="{current:index==pd_date_index}" @click="pdDateSearch(index,item)">
                                <span>{{item.week}}</span>
                                <span>{{item.ye}}</span>
                            </li>
                        </ul>
                    </div>
                    <van-pull-refresh v-model="isLoading" @refresh="pdLoadTop" success-text="刷新成功">
                      <div class="goods_list">
                        <div :key='i' class="goods" v-for="(item,i) in pd_arr" @click="gotoShop(item.id)">
                            <div class="img">
                                <img :src="item.thumb" style="width: 100%; height: 100%;">
                            </div>
                            <ul class="info">
                                <li class="info_a">
                                    <span>{{item.store_name}}</span>
                                    <span>距离{{item.distance}}km</span>
                                </li>
                                <li class="info_b">
                                    <span>{{item.has_many_privilege[0].title}}</span>
                                </li>
                                <li class="info_c">
                                    <span>{{item.has_many_privilege[0].discount_value}}折</span>
                                    <button type="button" @click="gotoShop(item.id)">立即使用</button>
                                </li>
                            </ul>
                        </div>
                      </div>
                    </van-pull-refresh>
                </div>
                <!-- 专属礼券 -->
                <div class="content_b_c" v-if="exclusive_coupons_show">
                    <div class="coupon_box">
                        <van-pull-refresh v-model="isLoading" @refresh="ecLoadTop" success-text="刷新成功">
                            <div class="coupon" :key='i' v-for="(item,i) in ec_arr">
                                <div class="left">
                                    <div class="img">
                                        <img :src="item.store.thumb?item.store.thumb:require('../../../assets/images/photo-mr.jpg')" style="width: 100%; height: 100%;">
                                    </div>
                                    <p>{{item.store.store_name}}</p>
                                </div>
                                <div class="right">
                                    <ul class="right_a">
                                        <li>{{item.name}}</li>
                                        <li v-if="item.coupon_method==1">满{{item.enough}}立减{{item.deduct}}{{$i18n.t('元')}}</li>
                                        <li v-if="item.coupon_method==0">{{item.discount}}折优惠</li>
                                    </ul>
                                    <ul class="right_b">
                                        <li v-if="item.coupon_method==1">{{$i18n.t('money')}}<span>{{item.deduct}}</span></li>
                                        <li v-if="item.coupon_method==0"><span>{{item.discount}}</span>折</li>
                                        <li><button type="button" @click="getCoupon(item.id)">立即领取</button></li>
                                    </ul>
                                    <!-- <div class="received_b">
                                            <i class="iconfont icon-receive"></i>
                                    </div> -->
                                </div>
                            </div>
                        </van-pull-refresh>
                    </div>
                </div>
            <!-- </transition> -->

        </div>
    </div>
  </div>
</template>

<script>
import controller from "./card_index_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#card_index {
  #content {
    .content_a {
      background-image: url(../../../assets/images/card_bgimg.png);
      background-repeat: no-repeat;
      background-size: 100%;

      .card_equity {
        padding-top: 1.25rem;

        .card_bg_a {
          margin: 0 auto;
          width: 18.75rem;
          height: 10.3125rem;
          //background-image: url(../../../assets/images/card_noopen.png);
          background-size: 18.75rem 10.3125rem;
          background-repeat: no-repeat;
          color: #fff;
          padding-top: 2.5rem;

          p {
            font-size: 18px;
            margin-bottom: 2.5rem;
          }

          button {
            width: 6.25rem;
            height: 1.875rem;
            line-height: 1.875rem;
            border-radius: 1.875rem;
            color: #daac5e;
            font-size: 16px;
            background: #fff;
            border: none;
          }
        }

        .card_bg_b {
          margin: 0 auto;
          width: 21.5625rem;
          height: 11.125rem;
          background-image: url(../../../assets/images/card_open.png);
          background-size: 21.5625rem 11.125rem;
          background-repeat: no-repeat;
          color: #fff;
          padding: 1.25rem 0 0 0.625rem;

          .top {
            position: relative;

            .top_a {
              display: flex;
              position: relative;

              .img {
                width: 3rem;
                height: 3rem;
                border-radius: 1.375rem;
                overflow: hidden;
                margin-right: 0.625rem;

                img {
                  width: 100%;
                }
              }

              .text {
                .name {
                  max-width: 8.75rem;
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  line-height: 1.5rem;
                  font-size: 18px;
                  font-weight: bold;
                }

                .grade {
                  line-height: 1.5rem;
                }
              }

              span {
                max-width: 8.75rem;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 2.25rem;
                font-size: 18px;
                font-weight: bold;
              }

              .all_vip {
                position: absolute;
                right: 0;
                top: -1.25rem;

                button {
                  height: 2.25rem;
                  width: 6.25rem;
                  background: rgba(0, 0, 0, 0.32);
                  display: flex;
                  align-items: center;
                  font-size: 14px;
                  border-radius: 0 0.625rem 0 0.625rem;
                  justify-content: center;
                  border: none;

                  i {
                    font-size: 1.5rem;
                    margin-right: 0.375rem;
                    color: #fff;
                  }
                }
              }
            }

            .gold_card {
              position: absolute;
              right: 0;
              top: 0;
              line-height: 1.875rem;
              background: rgba(51, 51, 51, 0.5);
              border-radius: 1.125rem 0 0 1.125rem;
              padding: 0 0.625rem;
            }
          }

          .time {
            font-size: 18px;
            margin: 1rem 0;
          }

          .btn {
            display: flex;
            justify-content: space-around;

            button {
              width: 6.25rem;
              height: 1.875rem;
              line-height: 1.875rem;
              border-radius: 1.875rem;
              color: #daac5e;
              font-size: 15px;
              background: #fff;
              border: none;
            }
          }
        }

        h1 {
          font-size: 16px;
          color: #333;
          line-height: 2.75rem;

          span {
            font-style: italic;
            color: #daac5e;
            margin-left: 0.625rem;
          }
        }
      }

      .equity {
        border-top: solid 0.125rem #ebebeb;
        background: #fff;
        display: flex;
        padding: 0.75rem 0;

        li {
          width: 25%;

          i {
            font-size: 2.25rem;
            color: #daac5e;
            display: block;
            margin-bottom: 0.25rem;
          }

          span {
            color: #333;
            font-size: 14px;
          }
        }
      }
    }

    .amount-box {
      height: 2.875rem;
      line-height: 2.875rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.875rem;
      margin-top: 0.625rem;
      background: #fff;
      font-size: 12px;

      .amount-box-left {
        em {
          margin-left: 0.25rem;
          font-size: 18px;
          font-weight: bold;
          color: #daac5e;
        }
      }

      .amount-box-right {
        color: #999;
      }
    }

    .content_b {
      margin-top: 0.625rem;
      background: #fff;

      .tab_a {
        padding: 0.625rem 0.9375rem;

        .tab_a_box {
          display: flex;
          border-radius: 0.375rem;
          border: solid 0.0625rem #daac5e;
          overflow: hidden;
          // li:nth-child(2){
          //   border-left:solid 0.0625rem #daac5e;
          //   border-right:solid 0.0625rem #daac5e;
          // }
          li {
            width: 50%;
            height: 2.25rem;
            line-height: 2.25rem;
            font-size: 16px;
            color: #daac5e;
          }

          .current {
            background: #daac5e;
            color: #fff;
          }
        }
      }

      .content_b_a,
      .content_b_b,
      .content_b_c {
        .tab_b {
          background: #f5f5f5;
          overflow-x: scroll;
          white-space: nowrap;

          .tab_b_box {
            display: flex;
            font-size: 15px;

            li {
              margin: 0 0.75rem;
              height: 2.625rem;
              line-height: 2.625rem;
              color: #666;
            }

            .current {
              font-weight: bold;
              color: #daac5e;
              border-bottom: solid 0.1875rem #daac5e;
            }

            li:last-child {
              padding-right: 0.75rem;
            }
          }
        }

        .tab_c {
          .tab_c_box {
            display: flex;

            li {
              flex: 1;
              padding: 0.625rem 0;
              color: #666;

              span {
                display: block;
                line-height: 1.25rem;
                font-size: 13px;
              }
            }

            .current {
              background: rgba(218, 172, 94, 0.6);
              color: #fff;
            }
          }
        }

        .goods_list {
          padding: 0 0.75rem;

          .goods {
            display: flex;
            padding: 1rem 0;
            border-bottom: solid 0.0625rem #ebebeb;

            .img {
              width: 4rem;
              height: 4rem;
              border: solid 0.0625rem #e8e8e8;
              overflow: hidden;
              margin-right: 0.75rem;

              img {
                width: 100%;
              }
            }
          }

          .info {
            width: 17.1875rem;

            li {
              display: flex;
              justify-content: space-between;
            }

            .info_a {
              margin-bottom: 0.25rem;
              font-size: 15px;

              span:first-child {
                max-width: 11.25rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              span:last-child {
                color: #8c8c8c;
                font-size: 14px;
              }
            }

            .info_b {
              span {
                background: #f5f5f5;
                font-size: 12px;
                color: #18bdad;
                padding: 0 0.25rem;
              }
            }

            .info_c {
              color: #daac5e;

              span {
                font-size: 16px;
              }

              button {
                border: solid 0.0625rem #daac5e;
                padding: 0.125rem 0.5rem;
                font-size: 0.8125rem;
                border-radius: 0.1875rem;
                color: #daac5e;
              }
            }
          }
        }

        .coupon_box {
          margin-top: 1.25rem;
          padding-bottom: 1.25rem;

          .coupon {
            background: #fff;
            border: none;
            margin: 0.625rem auto;
            width: 21.5625rem;
            height: 6.25rem;
            background-image: url(../../../assets/images/coupon_b.png);
            background-size: 21.5625rem 6.25rem;
            background-repeat: no-repeat;
            display: flex;

            .left {
              width: 7.75rem;
              height: 5.625rem;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;

              .img {
                margin: 0 auto;
                width: 2.25rem;
                height: 2.25rem;
                border-radius: 1.875rem;
                overflow: hidden;
                margin-bottom: 0.5rem;

                img {
                  width: 100%;
                }
              }

              p {
                width: 7.75rem;
                padding: 0 0.625rem;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
              }
            }

            .right {
              width: 13.8125rem;
              height: 5.625rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 0.625rem;
              position: relative;

              .right_a {
                li {
                  line-height: 1.125rem;
                  color: #daac5e;
                  text-align: left;
                  font-size: 13px;
                }
              }

              .right_b {
                li:first-child {
                  color: #daac5e;
                  font-size: 14px;

                  span {
                    font-size: 20px;
                  }
                }

                li:last-child {
                  button {
                    border: none;
                    background: #daac5e;
                    color: #fff;
                    font-size: 12px;
                    border-radius: 1rem;
                    padding: 0.25rem 0.5rem;
                  }
                }
              }

              .received_b {
                position: absolute;
                top: 0;
                left: 40%;

                i {
                  font-size: 3.75rem;
                  color: #daac5e;
                  opacity: 0.3;
                }
              }
            }
          }
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
