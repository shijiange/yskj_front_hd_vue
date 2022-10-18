<template>
  <div id="goodsinfo" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" text="商品订单详情"></c-title>

    <!--配送方式填写-->
    <div>
      <!-- 门店预约填写联系人 联系手机 -->
      <!-- <template v-if="root_tag == 'reserve'">
        <div class="reserveBox">
          <van-cell-group>
            <van-field v-model="reserveName" label="联系人" placeholder="请填写联系人姓名" />
          </van-cell-group>
          <van-cell-group>
            <van-field v-model="reservePhone" label="联系手机" placeholder="请输入联系人电话" />
          </van-cell-group>
        </div>
      </template> -->

      <!--聚合cps-->
      <template v-if="is_cps && cpsType == '1'">
        <div style="background: #fff; height: 3rem;">
          <input type="text" v-model="cpsTxt" :name="cpsTxt" placeholder="请输入帐号" style="width: 100%; height: 100%; text-indent: 15px;" id="cpsinp" />
        </div>
      </template>

      <!-- 快递 -->
      <div class="addr" @click="showAddressFun" v-if="selected == '0' && !show_address && !ele_no_showAdress && $route.query.tag != 'timeAppoint'">
        <!--虚拟商品需要配送地址-->
        <i class="fa fa-map-marker"></i>
        <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
          收件人:{{ realname }} {{ mobile }}
          <br />
          <span>{{ address }}</span>
        </p>
        <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
        <i v-show="realname" class="fa fa-angle-right"></i>
      </div>

      <!-- 接口返回的配送方式 start -->
      <template v-if="dispatch.length > 0 && !show_address && !ele_no_showAdress && $route.query.tag != 'timeAppoint'">
        <van-tabs v-model="selected" @click="requestByAddress"  :ellipsis="false">
          <van-tab v-show="dispatch.length > 0" v-for="item in dispatch" :name="item.dispatch_type_id" :key="item.dispatch_type_id" :title="item.name"></van-tab>
        </van-tabs>
      </template>
      <div v-show="selected == item.dispatch_type_id && !show_address && !ele_no_showAdress && $route.query.tag != 'timeAppoint'" v-for="item in dispatch" :key="item.dispatch_type_id">
        <template v-if="selected == '10'">
          <div class="autoAddress" @click="tolocation">
            <div class="autoAddress_nod">
              <i class="iconfont icon-location"></i>
              <div class="span_txt">{{ supp_point.address }}</div>
            </div>
            <i class="fa fa-angle-right"></i>
          </div>
          <div class="autoTips">
            注：订单配送是根据下单时的定位进行配送，不按照收货地址配送，请注意选择正确地址~
          </div>
        </template>
        <template v-if="selected == '1' || selected == '10'">
          <!-- 快递 -->
          <div class="addr" @click="showAddressFun" v-if="!show_address">
            <i class="fa fa-map-marker"></i>
            <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
              收件人:{{ realname }} {{ mobile }}
              <br />
              <span>{{ address }}</span>
            </p>
            <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
            <i v-show="realname" class="fa fa-angle-right"></i>
          </div>
        </template>
        <template v-if="selected == '2'">
          <!-- 门店自提 -->
          <div class="addr">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              自提地点:{{ store_info.store_name }} {{ store_info.store_mobile }}
              <br />
              <span>{{ store_info.store_address }}</span>
            </p>
          </div>

          <div style="height: 0.3rem;"></div>
          <div v-if="store_info.delivery_information == null || store_info.delivery_information == 1">
            <van-field class="inp-field" v-model="linkinfo.name" :label="recipient_name" :placeholder="`请输入${recipient_name}`" center clearable />
            <van-field class="inp-field" v-model="linkinfo.mobile" :label="recipient_mobile" :placeholder="`请输入${recipient_mobile}`" center clearable />
            <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
          </div>
        </template>
        <template v-if="selected == '3'">
          <!-- 门店配送（送货上门） -->
          <div class="addr" @click="showAddressFun" v-if="!show_address">
            <i class="fa fa-map-marker"></i>
            <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
              收件人:{{ realname }} {{ mobile }}
              <br />
              <span>{{ address }}</span>
            </p>
            <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
            <i v-show="realname" class="fa fa-angle-right"></i>
          </div>
          <div style="height: 0.3125rem;"></div>
          <div class="addr">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              自提地点:{{ store_info.store_name }} {{ store_info.store_mobile }}
              <br />
              <span>{{ store_info.store_address }}</span>
            </p>
          </div>
          <div style="height: 0.3rem;"></div>
          <!-- 配送说明 -->
          <div class="addr" v-if="is_show_store_delivery" style="text-align: left;">
            <div class="detail-item" style="width: 100%;">
              <p class="detail-title">配送范围</p>
              <!-- 配送说明 -->
              <p v-html="delivery_note" style="margin: 1rem 0;"></p>
              <!-- 配送范围地图 -->
              <div style="display: flex; justify-content: flex-end; align-items: center;">
                <div style="margin-right: 1rem;" v-if="!fun.isTextEmpty(delivery_amount)">
                  <span>起送价</span>
                  <span style="color: #ff4c52; margin: 0.5rem;">{{ $i18n.t("money") }}{{ delivery_amount }}</span>
                </div>
                <div @click="showDeliveryMap" style="text-align: center; width: 5rem; border-radius: 2rem; border: 1px solid rgb(204, 204, 204); padding: 0.25rem;">
                  配送范围
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="selected == '8'">
          <!-- 自提点（杨朗） -->
          <div class="addr" v-if="!fun.isTextEmpty(defaultSelfCarry)">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              {{ deliverName }}:{{ defaultSelfCarry.deliver_name }} {{ defaultSelfCarry.deliver_mobile }}
              <br />
              <span>{{ defaultSelfCarry.full_address }}</span>
            </p>
            <span style="border: 1px solid #f15353; padding: 0 0.25rem; border-radius: 0.25rem; color: #f15353;" @click.stop="replaceZT()" v-if="$route.query.tag != 'communityBuy'">更换</span>
          </div>
          <div class="addr" v-if="fun.isTextEmpty(defaultSelfCarry)">
            <div v-if="!isQuest_ing">抱歉，您所在地区暂无{{ deliverName }}，或<i style="color: #f15353;" @click="replaceZT('noLocation')">手动切换位置</i></div>
            <div v-if="isQuest_ing">正在获取您附近{{ deliverName }}信息 ...</div>
          </div>

          <div style="height: 0.3125rem;"></div>
          <van-field class="inp-field" v-model="distributionUserName" :label="consigneeName" :placeholder="'请输入'+consigneeName" center clearable />
          <van-field class="inp-field" v-model="distributionUserMobile" :label="consigneeMobile" :placeholder="'请输入'+consigneeMobile" center clearable />
          <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
        </template>
        <!-- 同城配送 -->
        <template v-if="selected == '11' && cityDelivery != null">
          <div class="distribution-range">
            <div class="sameCity" v-if="cityDelivery.distance_type == 1">
              <div class="sameCity-text">配送范围</div>
              <div class="sameCity-see" @click="showDeliveryMap">查看配送范围</div>
              <i class="fa fa-angle-right"></i>
            </div>
            <div class="sameCity" v-if="cityDelivery.distance_type == 2">
              <div class="sameCity-text">送达区域</div>
              <div class="sameCity-see" @click="serviceRegionShow = true">查看可送达区域</div>
              <i class="fa fa-angle-right"></i>
            </div>
            <div class="sameCity" v-if="cityDelivery.distance_type == 3">
              <div class="sameCity-text">送达社区</div>
              <div class="sameCity-see" @click="selectCommunityShow = true">{{ cityDelivery_community.name ? cityDelivery_community.name : "请选择" }}</div>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
          <div class="addr" @click="showAddressFun" v-if="!show_address">
            <i class="fa fa-map-marker"></i>
            <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
              收件人:{{ realname }} {{ mobile }}
              <br />
              <span>{{ address }}</span>
            </p>
            <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
            <i v-show="realname" class="fa fa-angle-right"></i>
          </div>

          <div class="distribution-cost" v-if="cityDelivery.future_state == 1">
            <div class="distribution-time" @click="openCityDeliveryDay">
              <div class="distribution-time-text">配送时间</div>
              <div class="distribution-time-select" v-if="cityDelivery_deliveryTime.day">
                {{ cityDelivery_deliveryTime.day }} {{ cityDelivery_deliveryTime.start_time_str }} {{ cityDelivery_deliveryTime.end_time_str }}
              </div>
              <div class="distribution-time-select" v-else>请选择</div>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
        </template>
        <template v-if="selected == '12'">
          <!-- 门店自提点（门店自己创建的自提点，可更换） -->
          <div class="addr" v-if="!fun.isTextEmpty(o2oSelfCarry) && o2oSelfCarry.id">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              {{ o2odeliverName }}:{{ o2oSelfCarry.deliver_name }} {{ o2oSelfCarry.deliver_mobile }}
              <br />
              <span>{{ o2oSelfCarry.full_address }}</span>
            </p>
            <span style="border: 1px solid #f15353; padding: 0 0.25rem; border-radius: 0.25rem; color: #f15353;" @click.stop="replaceZT()" v-if="$route.query.tag != 'communityBuy'">更换</span>
          </div>
          <div class="addr" v-else>
            <div v-if="!isQuest_ing">抱歉，您所在地区暂无{{ o2odeliverName }}，或<i style="color: #f15353;" @click="replaceZT('noLocation')">手动切换位置</i></div>
            <div v-if="isQuest_ing">正在获取您附近{{ o2odeliverName }}信息 ...</div>
          </div>

          <div style="height: 0.3125rem;"></div>
          <van-field class="inp-field" v-model="distributionUserName" label="提货人姓名" placeholder="请输入提货人姓名" center clearable />
          <van-field class="inp-field" v-model="distributionUserMobile" label="提货人手机" placeholder="请输入提货人手机" center clearable />
          <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
        </template>

        <template v-if="selected == '15'">
          <div class="addr" v-if="order_data && order_data[0] && order_data[0].order_address">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              自提点：{{ order_data[0].order_address.realname }} {{ order_data[0].order_address.mobile }}
              <br />
              <span>{{ order_data[0].order_address.address }}</span>
            </p>
          </div>
          <div style="height: 0.3125rem;"></div>
          <van-field class="inp-field" v-model="distributionUserName" label="提货人姓名" placeholder="请输入提货人姓名" center clearable />
          <van-field class="inp-field" v-model="distributionUserMobile" label="提货人手机" placeholder="请输入提货人手机" center clearable />
          <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
        </template>

        <div style="height: 0.3rem;"></div>
      </div>
      <!--配送方式填写end-->
    </div>
    <!-- 分时预约 -->
    <div class="timeAppointBox" v-if="root_tag == 'timeAppoint'">
      <div class="timeAppointBox_top">
        <van-cell-group inset >
          <van-field v-model="reserve_order.customer_name" :colon='true' label="联系人" placeholder="请填写联系人" />
          <van-field v-model="reserve_order.customer_tel" :colon='true' label="联系电话" placeholder="请填写联系电话" />
        </van-cell-group>
      </div>
      <div class="timeAppointBox_bottom">
         <van-cell-group inset >
          <van-field v-model="$route.query.reserveDataName" :colon='true' :label="appointmentLang.reserve_obj" :readonly='true' />
          <van-field v-model="$route.query.reserveDate" :colon='true' label="预约时间" :readonly='true' />
        </van-cell-group>
      </div>
    </div>
    <div class="prepaid-recharge" v-if="show_recharge_mobile && !phone_bill_pro_goods">
      <!-- 话费慢充-->
      <van-cell-group>
        <van-field v-model="recharge_mobile" type="tel" placeholder="请输入充值手机号码" clearable />
      </van-cell-group>
      <div class="tips" v-html="recharge_tips"></div>
    </div>
    <div style="display: flex; align-items: center; height: 4rem; background: #fff;" v-else-if="show_recharge_mobile && phone_bill_pro_goods">
      <div style="font-size: 14px; padding-left: 1rem;">你充值的手机号码</div>
      <div style="font-size: 28px; flex: 1; text-align: center;">{{ recharge_mobile }}</div>
    </div>
    <!-- 充值电费 -->
    <div v-if="electricity" class="eleBox">
      <div class="eleTxt">您充值的户号：</div>
      <div class="eleName" v-if="eleUser">{{ eleUser.account_number }}</div>
    </div>

    <!-- 油卡充值 -->
    <template v-if="oil_mobile && oil_account">
      <div style="display: flex; align-items: center;padding:0.3rem 0; background: #fff;" >
        <div style="font-size: 14px; padding-left: 1rem;width:8.5rem;flex-shrink:0;">您充值的油卡号：</div>
        <div style="font-size: 14px; flex: 1; text-align: left;word-break:break-all;padding-right:0.5rem;">{{ oil_account }}</div>
      </div>
      <div style="display: flex; align-items: center;padding:0.3rem 0; background: #fff;" >
        <div style="font-size: 14px; padding-left: 1rem;width:8.5rem;flex-shrink:0;">您充值的手机号：</div>
        <div style="font-size: 14px; flex: 1; text-align: left;word-break:break-all;padding-right:0.5rem;">{{ oil_mobile}}</div>
      </div>
    </template>


    <template v-if="camilo_resources_coupon_type == 1">
      <!-- 直冲商品-->
      <div class="camilo_resources_coupon" :class="{'not-shank': number_isFocus || recharge_number}">
        <div style="height:10px;"></div>
        <van-cell-group>
          <van-field v-model="recharge_number" @focus="number_isFocus = true" @blur="number_isFocus = false" label="充值账号" type="tel" placeholder="请输入您的充值账号" clearable />
        </van-cell-group>
      </div>
    </template>


    <!--商品表单  用于跨境商品报税使用-->
    <div style="margin-top: 0.625rem; background: #fff;" v-if="showMyinfo && !isOverseas">
      <van-cell-group :border="false" class="set-address">
        <van-cell :border="false" center>
          <span slot="title" style="font-size: 12px;">姓名</span>
          <span slot="default">{{ myRealname }}</span>
        </van-cell>
        <van-cell :border="false" center>
          <span slot="title" style="font-size: 12px;">身份证号</span>
          <span slot="default">{{ myIdcard }}</span>
        </van-cell>
        <van-cell :border="false" center @click.native="showFrom = true" is-link>
          <span slot="title" style="font-size: 12px;">修改个人信息</span>
          <span slot="default"></span>
        </van-cell>
      </van-cell-group>
    </div>

    <!--商品表单  用于跨境商品报税使用 没有认证-->
    <realname-auth ref="realnameAuth" v-if="isOverseas" @postMsg="postMsg"/>

    <yz-myinfo v-model="showFrom" @confirm="confirmFrom"></yz-myinfo>
    <!--商品表单end-->

    <!-- 上传相册模块（备注：相册模块适用于商城商品和供应商商品） -->
    <template v-if="isPhoto">
      <p class="imgUploaderTitle">
        上传图片<i style="color: #7d7d7d;">(选择不低于{{ min_count }}张，不高于{{ max_count }}张)</i>
      </p>
      <yz_uploader ref="yzUploader" v-model="fileList1" :max_count="max_count" :min_count="min_count"></yz_uploader>
    </template>
    <p class="imgUploaderTitle" v-if="isPhoto && storeNo_photo" style="color: #999;"><i style="color: #f15353;">**</i>( 如需上传相册，请选择单个商品下单结算 )</p>
    <!-- 上传相册模块 end-->

    <div class="goods-detail">
      <!--添加租赁信息-->
      <div class="title" v-if="isRent && !(rent_deposit_free == 0 && rent_free == 0)">
        <i class="iconfont icon-tishi" style="font-size: 1.125rem; color: #f15353;" color="#f15353"></i>
        <span>您还可以免费租{{ rent_free }}件商品!</span>
      </div>
      <!--添加租赁信息end-->
      <div v-for="(item, index) in order_data" :key="index">
        <div class="goods-shop">
          <i class="iconfont icon-fontclass-dianpu"></i>
          <p>{{ item.order_goods[0].overseas ? item.order_goods[0].overseas_shop.name :item.shop_name }}</p>
        </div>
        <van-notice-bar v-if="item.order_goods[0].overseas && favorable_rate[index] > 90"
          left-icon="thumb-circle-o"
          :text="'恭喜你，挑选的商品好评度高达'+favorable_rate[index]+'%'"
        />
        <div v-if="cityDelivery && cityDelivery.min_amount * 1 > item.order_goods_price * 1" style="background:#fff;text-align:left;padding:0.5rem 0.8rem;">
          还差 <span style="color: #f05354;font-size: 14px;">￥{{ (cityDelivery.min_amount * 1 - item.order_goods_price * 1).toFixed(2) }}</span
          >满足起送<span style="font-size: 12px;color: #989898;">（起送价￥{{ cityDelivery.min_amount }}）</span>
        </div>
        <div class="detail_good">
          <div class="goods" v-for="(g, i) in item.order_goods" v-if="g.is_gift <= 0" :key="i">
            <div class="img">
              <img :src="g.thumb" />
            </div>
            <!-- 租赁商品显示 -->
            <div class="warp" v-if="isRent">
              <ul class="inner">
                <li class="name" style="-webkit-box-orient: vertical;">
                  {{ g.title | escapeTitle }}
                </li>
                <br />
                <li class="red" style="font-size: 12px; text-align: right;">
                  <i class="iconfont icon-rent" style="font-size: 0.75rem; color: #ff9500;" v-if="!(rent_deposit_free == 0 && rent_free == 0)"></i>
                  {{ $i18n.t("money") }}{{ (g.order_lease_goods[0].lease_price / g.total).toFixed(2) }}{{ $i18n.t("元") }}/天<span>×{{ g.total }}</span>
                </li>
              </ul>
              <div class="right">
                <ul class="price">
                  <li class="option" v-if="g.goods_option_title">规格: {{ g.goods_option_title }}</li>
                  <br />
                  <li class="right">
                    押金: <em style="font-size: 10px;">{{ $i18n.t("money") }}</em
                    >{{ g.has_one_lease_goods.goods_deposit }}
                  </li>
                </ul>
                <ul class="rent-choice">
                  <span class="red"
                    >租金: <em style="font-size: 10px;">{{ $i18n.t("money") }}</em
                    >{{ g.price }}</span
                  >
                  <span
                    ><em style="font-size: 10px;">{{ $i18n.t("money") }}</em
                    >{{ g.order_lease_goods[0].lease_price }} <em style="font-size: 10px;">{{ $i18n.t("元") }}/天</em></span
                  >
                </ul>
              </div>
              <div class="diyFormDiv" v-if="g.diy_form">
                <div class="dfBtn" v-if="!g.diy_form.diyform_data_id" @click="getGoodDFData(g.goods_id, g.diy_form.form_id, null)">
                  填写表单
                </div>
                <div class="dfBtn revise_dy" v-if="g.diy_form.diyform_data_id" @click="getGoodDFData(g.goods_id, g.diy_form.form_id, g.diy_form.diyform_data_id)">
                  修改表单
                </div>
              </div>
            </div>
            <!-- 租赁商品显示结束 -->

            <!-- 普通商品显示 -->
            <div class="warp" v-if="!isRent">
              <div class="inner">
                <div class="name" style="-webkit-box-orient: vertical;">
                  {{ g.title | escapeTitle }}
                </div>
                <div class="option">规格: {{ g.goods_option_title }}</div>
              </div>
              <div style="text-align: left; color: rgb(232, 78, 64);" v-if="reserveDate">预约日期：{{ reserveDate }}</div>
              <div class="price">
                <p>
                  <span v-if="item.plugin_id == 108" class="deposit-tips"><!--判断定金活动-->定金</span>{{ $i18n.t("money") }}{{ (g.price / g.total).toFixed(2) }}
                </p>
                <p>×{{ g.total }}</p>
              </div>
              <overseastag :visible="g.overseas" class="details"/>
              <div class="price_Vip" v-if="vip_show">会员价: {{ $i18n.t("money") }}{{ vipPriceMethod(g.vip_price,g.total) }}</div>
              <div class="diyFormDiv" v-if="g.diy_form">
                <div class="dfBtn" v-if="!g.diy_form.diyform_data_id" @click="getGoodDFData(g.goods_id, g.diy_form.form_id, null)">
                  填写表单
                </div>
                <div class="dfBtn revise_dy" v-if="g.diy_form.diyform_data_id" @click="getGoodDFData(g.goods_id, g.diy_form.form_id, g.diy_form.diyform_data_id)">
                  修改表单
                </div>
              </div>
              <div class="give_integral_wrapper" style="padding-left: 0; padding-top: 0.5rem;" v-if="g.points">
                <div class="give_integral_text">送</div>
                <div class="give_integral_num">{{ g.points }}{{ integral }}</div>
              </div>
            </div>
            <!-- 普通商品显示结束 -->
          </div>

          <!-- 赠品品显示 -->
          <gift from="confirmOrder" v-for="(goods, index) in item.order_goods" v-if="goods.is_gift > 0" :goods_id="goods.goods_id" :goods_title="goods.goods_title" :goods_thumb="goods.goods_thumb" :price="goods.price" :total="goods.total" :labels="[goods.gift_price > 0 ? '换购' : '赠品']" :key="index"></gift>

          <div class="note">
            <div class="left">买家留言:</div>
            <div class="right">
              <input placeholder="50字以内（选填）" v-model.lazy="note[item.pre_id]" @change="noteHandle($event, item, note[item.pre_id])" maxlength="50" type="text" title="" />
            </div>
          </div>
        </div>

        <div class="tbs">
          <div class="num list" v-if="isRent">
            <div v-if="!(rent_deposit_free == 0 && rent_free == 0)">
              <div class="left">会员权益</div>
              <div class="right">
                <van-switch v-model="isOpenRight" active-color="#f15353" inactive-color="#fff" size="23" @change="rentSelect" />
              </div>
            </div>
          </div>
          <div class="num list">
            <div class="left">{{ isRent ? "租金" : "商品金额" }}</div>
            <div class="right">
              <span style="color: #e84e40;">{{ $i18n.t("money") }}{{ item.order_goods_price }}</span>
            </div>
          </div>
          <div class="num list" v-if="vip_show">
            <div class="left">会员价</div>
            <div class="right">
              <span style="color: #e84e40;">{{ $i18n.t("money") }}{{ item.vip_order_goods_price }}</span>
            </div>
          </div>
          <div class="freight-num list">
            <div class="left" v-if="selected == 11">
              配送费
              <i
                v-if="cityDelivery && cityDelivery.price_setting && cityDelivery.price_setting.show_state == 1"
                @click="costSpecShow = true"
                style="color:#ef5252;font-size:14px;cursor:pointer;"
                class="iconfont icon-fontclass-gantanhao"
              ></i>
              :
            </div>
            <div class="left" v-else>
              运费
              <i
                v-if="freightExplain && freightExplain.is_freight_explain == 1"
                @click="ferightExplainPop = true"
                style="color:#ef5252;font-size:14px;cursor:pointer;"
                class="iconfont icon-fontclass-gantanhao"
              ></i>
              :
            </div>
            <div class="right">
              <span style="color: #e84e40;"> <span> &nbsp;</span>{{ $i18n.t("money") }}{{ item.original_dispatch_price }} </span>
            </div>
          </div>

          <div class="freight-num list">
            <div class="left">
              税费
              <i
                @click="showTax(item.order_goods)"
                style="color:#ef5252;font-size:14px;cursor:pointer;"
                class="iconfont icon-fontclass-gantanhao"
              ></i>
              :
            </div>
            <div class="right">
              <span style="color: #e84e40;"> <span> &nbsp;</span>{{ $i18n.t("money") }}0.00 </span>
            </div>
          </div>
          <div class="freight-num list" v-if="item.order_goods[0].oversea_distribution_type">
            <div class="left">
              配送:
            </div>
            <div class="right">
              <span>{{ item.order_goods[0].oversea_distribution_type }}</span>
            </div>
          </div>

          <div class="freight-num list" v-for="(item, i) in item.order_fees" :key="i">
            <div class="left">{{ item.name }}:</div>
            <div class="right">
              <span style="color: #e84e40;"> <span> &nbsp;</span>{{ $i18n.t("money") }}{{ item.amount }} </span>
            </div>
          </div>
          <div v-if="reserve_deduction" style="width:100%;text-align: left;">
            预约扣除<span style="color: rgb(232, 78, 64);">{{ reserve_deduction }}{{ integral }}</span>
          </div>
          <div v-if="reserve_deduction_love" style="width:100%;text-align: left;">
            预约扣除<span style="color: rgb(232, 78, 64);">{{ reserve_deduction_love }}{{ love_name }}</span>
          </div>
          <div class="score list" v-if="item.order_deductions">
            <div v-for="(d, i) in item.order_deductions" :key="i" style="width: 100%; display: block; clear: both; margin-bottom: 2.1875rem;">
              <div class="left ">
                可用{{ parseFloat(d.coin).toFixed(2) }}{{ d.name || integral }}
                <span>{{ deduction_lang ? deduction_lang : "抵扣" }}{{ d.amount }}{{ $i18n.t("元") }}</span>
              </div>
              <div class="right" v-show="good_clicktag == 0">
                <van-switch v-model="d.checked" active-color="#f15353" inactive-color="#fff" size="23" @change="discountHandle(item, d, 'discount')" />
              </div>
              <div class="right" v-show="good_clicktag != 0">
                <van-loading />
              </div>
            </div>
          </div>

          <div class="score list" v-if="item.order_coin_exchanges">
            <template v-for="(d, i) in item.order_coin_exchanges">
              <div :key="i" v-if="!d.no_show" style="width: 100%; display: block; clear: both; margin-bottom: 2.1875rem;">
                <div class="left ">
                  {{ parseFloat(d.coin).toFixed(2) }}{{ d.name || integral }}
                  <span>{{ deduction_lang ? deduction_lang : "抵扣" }}{{ d.amount }}{{ $i18n.t("元") }}</span>
                </div>
                <div class="right"></div>
              </div>
            </template>
          </div>
          <div class="freight-num list" v-if="item.marketing">
            <div class="left">{{ item.marketing.simple_tag }}</div>
            <div class="right">
              <span v-html="item.marketing.confirm_order_detail"> </span>
            </div>
          </div>
        </div>
        <!-- 服务费、运费说明 start @change="discountHandle(item, fees, 'serviceFee')"-->
        <van-checkbox-group v-model="service_fee[item.pre_id]" @change="discountHandle(item, fees, 'serviceFee')">
          <div class="shipping_ins" v-for="(fees, i) in item.order_service_fees" :key="i.code">
            <div class="shipping_ins_1 nClassOne">
              <div class="shipping_ins_title nClassOne_title">是否需要{{ fees.name }}</div>
              <div class="switchBox">
                <van-switch v-model="fees.checked" inactive-color="#dcdee0" active-color="#ee0a24" @change="switchChange(item, fees, 'serviceFee')"> </van-switch>
                <van-icon name="success" v-if="fees.checked" class="switchIcon" />
              </div>
            </div>
            <div class="shipping_ins_1" v-show="fees.show">
              <div class="shipping_ins_title">{{ fees.name }}为</div>
              <div class="shipping_ins_total">{{ $i18n.t("money") }} {{ fees.amount }}</div>
            </div>
            <div v-show="fees.code == 'liveInstall' && fees.show">
              <div class="shipping_ins_1">
                <div class="shipping_ins_title">预约安装时间</div>
                <div class="shipping_ins_date" @click.stop="showInstallPop = true">
                  {{ installDate ? installDate.Format("yyyy-MM-dd hh:mm:ss") : "" }}<i v-if="!installDate" class="iconfont icon-fontclass-rili"></i><i class="fa fa-angle-right"></i>
                </div>
              </div>
              <van-field class="cell-textarea-style" v-model="install_comment" rows="2" autosize type="textarea" maxlength="120" placeholder="请输入留言" show-word-limit />
              <div class="shipping_ins_1">
                <div class="shipping_ins_title">地理位置<em style="color: #f86e6e;">*</em></div>
                <div class="shipping_ins_address">
                  <div class="addressDiv" style="text-align: right;">{{ location.address ? location.address : "定位中..." }}</div>
                  <i class="iconfont icon-dingwei" style="color: #f86e6e; padding-right: 0.25rem;"></i>
                  <div @click.stop="showLocationPop">{{ location.address ? "切换" : "自动定位中" }}</div>
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
        <!-- 服务费、运费说明 end -->
      </div>
      <div class="rent-time" v-if="isRent && isRightChoose">
        <div class="text"><span>租期：</span></div>
        <div class="week">
          <van-button type="default" v-for="(item, index) in rentTime" :key="index" @click.native="rentTimeChoose(item, index)" :class="{ active: index == currentIndex }">
            {{ item.term_name }}<br /><span class="text">优惠{{ item.term_discount }}% </span></van-button
          >
          <van-button type="default" @click.native="rentSelfChoose">自定义<br /><span></span></van-button>
        </div>
      </div>
    </div>
    <!--商品订单结束-->

    <agency-saleman ref="agencySaleman" v-if="goodsInfo.is_salesman_dividend == 1" :mid="goodsInfo.self_member_id"><!--创达通-销售员分红 #85033--></agency-saleman>

    <div class="tbs coupon-list" @click="showCoupon" v-if="isShowCoupon && coupon_size > 0">
      <div class="list">
        <div class="left ">
          优惠券 <span>{{ coupon_size }}张可用</span>
        </div>
        <div class="right">
          <span style="color: #e84e40;">
            <span>{{ use_coupon_size == 0 ? "未使用" : "已使用" + use_coupon_size + "张" }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 凑单减邮费 -->
    <addGoodsModule v-if="recommend_goods && recommend_goods.length > 0" :datas="recommend_goods"></addGoodsModule>

    <!--应用市场下单-->
    <div class="tbs coupon-list" @click="toSite" v-if="show_domain">
      <div class="list">
        <div class="left ">
          我的站点
        </div>
        <div class="right">
          <span style="color: #e84e40;">{{ shop_domain ? shop_domain : "新增/绑定站点" }}</span>
        </div>
      </div>
    </div>

    <!-- 发票-->
      <order_invoice :overseas="isOverseas" v-if="isShowInvoice" :invoiceData="invoiceData" @subInvoice="subInvoice"></order_invoice>
    <!--发票end -->
    <!-- 发票插件 -->
    <!-- <invoice-pop ref="invoicePop" @openAddList="invoiceShowAddressFun" @confirm="subInvoice" :addressData="addressData"></invoice-pop>
-->

<!--    <div class="tbs" style="margin-top: 0.625rem;">-->
<!--      <div class="goods-additional-text">赠品</div>-->
<!--      <div class="goods-additional-content" @click="activityShow=true">-->
<!--        <div class="goods-additional-content-line"> 请选择赠品 <span class="fa fa-angle-right i"></span></div>-->
<!--        <div class="goods-additional-content-line"> 护肝片 <span class="j">×1</span> <span class="fa fa-angle-right i"></span></div>-->
<!--        <div class="goods-additional-content-line">  W五峰慧果牌沙棘果油凝胶糖果 <span class="j">×2</span> <span class="fa fa-angle-right i"></span></div>-->
<!--        <div class="goods-additional-content-line"> 100积分 <span class="fa fa-angle-right i"></span></div>-->
<!--        <div class="goods-additional-content-line"> 100代金券 <span class="fa fa-angle-right i"></span></div>-->
<!--      </div>-->
<!--    </div>-->

    <div class="tbs" style="margin-top: 0.625rem;">
      <div class="price list" v-for="item in total_items" :key="item.code">
        <div class="left ">{{ item.name }}</div>
        <div class="right">
          <span style="color: #e84e40;"><span v-if="item.code == 'total_deduction_price'">-</span>{{ $i18n.t("money") }}{{ item.amount }}</span>
        </div>
      </div>

      <div class="price list" v-for="item in discount_amount_items" :key="item.code" v-show="!item.no_show">
        <div class="left ">{{ item.name }}</div>
        <div class="right">
          <span style="color: #e84e40;">-{{ $i18n.t("money") }}{{ item.amount }}</span>
        </div>
      </div>

      <div class="price list" v-for="(item, i) in service_fee_items" :key="i">
        <div class="left ">{{ item.name }}</div>
        <div class="right">
          <div class="right">
            <span style="color: #e84e40;">{{ $i18n.t("money") }}{{ item.amount }}</span>
          </div>
        </div>
      </div>

      <div class="price list" v-if="isRent">
        <div class="left ">押金（可退还）</div>
        <div class="right">
          <div class="right">
            <span style="color: #e84e40;">{{ $i18n.t("money") }}{{ goodsInfo.total_deposit }}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="agreement" v-if="isRent">
          <div class="right">
            <van-checkbox v-model="agreement" checked-color="#f15353" shape="square"></van-checkbox>
          </div>
          <div class="left "><span>我已认真阅读并同意该</span><span @click="showAgreement" style="color: red;">《租赁协议》</span></div>
        </div>

        <div class="agreement" v-if="AgreementPay && !isRent">
          <div class="right">
            <van-checkbox v-model="agreementPay" checked-color="#f15353" shape="square"></van-checkbox>
          </div>
          <div class="left">
            <span style="color: red; line-height: 1.7rem;" @click="showPay">《支付协议》 </span>
          </div>
        </div>
      </div>
    </div>

    <div class="diy-other-btn" v-if="storeSearchBtn.is_open_but">
      <!-- 门店 href需为开头需要带协议-->
      <a :href="storeSearchBtn.web_url" class="diy-other-btn-url">{{ storeSearchBtn.but_title }} <i class="fa fa-angle-right "></i></a>
    </div>

    <div style="height: 3.125rem;"></div>
    <div class="detail_pay">
      <ul class="total">
        <li class="deposit">
          <small v-if="isRent">(押金{{ $i18n.t("money") }}{{ goodsInfo.total_deposit }}可退)</small>
        </li>
        <li>
          合计：<span style="color: #f15353;"
            >{{ $i18n.t("money") }}<span class="span_t">{{ price }}</span></span
          >
        </li>
      </ul>

      <div class="order_delete" :class="{ disabled: yz_subscribe_disabled }" @click="submit">
        提交订单
        <yzSubscribe v-on:confirm="confirmSub" v-on:error="errorSub" :tagName="'submit_order'" :styleWidth="'150px'"></yzSubscribe>
      </div>
    </div>

    <!--自定义表单-->
    <van-popup v-model="dyFormPopup" position="bottom" class="mint-popup-4" :style="{ width: '100%', height: '100%', overflow: 'auto', display: dyFormPopup ? 'flex' : 'none' }">
      <div class="DYFpopHeader">
        <i class="iconfont icon-member-left" @click="dyFormPopup = false"></i>
        <p>{{ dyTiitle }}</p>
      </div>
      <!-- <c-dyPopup
        style="height: 100%; overflow: auto;"
        v-on:submitsave="diyFormSave"
        :datas="dfData"
        :form_data_id="activeFormDataID"
        :form_id="goodDYDormID"
        :description="dyDescription"
        :status="true"
        :thumb="dyThumb"
      ></c-dyPopup> -->
      <diyfrom
        v-if="dyFormPopup"
        v-on:submitsave="diyFormSave"
        style="height: 100%; overflow: auto;"
        :form_id="goodDYDormID"
        :form_data_id="activeFormDataID"
        modeType="Single"
        :singleStatus="true"
      ></diyfrom>
    </van-popup>

    <van-popup v-model="ferightExplainPop" round>
      <div class="ferightExplain" v-if="freightExplain">
        <div class="ferightExplain-title">运费说明</div>
        <div class="ferightExplain-content" v-if="freightExplain">
          <p v-for="(item, key) in freightExplain.freight_explain_content" :key="key">{{ item }}</p>
        </div>
        <div class="ferightExplain-button" @click="ferightExplainPop = false">确定</div>
      </div>
    </van-popup>

    <!--优惠券-->
    <van-popup v-model="popupCouponSpecs" :style="{ overflow: 'visible' }" position="bottom" class="mint-popup-4" closeOnClickModal="true">
      <div class="add-info">
        <div class="coupon-list-info" v-for="(coupon, index) in coupons" :key="index">
          <div class="checkList" style="float: left;" v-if="cup_notice" @click.stop="chooseCoupon(index, coupon.valid)">
            <div class="right" v-show="good_clicktag == 0">
              <van-checkbox v-model="coupon.checked" shape="square" :disabled="!coupon.valid" checked-color="#f15353" :name="coupon" @change="selectCoupon($event, coupon)"> </van-checkbox>
            </div>
            <div class="right" v-if="good_clicktag != 0">
              <van-loading />
            </div>
          </div>
          <div
            :class="{
              coupon_voucher_main: coupon.valid,
              coupon_voucher_gray: !coupon.valid
            }"
          >
            <div class="coupon_voucher_left">
              <div v-if="coupon.belongs_to_coupon.coupon_method == 1">
                <p class="coupon_voucher_amount type_large">
                  {{ coupon.belongs_to_coupon.deduct }}
                </p>
                <p class="coupon_voucher_limit">满{{ coupon.belongs_to_coupon.enough }}立减</p>
              </div>
              <div v-else>
                <p class="coupon_voucher_amount type_large">{{ coupon.belongs_to_coupon.discount }}折</p>
                <p class="coupon_voucher_limit">满{{ coupon.belongs_to_coupon.enough }}立享</p>
              </div>
            </div>
            <div class="coupon_voucher_hr"></div>
            <div class="coupon_voucher_right">
              <p class="coupon_voucher_range">
                {{ coupon.belongs_to_coupon.name }}
              </p>
              <div class="coupon-stepper" style="" v-if="is_coupon_SELE && coupon.checked && coupons_temp[coupon.coupon_id]">
                <div class="coupon-stepper-num">{{ coupon.has_conpon_id.length }}张</div>
                <div v-if="good_clicktag == 0 && stepper_show == 0">
                  <!-- :max="coupon.valid_num" -->
                  <van-stepper
                    :class="[coupons_temp[coupon.coupon_id].num >= coupon.valid_num ? 'maxDisabled' : '']"
                    :value="coupons_temp[coupon.coupon_id].num"
                    async-change
                    theme="round"
                    button-size="20"
                    integer
                    min="1"
                    :name="coupon"
                    @change="changeCoupon"
                  />
                </div>
                <div v-show="good_clicktag != 0 || stepper_show != 0">
                  <van-loading />
                </div>
              </div>
              <p class="coupon_voucher_period" v-if="!is_coupon_SELE">{{ coupon.time_start }}-{{ coupon.time_end }}</p>
            </div>
          </div>
        </div>
      </div>
      <button class=" sure" type="button" @click="popupCouponSpecs = false">
        {{ isCueCoupon ? "确定使用" : "确认" }}
      </button>
      <button class="close" type="button" @click="popupCouponSpecs = false">
        {{ isCueCoupon && use_coupon_size == 0 ? "不用优惠" : "取消" }}
      </button>
    </van-popup>

    <!-- 租赁协议 -->
    <template v-if="agreementShow">
      <van-popup v-model="agreementShow" position="right" style="width: 100%; height: 100%;">
        <van-nav-bar title="租赁协议">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="agreementShow = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <div>
          <p style="text-align: center; margin-top: 0.625rem; font-size: 16px;">
            {{ agreeCon.pact_title }}
          </p>
          <p v-html="agreeCon.lease_toy_pact"></p>
        </div>
      </van-popup>
    </template>

    <!-- 支付协议 -->
    <template v-if="agreementPayShow">
      <van-popup v-model="agreementPayShow" position="right" style="width: 100%; height: 100%;">
        <van-nav-bar title="支付协议" class="pcStyle_ydT">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="agreementPayShow = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <div>
          <p v-html="AgreementPay"></p>
        </div>
      </van-popup>
    </template>

    <!-- 配送范围 -->
    <template v-if="deliveryScopeShow">
      <van-popup v-model="deliveryScopeShow" position="right" style="width: 100%; height: 100%;">
        <van-nav-bar title="配送范围">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="deliveryScopeShow = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
        <div style="width: 100%; height: calc(100vh - 2.5rem);">
          <delivery-map :center_path="locations" :path_list="delivery_area"></delivery-map>
        </div>
      </van-popup>
    </template>

    <van-popup v-model="showPop" closeable position="bottom" :style="{ height: '40%' }">
      <div style="display: flex; align-items: center; justify-content: center; height: 4rem;">请输入租期</div>
      <div style="margin-top: 1rem;">
        <input type="text" v-model="popCode" style="outline: none; border: solid 1px #ccc; height: 2rem; text-indent: 1rem;" />
      </div>
      <van-button @click="activation" class="van-sure">确定</van-button>
    </van-popup>

    <!-- 快递地址选择器 -->
    <yz-address-list v-model="showAddress" :center_path="locations" :path_list="delivery_area" v-on:confirm="confirmSelectAddress" :options="yzAddressListOptions"></yz-address-list>
    <!-- 快递地址选择器 end -->

    <!--选择安装时间-->
    <van-popup v-model="showInstallPop" position="bottom">
      <van-datetime-picker v-model="installDate" type="datetime" @cancel="showInstallPop = false" @confirm="showInstallPop = false" title="选择完整时间" :min-date="minDate" />
    </van-popup>

    <!-- 地图选择器 -->
    <location v-model="showLocation" v-on:confirm="confirmLocation"></location>



    <!-- 配送时间 -->
    <cityDeliveryDay ref="deliveryTime" @confirm="cityDeliveryDayConfirm"></cityDeliveryDay>

    <!-- 计费规则 -->
    <van-popup v-model="costSpecShow" closeable position="bottom" round>
      <div class="costSpec">
        <div class="costSpec-title">计费规格</div>
        <div class="costSpec-container" v-if="cityDelivery && cityDelivery.price_setting">
          <div class="costSpec-items" v-if="cityDelivery.price_setting.distance_setting">
            <div class="costSpec-h2">按距离配送</div>
            <div class="costSpec-texts" v-for="item in cityDelivery.price_setting.distance_setting" :key="item.level">
              <span class="costSpec-text">{{ item.level == 1 ? `${item.unit}公里内` : `范围${item.unit}公里` }}</span>
              <span class="costSpec-text"
                >{{ item.level == 1 ? "起步价" : "每公里+" }} <span class="costSpec-price">￥ {{ item.amount }}</span></span
              >
            </div>
          </div>
          <div class="costSpec-items" v-if="cityDelivery.price_setting.weight_setting">
            <div class="costSpec-h2">按重量配送</div>
            <div class="costSpec-texts" v-for="item in cityDelivery.price_setting.weight_setting" :key="item.level">
              <span class="costSpec-text">{{ item.level == 1 ? `${item.unit}KG内` : `范围${item.unit}KG` }}</span>
              <span class="costSpec-text"
                >{{ item.level == 1 ? "起步价" : "每KG+" }} <span class="costSpec-price">￥ {{ item.amount }}</span></span
              >
            </div>
          </div>
          <div class="costSpec-items" v-if="cityDelivery.price_setting.night_setting">
            <div class="costSpec-h2">夜间配送</div>
            <div class="costSpec-texts" v-for="item in cityDelivery.price_setting.night_setting" :key="item.level">
              <span class="costSpec-text">{{ item.start_time_str }}-{{ item.end_time_str }}</span>
              <span class="costSpec-text"
                >服务费+ <span class="costSpec-price">￥ {{ item.amount }}</span></span
              >
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 选择社区 -->
    <van-popup v-model="selectCommunityShow" closeable position="bottom" round>
      <div class="selectCommunity">
        <div class="selectCommunity-title">送达社区</div>
        <div class="selectCommunity-container">
          <van-radio-group v-model="cityDelivery_community_id" v-if="cityDelivery && cityDelivery.community_setting">
            <div class="selectCommunity-items" v-for="item in cityDelivery.community_setting.community_list" :key="item.id">
              <div class="selectCommunity-text">{{ item.name }}</div>
              <div class="selectCommunity-radio"><van-radio :name="item.id" checked-color="#f15353"></van-radio></div>
            </div>
          </van-radio-group>
        </div>
        <div class="selectCommunity-btns">
          <div class="selectCommunity-btn" @click="setCityDeliveryCommunity">确定</div>
        </div>
      </div>
    </van-popup>

    <!-- 送达区域 -->
    <van-popup v-model="serviceRegionShow" closeable position="bottom" round>
      <div class="serviceRegion">
        <div class="serviceRegion-title">可送达区域</div>
        <div class="serviceRegion-container" v-if="cityDelivery && cityDelivery.area_setting">
          <div class="serviceRegion-item" v-for="item in cityDelivery.area_setting.city_list" :key="item.id">{{ item.areaname }}</div>
          <div class="serviceRegion-item" v-for="item in cityDelivery.area_setting.district_list" :key="item.id">{{ item.areaname }}</div>
          <div class="serviceRegion-item" v-for="item in cityDelivery.area_setting.street_list" :key="item.id">{{ item.areaname }}</div>
        </div>
      </div>
    </van-popup>

    <!-- 赠品详情  -->
