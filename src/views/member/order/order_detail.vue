<template>
  <div>
    <c-title :hide="false" text="订单详情"></c-title>
    <div v-if="orderType != 'ysSystem'" id="goodsinfo" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div class="addr" :class="jurisdiction_set == 1 ? 'addr1' : ''" style="display:block;">
        <div style="display: flex;">
          <i class="iconfont icon-dingwei"></i>
          <ul class="addr-info">
            <template v-if="orderType == 'DeliveryReplenish' && !this.fun.isTextEmpty(this.service_station)">
              <li style="margin-bottom: 0.5rem; font-size: 16px;">服务站：{{ service_station.service_name }} （{{ service_station.mobile }}）</li>
              <li style="color: #999;">
                {{ service_station.full_address }}
              </li>
              <div style="border-bottom: 1px solid #ebebeb; height: 0.5rem;"></div>
            </template>
            <template v-if="order_data.dispatch_type_id == 8 && !this.fun.isTextEmpty(order_data.package_deliver)">
              <li style="margin-bottom: 0.5rem; font-size: 14px;">提货人：{{ receiver }} {{ mobile }}</li>
              <li style="margin-bottom: 0.5rem; font-size: 14px;">提货点：{{ package_deliver.deliver_name }} {{ package_deliver.deliver_mobile }}</li>
              <li style="color: #333;">
                {{ package_deliver.full_address }}
              </li>
              <div class="map-navigation" v-if="!fun.isTextEmpty(package_deliver.lng) && !fun.isTextEmpty(package_deliver.lat)">
                <i @click.stop="goToAdress" class="iconfont icon-all_daohang"></i>
              </div>
            </template>
            <template v-if="order_data.dispatch_type_id == 8 && this.fun.isTextEmpty(order_data.package_deliver)">
              <li style="margin-bottom: 0.5rem; font-size: 14px;">
                获取收货信息出错了，请联系客服！
              </li>
            </template>
            <template v-if="order_data.dispatch_type_id == 11 && order_data.city_delivery">
              <div style="margin-bottom: 0.3rem; font-size: 14px;" v-if="order_data.city_delivery.is_expect == 1">
                送达时间：{{ order_data.city_delivery.expect_start_time }} - {{ order_data.city_delivery.expect_end_time }}
              </div>
              <div style="margin-bottom: 0.3rem; font-size: 14px;" v-if="order_data.city_delivery.community_name">送达社区：{{ order_data.city_delivery.community_name }}</div>
            </template>
            <template v-if="order_data.dispatch_type_id == 15 && !this.fun.isTextEmpty(order_data.package_delivery)">
              <li style="margin-bottom: 0.5rem; font-size: 14px;">提货人：{{ package_deliver.buyer_name }} {{ package_deliver.buyer_mobile }}</li>
              <li style="margin-bottom: 0.5rem; font-size: 14px;">提货点：{{ receiver }} {{ mobile }}</li>
              <li style="color: #333;">
                {{ address }}
              </li>
              <div class="map-navigation" v-if="!fun.isTextEmpty(package_deliver.lng) && !fun.isTextEmpty(package_deliver.lat)">
                <i @click.stop="goToAdress" class="iconfont icon-all_daohang"></i>
              </div>
            </template>
            <template v-if="order_data.dispatch_type_id != 8 && order_data.dispatch_type_id != 15">
              <!-- 供应商订单是否显示会员信息，为1不显示 -->
              <div v-if="jurisdiction_set != 1">
                <li v-if="!receiver && !address">无需收货地址 如信息出错请联系客服！</li>
                <li style="margin-bottom: 0.5rem; font-size: 16px;" v-if="receiver">收件人：{{ receiver }} （{{ mobile }}）</li>
                <li style="color: #999;" v-if="order_data.plugin_id == 130">预约时间：{{ order_data.reserve_simple.begin_time }}</li>
                <li style="color: #999;">
                  <span v-if="orderType == 'hotel'" style="margin-right: 0.3125rem;"> {{ hotel_name | escapeTitle }} </span>{{ address }}
                </li>
              </div>
            </template>
          </ul>
        </div>
        <div v-if="address!=''" class="operation-style">
          <div class="copy-box">
            <div @click="clickPhone(mobile)" class="contact-recipient" v-if="mobile">
              <a :href="'tel:'+ mobile" ref="telPhone"></a>
              <i class="iconfont icon-fontclass-rengezhongxin"></i>
              <span>联系收件人</span>
            </div>
            <div class="copy-address" v-clipboard:copy="receiver + ' '+ mobile + ' ' + address" v-clipboard:success="copySuccess" v-clipboard:error="copyError">
              <i class="iconfont icon-service_n"></i>
              <span>复制地址</span>
            </div>
          </div>
        </div>
      </div>
      <div class="addr" style="justify-content: space-between;" v-if="aggregation_cps_recharge_bill">
        <p>充值号码</p>
        <p style="color: #ff2424;">{{ aggregation_cps_recharge_bill }}</p>
      </div>
      <template v-if="order_data.camilo_resources_coupon_type == 1 && order_data.plugin_id != 130 && order_data.camilo_resources_recharge_number">
        <!--plugin_id130是分支预约商品-->
        <!-- 直冲订单 -->
        <div class="addr" style="justify-content: space-between;flex-wrap: wrap;">
          <p>充值账号</p>
          <p class="addrTxt">{{ order_data.camilo_resources_recharge_number }}</p>
        </div>
      </template>
      <div class="addr" style="justify-content: space-between;" v-if="phone_bill.mobile">
        <p>充值手机号</p>
        <p style="color: #ff2424;">{{ phone_bill.mobile }}</p>
      </div>
      <div class="addr" style="justify-content: space-between;" v-if="electricity_bill_pro">
        <p>充值户号</p>
        <p class="addrTxt" v-if="electricity_bill_pro.has_one_account">{{ electricity_bill_pro.has_one_account.account_number }}</p>
      </div>

      <!-- 油卡充值 -->
      <template v-if="oil_recharge">
        <div class="addr" style="flex-direction:column;" v-if="oil_recharge.account">
          <div style="display:flex;">
            <p>充值油卡号</p>
            <p style="padding-left:8px;">{{ oil_recharge.account }}</p>
          </div>
          <div style="display:flex;margin-top:0.5rem;">
            <p>充值手机号</p>
            <p style="padding-left:8px;">{{ oil_recharge.mobile }}</p>
          </div>
        </div>
      </template>

        <!--商品表单  用于跨境商品报税使用 没有认证-->
        <realname-auth class="cert" ref="realnameAuth" v-if="order_data.overseas" :order_id="order_data.id"  @postMsg="postMsg"/>

      <div class="goods-box">
        <div
          class="shop-box"
          @click="toStore(order_data)"
          v-if="
              order_data.shop_name &&
                (order_data.plugin_id == 0 || order_data.plugin_id == 92 || order_data.plugin_id == 31 || order_data.plugin_id == 32 || order_data.plugin_id == 44 || order_data.plugin_id == 54 || order_data.plugin_id == 108)
            "
        >
          <div class="shop-box-left">
            <i class="iconfont icon-fontclass-dianpu"></i>
            <p>{{ order_data.overseas ? (order_data.overseas_shop ? order_data.overseas_shop.name : '海外购') : order_data.shop_name }}</p>
          </div>
          <i class="iconfont icon-advertise-next"></i>
        </div>
        <div class="goods" v-for="(good, i) in order_data.has_many_order_goods" v-if="good.is_gift<=0" :key="i" @click="toGoodsDetail(good, order_data.is_virtual, good.is_course)">
          <div class="img">
            <img :src="good.thumb" />
            <div class="dfStyle" v-if="good.diyform_data" @click.stop="lookDFData(good.diyform_data)">查看表单</div>
          </div>

          <ul class="inner">
            <li class="name" v-if="!order_data.deposit_ladder">{{ good.title | escapeTitle }}</li>
            <li class="name" v-if="order_data.overseas">
              <!-- 添加海外标签 -->
                <overseastag :visible="order_data.overseas" class="details"/>
            </li>
            <li class="name" v-if="order_data.deposit_ladder"><!--判断定金活动尾款-->{{ order_data.deposit_ladder.activity_name | escapeTitle }}</li>
            <div class="option">
              <p v-show="order_data.is_virtual == 0 && good.goods_option_title">规格: {{ good.goods_option_title }}</p>
              <div class="num" v-if="!(orderType == 'hotel')">×{{ good.total }}</div>
              <div class="num" v-if="orderType == 'hotel'">{{ night_day }}晚{{ order_data.goods_total }}间</div>
            </div>
          </ul>
          <ul class="price">
            <div style="text-align: left; color: rgb(232, 78, 64);" v-if="reserveDate">预约日期：{{ reserveDate }}</div>
            <li class="money">
              <span class="deposit-tips" v-if="order_data.plugin_id == 108"><!--判断定金活动-->定金</span>
              <span class="deposit-tips" v-if="order_data.deposit_ladder"><!--判断定金活动尾款-->尾款</span>
              <small>{{ $i18n.t("money") }}</small>
              {{ good.price }}
              <div class="vipPirce" v-if="vip_show">
                会员价:
                <small>{{ $i18n.t("money") }}</small>
                {{ good.vip_price }}
              </div>
            </li>
            <li class="money" v-if="order_data.plugin_id == 40">
              <span>押金:</span><small>{{ $i18n.t("money") }}</small>
              {{ good.lease_toy_goods.deposit }}
            </li>
            <div class="give_integral_wrapper" v-if="good.points">
              <div class="give_integral_text">送</div>
              <div class="give_integral_num">{{ good.points }}{{ integral }}</div>
            </div>
          </ul>

          <div class="comment-box">
            <div v-for="(btn, index) in good.buttons" :key="index" :class="btn.value == 2 ? 'view-comment-btn' : 'comment-btn'" @click.stop="evaluateOpration(btn, good, order_data)">
              {{ btn.name }}
            </div>
          </div>
          <div style="clear: both;"></div>
        </div>
        <gift v-for="(goods, i) in order_data.has_many_order_goods" from="orderList" v-if="goods.is_gift" :key="i+'_gift'" :goods_id="goods.goods_id"  :goods_title="goods.title" :goods_thumb="goods.thumb" :price="goods.goods_price" :total="goods.total" :labels="[goods.marketing_order_goods.gift_type == 4 ? '换购' : '赠品']"></gift>
      </div>

      <div class="tbs">
        <div class="tbs-number-tra">
          <ul class="number">
            <li class="left">订单编号:</li>
            <li class="right">{{ order_data.order_sn }}</li>
          </ul>
          <ul class="tra" v-if="order_data.plugin_id == 40">
            <li class="left">租期:</li>
            <li class="right">{{ order_data.lease_toy.return_days }}天</li>
          </ul>
          <ul class="tra" v-if="order_data.plugin_id == 40">
            <li class="left">租赁到期日期:</li>
            <li class="right">{{ order_data.lease_toy.end_time }}</li>
          </ul>
          <ul class="tra">
            <li class="left">交易状态:</li>
            <li class="right" v-if="order_data.plugin_id == 130">{{ order_data.status == 2 ? "待核销" : order_data.status_name }}</li>
            <li class="right" v-else>{{ phone_bill.status ? phone_bill.phone_bill_state_name : order_data.status_name }}</li>
          </ul>
          <ul class="tra" v-if="order_data.note">
            <li class="left">买家留言:</li>
            <li class="right">{{ order_data.note }}</li>
          </ul>
          <ul class="tra" v-if="order_data.plugin_id == 40">
            <li class="left">租金总金额:</li>
            <!-- <li class="right">{{$i18n.t('money')}}{{order_data.goods_price*order_data.lease_toy.return_days}}</li> -->
            <li class="right">{{ $i18n.t("money") }}{{ order_data.order_goods_price }}</li>
          </ul>
        </div>
        <div class="tbs-number-tra" v-if="orderType == 'hotel'">
          <ul class="number">
            <li class="left">入住日期:</li>
            <li class="right">{{ hotel_start }}</li>
          </ul>
          <ul class="number">
            <li class="left">离店日期:</li>
            <li class="right">{{ hotel_end }}</li>
          </ul>
          <ul class="number">
            <li class="left">天数:</li>
            <li class="right">{{ night_day }}天</li>
          </ul>
          <ul class="number">
            <li class="left">房间数量:</li>
            <li class="right">{{ order_data.goods_total }}间</li>
          </ul>
        </div>
        <template v-if="order_data.cashier_order">
          <div class="info">
            <ul class="time">
              <li class="left">下单时间:</li>
              <li class="right">{{ order_data.cashier_order.created_at }}</li>
            </ul>
            <ul class="name">
              <li class="left">姓名:</li>
              <li class="right">{{ order_data.cashier_order.realname }}</li>
            </ul>
            <ul class="member">
              <li class="left">电话:</li>
              <li class="right">{{ order_data.cashier_order.mobile }}</li>
            </ul>
          </div>
        </template>

        <template v-if="order_data.pay_type_name">
          <ul class="Pay-method">
            <li class="left">支付方式:</li>
            <li class="right" style="color: #f15353;">{{ order_data.pay_type_name }}</li>
          </ul>
        </template>
        <div id="discount">
          <template v-for="(info, ind) in order_data.order_discount">
            <ul class="Discount" :key="ind" v-if="!info.no_show">
              <li class="left">{{ info.name }}:</li>
              <li class="right">-{{ $i18n.t("money") }}{{ info.amount }}</li>
            </ul>
          </template>
          <template v-for="(item, index) in order_data.order_fees">
            <ul class="Discount" :key="index">
              <li class="left">{{ item.name }}:</li>
              <li class="right">-{{ $i18n.t("money") }}{{ item.amount }}</li>
            </ul>
          </template>
          <template v-for="(item, index) in order_data.order_deduction">
            <ul class="Discount" :key="'order_deduction'+index">
              <li class="left">{{ item.name }}抵扣:</li>
              <li class="right">-{{ $i18n.t("money") }}{{ item.amount }}</li>
            </ul>
          </template>
        </div>

        <template v-if="order_data.dispatch_price">
          <ul class="Fre">
            <li class="left">{{ order_data.dispatch_type_id == 11 ? "配送费" : "运费" }}</li>
            <li class="right">{{ $i18n.t("money") }}{{ order_data.original_dispatch_price }}</li>
          </ul>
        </template>
        <ul class="Sub">
          <li class="left">商品小计:</li>
          <li class="right" v-if="!(order_data.plugin_id == 40)">{{ $i18n.t("money") }}{{ order_data.order_goods_price }}</li>
          <li class="right" v-if="order_data.plugin_id == 40">{{ $i18n.t("money") }}{{ order_data.order_goods_price }}</li>
        </ul>
        <ul class="Sub" v-if="order_data.plugin_id == 40">
          <li class="left">押金:</li>
          <li class="right">{{ $i18n.t("money") }}{{ order_data.lease_toy.deposit_total }}</li>
        </ul>
        <ul class="Real-pay">
          <li class="left" v-if="!(order_data.plugin_id == 40)">
            实付款:
          </li>
          <li class="left" v-if="order_data.plugin_id == 40">合计:（押金{{ $i18n.t("money") }}{{ order_data.lease_toy.deposit_total }}可退）:</li>
          <li class="right" style="margin-left: 5px;">
            <small>{{ $i18n.t("money") }}</small>
            {{ order_data.price }}
          </li>
        </ul>

        <ul class="photoGoods" v-if="!fun.isTextEmpty(order_data.photo_order_thumbs)" @click="showPhotoGoodsArr = true">
          <li v-for="(item, index) in order_data.photo_order_thumbs" :key="index">
            <img :src="item" />
          </li>
        </ul>
        <div class="order_times">
          <ul class="Sub">
            <li class="left">创建时间:</li>
            <li class="right">{{ order_data.create_time }}</li>
          </ul>
          <ul class="Sub" v-if="order_data.status >= 1">
            <li class="left">付款时间:</li>
            <li class="right">{{ order_data.pay_time }}</li>
          </ul>
          <!--话费慢充-->
          <ul class="Sub" v-if="phone_bill.has_one_pre_order && phone_bill.has_one_pre_order.created_at">
            <li class="left">提交时间:</li>
            <li class="right">{{ phone_bill.has_one_pre_order.created_at }}</li>
          </ul>
          <!--话费慢充end-->
          <ul class="Sub" v-if="order_data.status >= 2">
            <li class="left">发货时间:</li>
            <li class="right">{{ order_data.send_time }}</li>
          </ul>
          <ul class="Sub" v-if="order_data.status >= 3">
            <li class="left">完成时间:</li>
            <li class="right">{{ order_data.finish_time }}</li>
          </ul>
          <!--话费慢充-->
          <ul class="Sub" v-if="phone_bill.has_one_pre_order && phone_bill.has_one_pre_order.has_one_call_back && phone_bill.has_one_pre_order.created_at">
            <li class="left">状态通知时间:</li>
            <li class="right">{{ phone_bill.has_one_pre_order.has_one_call_back.created_at }}</li>
          </ul>
          <ul class="Sub" v-if="(phone_bill.status == 4 || phone_bill.status == 5) && phone_bill.has_one_pre_order">
            <li class="left">交易错误:</li>
            <li class="right" style="color: #f15353;">{{ phone_bill.has_one_pre_order.return_msg }}</li>
          </ul>
          <!--话费慢充end-->
        </div>
        <div class="kefu" v-if="order_data.has_many_order_goods && order_data.has_many_order_goods.length > 0" @click="getKefu"><i class="iconfont icon-kefu"></i><span>联系客服</span></div>
      </div>

      <!-- 自定义信息 -->
      <div style="margin: -2.5rem 0.625rem 3.5rem 0.625rem;">
        <customMessage :listMap="customForm"></customMessage>
      </div>

      <div style="height: 3rem;"></div>

      <div class="detail_pay">
        <!--卡券信息不能再更多里显示  前端判断 卡券类型为2  待收货 和已完成才显示-->
        <div
          class="order_delete red-button"
          v-if="(order_data.status == 2 || order_data.status == 3) && order_data.camilo_resources_coupon_type == 2"
          @click.stop="operation({ value: 140 }, order_data)"
        >
          卡券信息
        </div>
        <template v-for="(item, index) in order_data.button_models">
          <!--只有一个的情况-->
          <div v-if="index < 1" :key="index" class="order_delete" :class="[!item.api ? 'noClickBG' : '', [1,'overseas'].includes(item.value) ? 'red-button' : '']" @click="operation(item, order_data)">
            {{ item.name }}
          </div>
          <!--只有两个的情况-->
          <div
            v-if="index == 1 && order_data.button_models.length == 2"
            :key="index"
            class="order_delete"
            :class="[!item.api ? 'noClickBG' : '', item.value == 1 ? 'red-button' : '']"
            @click="operation(item, order_data)"
          >
            {{ item.name }}
          </div>
          <!--两个以上的情况-->
          <div :key="index" v-if="index == 1 && order_data.button_models.length > 2" class="order_delete red-button" @click.stop="showMore(order_data.order_sn)">
            更多
          </div>
          <div class="trans" :key="index" v-if="index == 1 && showID == order_data.order_sn"></div>
          <div class="more-button" :key="index" v-if="index == 1 && showID == order_data.order_sn">
            <p v-for="(item, ind) in order_data.button_models" :key="ind" v-if="ind >= 1" @click="operation(item, order_data)" :class="[!item.api ? 'noClickBG' : '']">
              {{ item.name }}
            </p>
          </div>
        </template>
      </div>

      <div class="qrcode">
        <van-popup v-model="showQrcode" position="center" modal="true">
          <img :src="qrcode" style="width: 100%;" />
          <div style="height: 1.875rem;">请核销员扫码</div>
        </van-popup>
      </div>

      <van-popup v-model="showKefu" position="center" round>
        <div class="pop-content">
          <div class="pop-top">
            <div class="left" v-if="!fun.isTextEmpty(cservice)">
              <div class="wrap">
                <a :href="cservice">
                  <div class="image"><img src="../../../assets/images/kf_online_contect@2x.png" /></div>
                </a>
                <div>在线联系</div>
              </div>
            </div>
            <div style="display: flex; align-items: center;" v-if="!fun.isTextEmpty(cservice) && !fun.isTextEmpty(service_mobile)">
              <div class="line"></div>
            </div>
            <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
              <div class="wrap">
                <div class="image">
                  <a :href="`tel:${service_mobile}`"><img src="../../../assets/images/kf_tel_contect@2x.png"/></a>
                </div>
                <div style="margin-top: 0.5rem;">{{ service_mobile }}</div>
              </div>
            </div>
          </div>
          <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
            <div class="image">
              <img :src="service_QRcode" style="width: 100%; height: 100%;" />
            </div>
          </div>
          <i class="iconfont icon-close11" @click="showKefu = false"></i>
        </div>
      </van-popup>

      <van-dialog v-model="dialogVisible" :showConfirmButton="false" class="logistics-pop">
        <div class="title">确认发货</div>
        <section style="width: 100%; text-align: left;overflow: auto;">
          <div class="addressee" v-if="addresseeInfo && jurisdiction_set != 1">
            <div class="row-title">
              收件人信息:
            </div>
            <div class="user-info">
              <div>
                <span>{{ addresseeInfo.realname }}</span>
                <span>({{ addresseeInfo.mobile }})</span>
              </div>
              <div style="margin-bottom: 10px;">{{ addresseeInfo.address }}</div>
            </div>
          </div>
          <div style="display: flex;width: 100%; height: 45px; line-height: 45px;">
            <div class="row-title" style="width: 28%; height: 45px;">快递公司:</div>
            <div style="height: 45px; width: 60%;" class="logistics-company">
              <van-button plain type="primary" @click="seleRegional">
                {{ regional }}
              </van-button>
            </div>
          </div>
          <div style="display: flex;width: 100%; height: 45px; line-height: 45px;" class="logistics-num">
            <div class="row-title" style="width: 28%; height: 45px;">快递单号:</div>
            <div style="height: 45px; width: 60%;text-align:right;">
              <van-cell-group>
                <van-field v-model="numberName" placeholder="请输入快递单号" />
              </van-cell-group>
            </div>
          </div>
        </section>
        <div class="foot">
          <van-button type="default" style="width: 50%;" @click="sendCancel">取 消 </van-button>
          <van-button type="primary" style="width: 50%;" @click="sendGoogs">确 定 </van-button>
        </div>
      </van-dialog>

      <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
        <van-picker :columns="columns" @cancel="onCancelbtn" @confirm="onConfirmbtn" show-toolbar />
      </van-popup>

      <van-popup v-model="showDFData" position="bottom" closeable round :overlay="true" :style="{ height: '80%' }" style="padding-top: 3.25rem;">
        <!-- <c-dyPopup :datas="dfData" v-if="showDFData" :status="false"></c-dyPopup> -->
        <diyfrom v-if="dfData" :modeType="'Single'" :singleStatus="false" :singleDatas="dfData" :desThumb="false" :memberBtn="false"> </diyfrom>
      </van-popup>

      <van-image-preview v-model="showPhotoGoodsArr" :images="PhotoGoodsArr" @change="onChangePhotoGoods"></van-image-preview>

      <van-dialog v-model="showBarter" title="易货兑换" show-cancel-button class="barter_dialog" @confirm="confirmBarter" @cancel="cancelBarter">
        <div class="barter_dialog_1">是否确认易货兑换</div>
        <div class="barter_dialog_2">该商品可兑换易货值为{{ showBarter_value }}</div>
      </van-dialog>

      <!--消费红包-->
      <van-overlay :show="showPacket" @click="showPacket = false">
        <div class="wrapper">
          <div class="block" @click.stop>
            <img @click="toPacket" src="../../../assets/images/consume_packet.png" />
          </div>
        </div>
      </van-overlay>

      <div class="fixed-box" v-show="!showPacket && hasPacket" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <img @click="showPacket = true" class="rotate" :class="[{ r1: shrinkPacket }, { r2: !shrinkPacket }]" src="../../../assets/images/consume_packet.png" />
      </div>
      <!--消费红包end-->

      <!-- 盲盒 -->
      <van-overlay :show="blindBoxInfo.show" z-index="99">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <transition name="van-fade">
            <div class="blindBoxInfo" v-if="blindBoxInfo.show">
              <div class="multipleWrapper">
                <div class="desc">盲盒商品</div>
                <div class="goodsWrapper" @touchmove.stop>
                  <router-link
                    :to="
                      fun.getUrl(detailUrl == 'HotelOrderDetail' ? 'HotelOrderDetail' : detailUrl, {
                        order_id: item.id,
                        orderType: orderType
                      })
                    "
                    v-for="item in blindBoxInfo.goods"
                    :key="item.id"
                  >
                    <div class="goodsItem">
                      <div class="goodInfo">
                        <div class="c1">{{ item.order_sn }}</div>
                        <div class="c2">{{ item.status_name }}</div>
                      </div>
                      <div class="goodContent" v-for="item1 in item.has_many_order_goods" :key="item1.id">
                        <div class="goods_img">
                          <img :src="item1.thumb" alt="" />
                        </div>
                        <div class="content">
                          <div class="name">{{ item1.title }}</div>
                          <div class="price">{{ item1.goods_option_title }}</div>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>

              <div class="close">
                <i class="iconfont icon-adsystem_icon_cancle" @click="blindBoxInfo.show = false"></i>
              </div>
            </div>
          </transition>
        </div>
      </van-overlay>

      <van-popup v-model="refundShow" position="bottom" round closeable :style="{ height: '50%' }">
        <div class="refundShow-box">
          <div class="popup-title">关闭原因</div>
          <div class="popup-context">{{ refundText }}</div>
        </div>
      </van-popup>
    </div>

    <!-- 线下订单-详情页 -->
    <offline-order-detail v-if="orderType == 'ysSystem'" :order_data="order_data"></offline-order-detail>
    <van-dialog v-model="custom_receipt_confirmation_show" :title="custom_receipt_confirmation_btn.name" show-cancel-button @confirm="CustomReceiptConfirmationSend">
      <div v-html="custom_receipt_confirmation_html" class="custom_receipt_confirmation_html"></div>
    </van-dialog>

    <van-dialog v-model="inventoryApplyPopup" class="inventory-apply-popup" title="请选择" show-cancel-button @confirm="confirmInventoryApply">
      <van-radio-group v-model="inventoryApplyRadio">
        <van-radio :name="item.id" v-for="item in inventoryApplyList" :key="item.id" checked-color="#ee0a24">{{ item.name }}</van-radio>
      </van-radio-group>
    </van-dialog>
  </div>
