<template>
  <div id="assessment">
    <c-title :hide="false" :text="lang.capital_name + '详情'"></c-title>
    <!-- 公共部分 -->
    <div id="content">
      <div class="m-swipe">
        <div
          style="line-height: 9.375rem; text-align: center; color: #999; font-size: 16px;"
          v-if="banner === ''"
        >
          一个轮播都没有...
        </div>
        <c-myswipe
          :pagination-visible="true"
          :slides="banner"
          :repeating="true"
          :auto="3000"
          v-if="banner !== ''"
        >
          <div v-for="(slide, index) in banner" :key="index">
            <a :href="slide | href_filters" v-if="slide" style="height: 38vw;">
              <img style="height: 8.75rem; width: 100%;" :src="slide" />
            </a>

            <a href="javascript:;" v-if="!slide" style="height: 38vw;">
              <img
                style="height: 8.75rem; width: 100%;"
                src="../../../assets/images/img_default.png"
              />
            </a>
          </div>
        </c-myswipe>
      </div>

      <div class="company_info">
        <div class="info_a">
          <ul class="box">
            <li>
              <img src="../../../assets/images/brief.png" />
            </li>
            <li>
              {{ industry_detail.name }}
            </li>
            <li @click="more">
              更多
              <i class="fa fa-angle-right"></i>
            </li>
          </ul>
        </div>
        <div class="info_b">
          <ul class="text">
            <li>
              <h1>{{ industry_detail.asset_name }}</h1>
            </li>
            <li>
              <i class="iconfont icon-seller-home"></i
              >{{ industry_detail.industry_name }}
            </li>
            <li>
              <i class="iconfont icon-seller-position"></i
              >{{ industry_detail.industry_address }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="middle">
      <!-- 导航 -->
      <div class="nav_box">
        <ul class="nav">
          <li
            v-for="(item, index) in tabs"
            @click="handleChange(item)"
            :class="{ current: currentTab == item.mark }"
            :key="index"
            v-if="item.status === 1"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="all" @click="showClass">
          <i class="iconfont icon-more-list"></i>
        </div>
      </div>
      <!-- 简况 -->
      <div class="box_h" v-if="currentTab === 'base'">
        <div class="content_b">
          <h2>基本信息</h2>
          <ul class="list">
            <li>
              <span>所属分类：</span>
              <span>{{ asset_detail.category_name }}</span>
            </li>
            <li>
              <span>标签：</span>
              <span>{{ asset_detail.asset_label }}</span>
            </li>
          </ul>
        </div>
        <div
          class="content_c"
          v-if="
            asset_detail.asset_property &&
              asset_detail.asset_property.length > 0
          "
        >
          <h2>{{ lang.capital_name }}属性</h2>
          <ul class="list">
            <li
              v-for="(item, index) in asset_detail.asset_property"
              :key="index"
            >
              <span>{{ item.title }}：</span>
              <span>{{ item.value }}</span>
            </li>
          </ul>
        </div>
        <div class="content_d">
          <h3>{{ lang.capital_name }}详情</h3>
          <div class="text" v-html="asset_detail.asset_content"></div>
        </div>
      </div>

      <!-- 评估 -->
      <div class="box_a" v-if="currentTab === 'assess'">
        <div class="text">
          <p></p>
        </div>
        <div class="new_assess" v-if="assess_data.last_worth">
          <ul class="assess">
            <li>最新评估价值</li>
            <li><span>{{$i18n.t('money')}}</span>{{ assess_data.last_worth }}</li>
          </ul>
        </div>
        <div
          class="down_report"
          v-for="(item, index) in assess_list"
          :key="index"
        >
          <div class="report_box">
            <h2>
              {{ index + 1 }}、{{ item.title }}
              <i class="fa fa-angle-right"></i>
            </h2>
            <ul class="content">
              <li>时间：{{ item.created_at }}</li>
              <li>评估机构：{{ item.agency }}</li>
              <li>评估市值：人民币{{ item.worth }}万元</li>
            </ul>
            <a :href="item.file_url" download>点击下载评估报告</a>
          </div>
        </div>
      </div>

      <!-- 公告 -->
      <div class="box_b" v-if="currentTab === 'notice'">
        <div>
          <div class="list">
            <ul
              class="notice"
              v-for="(item, index) in notice_list"
              :key="index"
              @click="noticeDel(item)"
            >
              <!-- :class="{notice_title:notice_title}" -->
              <li>
                <span>{{ item.title }}</span>
                <i class="fa fa-angle-right"></i>
              </li>
              <li>
                <span>作者：{{ item.author }}</span>
                <span>{{ item.created_at }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 财务 -->
      <div class="box_c" v-if="currentTab === 'finance'">
        <div>
          <div class="list">
            <ul
              class="finance"
              v-for="(item, index) in finance_list"
              :key="index"
              @click="financeDel(item)"
            >
              <li>
                <span>{{ item.title }}</span>
                <i class="fa fa-angle-right"></i>
              </li>
              <li>
                <span>作者：{{ item.author }}</span>
                <span>{{ item.reported_at }}</span>
              </li>
              <li @click.stop>
                <a :href="item.file_url" download>点击下载财务报告</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 数字资产-->
      <div class="box_d" v-if="currentTab === 'digitization'">
        <div class="form">
          <ul class="asset">
            <h4>{{ lang.capital_name }}构成</h4>
            <li class="opacity">可用{{ lang.digitization_name }}（单位）</li>
            <li>{{ digitization_Data.base.usable }}</li>
            <li class="opacity">
              不可用{{ lang.digitization_name }}：{{
                digitization_Data.base.froze
              }}
            </li>
          </ul>
        </div>
        <div class="total">
          <ul class="number">
            <h5>总量</h5>
            <li>总发行：{{ digitization_Data.base.total }}</li>
            <li>已发行：{{ digitization_Data.base.publish }}</li>
            <li>未发行：{{ digitization_Data.base.spare }}</li>
          </ul>
        </div>
        <!-- 图表 -->
        <!--<div class="chart1">-->
          <!--<div-->
            <!--class="img"-->
            <!--style="width: 100%; height: 400px;"-->
            <!--v-if="digitization_Data.subscription_price.week"-->
          <!--&gt;-->
            <!--&lt;!&ndash;:XData="digitization_Data.subscription_price.week"&ndash;&gt;-->
            <!--<ECharts-->
              <!--:id="'echarts1'"-->
              <!--:text="lang.subscription_name + '价格曲线'"-->
              <!--:YData="digitization_Data.subscription_price.value"-->
              <!--style="height: 400px; width: 22rem;"-->
            <!--/>-->
          <!--</div>-->
          <!--<span>{{ lang.subscription_name }}价格曲线</span>-->
        <!--</div>-->

        <!--<div class="chart">-->
          <!--<div-->
            <!--class="img"-->
            <!--style="width: 100%; height: 400px;"-->
            <!--v-if="digitization_Data.sell_price.week"-->
          <!--&gt;-->
            <!--&lt;!&ndash;:XData="digitization_Data.sell_price.week"&ndash;&gt;-->
            <!--<ECharts-->
              <!--:id="'echarts2'"-->
              <!--:text="'拍卖价格曲线'"-->
              <!--:YData="digitization_Data.sell_price.value"-->
              <!--style="height: 400px; width: 22rem;"-->
            <!--/>-->
          <!--</div>-->
          <!--<span>拍卖价格曲线</span>-->
        <!--</div>-->
        <!--<div class="purchase">-->
          <!--<van-swipe style="height: 3.75rem;" vertical :show-indicators="false" :height="30" :autoplay='1000'>-->
            <!--<van-swipe-item v-for="(item,i) in digitization_Data.subscribe_record" :key='i'>-->
              <!--{{ item.username }} {{ lang.subscription_name }}了{{-->
                <!--item.total-->
              <!--}}单位-->
            <!--</van-swipe-item>-->
          <!--</van-swipe>-->
        <!--</div>-->
        <!--<div class="buy_btn">-->
          <!--<van-button type="primary" v-if="can_subscribe" @click.native="tobuy"-->
            <!--&gt;我要{{ lang.subscription_name }}</van-button-->
          <!--&gt;-->
          <!--<van-button type="primary" @click.native="tosell">我要拍卖</van-button>-->
          <!--<van-button type="primary" @click.native="auction">拍卖中</van-button>-->
        <!--</div>-->
        <!--<div class="buy_record">-->
        <!--<div class="img" id="chart_example">-->
        <!--<img src="../../../assets/images/photo-mr.jpg">-->
        <!--</div>-->
        <!--<button @click="detail" style="border:none">记录明细</button>-->
        <!--<i class="fa fa-angle-right"></i>-->
        <!--</div>-->
      </div>

      <!-- 分红 -->
      <div class="box_e" v-if="currentTab === 'bonus'">
        <div class="sum">
          <ul class="bonus">
            <li>
              {{ lang.capital_name }}总{{ lang.bonus_name }}金额：{{$i18n.t('money')}}
              {{ profit.bonus_amount || 0 }}
            </li>
            <li>
              累计{{ lang.bonus_name }}次数：{{ profit.bonus_num || 0 }}次
            </li>
            <li>
              累计{{ lang.bonus_name }}人数：{{ profit.bonus_member || 0 }}人
            </li>
            <li>
              单人累计最高{{ lang.bonus_name }}金额：{{$i18n.t('money')}}{{
                profit.max_member || 0
              }}
            </li>
            <!--<li>原始单资产累计分红金额：{{$i18n.t('money')}}{{profit.init_accumlative_momery}}</li>-->
          </ul>
        </div>
        <div>
          <div
            class="list"
            v-for="(item, index) in profit_list"
            :key="index"
            v-if="item"
          >
            <h3>{{ lang.bonus_name }}记录</h3>
            <ul class="record">
              <li>
                <span>分红金额：{{$i18n.t('money')}}{{ item.amount }}</span>
                <span>{{ item.created_at }}</span>
              </li>
              <li>单{{ lang.capital_name }}价值：{{$i18n.t('money')}}{{ item.unit_amount }}</li>
              <li>
                发行{{ lang.capital_name }}总量：{{$i18n.t('money')}}{{ item.useable_amount }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 商品 -->
      <div class="box_f" v-if="currentTab === 'goods'">
        <div class="main">
          <dl :key="item.goods_id"
            v-for="item in goods_list"
            @click.stop.prevent="gotoDetail(item.goods_id)"
          >
            <dt v-if="item.thumb_url">
              <img
                :src="item.thumb_url"
                @click.stop.prevent="gotoDetail(item.goods_id)"
              />
            </dt>
            <dt v-if="!item.thumb_url">
              <img src="../../../assets/images/img_default.png" />
            </dt>
            <dd class="m-text" style="-webkit-box-orient: vertical;">
              {{ item.title | escapeTitle }}
            </dd>
            <dd class="s3">
              <p class="s1">
                <span style="color: red;">
                  <small>{{$i18n.t('money')}}</small><em>{{ item.price }}</em>
                </span>
                <span class="s2" v-show="parseInt(item.market_price)">{{ item.market_price }}</span>
              </p>
            </dd>
          </dl>
        </div>
      </div>

      <!-- 门店 -->
      <div class="box_g" v-if="currentTab === 'store'">
        <div
          class="store-list"
          @click="toRouter(items)"
          v-for="(items,i) in store_list" :key='i'
        >
          <div class="store-img">
            <div class="store-logo">
              <span class="img-mask" v-if="items.operating_state === 1"></span>
              <span class="img-text" v-if="items.operating_state === 1"
                >商家休息中</span
              >
              <img :src="items.thumb" />
            </div>
          </div>
          <div class="store-intro">
            <div class="a8q ">
              <h2>{{ items.store_name }}</h2>
            </div>
            <div class="a06 a8r">
              <strong class="i8">
                <span class="da">{{ items.dispatch }}</span>
              </strong>
            </div>
            <div class="a8v order">
              <p class="a8d">
                <cStar :score="items.average_score"></cStar>
              </p>
              <p class="a8w">
                <span class="line_split"></span>已售{{ items.order_total }}单
              </p>
            </div>
            <div
              class="a8v"
              v-if="items.store_point.point_switch == 0 ? false : true"
            >
              <p class="a8w">
                <span style="margin-right: 0.625rem;">{{
                  items.store_point.point
                }}</span>
                <span
                  v-if="
                    items.store_point.point_deduct_switch == 0 ? false : true
                  "
                  >{{ items.store_point.max_point_deduct }}</span
                >
              </p>
            </div>
            <div class="a8v" v-if="items.store_love.award == 1 ? true : false">
              <p class="a8w">
                <span style="margin-right: 0.625rem;">{{
                  items.store_love.award_proportion
                }}</span>
                <span v-if="items.store_love.deduction == 1 ? true : false">{{
                  items.store_love.deduction_proportion
                }}</span>
              </p>
            </div>
          </div>
          <div class="store_honor_box">
            <div class="store_honor_icon1">
              <a :href="'tel:' + items.mobile" @click.stop>
                <i
                  class="fa fa-phone"
                  aria-hidden="true"
                  style="font-size: 22px; margin-right: 0.9375rem;"
                ></i>
              </a>
            </div>
            <span class="store_honor_icon1" style="font-size: 12px;"
              >地址：{{ items.address.detailed_address }}</span
            >
          </div>
        </div>
      </div>

      <!-- 弹窗 -->
      <transition name="fade">
        <div class="popup" v-show="showPopup">
          <div class="up"></div>
          <div
            class="cartWrapper"
            ref="cartWrapper"
            style="max-height: 7rem; overflow: hidden; border-top: solid 0.0625rem #ebebeb;"
          >
            <ul class="popups">
              <li
                @click="handleChange(item)"
                v-for="(item, index) in tabs"
                v-if="item.status === 1"
                :class="currentTab === item.mark ? 'choose' : ''"
                :key="index"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import assessment_controller from "./assessment_controller";

export default assessment_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.van-swipe-item {
  line-height: 30px !important;
}

#assessment {
  #content {
    background: #fff;
    padding: 0.625rem 0;
    // .banner {
    //   margin: 0 auto;
    //   width: 21.5625rem;
    //   height: 8.75rem;
    //   border-radius: 0.375rem;
    //   overflow: hidden;
    // }
    .company_info {
      background: #fff;
      width: 21.5625rem;
      border-radius: 0.375rem;
      margin: 1.25rem auto 0.625rem;
      box-shadow: 0 0.125rem 0.625rem #ccc;

      .info_a {
        border-bottom: solid 0.0625rem #ebebeb;

        .box {
          position: relative;
          display: flex;
          padding-left: 0.375rem;

          li {
            height: 2.25rem;
            line-height: 2.25rem;
          }

          li:first-child {
            margin-right: 0.375rem;

            img {
              width: 2.25rem;
              height: 2.25rem;
            }
          }

          li:last-child {
            position: absolute;
            right: 0.625rem;
            color: #8c8c8c;
            display: flex;

            i {
              font-size: 1.25rem;
              color: #c9c9c9;
              margin-left: 0.375rem;
              line-height: 2.25rem;
            }
          }
        }
      }

      .info_b {
        padding: 0.625rem;

        .text {
          text-align: left;

          li:first-child {
            font-size: 18px;
            line-height: 30px;
          }

          li:nth-child(2),
          li:last-child {
            line-height: 1.5rem;
            color: #8c8c8c;
            font-size: 14px;
            display: flex;

            i {
              font-size: 1.25rem;
              color: #666;
              margin-right: 0.125rem;
            }
          }
        }
      }
    }
  }
  // 导航
  .nav_box {
    margin-top: 0.625rem;
    background: #fff;
    border-bottom: solid 0.0625rem #ebebeb;
    overflow-x: scroll;
    white-space: nowrap;
    position: relative;
    display: flex;
    padding-right: 2.5rem;

    .nav {
      display: flex;
      padding: 0 2.5rem 0 0.625rem;
      overflow: auto;

      li {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.625rem;
        font-weight: bold;
        font-size: 16px;
      }

      .current {
        color: #f7a145;
        border-bottom: solid 0.1875rem #f7a145;
      }
    }

    .all {
      position: absolute;
      right: 0;
      width: 2.5rem;
      height: 2.5rem;
      background: #fff;

      i {
        line-height: 2.5rem;
        font-size: 1.5rem;
        color: #666;
      }
    }
  }
  // 评估
  .box_a {
    padding-bottom: 2.5rem;
    background: #fff;

    .text {
      padding: 0.625rem 1.25rem;

      p {
        font-size: 14px;
        text-align: left;
        color: #8c8c8c;
      }
    }

    .new_assess {
      margin: 1.25rem auto;
      padding: 0.625rem 0.875rem;
      width: 21.5625rem;
      border-radius: 0.375rem;
      background-image: url(../../../assets/images/assess_bg.png);
      background-repeat: no-repeat;
      background-size: 100%;

      .assess {
        text-align: left;
        color: #fff;

        li:first-child {
          line-height: 1.875rem;
          font-size: 16px;
        }

        li:last-child {
          font-size: 24px;
          line-height: 2.25rem;

          span {
            font-size: 16px;
          }
        }
      }
    }

    .down_report {
      width: 21.5625rem;
      margin: 0.625rem auto;

      .report_box {
        background: #f5f5f5;
        margin-top: 0.625rem;

        h2 {
          position: relative;
          display: flex;
          margin-left: 0.625rem;
          line-height: 1.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 14px;
          font-weight: normal;

          i {
            position: absolute;
            line-height: 1.875rem;
            right: 0.625rem;
            color: #c9c9c9;
            font-size: 1.25rem;
          }
        }

        .content {
          text-align: left;
          padding: 0.625rem 0;

          li {
            line-height: 1.5rem;
            padding: 0 1.25rem;
          }
        }

        button,
        a {
          width: 100%;
          height: 1.875rem;
          font-size: 14px;
          background-color: #469de2;
          color: #fff;
          border: none;
        }

        a {
          display: inline-block;
          line-height: 1.875rem;
        }
      }
    }
  }
  // 公告
  .box_b {
    background-color: #fff;
    padding-bottom: 0.5rem;

    .list {
      .notice {
        margin-left: 0.875rem;
        padding: 0.625rem 0.875rem 0.625rem 0;
        border-bottom: solid 0.0625rem #ebebeb;

        li {
          line-height: 1.625rem;
          display: flex;
          justify-content: space-between;
          font-size: 16px;

          span {
            color: #8c8c8c;
            font-size: 12px;
          }
        }

        li:first-child {
          display: block;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1.875rem;

          span {
            width: 80%;
            font-size: 16px;
            color: #333;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            text-align: left;
          }

          i {
            font-size: 18px;
            color: #c9c9c9;
          }
        }
      }
    }
  }
  // 财务
  .box_c {
    background-color: #fff;
    padding-bottom: 2.5rem;

    .list {
      padding-top: 0.625rem;

      .finance {
        margin: 0 0.875rem 0.875rem 0.875rem;
        padding-top: 0.625rem;
        background: #f5f5f5;

        li {
          line-height: 1.625rem;
          padding: 0 0.875rem;
          display: flex;
          justify-content: space-between;
          font-size: 16px;

          span {
            color: #8c8c8c;
            font-size: 12px;
          }
        }

        li:first-child {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1.875rem;

          span {
            width: 80%;
            font-size: 16px;
            color: #333;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            text-align: left;
          }

          i {
            font-size: 18px;
            color: #c9c9c9;
          }
        }

        li:last-child {
          padding: 0;
        }

        button,
        a {
          width: 100%;
          height: 1.875rem;
          font-size: 14px;
          background-color: #469de2;
          color: #fff;
          border: none;
        }

        a {
          margin-top: 0.625rem;
          display: inline-block;
          line-height: 1.875rem;
        }
      }
    }
  }
  // 数字资产
  .box_d {
    background: #fff;
    padding-top: 1.25rem;
    padding-bottom: 2.5rem;

    .form {
      margin: 0 auto 0.625rem;
      width: 21.5625rem;
      border-radius: 0.375rem;
      background-image: url(../../../assets/images/number_bg.png);
      background-repeat: no-repeat;
      background-size: 100%;
      color: #fff;

      .asset {
        text-align: left;
        padding: 0 0 0.625rem 0.625rem;

        h4 {
          line-height: 2.5rem;
          font-size: 16px;
        }

        li {
          padding: 0 1.25rem;
        }

        li:nth-child(2) {
          line-height: 1.5rem;
        }

        li:nth-child(3) {
          font-size: 28px;
        }

        li:last-child {
          line-height: 1.5rem;
        }

        .opacity {
          opacity: 0.8;
        }
      }
    }

    .total {
      .number {
        text-align: left;
        padding: 0 0.875rem;

        h5 {
          line-height: 2.5rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 16px;
          margin-bottom: 0.625rem;
        }

        li {
          line-height: 1.5rem;
          padding-left: 1.25rem;
        }
      }
    }

    .chart1 {
      margin-top: 0.625rem;

      .img {
        margin: 0 auto;
        width: 18.75rem;
        height: 10.375rem;
        background: #fff;
      }

      span {
        font-size: 14px;
        line-height: 1.875rem;
        display: block;
      }
    }

    .chart {
      margin-top: 2.625rem;

      .img {
        margin: 0 auto;
        width: 18.75rem;
        height: 10.375rem;
        background: #fff;
      }

      span {
        font-size: 14px;
        line-height: 1.875rem;
        display: block;
      }
    }

    .purchase {
      margin: 1.25rem auto 0;
      width: 21.5625rem;
      height: 3.875rem;
      border: solid 0.0625rem #ebebeb;
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .buy_btn {
      width: 21.5625rem;
      margin: 1rem auto 0;
      display: flex;
      justify-content: space-between;

      button {
        flex: 1;

        /* width: 6.25rem; */
        height: 1.875rem;
        border-radius: 0.1875rem;
        background: #ff9800;
        border: none;
        padding: 0;
        margin: 0 10px;
      }
    }

    .buy_record {
      margin-top: 1rem;
      padding: 0.625rem 0.875rem;
      display: flex;
      align-items: center;
      position: relative;
      border-top: solid 0.0625rem #ebebeb;
      border-bottom: solid 0.0625rem #ebebeb;

      .img {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 1.125rem;
        overflow: hidden;
        background: #ccc;
        margin-right: 0.625rem;

        img {
          width: 100%;
        }
      }

      span {
        font-size: 16px;
      }

      i {
        position: absolute;
        line-height: 2.8125rem;
        font-size: 1.5rem;
        color: #c9c9c9;
        right: 0.875rem;
      }
    }
  }
  // 分红
  .box_e {
    padding-bottom: 2.5rem;

    .sum {
      background: #fff;
      padding: 0.625rem 0.875rem;

      .bonus {
        background: #f5f5f5;
        padding: 0.625rem;
        text-align: left;
        border-radius: 0.25rem;

        li {
          line-height: 1.5rem;
          font-size: 14px;
        }
      }
    }

    .list {
      background: #fff;
      margin-top: 0.625rem;
      text-align: left;
      padding-left: 0.875rem;

      h3 {
        line-height: 2.5rem;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      .record {
        padding: 0.625rem 0;
        border-bottom: solid 0.0625rem #ebebeb;

        li {
          line-height: 1.5rem;
          padding-right: 0.875rem;
          display: flex;
          justify-content: space-between;

          span:last-child {
            font-size: 14px;
            color: #8c8c8c;
          }
        }
      }
    }
  }
  // 商品
  .box_f {
    .main {
      overflow: hidden;
      margin-right: -0.0625rem;
      background: #f5f5f5;

      dl:nth-child(2n) {
        margin-right: 0;
      }

      dl {
        padding: 0;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        float: left;
        margin-bottom: 1.2vw;
        margin-right: 1.2vw;
        background: #fff;
        width: 49.4vw;

        dt {
          height: 50vw;
          line-height: 82vw;
        }

        dt {
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          position: relative;

          img {
            width: 100%;
            right: 0;
            height: 100%;
            position: absolute;
          }
        }

        .s3 {
          height: 1.5625rem;

          /* line-height: 30px; */
          text-align: left;
          margin: 0 0.3125rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;

          /* white-space:nowrap */
        }

        dd {
          margin: 0;

          .s1 {
            margin: 0;
            // .s {color: #F55955;
            // font-size: 16px;
            // vertical-align: middle;}
            em {
              font-size: 16px;
              font-style: normal;
            }
          }

          .s2 {
            text-decoration: line-through;
            vertical-align: middle;
            color: #888;
            font-size: 12px;
            margin-left: 0.625rem;
          }
        }

        .m-text {
          font-size: 14px;
          margin: 0.25rem 0.375rem;
          height: 2.625rem;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          word-break: break-all;
          overflow: hidden;
          line-height: 1.34rem;
          text-align: justify;
        }
      }
    }
  }
  // 门店
  .box_g {
    .store-list {
      /* .store-list { */
      display: flex;
      padding: 0.75rem;
      border-top: 0.0625rem solid #e7e9e4;

      /* width: 97%; */
      background: #fff;
      font-size: 14px;

      /* font-size: .9rem; */
      color: #333;
      text-align: left;
      position: relative;

      /* } */

      .store-img {
        /* position: relative; */
        display: flex;
        flex-direction: column;
      }

      .store-img .store-logo {
        /* position: absolute; */

        /* left: 0.625rem; */

        /* top: 0; */

        /* bottom: 0; */

        /* float: none; */
        width: 4rem;
        height: 4rem;

        .img-mask {
          position: relative;
          top: 60%;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 40%;
          border: 0.0625rem solid #e8e8e8;
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 12px;
          background-color: #3b4043;
          opacity: 0.6;
        }

        .img-text {
          position: relative;
          top: 20%;
          left: 3%;
          z-index: 15;
          width: 100%;
          height: 40%;
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 12px;
          color: white;
        }
      }

      .store-img img {
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        width: 4rem;
        height: 4rem;
        border: 0.0625rem solid #e8e8e8;
        display: inline-block;
      }

      .store-intro {
        width: 11.25rem;
        display: inline-block;
        position: relative;
        margin-left: 0.625rem;
      }

      .store-intro .a8q {
        height: 1.25rem;
        line-height: 1.25rem;
        overflow: hidden;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -moz-flex: 1;
        -ms-flex: 1;
        -webkit-box-flex: 1;
        flex: 1;
      }

      .store-intro .a8q h2 {
        font-size: 16px;
        color: #333;

        /* overflow: hidden; */
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        margin-top: 0;
        font-weight: bold;
        -moz-flex: 1;
        -ms-flex: 1;
        -webkit-box-flex: 1;
        flex: 1;
      }

      .store-intro .a8q .store_honor_icon1 {
        display: inline-block;
        width: 5.5rem;
        height: 1.25rem;
        font-size: 12px;
        text-align: right;
        margin-right: 0.125rem;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 1rem auto;
      }

      .store-intro .a8r {
        font-size: 0;
        padding-top: 0.625rem;
        overflow: hidden;
      }

      .store-intro .a8r .i8 {
        display: inline-block;
        background-color: #f5f5f5;
        font-size: 0;
        border-radius: 0.125rem;
        color: #18bdad !important;
        line-height: 0; // height: 0.9375rem;
        overflow: hidden;
      }

      .store-intro .a8r .i8 .da {
        display: inline-block;
        line-height: 1;
        padding: 0.125rem;
        font-size: 10px;
      }

      .store-intro .a8v {
        height: 0.875rem;
        margin-top: 0.5rem;
        overflow: hidden;
        font-size: 0;
      }

      .order {
        display: flex;
      }

      .store-intro .a8v .a8d {
        // height: 12px;

        /* padding-top: 2px; */
        overflow: hidden;
        display: inline-block;
        position: relative;
      }

      .store-intro .a8v .a8d .a79 {
        display: inline-block;
        font-size: 0;
      }

      .store-intro .a8v .a8d .a79 i {
        display: inline-block;
        width: 0.625rem;
        height: 0.625rem;
        background-position: 0 0;
        background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/newStar.png);
        background-repeat: no-repeat;
        background-size: auto 0.625rem;
        margin-right: 0.0625rem;
      }

      .store-intro .a8v .a8d .a79 .zo {
        background-position: -0.625rem 0;
      }

      .store-intro .a8v .a8w {
        font-size: 11px;
        line-height: 0.875rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #999;
        display: inline-block;

        span {
          color: #ff9800;
        }
      }

      .store-intro .a8v .a8w .line_split {
        display: inline-block;
        width: 0.5rem;
        height: 0.625rem;
        background:
          url(//static-o2o.360buyimg.com/daojia/new/images/index/icon_line_split.jpg)
          no-repeat center 0.125rem;
      }

      .store_honor_box {
        display: inline-block;
        position: absolute;
        text-align: right;
        right: 1rem;
        width: 8rem;

        span {
          color: #8c8c8c;
        }

        .fa {
          color: #18bdad;
        }
      }

      .store_honor_icon1 {
        display: block;
        color: #18bdad;
      }
    }
  }
  //简况
  .box_h {
    background: #fff;
    padding-bottom: 1rem;

    .content_a {
      margin: 0.625rem;
      background: #f5f5f5;
      border-radius: 0.375rem;
      padding: 0.625rem;

      .company_info {
        li {
          text-align: left;
          color: #8c8c8c;
          font-size: 14px;
          display: flex;

          i {
            font-size: 1.5rem;
            color: #999;
            line-height: 1.25rem;
          }

          h1 {
            font-size: 16px;
            line-height: 2.25rem;
            color: #333;
          }
        }

        li:last-child {
          line-height: 1.25rem;
        }
      }
    }

    .content_b,
    .content_c {
      padding-top: 0.625rem;

      h2 {
        font-size: 16px;
        line-height: 1.875rem;
        text-align: left;
        padding: 0 0.625rem;
      }

      .list {
        margin-top: 0.625rem;
        padding: 0 0.875rem;

        li {
          display: flex;
          font-size: 14px;
          text-align: left;
          line-height: 1.625rem;

          span:first-child {
            width: 6.25rem;
            color: #8c8c8c;
            display: block;
          }

          span:last-child {
            width: 15.4375rem;
          }
        }
      }
    }

    .content_d {
      margin-top: 0.625rem;
      text-align: left;

      h3 {
        font-size: 16px;
        line-height: 1.875rem;
        padding: 0 0.625rem;
      }

      .text {
        margin: 0.625rem 0.875rem;
        border: solid 0.0625rem #ebebeb;
        padding: 0.625rem;
      }
    }
  }

  .middle {
    position: relative;
  }

  .popup {
    position: absolute;
    top: 2.5rem;
    right: 0;
    width: 7rem;
    background-color: #333;
    opacity: 0.9;
  }

  .up {
    position: absolute;
    right: 0.8rem;
    top: -0.5rem;
    width: 0;
    height: 0;
    border-left: 0.375rem solid transparent;

    /* border-top: 0.625rem solid #5851c3; */
    border-right: 0.375rem solid transparent;
    border-bottom: 0.5rem solid #333;
    box-sizing: border-box;
    opacity: 0.9;
  }

  .popups {
    li {
      background-color: #333;
      opacity: 0.9;
      color: #fff;
      border-bottom: solid 0.0625rem #fff;
      line-height: 2rem;
    }

    /* li:first-child { */

    /* border-radius: 0.3125rem 0.3125rem 0 0; */

    /* } */

    /* li:last-child { */

    /* border-radius: 0 0 0.3125rem 0.3125rem; */

    /* } */
    .choose {
      color: #f7a145;
    }
  }
}
</style>