<!--    <van-popup v-model="activityShow" class="mint-popup-4 pcStyle_mint" position="bottom" get-container="#appMain">-->
<!--      <van-nav-bar title="活动规则" class="pcStyle_ydT">-->
<!--        <template #right>-->
<!--          <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="activityShow = false"></i>-->
<!--        </template>-->
<!--      </van-nav-bar>-->

<!--      <div style="clear: both;" class="pcStyle_ydC">-->
<!--        <van-cell-group style="border-width: 0;">-->
<!--          <div  style=" text-align: left; padding:1em;">-->
<!--            <p>满100送100元代金券</p>-->
<!--            <p>* 下完单48小时内到账</p>-->
<!--          </div>-->
<!--        </van-cell-group>-->
<!--      </div>-->
<!--    </van-popup>-->

    <!-- 商品-数量、金额提示 -->
    <van-popup v-model="payTips" position="bottom" closeable class="mint-popup-4">
        <!-- 请合理购买,每单不可超过14件商品！ -->
        <div style="display: flex; align-items: center; justify-content: center; height: 4rem;">{{payTipsContent}} </div>
        <button class="address-plus" type="button" @click="payTips = false">修改结算单</button>
    </van-popup>

    <van-popup v-if="taxGoodsList"  v-model="taxShow" title="税费详情" class="tax-box" style="max-height:490px; width:80%;border-radius: 10px;">
      <van-panel title="税费详情">
        <template #header>
          <van-nav-bar title="税费详情"></van-nav-bar>
        </template>
        <van-card
          v-for="(goods,index) in taxGoodsList"
          :key="index"
          :num="goods.total"
          :title="goods.title"
          currency="税费：¥"
          price="0.00"
          :thumb="goods.thumb"
        >
          <template #tags>
            <van-tag plain type="warning">商家已承担税费</van-tag>
          </template>
        </van-card>
        <template #footer>
          <van-notice-bar
            left-icon="volume-o"
            mode="link"
            text="根据国家政策规定需要缴纳跨境电商综合税。"
            @click="toTaxDetail"
            style=""
          />
          <van-button type="default" @click="taxShow = false" style="width:100%; border:none;color:red;">确定</van-button>
        </template>
      </van-panel>
    </van-popup>

  </div>
