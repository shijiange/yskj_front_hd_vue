<template>
  <div id="extension-box" :style="{ '--color': `${background_color}` }">
    <div v-show="template">
      <div v-if="template === '01'">
        <div class="background-box">
          <div class="extension-head">
            <img class="extension-head-avatar" :src="userInfo.avatar" alt="">
            <div class="extension-name-box" :style="{maxWidth: share_page? '73%' : '83%'}">
              <p class="extension-name van-ellipsis">{{ userInfo.nickname }}</p>
              <p class="extension-id" v-if="show_member_id != 1">ID：{{ userInfo.member_id }}</p>
            </div>
            <div class="extension-share" @click="toPage('MyIncome')" v-if="share_page">
              <i class="iconfont icon-bc_share_card"></i>
            </div>
          </div>

          <div class="extension-nickname-box" :style="{height: !moreIdentity && income_page.identity.length > 5? '75px' : ''}" v-if="income_page.identity && income_page.identity.length > 0">
            <div class="extension-nickname-bg"></div>
            <div class="nickname-warp">
              <span class="nickname-warp-item" v-for="(identity,index) in income_page.identity" :key="index">{{identity}}</span>
            </div>
            <i class="iconfont icon-member-top moreIdentity" v-if="!moreIdentity && income_page.identity.length > 5" @click="showMoreIdentity"></i>
            <i class="iconfont icon-member-bottom moreIdentity" v-if="moreIdentity" @click="showMoreIdentity"></i>
          </div>

          <div class="extension-money-box">
            <div class="extension-money-box-head">
              <div class="time-box">
                <span :class="[income.type===income_statistic_type ? 'active': '' ]" v-for="(income, index) in income_statistic_type_box" :key="index"
                      @click="tabChange('income_statistic_type', income.type)">{{income.title}}</span>
              </div>
              <div class="asset-line"></div>
              <div class="asset-right-box" v-if="!userInfo.auto_withdraw&&withdraw_date&&!withdraw_date.disable" @click="gotoIncome">
                <i class="iconfont icon-fontclass-shouru"></i>
                <span>{{fun.initWithdrawal()}}</span>
              </div>
              <div class="asset-right-box" v-if="userInfo.auto_withdraw&&withdraw_date&&!withdraw_date.disable">
                <i class="iconfont icon-fontclass-shouru"></i>
                <span>{{ userInfo.auto_withdraw }}号自动{{fun.initWithdrawal()}}</span>
              </div>
              <div class="asset-right-box" v-if="withdraw_date&&withdraw_date.disable" @click="toToast">
                <i class="iconfont icon-fontclass-shouru"></i>
                <span>{{withdraw_date.day}}号可{{fun.initWithdrawal()}}</span>
              </div>
            </div>
            <div class="extension-money-box-body">
              <div class="body-head">
                <div class="head-line"></div>
                <div class="head-circle"></div>
                <div class="head-line head-line-right"></div>
              </div>
              <div class="body-money">
                <div class="body-money-item" v-for="(item,index) in income_statistic" :key="index" @click="toPage(item.url)">
                  <span class="money-top van-ellipsis"><countTo :startVal="0" :decimals="item.url === 'myRelationship'? 0 : 2" :endVal="Number(item.value)" :duration="500"></countTo></span>
                  <span>{{item.title}}</span>
                </div>
              </div>
            </div>
            <p class="tips">本页收入统计仅包含已经结算部分，不含未结算部分~</p>
            <p class="tips">已提现收入，未提现收入，提现中收入，团队粉丝不随周期变化</p>
          </div>
        </div>

        <div class="eChats-box">
          <div class="tab-head">
            <div class="tab-item" :class="[charts_type !== '1' ? 'active':'']" @click="tabChange('charts_type', '')">收入动态</div>
            <div class="tab-item" :class="[charts_type === '1' ? 'active':'']" @click="tabChange('charts_type', '1')">收入占比</div>
          </div>
          <div>
            <div id="echats-income" v-if="charts_type !== '1'" style="height: 220px; width: 21rem;"></div>
          </div>
          <div>
            <div id="echats-income-pie" v-if="charts_type === '1'" style="height: 250px; width: 21rem;"></div>
          </div>
        </div>

        <div class="income-box">
          <div class="income-item" v-for="(btn,i) in income_page.button" :key="btn.icon + i" @click="toPage(btn.url)">
            <i class="iconfont" :class="btn.icon"></i>
            <p>{{btn.title}}</p>
          </div>
        </div>

        <div class="available-box">
          <div class="tab-head">
            <div class="tab-item" :class="[available_type !== '1' ? 'active':'']" @click="tabChange('available_type', '')">我的权限</div>
            <div class="tab-item" v-if="is_show_unable==1" :class="[available_type === '1' ? 'active':'']" @click="tabChange('available_type', '1')">未开通权限</div>
          </div>
          <div class="available-body">
            <template v-if="available_type !== '1'">
              <div class="available-item" v-for="(item,i) in extension" @click="gotoPage(item)" :key="item.icon + i">
                <i class="iconfont" :class="item.icon"></i>
                <div class="available-money">
                  <p style="word-break: keep-all;" class="van-ellipsis">{{ item.title }}</p>
                  <p class="red-money van-ellipsis"><span>{{$i18n.t("money")}}</span>{{ item.value }}</p>
                </div>
                <i class="fa fa-angle-right"></i>
              </div>
            </template>
            <template v-if="available_type === '1'">
              <div class="available-item" v-for="item in unextension" @click="gotoPage(item)" :key="item.url">
                <i class="iconfont" :class="item.icon"></i>
                <div class="available-money">
                  <p style="word-break: keep-all;">{{ item.title }}</p>
                  <p class="red-money van-ellipsis"><span>{{$i18n.t("money")}}</span>{{ item.value }}</p>
                </div>
                <i class="fa fa-angle-right"></i>
              </div>
            </template>
          </div>
        </div>

        <div class="eChats-box">
          <div class="tab-head">
            <div class="tab-item" :class="[fans_type !== '1' ? 'active':'']" @click="tabChange('fans_type', '')">粉丝裂变</div>
            <div class="tab-item" :class="[fans_type === '1' ? 'active':'']" @click="tabChange('fans_type', '1')">粉丝转化</div>
          </div>
          <div>
            <div id="echats-fans" v-if="fans_type !== '1'" style="height: 220px; width: 21rem;"></div>
          </div>
          <div>
            <div id="echats-fans-line" v-if="fans_type === '1'" style="height: 220px; width: 21rem;"></div>
          </div>
          <div class="fans-box">
            <div class="fans-item" v-for="(fans,index) in fans_fission.data" :key="index">
              <p>{{fans.value}}</p>
              <p>{{fans.title}}</p>
            </div>
          </div>
        </div>

        <div class="plugin-items-box">
          <div class="plugin-items-icon" v-for="icon in income_page.plugin_data" :key="icon.url" @click="pluginGoto(icon)">
            <i class="iconfont" :class="icon.class"></i>
            <span>{{icon.title}}</span>
          </div>
        </div>

        <div class="order-box">
          <div class="tab-head">
            <div class="tab-item" :class="[extension_type !== '1' ? 'active':'']" @click="tabChange('extension_type', '')">推广订单</div>
            <div class="tab-item" :class="[extension_type === '1' ? 'active':'']" @click="tabChange('extension_type', '1')">推广粉丝</div>
          </div>
          <div class="order-list" v-if="extension_type !== '1'">
            <div class="order-item" v-for="order in extension_order.data" :key="order.order_sn">
              <div class="order-top">
                <p class="order-sn">{{order.order_sn}}</p>
                <p class="status">{{order.status_name}}</p>
              </div>
              <div class="order-bottom">
                <p class="time">{{order.create_time}}</p>
                <p class="money"><span class="old-price">{{$i18n.t("money")}}{{order.goods_price}}</span><span>实付:{{$i18n.t("money")}}{{order.price}}</span></p>
              </div>
            </div>
          </div>
          <div class="fans-list" v-if="extension_type === '1'">
            <div class="fans-item" v-for="order in extension_order.data" :key="order.order_sn">
              <img class="img" :src="order.avatar" alt="">
              <div class="fans-item-right">
                <div class="fans-item-top">
                  <p class="fans-name"><span>{{order.nickname}}</span> <span class="id">{{order.child_id}}</span></p>
                  <p class="pay-box">支付订单数: <span class="num">{{order.order_price}}</span></p>
                </div>
                <div class="fans-item-bottom">
                  <span class="time">{{order.created_at}}</span>
                  <p class="pay-box">支付订单总额: <span class="num">{{$i18n.t("money")}}{{order.order_count}}</span></p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="extension_order.data && extension_order.data.length <= 0" style="margin-top: 10px;">暂无数据</div>
        </div>

        <U_backup :btnFlag="btnFlag" :id="1" :datas="btnData"></U_backup>

        <i v-if="service" class="iconfont icon-member_kefu service-box" :style="{left:  fun.getPhoneEnv() == 3 ? '61%' : buttonClientWidth}" @click="openService"></i>

        <d-connect-customer-service
          :show="showPopup"
          :tel="service.service_mobile"
          :online="service.cservice"
          :qrcode="service.service_QRcode"
          @closed="showPopup=false"
        ></d-connect-customer-service>

        <!--海报部分-->
        <yz-goodsposter v-model="posterShow" :posterData="poster_Data" :defaultImg="poster" :width="`18.875rem`" v-on:finish="uploadImageM"></yz-goodsposter>
        <!--海报部分end-->

      </div>

      <!-- 优化推广中心 -->
      <div v-if="template === '02'">
        <div id="header">
          <div class="top">
            <div class="img">
              <img :src="userInfo.avatar" style="width: 100%; height: 100%;"/>
            </div>
            <ul class="header-info">
              <li class="header-name">{{ userInfo.nickname }}</li>
              <li v-if="show_member_id != 1">
                <span>[{{$i18n.t("extension.会员")}}ID：{{ userInfo.member_id }}]</span>
              </li>
            </ul>
            <div class="share" @click="toPage('MyIncome')" v-if="share_page">
              <i class="iconfont icon-extension_code"></i>
              <span>{{income_name_text}}{{$i18n.t("extension.分享")}}</span>
            </div>
          </div>
          <div class="income">
            <ul>
              <li class="header-top">{{$i18n.t("extension.累计")}}{{income_name_text}}</li>
              <li>
                <small>{{$i18n.t("money")}}</small>
                {{ userInfo.grand_total }}
              </li>
            </ul>
            <ul class="right">
              <li class="header-top">{{$i18n.t("extension.可")}}{{fun.initWithdrawal()}}{{income_name_text}}</li>
              <li>
                <small>{{$i18n.t("money")}}</small>
                {{ userInfo.usable_total }}
              </li>
            </ul>
            <div class="btn"
                 @click="gotoIncome"
                 v-if="userInfo.auto_withdraw == 0&&withdraw_date&&!withdraw_date.disable"
                 style="position: relative;">

              <button type="button">
                {{$i18n.t("extension.去")}}{{fun.initWithdrawal()}}<i class="fa fa-angle-right"></i>
              </button>
            </div>
            <div class="btn"
                 v-if="userInfo.auto_withdraw!=0&&withdraw_date&&!withdraw_date.disable">
              <button type="button"
                      style="background-color: #ccc;">
                {{ userInfo.auto_withdraw }}号自动{{fun.initWithdrawal()}}
                <i class="fa fa-angle-right"></i>
              </button>
            </div>
            <div class="btn"
                 @click="toToast"
                 v-if="withdraw_date&&withdraw_date.disable"
                 style="position: relative; width: 26%;">
              <button type="button" style="background-color: #ccc;">
                {{withdraw_date.day}}号可{{fun.initWithdrawal()}}<i class="fa fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>

        <ul id="detail">
          <li @click="toPage('myEarnings')"
              v-if="showEarning">
            <i class="iconfont icon-extension_receive"></i>
            <span>{{$i18n.t("extension.领取收益")}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li @click="toPage('incomedetails')">
            <i class="iconfont icon-member_integral1-copy"></i>
            <span>{{income_name_text}}{{$i18n.t("extension.明细")}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li @click="toPage('presentationRecord')">
            <i class="iconfont icon-member-withdrawals1"></i>
            <span>{{fun.initWithdrawal()}}{{$i18n.t("extension.明细")}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li @click="toPage('Performance')"
              v-if="is_show_performance">
            <i class="iconfont icon-extension_collect"></i>
            <span>{{$i18n.t("extension.营业额")}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li v-if="high_light.url " @click="btnHighLight">
            <i class="iconfont icon-fontclass-gaodeng"></i>
            <span>{{highLightName}}</span>
            <span class="high_light_count">{{high_light.count}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li v-if="is_show_limit">
            <i class="iconfont icon-cord_erdutixian"></i>
            <span>当前提现额度{{amount_num}}</span>
          </li>
        </ul>

        <!-- 权限插件模版 -->
        <div id="power">
          <div class="title">
            <div class="spare"></div>
            <h1>{{$i18n.t("extension.权限")}}</h1>
          </div>

          <!--  模板2 -->
          <div class="plugg" v-if="template === '02'">
            <div class="plug-list"
                 v-for="(item,i) in extension"
                 @click="gotoPage(item)" :key='i'>
              <i class="iconfont" :class="item.icon"></i>
              <ul class="left">
                <li class="left_a van-ellipsis">{{ item.title }}</li>
                <li class="left_b"
                    v-if="
                  item.level == null ||
                  item.level == '' ||
                  item.level == undefined
                    ? false
                    : true
                ">
                  {{ item.level }}
                </li>
                <li class="left_b"
                    v-if="
                  item.level == null ||
                  item.level == '' ||
                  item.level == undefined
                    ? true
                    : false
                "></li>
                <li class="left_c"><span>{{$i18n.t("money")}}</span>{{ item.value }}</li>
              </ul>
            </div>
          </div>
          <!-- 模板2end -->
        </div>

        <!-- 更多权限插件模版 -->
        <div id="more-power" v-if="is_show_unable==1">
          <div class="title">
            <div class="spare"></div>
            <h1>{{$i18n.t("extension.更多权限")}}</h1>
          </div>

          <!-- 模板2 -->
          <div class="plugg" v-if="template === '02'">
            <div class="plug-list"
                 v-for="(item,i) in unextension"
                 @click="gotoPage(item)"
                 :key='i'>
              <i class="iconfont"
                 :class="item.icon"></i>
              <ul class="left">
                <li class="left_a">{{ item.title }}</li>
                <li class="left_b"></li>
                <li class="left_c"><span>{{$i18n.t("money")}}</span>{{ item.value }}</li>
              </ul>
            </div>
          </div>
          <!-- 模板2end -->
        </div>

      </div>

      <div v-if="fun.isIphoneX()" style="height: 34px;"></div>
      <div style="height: 6.25rem;"></div>
    </div>
  </div>
</template>

<script>
import index_controller from "./index_controller";
export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
