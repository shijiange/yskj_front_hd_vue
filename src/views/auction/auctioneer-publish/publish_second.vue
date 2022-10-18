<template>
  <div id="publish_second" ref="publish_second">
    <c-title :hide="false" text="拍品发布"></c-title>
    <div class="content">
      <div class="item">
        <div class="title">市场价</div>
        <div class="input">
          <input type="number" @input="form.market_price = Number(form.market_price.replace(/[^0-9.]/, ''))" placeholder="请输入市场价" v-model="form.market_price" />
        </div>
      </div>
      <div class="item">
        <div class="title">起拍价</div>
        <div class="input">
          <input type="number" @input="form.start_price = Number(form.start_price.replace(/[^0-9.]/, ''))" placeholder="请输入起拍价" v-model="form.start_price" />
        </div>
      </div>
      <div class="item">
        <div class="title">一口价</div>
        <div class="input">
          <input type="number" placeholder="无一口价请设置0" v-model="form.fixed_price" />
        </div>
      </div>
      <div class="item">
        <div class="title">加一口</div>
        <div class="input">
          <input type="number" @input="form.mini_markup = Number(form.mini_markup.replace(/[^0-9.]/, ''))" placeholder="请输入价格" v-model="form.mini_markup" />
        </div>
      </div>
      <div class="item">
        <div class="title">保留价</div>
        <div class="input">
          <input type="number" @input="form.mini_deal = Number(form.mini_deal.replace(/[^0-9.]/, ''))" placeholder="请输入保留价" v-model="form.mini_deal" />
        </div>
      </div>
      <!--<div class="item">-->
        <!--<div class="title">起拍时段间隔(分钟)</div>-->
        <!--<div class="input">-->
          <!--<input type="number" placeholder="请输入起拍时段间隔" v-model="form.time_interval" />-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="item">-->
        <!--<div class="title">单次竞拍时长(分钟)</div>-->
        <!--<div class="input">-->
          <!--<input type="number" placeholder="请输入单次竞拍时长" v-model="form.duration" />-->
        <!--</div>-->
      <!--</div>-->
      <div class="item-special">
        <div class="title">
          <div><span>保证金</span><span style="color: #999;">(预付款)</span></div>
          <div class="enp">
            <div class="enp-choose">
              <span
                v-for="(item, index) in primise"
                :key="index"
                @click="chooseEnp(item)"
                :class="[item.checked ? 'bg' : '']"
              >
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
        <div class="input" v-show="form.prepayment_mode == '1'">
          <input type="number" placeholder="请输入比例" @input="form.advance_proportion = Number(form.advance_proportion.replace(/[^0-9.]/, ''))" v-model="form.advance_proportion" />
        </div>
        <div class="input" v-show="form.prepayment_mode == '2'">
          <input type="number" placeholder="请输入金额" @input="form.advance_money = Number(form.advance_money.replace(/[^0-9.]/, ''))" v-model="form.advance_money" />
        </div>
      </div>
      <div class="item-special">
        <div class="title">
          <div>
            <span>{{ endorsement_name }}</span
            ><span style="color: #999;">(预付款)</span>
          </div>
          <div class="enp">
            <div class="enp-choose">
              <span
                v-for="(item, index) in daiyan"
                :key="index"
                @click="chooseEm(item)"
                :class="[item.checked ? 'bg' : '']"
              >
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
        <div class="input" v-show="form.em_mode == '1'">
          <input type="number" placeholder="请输入比例" @input="form.em_proportion = Number(form.em_proportion.replace(/[^0-9.]/, ''))" v-model="form.em_proportion" />
        </div>
        <div class="input" v-show="form.em_mode == '2'">
          <input type="number" placeholder="请输入金额" @input="form.endorsement = Number(form.endorsement.replace(/[^0-9.]/, ''))" v-model="form.endorsement" />
        </div>
      </div>
      <div class="item">
        <div class="title">运费</div>
        <div class="input">
          <input type="number" placeholder="请输入运费" v-model="form.dispatch_price" />
        </div>
      </div>
      <div class="item">
        <div class="title">选择时间</div>

        <van-cell
          is-link
          title-style="text-align:left"
          class="select-time"
          center
          :border="false"
          @click="startTimeTag = true"
        >
          <span slot="title">开始时间:</span>
          <span slot="default">{{ start_shooting }}</span>
        </van-cell>
        <van-cell
          is-link
          title-style="text-align:left"
          class="select-time"
          center
          :border="false"
          @click="endTimeTag = true"
        >
          <span slot="title">结束时间:</span>
          <span slot="default">{{ end_shooting }}</span>
        </van-cell>
        <div class="item">
          <div class="title">拍卖结束前触发延时时间（分）</div>
          <div class="input">
            <input type="number" placeholder="请输入数值" v-model="form.delay_before_minute" />
          </div>
        </div>
        <div class="item">
          <div class="title">延时周期时间（分）</div>
          <div class="input">
            <input type="number" placeholder="请输入数值" v-model="form.delay_cycle_minute" />
          </div>
        </div>
      </div>
      <!--<div class="item">-->
        <!--<div class="title">是否开启新一轮</div>-->
        <!--<van-radio-group v-model="form.is_restart" style="display: flex; margin-top: 1rem;" checked-color="#ff0000">-->
          <!--<van-radio name="1" style="margin-right: 1rem;">是</van-radio>-->
          <!--<van-radio name="0">否</van-radio>-->
        <!--</van-radio-group>-->
      <!--</div>-->
    </div>
    <div class="wrap" :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']">
      <div class="left-btn" @click="toUp">上一步</div>
      <div class="right-btn" @click="showPop">发布</div>
    </div>
    <van-popup v-model="show" position="right" style="width: 100%; height: 100%;">
      <div class="popup">
        <i class="iconfont icon-pm_auction_success" style="color: #ff2c29; font-size: 100px;"></i>
        <div class="success">提交成功</div>
        <span>请等待管理员审核</span>
        <div class="btn" @click="back">返回</div>
      </div>
    </van-popup>

    <van-popup v-model="startTimeTag" position="bottom" :style="{ height: '40%' }" style="overflow: hidden;">
      <van-datetime-picker
        v-model="form.start_shooting"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="sureStartTime"
        @cancel="startTimeTag = false"
      />
    </van-popup>

    <van-popup v-model="endTimeTag" position="bottom" :style="{ height: '40%' }" style="overflow: hidden;">
      <van-datetime-picker
        v-model="form.end_shooting"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="sureEndtTime"
        @cancel="endTimeTag = false"
      />
    </van-popup>
  </div>