</template>

<script>
import goods_order_controller from "./goods_order_controller";

export default goods_order_controller;
</script>

<style lang="scss" rel="stylesheet/scss">
#app .tax-box{
  text-align: left;
  .van-panel__content{
    padding: 10px 16px;
    max-height:345px;
    overflow-y:scroll;
  }
}
.van-sure {
  color: #fff;
  background-color: #f15353;
  border-color: #f15353;
  width: 80%;
  height: 2.5rem;
  line-height: 2.5rem;
  margin: 1.25rem 0;
  padding: 0;
  font-size: 16px;
}
.camilo_resources_coupon {
  .van-field__value{
    display: flex;
    align-items: center;
  }
  .van-field__value::before{
    animation:cursorImg 1s infinite steps(1, start);
    content: '';
    display: inline-block;
    width: 1px;
    height: 90%;
    background-color: #000000;
  }
}
.camilo_resources_coupon.not-shank {
  .van-field__value::before{
    display: none;
  }
}
@keyframes cursorImg {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
#cpsinp {
  padding-top: 1rem;
  box-sizing: border-box;
  font-size: 16px;
}

#goodsinfo {
  input {
    border: none;
  }

  .title {
    line-height: 2.25rem;
    background-color: #f7f7f7;
    color: #f15353;
    text-align: left;
    padding: 0 0.875rem;

    span {
      margin-left: 0.625rem;
    }
  }

  .goods-shop {
    background: #fff;
    line-height: 2.25rem;
    border-bottom: #e8e8e8 solid 0.0625rem;
    display: flex;
    .icon-fontclass-dianpu{
      font-size: 26px;
      color: #f15353;
      padding: 0 0 0 0.875rem;
    }
    p {
      text-align: left;
      margin: 0;
      color: #555;
      font-size: 16px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .add-info {
    overflow-y: scroll;
    width: 100%;
    background: #fff;
    max-height: 50vh;
    padding-top: 0.625rem;

    /* ul { */

    /* overflow-y: scroll; */

    /* max-height: 50vh; */

    /* } */
  }
  .goods-additional-text {
    width: 3.156rem;
    font-size: 14px;
    display: block;
    text-align: left;
    margin-bottom:0.5em;
  }

  .goods-additional-content {
    width:100%;
    .goods-additional-content-line{
      width:100%;
      text-align: left;
      overflow: hidden;
      padding-right: 40px;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 2em;
      font-size:15px;
      .i {
        position: absolute;
        right: 0.875rem;
        font-size: 24px;
        color: #c9c9c9;
      }
      .j {
        position: absolute;
        right: 1.875rem;
      }
    }

  }
  .mint-popup-4 {
    width: 100%;

    .sure {
      background: #f15353;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #fff;
      width: 50%;
      border: 0;
      float: left;
    }

    .close {
      background: #eee;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #333;
      width: 50%;
      border: 0;
      float: left;
    }

    .address-plus {
      background: #f15353;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #fff;
      width: 100%;
      border: 0;
    }

    /* ul { */

    /* overflow-y: scroll; */

    /* } */

    li {
      padding: 0.625rem 0;
      display: flex;
      position: relative;

      i {
        flex: 1;
      }
    }
  }
  .autoAddress {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    align-items: center;
    background: #fff;
    padding: 0.875rem;
    .autoAddress_nod {
      flex: 1;
      display: flex;
      .span_txt {
        text-align: left;
        padding: 0px 0.625rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .icon-location {
      // font-size: 22px;
      color: #ec6060;
    }
  }
  .autoTips {
    font-size: 12px;
    text-align: left;
    padding: 0.875rem;
    color: #858585;
  }
  .addr {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    align-items: center;
    background: #fff;
    padding: 0.875rem;

    .icon {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      align-items: center;
      background: #fff;

      .fa-map-marker {
        line-height: 1.5rem;
        margin-right: 0.625rem;
        font-size: 22px;
        color: #333;
        padding-right: 0.5rem;
      }

      .fa-angle-right {
        line-height: 1.5rem;
        font-size: 24px;
        color: #c9c9c9;
      }

      p {
        flex: 6;
        text-align: justify;
        font-weight: bold;
        padding-right: 1rem;
        color: #333;
        font-size: 16px;

        span {
          font-weight: normal;
          color: #666;
          display: -webkit-box;
          font-size: 14px;
          margin-top: 0.375rem;
        }
      }
    }
  }

  .goods-detail {
    margin-top: 0.625rem;
  }

  .imgUploaderTitle {
    text-align: left;
    margin-top: 0.8rem;
    height: 2.25rem;
    line-height: 2.25rem;
    padding: 0 0.8rem;
    border-bottom: 1px solid #e0e0e0;
    background: #fff;
    color: #333;
    font-size: 12px;
  }

  .detail_good {
    background: #fff;
    overflow: hidden;

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
        font-size: 20px;
        padding-right: 0.3125rem;
      }
    }

    .goods::after {
      content: "";
      display: block;
      clear: both;
    }

    .goods {
      display: flex;
      padding: 1rem 0.875rem 0 0.875rem;
      width: 100%;
      box-sizing: border-box;

      .img {
        /* flex: 1; */
        width: 30%;
        display: inline-block;

        /* background:blue; */
        img {
          width: 100%;
        }
      }

      .warp {
        width: 70%;
        margin-left: 0.625rem;
        position: relative;

        .inner {
          display: flex;
          justify-content: space-between;

          .red {
            color: #f15353;

            i {
              font-size: 12px;
              color: #ff9500;
            }
          }

          .name {
            font-size: 14px;
            line-height: 1.25rem;
            height: 2.5rem;
            width: 60%;
            text-align: left;
            color: #333;
            margin-bottom: 0.625rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
        .price_Vip{
          color: #FD7B0C;
          text-align: left;
        }
        .price {
          display: flex;
          justify-content: space-between;
          color: #333;
          box-sizing: border-box;

          p {
            margin-top: 0;
          }

          .right {
            color: #8c8c8c;
          }
        }

        .diyFormDiv {
          display: flex;
          flex-direction: row-reverse;

          .dfBtn {
            height: 1.5rem;
            line-height: 1.5rem;
            padding: 0 0.875rem;
            // border: 1px solid #e21212;
            font-size: 0.875rem;
            background: #f13232;
            border-top-left-radius: 1rem;
            border-bottom-left-radius: 1rem;
            color: #fff;
          }

          .revise_dy {
            background: #7cbd5b;
          }
        }
      }

      .option {
        color: #8c8c8c;
        font-size: 14px;
      }
    }

    .rent-choice {
      width: 100%;
      // position: absolute;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      color: #8c8c8c;

      .red {
        color: #f15353;
        margin-right: 0.625rem;
        font-size: 14px;
      }

      li:nth-child(2) {
        position: relative;
        right: 0;
        color: #8c8c8c;
      }
    }

    .note {
      display: flex;
      margin: 1rem 0.5rem 0 0.5rem;

      .left {
        flex: 0 0 4rem;
        font-size: 12px;
        color: #858585;
      }

      .right {
        flex: 1;
        text-align: left;

        input {
          font-size: 12px;
        }
      }
    }
  }

  .nums {
    background: #fff;
    text-align: right;
    margin: 0;
    padding-right: 0.625rem;
    line-height: 2rem;
  }

  .tbs.coupon-list {
    margin-top: 0.625rem;
    // margin-bottom: 0.625rem;
  }

  .coupon.list {
    .left font {
      color: #fff;
      background: #f15353;
      font-size: 12px;
      height: 1.25rem;
      padding: 0 0.3125rem;
      border-radius: 0.1875rem;
      margin-left: 0.3125rem;
    }

    .right font span {
      font-size: 12px;
    }

    .right font i {
      font-size: 12px;
      color: #999;
    }
  }

  .rent-time {
    margin-top: 0.625rem;
    padding: 1rem 0.875rem;
    background-color: #fff; //display: flex;
    .text {
      font-size: 14px;
      text-align: left;
      flex: 16%;
      margin-bottom: 0.625rem;
    }

    .week {
      display: flex;
      flex-wrap: wrap;

      button {
        display: inline-block;
        width: 30.4%;
        border: solid 0.0625rem #e2e2e2;
        background-color: #fff;
        font-size: 12px;
        color: #333;
        border-radius: 0.25rem;
        height: 3.75rem;
        margin: 0.3125rem 1.1%;

        .text {
          color: #f15353;
        }
      }

      .yd-btn {
        padding: 0;
      }

      .active {
        border: solid 0.0625rem red;
      }
    }
  }

  .tbs {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    flex-flow: row wrap;
    padding: 0.625rem 0.875rem;
    line-height: 1.5rem;
    border-bottom: #e8e8e8 solid 0.0625rem;
    font-size: 14px;

    .list {
      width: 100%;
      padding-bottom: 0.625rem;
    }

    .list:nth-last-child(1) {
      padding-bottom: 0;
    }

    .left {
      text-align: left;
      float: left;
      color: #333;

      span {
        font-size: 15px;
      }
    }

    .right {
      text-align: right;
      float: right;
    }

    p {
      text-align: left;
      margin: 0;
      padding-right: 0.625rem;
      line-height: 2rem;
      width: 100%;

      span {
        color: #858585;
        font-size: 12px;
        float: right;
      }
    }

    .remarks {
      width: 100%;

      textarea {
        color: #8c8c8c;
        padding: 0.25rem;
        width: 100%;
        margin-top: 0.375rem;
        height: 4.25rem;
        border: solid 0.0625rem #e2e2e2;
        background-color: #f9f9f9;
        border-radius: 0.25rem;
      }
    }

    .agreement {
      display: flex;
      align-items: center;

      .left {
        margin-left: 0.625rem;

        a {
          color: #f15353;
        }
      }
    }
  }

  .detail_pay {
    z-index: 98;
    font-size: 16px;
    text-align: left;
    height: 3.0625rem;
    width: 100%;
    background: #fff;
    padding: 0 0 0 0.875rem;
    margin-top: 1.875rem;
    border-top: 0.0625rem solid #eaeaea;
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .order_delete {
      flex: 1;
      width: auto;
      background: #f15353;
      text-align: center;
      color: #fff;
      line-height: 3.0625rem;
      position: relative;
      &.disabled {
        background: #a5a5a5;
      }
    }

    .total {
      font-size: 14px;
      padding-right: 0.625rem;
      display: flex;
      justify-content: flex-end;
      line-height: 3.0625rem;
      flex: 3;

      .deposit {
        font-size: 12px;
        color: #999;
        margin-right: 0.375rem;
      }
    }
  }

  .span_t {
    color: #f15353;
    font-size: 16px;
  }
}

#goodsinfo.pcStyle {
  .detail_pay,
  .mint-popup-4 {
    width: 375px;
  }
}

.checkList {
  position: relative;
  top: 1.875rem;
  left: 0.1875rem;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.coupon-list-info {
  width: 99.5%;
}

.coupon_voucher_main {
  position: relative;
  padding-left: 6.375rem;
  height: 5rem;
  margin-left: 2.25rem;
  margin-right: 0.625rem;
  margin-bottom: 0.625rem;

  .coupon_voucher_left {
    position: absolute;
    top: 0;
    left: 0;
    width: 6.375rem;
    height: 100%;
    color: #fff;
    border-radius: 0.25rem 0 0 0.25rem;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #47c1c4;

    .coupon_voucher_amount.type_large {
      margin: 0;
      font-size: 22px;
    }

    .coupon_voucher_amount {
      position: relative;
      font-size: 36px;
      line-height: 1;
    }

    .coupon_voucher_amount::before {
      content: "\00A5";
      font-size: 16px;
      display: inline-block;
      vertical-align: text-top;
      margin-right: 0.1875rem;
      line-height: 1;
    }

    .coupon_voucher_limit {
      font-size: 12px;
      line-height: 1;
      margin-top: 0.9375rem;
      margin-bottom: 0;
    }
  }

  .coupon_voucher_hr {
    position: absolute;
    top: 0;
    left: 6.0625rem;
    width: 0.375rem;
    overflow: hidden;
    height: 100%;
  }

  .coupon_voucher_hr::after {
    box-sizing: border-box;
    position: absolute;
    top: -0.1875rem;
    right: -0.1875rem;
    bottom: 0;
    content: "• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •";
    line-height: 0.625rem;
    width: 0.4375rem;
    color: #f8fbfb;
    font-size: 18px;
    overflow: hidden;
    z-index: 1;
  }

  .coupon_voucher_right {
    box-sizing: border-box;
    padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
    height: 100%;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: #e5f3f3;
    color: #666;
    position: relative;

    .coupon_voucher_range {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 12px;
      text-align: left;
      margin: 0;
      padding: 0;
      vertical-align: baseline;
    }

    .coupon_voucher_period {
      color: #999;
      font-size: 12px;
      position: absolute;
      bottom: 0;
    }

    .coupon-stepper {
      position: absolute;
      width: 95%;
      bottom: 4px;
      right: 0.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .coupon-stepper-num {
        border-radius: 0.875rem;
        overflow: hidden;
        padding: 0 0.5rem;
        color: #999;
        border: 1px solid #999;
        height: 1rem;
        font-size: 0.75rem;
        line-height: 1rem;
      }

      /deep/.van-stepper--round .van-stepper__minus {
        color: #47c1c4;
        border: 1px solid #47c1c4;
      }

      /deep/.van-stepper--round .van-stepper__plus {
        background-color: #47c1c4;
      }

      /deep/.maxDisabled .van-stepper__plus {
        background-color: #999;
      }
    }
  }
}

.coupon_voucher_gray {
  position: relative;
  padding-left: 6.375rem;
  height: 5rem;
  margin-left: 2.25rem;
  margin-right: 0.625rem;
  margin-bottom: 0.625rem;

  .coupon_voucher_left {
    position: absolute;
    top: 0;
    left: 0;
    width: 6.375rem;
    height: 100%;
    color: #fff;
    border-radius: 0.25rem 0 0 0.25rem;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #ccc;

    .coupon_voucher_amount.type_large {
      margin: 0;
      font-size: 22px;
    }

    .coupon_voucher_amount {
      position: relative;
      font-size: 36px;
      line-height: 1;
    }

    .coupon_voucher_amount::before {
      content: "\00A5";
      font-size: 16px;
      display: inline-block;
      vertical-align: text-top;
      margin-right: 0.1875rem;
      line-height: 1;
    }

    .coupon_voucher_limit {
      font-size: 12px;
      line-height: 1;
      margin-top: 0.9375rem;
      margin-bottom: 0;
    }
  }

  .coupon_voucher_hr {
    position: absolute;
    top: 0;
    left: 6.0625rem;
    width: 0.375rem;
    overflow: hidden;
    height: 100%;
  }

  .coupon_voucher_hr::after {
    box-sizing: border-box;
    position: absolute;
    top: -0.1875rem;
    right: -0.1875rem;
    bottom: 0;
    content: "• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •";
    line-height: 0.625rem;
    width: 0.4375rem;
    color: #f8fbfb;
    font-size: 18px;
    overflow: hidden;
    z-index: 1;
  }

  .coupon_voucher_right {
    box-sizing: border-box;
    padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
    height: 100%;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: #eee;
    color: #666;
    position: relative;

    .coupon_voucher_range {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 12px;
      text-align: left;
      margin: 0;
      padding: 0;
      vertical-align: baseline;
    }

    .coupon_voucher_period {
      color: #999;
      font-size: 12px;
      position: absolute;
      bottom: 0;
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
  border-bottom: 0.0625rem solid #e8e8e8;
  background: #fff;
  z-index: 99;
}

.is-right a {
  font-size: 12px;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.scale-enter,
.scale-leave-to {
  transform: scale(1.5);
  opacity: 0;
}

.move-enter-active,
.move-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.move-enter,
.move-leave-to {
  /* transform: translate(10px, 0); */
  opacity: 0;
}

.popHeader,
.DYFpopHeader {
  position: absolute;
  top: 0;
  width: 100%;
  height: 2.5rem;
  background: white;
  display: flex;
  font-size: 16px;
  text-align: center;

  p {
    font-weight: bold;
    flex: 1;
    align-self: center;
  }

  i {
    padding: 0.5rem;
    align-self: center;
    flex: 0 0 1.5rem;
  }
}

.DYFpopHeader {
  position: fixed;
  top: 0;
  z-index: 9;
}

.address_addnav {
  z-index: 10;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0 3% 0 6% !important;
  left: 0;
  background: #f15353 !important;
  color: #fff !important;
  text-align: center;
  height: 2.8125rem !important;
  line-height: 2.8125rem !important;
}

.popup-con {
  width: 100%;
}

#goodsinfo .shipping_ins {
  // margin: 0.625rem 0;
  background: #fff;
  .shipping_ins_1 {
    padding: 0 0.625rem;
    height: 2.125rem;
    line-height: 2.125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .shipping_ins_title {
      font-size: 0.875rem;
      color: #333;
    }

    .shipping_ins_total {
      color: #f15353;
    }

    .fa-angle-right {
      font-size: 20px;
      margin-left: 10px;
    }

    .shipping_ins_date {
      .icon-fontclass-rili {
        font-size: 20px;
        color: #666;
      }
    }

    .shipping_ins_address {
      flex: 1;
      padding-left: 12px;
      display: flex;
      align-items: center;
      font-size: 10px;
      overflow: hidden;

      .addressDiv {
        flex: 1;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }
  }

  .cell-textarea-style {
    background: #fbfbfb;
  }
  .nClassOne {
    height: 3rem !important;
    background: #fde4d8;
    .nClassOne_title {
      color: #e84e40;
    }
    .switchBox {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      .switchIcon {
        position: absolute;
        right: 0.5rem;
        font-size: 1rem;
        color: #e84e40;
      }
    }
  }
}

#goodsinfo .animation {
  top: 0;

  header {
    display: flex;
  }

  .address_addnav {
    display: block;
  }
}

.dis_warn {
  text-align: left;
  padding: 0.25rem 0.875rem;
  background: #fff;
  color: #f15353;
  font-size: 0.75rem;
  border-top: 0.0625rem solid #ebebeb;
}

.set-address {
  .van-cell {
    padding: 10px 12px;

    .van-cell__title {
      flex: none;
      color: #555;
      text-align: left;
    }

    .van-cell__value {
      input {
        color: #555;
        width: 100%;
      }
    }
  }

  /deep/.van-cell:active {
    background-color: #fff !important;
  }
}

.longitude {
  padding: 10px 13px !important;
}

.diy-other-btn {
  height: 2rem;
  line-height: 2rem;
  background: #f7e7e7;
  text-align: center;
  margin-top: 0.875rem;
  color: #e84e40;
}

#goodsinfo.pcStyle .DYFpopHeader {
  width: 375px;
}

#goodsinfo.pcStyle .van-popup--top {
  top: 0;
  right: 50% !important;
  left: unset;
  margin-right: -187.5px;
  width: 100%;
}

/deep/.inp-field.van-cell {
  padding: 10px 10px 10px 21px;

  /deep/.van-field__label {
    flex: none;
    white-space: nowrap;
    width: 4.5rem;
    margin-right: 20px;
    color: #333;
    text-align: center;
    font-size: 16px;
  }

  input::placeholder {
    color: #555;
    font-size: 16px;
  }
}

.prepaid-recharge {
  background-color: white;
  text-align: left;

  /deep/.van-cell {
    font-size: 22px;
  }

  /deep/.van-cell::after,
  [class*="van-hairline"]::after {
    border-bottom: none;
  }

  .tips {
    margin-top: 15px;
    border-top: #e8e8e8 solid 0.0625rem;
    padding: 10px;
    line-height: 22px;
    color: #ff2424;
    font-size: 14px;

    /deep/img {
      max-width: 100%;
    }
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
    padding: 0.2rem 0.5rem 0.2rem 1.3rem;
    font-size: 0.688rem;
    color: #ec544a;
    background-color: #fff5f4;
    border-radius: 15%;
  }
}
.eleBox {
  display: flex;
  align-items: center;
  height: 4rem;
  background: #fff;
  .eleTxt {
    font-size: 14px;
    padding-left: 1rem;
  }
  .eleName {
    font-size: 28px;
    flex: 1;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.ferightExplain {
  width: 18rem;
  margin: 0 auto;
  padding-bottom: 1rem;
  .ferightExplain-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
  }
  .ferightExplain-content {
    min-height: 10rem;
    max-height: 15rem;
    padding: 0 1rem;
    margin-bottom: 1rem;
    text-align: left;
    overflow: auto;
  }
  .ferightExplain-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10rem;
    height: 2rem;
    margin: 0 auto;
    font-size: 14px;
    color: #fff;
    background: #ef5252;
    border-radius: 5px;
  }
}

.distribution-range {
  padding: 0.8rem 0.969rem;
  text-align: left;
  color: #2c2c2c;
  background: #fff;
  border-bottom: 1px solid #f2f2f2;
  .sameCity {
    display: flex;
    align-items: center;
    .sameCity-text {
      font-size: 15px;
      color: #2c2c2c;
    }
    .sameCity-see {
      flex: 1;
      text-align: right;
      font-size: 12px;
      color: #989898;
    }
    .fa-angle-right {
      padding-left: 0.5rem;
      color: #4e4e4e;
    }
  }
}

.distribution-cost {
  padding: 0.8rem 0.969rem;
  margin-top: 0.625rem;
  text-align: left;
  background: #fff;
  .distribution-time {
    display: flex;
    align-items: center;

    .distribution-time-text {
      font-size: 14px;
      color: #2c2c2c;
    }
    .distribution-time-select {
      flex: 1;
      text-align: right;
      font-size: 12px;
      color: #666666;
    }
    .fa-angle-right {
      padding-left: 0.5rem;
      color: #4e4e4e;
    }
  }
}

.costSpec {
  max-height: 28.5rem;
  .costSpec-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    font-size: 18px;
    color: #2a2a2a;
    font-weight: bold;
  }
  .costSpec-container {
    max-height: 25rem;
    padding: 0 1.219rem;
    overflow: auto;
    .costSpec-items {
      margin-bottom: 1.3rem;
      .costSpec-h2 {
        margin-bottom: 1.063rem;
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        color: #2a2a2a;
      }
      .costSpec-texts {
        display: flex;
        justify-content: space-between;
        margin-top: 0.831rem;
        .costSpec-text {
          font-size: 13px;
          font-weight: bold;
          color: #666666;
          .costSpec-price {
            color: #f05152;
          }
        }
      }
    }
  }
}

.selectCommunity {
  max-height: 28.5rem;
  .selectCommunity-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    font-size: 18px;
    color: #2a2a2a;
    font-weight: bold;
  }
  .selectCommunity-container {
    max-height: 20rem;
    padding: 0 1.219rem;
    overflow: auto;
    .selectCommunity-items {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
  }
  .selectCommunity-btns {
    display: flex;
    align-items: center;
    height: 5rem;
    padding: 0 1.3rem;
    .selectCommunity-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
      width: 100%;
      color: #fff;
      background: #f05354;
      border-radius: 0.25rem;
    }
  }
}

.serviceRegion {
  max-height: 23.5rem;
  min-height: 15rem;
  padding-bottom: 1rem;
  .serviceRegion-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    font-size: 18px;
    color: #2a2a2a;
    font-weight: bold;
  }
  .serviceRegion-container {
    display: flex;
    flex-wrap: wrap;
    max-height: 20rem;
    overflow: auto;
    padding-left: 0.2rem;
    padding-right: 0.906rem;
    padding-bottom: 1rem;
    .serviceRegion-item {
      display: flex;
      align-items: center;
      height: 1.625rem;
      padding: 0.2rem 0.5rem;
      margin-left: 0.719rem;
      margin-bottom: 0.719rem;
      font-size: 14px;
      color: #2b2b2b;
      border-radius: 0.125rem;
      border: solid 0.063rem #c5c5c5;
    }
  }
}
.timeAppointBox{
  background: #fff;
  .van-cell-group--inset{
    margin: 0 !important;
  }
}
</style>
