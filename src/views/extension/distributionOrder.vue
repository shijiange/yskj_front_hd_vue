<template>
    <div id="distributionOrder">

        <c-title :hide="false" :text='mailTitle'></c-title>

        <template>
			<van-sticky offset-top="40px">
				<van-tabs v-model="selected" @click="swichTabTItem">
					<van-tab name="0" title="全部"></van-tab>
					<van-tab name="1" title="待付款"></van-tab>
					<van-tab name="2" title="已付款"></van-tab>
					<van-tab name="3" title="已完成"></van-tab>
				</van-tabs>
			</van-sticky>
            <div >
            <!-- <mt-tab-container v-model="selected" style="margin-top: 3.125rem;"> -->
                <div v-show="selected==0">
                <!-- <mt-tab-container-item id="0"> -->

                    <div class="order" v-for="(item,index) in statusData0" :key='index'>
                        <font @click="toggle($event,index)" class="or">
                            <div class="tbs" v-if="item.order">
                                <ul class="item2">
                                    <li>{{item.order.order_sn}}({{item.hierarchy}}级)</li>
                                    <li>{{item.order.create_time}}</li>
                                </ul>
                                <ul class="item3">
                                    <li>+{{item.commission}}</li>
                                    <!--分销佣金-->
                                    <li class="red">{{item.order.status_name}}</li>
                                </ul>
                            </div>
                        </font>
                        <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
                        <div class="order_detail" :class="{'opens':index==display}" v-if="open_order_detail==1 || open_order_buyer==1 || open_order_buyer_info==1">
                            <div class="team_list" v-if="open_order_buyer==1">
                                <div class="img" v-if="item.member">
                                    <img :src="item.member.avatar">
                                </div>
                                <div class="info" v-if="item.member">{{item.member.nickname}}
                                    <br>
                                    <span>微信号:{{item.member.wechat?item.member.wechat:"暂无微信号"}}</span>
                                </div>
                            </div>
                            <div class="team_goods" id="distribution-goods" v-for="(goods,i) in item.order_goods" :key='i' v-show="open_order_detail==1">
                                <div class="img">
                                    <img :src="goods.thumb">
                                </div>
                                <div class="inner">
                                    <div class="name">{{goods.title}}</div>
                                </div>
                                <div class="price">
                                    <b>{{$i18n.t('money')}}{{(goods.goods_price/goods.total)}}
                                        <br> ×{{goods.total}}</b>
                                    <div class="Total">{{$i18n.t('money')}}{{goods.goods_price}}</div>
                                </div>                                
                            </div>
                            <div class="paid_in" v-if="item.order">实付: {{$i18n.t('money')}}{{item.order.price}}</div>
                            <div class="order_list" v-if="open_order_buyer_info==1">
                              <div class="person" v-if="item.order&& item.order.address">
                                <span>收货人：{{item.order.address.realname|| '无'}}</span>
                              </div>
                              <div class="mobile"  v-if="item.order&& item.order.address">
                                <span>手机:{{item.order.address.mobile?item.order.address.mobile:"暂无手机"}}</span>
                              </div>
                            </div>
                        </div>
                    </div>
                <!-- </mt-tab-container-item> -->
                </div>
                <div v-show="selected==1">
                <!-- <mt-tab-container-item id="1"> -->
                    <div class="order" v-for="(item,index) in statusData1" :key='index'>
                        <font @click="toggle($event,index)">
                            <div class="tbs" v-if="item.order">
                                <ul class="item2">
                                    <li>{{item.order.order_sn}}({{item.hierarchy}}级)</li>
                                    <li>{{item.order.create_time}}</li>
                                </ul>
                                <ul class="item3">
                                    <li>+{{item.commission}}</li>
                                    <!--分销佣金-->
                                    <li class="red">{{item.order.status_name}}</li>
                                </ul>
                            </div>
                        </font>
                        <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
                        <div class="order_detail" :class="{'opens':index==display}" v-if="open_order_detail==1 || open_order_buyer==1 || open_order_buyer_info==1">
                            <div class="team_list" v-if="open_order_buyer==1">
                                <div class="img" v-if="item.member">
                                    <img :src="item.member.avatar">
                                </div>
                                <div class="info" v-if="item.member">{{item.member.nickname}}
                                    <br>
                                    <span>微信号:{{item.member.wechat?item.member.wechat:"暂无微信号"}}</span>
                                </div>
                            </div>
                            <div class="team_goods" id="distribution-goods" v-for="(goods,i) in item.order_goods" :key='i' v-show="open_order_detail==1">
                                <div class="img">
                                    <img :src="goods.thumb">
                                </div>
                                <div class="inner">
                                    <div class="name">{{goods.title}}</div>
                                </div>
                                <div class="price">
                                    <b>{{$i18n.t('money')}}{{(goods.goods_price/goods.total)}}
                                        <br> ×{{goods.total}}</b>
                                    <div class="Total">{{$i18n.t('money')}}{{goods.goods_price}}</div>
                                </div>
                            </div>
                            <div class="paid_in" v-if="item.order">实付: {{$i18n.t('money')}}{{item.order.price}}</div>
                            <div class="order_list" v-if="open_order_buyer_info==1">
                              <div class="person" v-if="item.order&& item.order.address">
                                <span>收货人：{{item.order.address.realname|| '无'}}</span>
                              </div>
                              <div class="mobile"  v-if="item.order&& item.order.address">
                                <span>手机:{{item.order.address.mobile?item.order.address.mobile:"暂无手机"}}</span>
                              </div>
                            </div>
                        </div>
                    </div>
                <!-- </mt-tab-container-item> -->
                </div>
                <div v-show="selected==2">
                <!-- <mt-tab-container-item id="2"> -->
                    <div class="order" v-for="(item,index) in statusData2" :key='index'>
                        <font @click="toggle($event,index)">
                            <div class="tbs" v-if="item.order">
                                <ul class="item2">
                                    <li>{{item.order.order_sn}}({{item.hierarchy}}级)</li>
                                    <li>{{item.order.create_time}}</li>
                                </ul>
                                <ul class="item3">
                                    <li>+{{item.commission}}</li>
                                    <!--分销佣金-->
                                    <li class="red">{{item.order.status_name}}</li>
                                </ul>
                            </div>
                        </font>
                        <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
                        <div class="order_detail" :class="{'opens':index==display}" v-if="open_order_detail==1 || open_order_buyer==1 || open_order_buyer_info==1">
                            <div class="team_list" v-if="open_order_buyer==1">
                                <div class="img" v-if="item.member">
                                    <img :src="item.member.avatar">
                                </div>
                                <div class="info" v-if="item.member">{{item.member.nickname}}
                                    <br>
                                    <span>微信号:{{item.member.wechat?item.member.wechat:"暂无微信号"}}</span>
                                </div>
                            </div>
                            <div class="team_goods" id="distribution-goods" v-for="(goods,i) in item.order_goods" :key='i' v-show="open_order_detail==1">
                                <div class="img">
                                    <img :src="goods.thumb">
                                </div>
                                <div class="inner">
                                    <div class="name">{{goods.title}}</div>
                                </div>
                                <div class="price">
                                    <b>{{$i18n.t('money')}}{{(goods.goods_price/goods.total)}}
                                        <br> ×{{goods.total}}</b>
                                    <div class="Total">{{$i18n.t('money')}}{{goods.goods_price}}</div>
                                </div>
                            </div>
                            <div class="paid_in" v-if="item.order">实付: {{$i18n.t('money')}}{{item.order.price}}</div>
                            <div class="order_list" v-if="open_order_buyer_info==1">
                              <div class="person" v-if="item.order&& item.order.address">
                                <span>收货人：{{item.order.address.realname|| '无'}}</span>
                              </div>
                              <div class="mobile"  v-if="item.order&& item.order.address">
                                <span>手机:{{item.order.address.mobile?item.order.address.mobile:"暂无手机"}}</span>
                              </div>
                            </div>
                        </div>
                    </div>
                <!-- </mt-tab-container-item> -->
                </div>
                <div v-show="selected==3">
                <!-- <mt-tab-container-item id="3"> -->
                    <div class="order" v-for="(item,index) in statusData3" :key='index'>
                        <font @click="toggle($event,index)">
                            <div class="tbs" v-if="item.order">
                                <ul class="item2">
                                    <li>{{item.order.order_sn}}({{item.hierarchy}}级)</li>
                                    <li>{{item.order.create_time}}</li>
                                </ul>
                                <ul class="item3">
                                    <li>+{{item.commission}}</li>
                                    <!--分销佣金-->
                                    <li class="red">{{item.order.status_name}}</li>
                                </ul>
                            </div>
                        </font>
                        <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
                        <div class="order_detail" :class="{'opens':index==display}" v-if="open_order_detail==1 || open_order_buyer==1 || open_order_buyer_info==1">
                            <div class="team_list" v-if="open_order_buyer==1">
                                <div class="img" v-if="item.member">
                                    <img :src="item.member.avatar">
                                </div>
                                <div class="info" v-if="item.member">{{item.member.nickname}}
                                    <br>
                                    <span>微信号:{{item.member.wechat?item.member.wechat:"暂无微信号"}}</span>
                                </div>
                            </div>
                            <div class="team_goods" id="distribution-goods" v-for="(goods,i) in item.order_goods" :key='i' v-show="open_order_detail==1">
                                <div class="img">
                                    <img :src="goods.thumb">
                                </div>
                                <div class="inner">
                                    <div class="name">{{goods.title}}</div>
                                </div>
                                <div class="price">
                                    <b>{{$i18n.t('money')}}{{(goods.goods_price/goods.total)}}
                                        <br> ×{{goods.total}}</b>
                                    <div class="Total">{{$i18n.t('money')}}{{goods.goods_price}}</div>
                                </div>
                            </div>
                            <div class="paid_in" v-if="item.order">实付: {{$i18n.t('money')}}{{item.order.price}}</div>
                            <div class="order_list" v-if="open_order_buyer_info==1">
                              <div class="person" v-if="item.order&& item.order.address">
                                <span>收货人：{{item.order.address.realname|| '无'}}</span>
                              </div>
                              <div class="mobile"  v-if="item.order&& item.order.address">
                                <span>手机:{{item.order.address.mobile?item.order.address.mobile:"暂无手机"}}</span>
                              </div>
                            </div>
                        </div>
                    </div>
                <!-- </mt-tab-container-item> -->
                </div>
            <!-- </mt-tab-container> -->
            </div>
        </template>

    </div>