</template>

<script>
import publish_second_controller from './publish_second_controller';

export default publish_second_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#publish_second {
  background-color: #fff;
  height: 100vh;
  position: relative;
  overflow: scroll;

  .content {
    padding: 0 0.75rem;
    background-color: #fff;
    padding-bottom: 4rem;

    .item {
      text-align: left;
      padding: 0.875rem 0;
      border-bottom: solid 1px #f1f1f1;

      .input {
        margin-top: 1.125rem;

        input {
          outline: none;
          border: none;
          width: 100%;
          font-size: 12px;
        }
      }
    }

    .item-special {
      text-align: left;
      padding: 0.875rem 0;
      border-bottom: solid 1px #f1f1f1;

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .enp {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: flex-end;

          .enp-choose {
            width: 6.0625rem;
            border-radius: 0.6875rem;
            height: 1.8rem;
            margin-right: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ff6333;

            span {
              padding: 0.25rem 0.5rem;
              border-radius: 1rem;
              line-height: 1rem;
              font-size: 12px;
              color: #fff;
            }
          }
        }
      }

      .input {
        margin-top: 1.125rem;

        input {
          outline: none;
          border: none;
          width: 100%;
          font-size: 12px;
        }
      }
    }
  }

  .wrap {
    padding: 0.5rem 1rem;
    width: 100%;
    height: 3.0625rem;
    background-color: #fff;
    box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-btn {
      width: 5.8125rem;
      height: 1.875rem;
      border-radius: 0.9375rem;
      border: solid 0.0625rem #ff2c29;
      box-sizing: border-box;
      color: #f00;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-btn {
      width: 5.8125rem;
      height: 1.875rem;
      background-color: #f00;
      border-radius: 0.9375rem;
      box-sizing: border-box;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .popup {
    padding-top: 2.875rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    img {
      margin-bottom: 1.5rem;
    }

    .success {
      font-size: 24px;
      color: #000;
      margin-bottom: 1rem;
      width: 100%;
    }

    span {
      color: #999;
      display: inline-block;
      width: 100%;
    }

    .btn {
      width: 12.75rem;
      height: 2.8125rem;
      background-color: #ff6333;
      border-radius: 1.4375rem;
      font-size: 18px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      margin-top: 2.6875rem;
    }
  }

  /deep/.van-picker__confirm {
    color: #0bb20c;
    font-size: 15px;
  }
}

.bg {
  background-color: #fff !important;
  color: #ff1f1c !important;
}

.pc {
  width: 375px !important;
}

.select-time {
  padding-left: 0;
  padding-right: 0;
  height: 50px;

  .van-cell__title {
    flex: none;

    span {
      color: #555;
    }
  }
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
