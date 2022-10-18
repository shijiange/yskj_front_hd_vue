<template>
  <div id="payment">
    <c-title :hide="false" text="团队订单"></c-title>
	<van-sticky offset-top="2.6rem">
		<van-tabs
		v-model="selected"
		style="z-index: 98; height: 2.75rem; line-height: 2.75rem;"
		@click="swichTabTItem">
		<van-tab
			v-for="(item, index) in setNavList"
			:key="index"
			:name="index"
			:title="item"
		></van-tab>
		</van-tabs>
	</van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <div>
      <!-- <mt-tab-container v-model="selected"> -->
        <div v-for="(datasource, key, indexs) in dataList" :key="indexs" v-show="selected==indexs">
        <!-- <mt-tab-container-item
          v-for="(datasource, key, indexs) in dataList"
          :key="indexs"
          :id="indexs"
        > -->
          <div class="osll">
            <div v-for="(order, index) in datasource"
                 :class="'shop'"
                 :key="index">
              <div @click="showMore(order)">
                <div class="title">
                  <h4>{{ order.order_sn }}</h4>
                  <span style="color: #f15353;">+13.90</span>
                </div>
                <div class="title">
                  <h4>{{order.create_time}}</h4>
                  <span>{{ order.status_name }}</span>
                </div>
              </div>

              <div v-if="order.show">
                <!--<div class="member">-->
                  <!--<div class="img-box">-->
                    <!--<img src="https://dev5.yunzmall.com/attachment/images/2/2018/11/HZK4GiK3nv4s3rE3LKGnRpg4rVeK3u.jpg"-->
                         <!--alt="">-->
                  <!--</div>-->
                  <!--<div class="phone-box">-->
                    <!--<p>手机：1269897239729</p>-->
                    <!--<p>微信号：246923743</p>-->
                  <!--</div>-->
                <!--</div>-->
                <div v-for="(good,i) in order.order_goods" :key='i'>
                  <div class="goods">
                    <div class="img"><img :src="good.thumb"/></div>
                    <div class="warp">
                      <div class="inner">
                        <div class="name"
                             style="-webkit-box-orient: vertical;">
                          {{ good.title | escapeTitle }}
                        </div>
                        <div class="option" v-if="good.goods_option_title">规格: {{ good.goods_option_title }}</div>
                      </div>
                      <div class="price">
                        <div class="money">
                          <small>{{$i18n.t('money')}}</small>
                          {{good.unit_price}}
                        </div>
                        <div>
                          ×{{ good.total }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="title">
                  <h4 style="text-align: right;">
                    <!--共 {{ order.goods_total }}件商品-->
                    实付：{{$i18n.t('money')}}<b>{{ order.price }}</b>
                  </h4>
                </div>
              </div>
              <!--<div class="allbt"-->
              <!--v-if="order.button_models.length > 0">-->
              <!--<span v-for="(item,i) in order.button_models" :key='i'-->
              <!--@click="operation(item, order)">{{ item.name }}</span>-->
              <!--</div>-->
            </div>

            <div class="blank" v-if="datasource.length<=0">
              <img src="../../../assets/images/blank.png">
              <span>还没有记录哦</span>
            </div>
          </div>

        <!-- </mt-tab-container-item> -->
        </div>
      <!-- </mt-tab-container> -->
      </div>

    </van-pull-refresh>
  </div>
</template>
<script>
import group_orders_controller from "./group_orders_controller";

export default group_orders_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .osll {
    min-height: 100vh;
  }

  .blank {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 6rem;
      height: 6rem;
    }

    span {
      margin-top: 15px;
      color: #ccc;
      font-size: 14px;
    }
  }

  .contes {
    z-index: 98;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2.8125rem;
    background: #fff;
    line-height: 2.8125rem;
    border-top: #e2e2e2 solid 0.0625rem;
    text-align: right;

    button {
      border: solid 0.0625rem #f15353;
      background: #f15353;
      border-radius: 0.1875rem;
      margin-right: 0.875rem;
      color: #fff;
      padding: 0.25rem 0.625rem;
    }
  }

  .loadNomore img {
    width: 20%;
  }

  #payment {
    .mint-navbar.is-fixed {
      top: 40px;
    }
  }

  .shop {
    background: #fff;
    margin-top: 0.625rem;
    border-bottom: 0.0625rem solid #ebebeb;
    border-top: 0.0625rem solid #ebebeb;

    a {
      color: #000;
    }

    .member {
      display: flex;
      padding: 0.5rem 0.875rem;

      .img-box {
        flex: 0 0 2rem;
        width: 2rem;
        height: 2rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .phone-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: left;
        margin-left: 1rem;

        p {
          font-size: 12px;
        }
      }
    }

    .title::after {
      content: "";
      display: block;
      clear: both;
    }

    .title:first-child {
      border-bottom: 1px solid #f0f0f0;
    }

    .title {
      padding: 0 0.875rem;
      display: flex;
      align-items: center;
      height: 2.25rem;

      h4 {
        text-align: left;
        font-weight: normal;
        line-height: 1.5rem;
        flex: 8;
        font-size: 14px;

        b {
          font-size: 18px;
        }
      }

      span {
        text-align: right;
        margin-right: 0.0625rem;
        flex: 3;
        font-size: 14px;
      }
    }

    span.del {
      border-radius: 0.875rem;
      border: 0.0625rem solid #f15353;
      text-align: center;
      padding: 0.25rem 0.625rem;
      font-size: 12px;
    }

    .allbt {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 0.0625rem solid #ebebeb;
      padding-right: 0.875rem;
      padding-top: 0.5rem;
      flex-wrap: wrap;

      span {
        border-radius: 0.1875rem;
        border: 0.0625rem solid #666;
        margin-left: 0.625rem;
        padding: 0.25rem 0.625rem;
        text-align: center;
        font-size: 12px;
        margin-bottom: 0.5rem;
      }
      // .allbt {
      //   display: flex;
      //   align-items: center;
      //   justify-content: flex-end;
      //   border-top: 1px solid #e2e2e2;
      //   height: 2.75rem;
      //   span {
      //     border-radius: 0.25rem;
      //     border: 1px solid #666;
      //     margin: 0 10px 0 0;
      //     padding: 0.25rem 0.625rem;
      //     text-align: center;
      //     font-size: 12px;
      //   }
      //   span:last-child {
      //     color: #f15353;
      //     border: 1px solid #f15353;
      //   }
      // }
    }

    .goods::after {
      content: "";
      display: block;
      clear: both;
    }

    .goods {
      /* display: -webkit-box;
                                                                                            display: -ms-flexbox;
                                                                                            display: flex;
                                                                                            -webkit-box-align: stretch;
                                                                                            -ms-flex-align: stretch;
                                                                                            align-items: stretch;
                                                                                            -webkit-box-orient: horizontal;
                                                                                            -webkit-box-direction: normal;
                                                                                            -ms-flex-flow: row wrap;
                                                                                            flex-flow: row wrap;
                                                                                            */
      width: 100%;
      box-sizing: border-box;
      background: #fafafa;

      .img {
        padding: 0.625rem 1rem;

        /* flex: 1; */
        width: 26%;
        float: left;
        display: inline-block;

        /* background:blue; */
        img {
          width: 100%;
        }
      }

      .warp {
        width: 74%;
        padding: 0.625rem 1rem 0.625rem 0;
        float: left;
        display: inline-block;

        .inner {
          width: 70%;
          float: left;
          box-sizing: border-box;
          text-align: left;

          .name {
            font-size: 14px;
            text-align: left;
            color: #333;
            margin-bottom: 0.625rem;
            height: 2.5rem;
            line-height: 1.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }

        .price {
          font-size: 14px;
          width: 30%;
          align-items: center;
          text-align: right;
          color: #333;
          box-sizing: border-box;
          float: left;

          .money {
            margin-bottom: 0.625rem;
          }

          small {
            font-size: 12px;
          }
        }
      }

      .option {
        color: #888;
        font-size: 12px;
        flex: 1;
      }
    }

    #tbs {
      display: flex;
      align-items: center;
      background: #fff;
      flex-flow: row wrap;
      padding: 0.625rem;
      line-height: 1.5rem;
      border-bottom: 0.0625rem solid #d9d9d9;

      .left {
        text-align: left;
        flex: 50%;
        color: #858585;
      }

      .right {
        text-align: right;
        flex: 50%;
      }

      .add {
        color: #259b24;
      }

      .reduce {
        color: #e51c23;
      }
    }
  }
</style>