</template>
<script>
import order_detailcontroller from "./order_detailcontroller";

export default order_detailcontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.shop-box {
  display: flex;
  padding: 0.3rem 0.6rem;
  line-height: 28px;

  .shop-box-left {
    display: flex;
    width: 90%;

    p {
      font-size: 16px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .icon-fontclass-dianpu {
    font-size: 26px;
    color: #f15353;
  }

  .icon-advertise-next {
    font-size: 26px;
    color: #bdbdbd;
    flex: 0 0 30px;
  }
}

.qrcode {
  width: 100%;
  margin: 0 auto;
}

#goodsinfo .van-dialog {
  width: 90%;
  padding: 1rem;
  height: 22rem;
  max-width: 350px;

  .van-dialog__content {
    section {
      height: 15rem;
    }

    .title {
      padding-bottom: 1.5rem;
      font-weight: bold;
    }
  }
}

#goodsinfo {
  min-height: 110vh;

  .addr {
    text-align: left;
    padding: 0.75rem;
    margin: 0.625rem;
    background: #fff;
    border-bottom: #ebebeb 0.0625rem solid;
    border-radius: 10px;
    display: flex;
    position: relative;
    .addrTxt {
      color: #ff2424;
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    i {
      font-size: 1rem;
      color: #333;
      margin-right: 0.625rem;
      margin-top: 0.0625rem;
      justify-content: center;
      align-self: center;
    }

    p {
      text-align: left;

      span {
        color: #858585;
        font-size: 12px;
      }
    }

    .addr-info {
      font-size: 14px;
    }

    .clearfix {
      clear: both;
    }

    .map-navigation {
      position: absolute;
      right: 1rem;
      top: 2rem;

      .icon-all_daohang {
        font-size: 1.875rem;
        color: #f14e4e;
        margin: 0;
      }
    }

    .operation-style{
      display:flex;
      .copy-box{
        margin-top: .75rem;
        display: flex;
        justify-content: space-around;
        width: 100%;
        font-size: .85rem;

        >div{
          display: flex;
          justify-content: center;
          align-items: center;
          width:6rem;
          height:2rem;
          border-radius: 1rem;
        }
        .contact-recipient{
          background-color: #FF5F5F;
          color: #fff;
          a{display: none;}
          i{margin-right:2px;color:#fff;}
        }

        .copy-address{
          background-color: #fff;
          color: #FF5F5F;
          border: 1px solid #FF5F5F;
          i{margin-right:2px;color:#FF5F5F;}
        }
      }
    }
  }
  .cert{
    padding: 0.75rem;
    margin: 0.625rem;
    background: #fff;
    border-bottom: #ebebeb 0.0625rem solid;
    border-radius: 10px;
  }
  .goods-box {
    background-color: #fff;
    margin: 0.625rem;
    padding-bottom: 0.625rem;
    border-radius: 10px;
  }

  .goods {
    .img {
      padding: 0.625rem 1rem;
      width: 30%;
      float: left;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        display: inline-block;
      }

      .dfStyle {
        position: absolute;
        left: 1rem;
        bottom: 0;
        display: inline-block;
        background: #f15353;
        height: 1.5rem;
        line-height: 1.5rem;
        color: #fff;
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
        overflow: hidden;
        font-size: 12px;
        padding: 0 0.5rem;
      }
    }

    .inner {
      width: 69%;
      float: left;
      padding: 0.625rem 0 0 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .name {
      text-align: left;
      margin-bottom: 0.625rem;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .money {
      margin-bottom: 0.625rem;
      font-size: 14px;
    }

    small {
      font-size: 12px;
    }

    .price {
      padding: 0.625rem;
      align-items: center;
      text-align: right;
    }

    .option {
      color: #888;
      font-size: 12px;
      flex: 1;
      display: flex;
      line-height: 14px;
    }

    .num {
      font-size: 14px;
      color: #333;
    }

    .comment-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      .view-comment-btn {
        color: #565656;
        border-radius: 15px;
        padding: 0.25rem 0.625rem;
        border: 0.0625rem solid #9f9c9c;
      }
      .comment-btn {
        color: #f15353;
        margin-left: 0.625rem;
        border-radius: 15px;
        padding: 0.25rem 1.25rem;
        border: 0.0625rem solid #f15353;
      }
    }
  }

  .detail_good {
    background: #fff;

    .content {
      text-align: left;
      background: #efeded;
      padding: 0.625rem;
      color: #8c6700;
    }

    a {
      color: #000;
    }

    h3 {
      text-align: left;
      margin: 0.5625rem 0;

      i {
        font-size: 1.25rem;
        padding-right: 0.3125rem;
      }
    }
  }

  .tbs {
    font-size: 14px;
    margin: 0.625rem 0.625rem 3.5rem 0.625rem;
    background-color: #fff;
    border-radius: 10px;

    .left {
      flex: 2;
      text-align: left;
    }

    .right {
      flex: 3;
      text-align: right;
    }

    .tbs-number-tra {
      background-color: #fff;
      width: 100%;
      padding: 0.625rem 0.875rem;
      margin-top: 0.625rem;
      border-radius: 10px;

      li {
        line-height: 1.875rem;
      }
    }

    .Sub {
      width: 100%;
      display: flex;
      justify-content: space-between;
      line-height: 1.875rem;
      padding: 0 0.875rem 0.625rem 0.875rem;
      background-color: #fff;
    }

    .Real-pay {
      background-color: #fff;
      display: flex;
      justify-content: flex-end;
      line-height: 2.25rem;
      padding: 0 0.875rem;
      border-top: solid 0.0625rem #ebebeb;
      font-size: 16px;

      .left {
        color: #333;
        text-align: right;
      }

      .right {
        color: #f15353;
        font-size: 18px;
        flex: 0;
        display: flex;
      }

      small {
        font-size: 12px;
      }
    }

    .photoGoods {
      display: flex;
      flex-wrap: wrap;
      margin-top: 1rem;
      padding: 1rem;
      background: #fff;

      li {
        width: 4.25rem;
        height: 4.25rem;
        margin-right: 0.5rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .Fre {
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      padding: 0 0.875rem;
      line-height: 1.875rem;
    }

    #discount {
      margin-top: 0.625rem;
      padding-top: 0.625rem;
      background-color: #fff;
    }

    .Discount {
      width: 100%;
      line-height: 1.875rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0.875rem;
    }

    .number,
    .tra {
      line-height: 1.75rem;
      display: flex;
      justify-content: space-between;
    }

    .Pay-method {
      background-color: #fff;
      width: 100%;
      display: flex;
      justify-content: space-between;
      line-height: 2.25rem;
      padding: 0 0.875rem;
      border-top: solid 0.0625rem #ebebeb;
    }

    .info {
      padding: 0 0.75rem;
      line-height: 1.75rem;
      border-top: solid 0.0625rem #e2e2e2;

      .time,
      .name,
      .member {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .detail_pay {
    min-height: 3.0625rem;
    width: 100%;
    background: #fff;
    padding: 0 0.75rem;
    border-top: 1px solid #ebebeb;
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;

    .order_delete {
      min-width: 65px;
      margin-left: 0.5rem;
      background: #fff;
      padding: 0.25rem 0.625rem;
      border-radius: 15px;
      color: #333;
      border: 0.0625rem solid #666;
    }

    .red-button {
      border: 0.0625rem solid #f14e4e;
      background-color: #f14e4e;
      color: #fff;
    }

    .noClickBG {
      border: 0.0625rem solid #e8e8e8;
      background: #e8e8e8;
      color: #999;
    }

    input {
      padding: 0.25rem 0.625rem;
      border: solid 0.0625rem #666;
      border-radius: 0.1875rem;
      background-color: #fff;
      margin-top: 0.6875rem;
      float: right;
      color: #333;
      font-size: 12px;
    }

    .trans {
      position: absolute;
      right: 1.875rem;
      bottom: 2.5rem;
      width: 0;
      height: 0;
      border-width: 0.8rem 0.8rem 0;
      border-style: solid;
      border-color: #f5f5f5 transparent transparent;
    }

    .more-button {
      position: absolute;
      border: solid 1px #e2e2e2;
      width: 70px;
      border-radius: 5px;
      background: #fff;
      right: 0.875rem;
      bottom: 3.2rem;

      p {
        padding: 0.3rem 0.1rem;
        border-top: 1px solid #e2e2e2;
      }
    }
  }

  .rent-info {
    border-bottom: solid 0.0625rem #e2e2e2;
    background-color: #fff;

    ul {
      padding: 1rem 0.875rem;

      li {
        display: flex;
        justify-content: space-between;
        line-height: 1.5rem;
        font-size: 14px;

        span:first-child {
          color: #8c8c8c;
        }
      }
    }

    .info {
      border-top: solid 0.0625rem #ebebeb;
      margin: 0 0.875rem;
      line-height: 1.875rem;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
  }

  .commodity {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;

    .jpg {
      width: 30%;
      overflow: hidden;
      margin-right: 0.625rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    ul {
      position: relative;
      width: 70%;

      li {
        display: flex;
        justify-content: space-between;
      }

      li:first-child {
        margin-bottom: 0.625rem;

        .left {
          text-align: left;
          width: 60%;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        i {
          font-size: 0.75rem;
          color: #ff9500;
        }
      }

      .red {
        font-size: 14px;
        color: #f15353;

        small {
          font-size: 12px;
          color: #333;
          margin-left: 0.625rem;
        }
      }

      .left {
        font-size: 14px;
      }

      .rent {
        position: absolute;
        bottom: 0;
      }
    }
  }

  .order_times {
    background: #fff;
    margin-top: 0.875rem;
    padding: 0.5rem 0;
    border-radius: 10px;

    .Sub {
      width: 100%;
      display: flex;
      justify-content: space-between;
      line-height: 1.875rem;
      height: 1.875rem;
      padding: 0 0.875rem;
      color: #333;

      .left {
        flex: 2;
        text-align: left;
      }

      .right {
        flex: 3;
        text-align: right;
      }
    }
  }
}

#goodsinfo.pcStyle {
  .detail_pay {
    width: 375px;
  }
}

.barter_dialog {
  height: auto;

  .barter_dialog_1 {
    padding: 0.875rem 0;
    font-size: 1rem;
    font-weight: bold;
    color: #000;
  }

  .barter_dialog_2 {
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: #ee0a24;
  }
}

.inventory-apply-popup {
  height: auto;
  padding: 0;
  /deep/.van-dialog__content {
    padding: 0 0.875rem 0.875rem;
    max-height: 15rem;
    overflow-y: scroll;
    text-align: left;
    .van-radio {
      padding: 0.875rem 0;
    }
  }
}

.mint-header {
  background: none;
  color: #666;
}

.is-fixed .mint-header-title {
  font-weight: bold;
}

.mint-header.is-fixed {
  border-bottom: 0.0625rem solid #ebebeb;
  background: #fff;
  z-index: 99;
}

.is-right a {
  font-size: 12px;
}

.addr1 {
  padding: 0 !important;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .block {
    width: 14rem;
    height: 18rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.fixed-box {
  position: fixed;
  left: 5px;
  bottom: 6rem;
  width: 2rem;
  height: 2.5rem;

  img {
    width: 2rem;
    height: 2.5rem;
  }

  .r1 {
    transform: rotate(-5deg);
  }

  .r2 {
    transform: rotate(3deg);
  }
}

.fixed-box.pcStyle {
  left: 40%;
  transform: translateX(-50%);
}

.kefu {
  padding: 0 0.875rem 0.625rem 0.875rem;
  text-align: left;
  display: flex;

  .icon-kefu {
    font-size: 20px;
    color: rgb(241, 83, 83);
    margin-right: 3px;
  }
}

.pop-content {
  width: 20rem;
  padding: 3.1875rem 0;
  text-align: center;
  border-radius: 1.1875rem;
  background: #fff;

  .pop-top {
    display: flex;
    align-items: unset;
    justify-content: center;

    .left {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .line {
      width: 1px;
      height: 1.625rem;
      background-color: #999;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .pop-bottom {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;

    .image {
      width: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .icon-close11 {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 18px;
  }
}

.blindBoxInfo {
  .close {
    height: 4rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .icon-adsystem_icon_cancle {
      font-size: 3rem;
      color: #fff;
      width: 3rem;
      height: 3rem;
    }
  }

  .multipleWrapper {
    width: 18.906rem;
    height: 22.25rem;
    background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindToast.png);
    background-size: 100% 100%;

    .desc {
      padding-top: 1.45rem;
      padding-bottom: 0.906rem;
      font-size: 0.938rem;
      color: #fff;
    }

    .goodsWrapper {
      margin: 0 auto;
      padding: 0 0.1rem;
      width: 16.031rem;
      height: 17.6rem;
      border-radius: 0.625rem;
      overflow: scroll;

      .goodsItem {
        width: 100%;
        margin-bottom: 0.6rem;
        background-color: #fff;
        border-radius: 0.313rem;

        .goodInfo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.531rem 0.469rem;
          font-size: 0.625rem;

          .c1 {
            color: #666;
          }

          .c2 {
            color: #f14e4e;
          }
        }

        .goodContent {
          display: flex;
          padding-bottom: 0.5rem;

          .goods_img {
            height: 3.125rem;
            padding: 0 0.5rem;
            border-radius: 0.125rem;

            img {
              width: 3.125rem;
              height: 3.125rem;
              border-radius: 0.125rem;
            }
          }

          .content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 3.125rem;
            padding-right: 1.3rem;
            text-align: left;

            .name {
              font-size: 0.75rem;
              color: #333;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .price {
              font-size: 0.625rem;
              color: #666;
            }
          }
        }
      }
    }
  }
}

.refundShow-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .popup-title {
    height: 3rem;
    line-height: 3rem;
    font-size: 18px;
    font-weight: bold;
  }

  .popup-context {
    flex: 1;
    overflow: scroll;
    padding: 0 0.875rem 0.875rem;
    text-align: left;
    text-indent: 26px;
  }
}

.deposit-tips {
  font-size: 12px;
  padding: 2px 8px;
  margin-right: 5px;
  border-radius: 5px;
  background-color: rgba(255, 174, 190, 0.43);
  color: #f15353;
}

.give_integral_wrapper {
  position: relative;
  display: flex;
  text-align: left;
  padding-left: 0.5rem;
  float: right;
  width: 75%;

  .give_integral_text {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.094rem !important;
    height: 1.094rem !important;
    font-size: 0.688rem;
    color: #fff;
    background-color: #ec544a;
    border-radius: 50%;
  }

  .give_integral_num {
    display: inline-flex;
    align-items: center;
    height: 1.094rem !important;
    padding: 0 0.5rem 0 1.3rem;
    font-size: 0.688rem;
    color: #ec544a;
    background-color: #fff5f4;
    border-radius: 15%;
  }
}

.custom_receipt_confirmation_html {
  max-height: 20rem;
  padding-top: 0.8rem;
  overflow-y: scroll;

  /deep/img {
    max-width: 100%;
    object-fit: cover;
  }
}

/deep/ .logistics-pop {
  .row-title {
    font-size: 15px;
    font-weight: bold;
    min-height: 1.875rem;
    line-height: 1.875rem;
  }
  .addressee {
    .user-info {
      font-size: 14px;
      min-height: 1.5rem;
      line-height: 1.5rem;
      overflow: visible;
      color: #8c8c8c;
    }
  }

  .logistics-company {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .van-button--primary {
      color: #1989fa;
      text-align: right;
      border: none !important;
    }
  }
  .logistics-num {
    .van-field__body {
      input {
        text-align: right;
      }
    }
  }

  .foot {
    display: flex;
    justify-content: space-between;
    .van-button {
      width: 50%;
      height: 3.125rem;
      background: #fff;
      font-size: 16px;
    }
    .van-button--primary {
      color: #1989fa;
      border: solid 0.0625rem #ebebeb;
    }
  }
}
.vipPirce {
  color: #fd7b0c;
  display: inline;
}
</style>
