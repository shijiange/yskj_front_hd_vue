<template>
    <div id="hotel_order_list">
        <c-title :hide="false" text='订单列表' ></c-title>
        <div id="content">
            <div class="content_a">
                <van-tabs>
                    <van-tab title="全部">
                        <div class="orderList">
                            <div class="shop">
                                <div class="title">
                                    <!-- <van-checkbox checked-color="#f15353" shape="square"></van-checkbox> -->
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <!-- <van-checkbox checked-color="#f15353" shape="square"></van-checkbox> -->
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <!-- <van-checkbox checked-color="#f15353" shape="square"></van-checkbox> -->
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="待付款">
                        <div class="orderList">
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="待确认">
                        <div class="orderList">
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="待入住">
                        <div class="orderList">
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="待退房">
                        <div class="orderList">
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="已完成">
                        <div class="orderList">
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                            <div class="shop">
                                <div class="title">
                                    <van-checkbox checked-color="#f15353" shape="square"></van-checkbox>
                                    <h4>订单号：SN20190354165PW</h4>
                                    <span>待付款</span>
                                </div>
                                <div class="goods">
                                    <div class="img">
                                        <img src="">
                                    </div>
                                    <ul class="goods_info">
                                        <li class="info_a">
                                            <span>逸林客房</span>
                                            <span>{{$i18n.t('money')}}773.00</span>
                                        </li>
                                        <li class="info_b">
                                            <span>规格：行政客房</span>
                                            <span>1晚/间</span>
                                        </li>
                                    </ul>
                                </div>
                                <p class="total">共2件商品实付：<span>{{$i18n.t('money')}}1000.00</span></p>
                                <div class="allbt">
                                    <button type="button">支付</button>
                                    <button type="button">取消订单</button>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
            <div class="close">
                <button type="button">合并支付</button>
            </div>
        </div>
    </div>
</template>


<script>
import controller from './order_list_controller';
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#hotel_order_list {
  padding-bottom: 50px;

  #content {
    .content_a {
      .orderList {
        .shop {
          background: #fff;
          margin-top: 0.625rem;
          border-top: solid 0.0625rem #ebebeb;
          border-bottom: solid 0.0625rem #ebebeb;

          .title {
            padding: 0 0.875rem;
            display: flex;
            align-items: center;

            h4 {
              font-weight: normal;
              font-size: 14px;
              line-height: 2.25rem;
              text-align: left;
              width: 60%;
            }

            span {
              flex: 2;
              color: #f15353;
              text-align: right;
              font-size: 14px;
            }
          }

          .goods {
            display: flex;
            padding: 0.625rem 0.875rem;

            .img {
              width: 4rem;
              height: 4rem;
              background: #ccc;
              overflow: hidden;
              margin-right: 0.625rem;

              img {
                width: 100%;
              }
            }

            .goods_info {
              width: 17.0625rem;

              li {
                display: flex;
                justify-content: space-between;
              }

              .info_a {
                font-size: 15px;
                line-height: 1.5rem;
              }

              .info_b {
                margin-top: 0.625rem;
                font-size: 12px;
                color: #8c8c8c;
              }
            }
          }

          .total {
            padding: 0 0.875rem;
            line-height: 2.25rem;
            text-align: right;
            font-size: 14px;

            span {
              font-size: 16px;
              font-weight: bold;
            }
          }

          .allbt {
            border-top: solid 0.0625rem #ebebeb;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 2.5rem;
            padding-right: 0.875rem;

            button {
              border-radius: 0.1875rem;
              border: solid 0.0625rem #666;
              margin-left: 0.625rem;
              padding: 0.25rem 0.625rem;
              text-align: center;
              font-size: 12px;
            }
          }
        }
      }
    }

    .close {
      position: fixed;
      width: 100%;
      bottom: 0;
      background: #fff;
      height: 3.125rem;
      line-height: 3.125rem;
      text-align: right;
      padding: 0 0.875rem;
      border-top: solid 0.0625rem #ebebeb;

      button {
        background: #f15353;
        color: #fff;
        font-size: 15px;
        border-radius: 0.1875rem;
        padding: 0.25rem 0.625rem;
        margin-left: 0.625rem;
        border: none;
      }
    }
  }
}
</style>