</template>
<script>
import distributionOrder from './distributionOrder_controller';
export default distributionOrder;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#distributionOrder {
  .order {
    .tbs {
      background: #fff;
      overflow: hidden;
      display: flex;
      align-items: center;
      border-bottom: 0.0625rem solid #e2e2e2;
      line-height: 1.3rem;
      padding: 0.625rem 0.75rem;
      font-size: 14px;

      li {
        line-height: 1.5rem;
      }

      .item2 {
        flex: 2;
        text-align: left;
        color: #666;
      }

      .item3 {
        text-align: right;

        .red {
          color: #f15353;
        }

        p {
          margin: 0;
          color: #222;
        }
      }
    }

    .order_detail.opens {
      display: block;
    }

    .order_detail {
      display: none;
      overflow: hidden;
      margin-bottom: 0.375rem;

      .team_list {
        background-color: #fff;
        padding: 0.625rem 0.75rem;
        overflow: hidden;

        .img {
          width: 14%;
          float: left;
          text-align: left;
          height: 0;
          padding-bottom: 14%;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            position: absolute;
          }
        }

        .info {
          height: 2.5rem;
          width: 80%;
          float: left;
          font-size: 14px;
          color: #222;
          line-height: 1.429rem;
          text-align: left;
          padding: 0 0.625rem;

          span {
            color: #666;
          }
        }
      }
    }
  }

  #distribution-goods {
    background-color: #fff;
    display: flex;
    align-items: stretch;
    flex-flow: row wrap;
    padding: 0.625rem 0.75rem;
    border-top: 1px solid #e2e2e2;

    .img {
      flex: 1;

      img {
        width: 100%;
      }
    }

    .inner {
      flex: 5;
      padding: 0 0.625rem;
      display: flex;
      align-items: flex-start;
    }

    .name {
      flex: 5;
      text-align: justify;
    }

    .price {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      b {
        flex: 3;
        text-align: right;
        color: #666;
        font-size: 12px;
        font-weight: normal;
      }

      .evaluate-yet {
        margin: 0;
        color: #888;
        float: right;
        line-height: 1.6rem;
      }
    }
  }

  .paid_in {
    background: #fff;
    padding: 0 0.75rem;
    text-align: right;
  }

  .order_list {
    display: flex;
    background: #fff;
    padding: 0.625rem 0.75rem;

    div {
      flex: 1;
    }

    .person {
      text-align: left;
    }

    .mobile {
      text-align: right;
    }
  }
}
</style>
