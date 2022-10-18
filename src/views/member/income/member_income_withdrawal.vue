<template>
  <div id="withdrawal"
       :class="[fun.getPhoneEnv() == 3?'pcStyle':''] ">
    <c-title :hide="false"
             :text="`${income_name_text}${fun.initWithdrawal()}`"
             tolink="presentationRecord"
             :totext="`${fun.initWithdrawal()}记录`"
             :setQuery="{extension: 'extension'}"></c-title>
    <div style="height: 40px;"></div>
    <div class="blank"
         v-if="Data.length<=0">
      <img src="../../../assets/images/blank.png">
      <span>暂无可提现金额</span>
    </div>

    <ul class="tbbox_a" v-if="Data.length>0">
      <li class="libg ones"
          @click.stop="selectBolfun(1)">
        <van-checkbox checked-color="#f15353"
                      @change="allSelect"
                      v-model="checkAll"
                      :checked="checkAll"
                      :disabled="!isCheckAll">
          <span style="display: inline-block; width: 2px; height: 1px;"></span>
        </van-checkbox>
      </li>
      <li class="libg">类型</li>
      <li class="libg">金额</li>
      <li class="libg">{{poundage_name}}</li>
    </ul>
    <van-checkbox-group v-if="Data.length>0" v-model="checkList"
                        @change="allSelectHandle">
      <template v-for="(item,index) in datasource">
        <ul class="tbbox" :key="index">
          <li class="libg2 ones"
              @click.stop="selectBolfun(0)">
            <van-checkbox checked-color="#f15353"
                          :key="item"
                          :name="item"
                          :disabled="!item.can || (income_type && item.income_type !== income_type)">
            </van-checkbox>
          </li>
          <li class="libg2" style="line-height: 1rem; display: flex; flex-direction: column; align-self: center;">
            {{ item.type_name }}
            <p v-if="!item.can" style="line-height: 1rem; font-size: 12px; margin-top: 0.5rem;">
              最低{{fun.initWithdrawal()}}额:{{ item.roll_out_limit }}
            </p>
          </li>
          <li class="libg2">{{ item.income }}</li>
          <li class="libg2">{{ item.poundage }}</li>
        </ul>
      </template>
    </van-checkbox-group>
    <div style="height: 0.625rem;"></div>

    <!-- 提现到银行卡弹窗 -->
    <van-popup v-model="popupVisible"
              style="width: 72%; border-radius: 0.375rem;">
      <form :action="action"
            method="post"
            style="width: 100%; height: 100%;">
        <h1 style="font-size: 16px; color: #333; padding: 1.25rem 0; line-height: 2.25rem; font-weight: normal; border-bottom: solid 0.0625rem #ebebeb;">
          {{ notice }}
        </h1>
        <input type="text"
               name="ipsRequest"
               :value="msg"
               style="display: none; margin-top: 0.625rem;" />
        <input type="submit"
               value="确认"
               style="width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 16px; color: #26a2ff; border: none;" />
      </form>
    </van-popup>
    <!-- 提现到银行卡弹窗end -->

    <div class="bottom_btn"
         @click="getMergeServicetax">
      <button type="button"
              class="btn custom_color">去{{fun.initWithdrawal()}}</button>
    </div>
    <!-- 提现方式弹窗 -->
    <van-popup v-model="show1"
              position="bottom"
              :style="{height:'60%'}">
      <div class="withdrawal_box">
        <h2>
          {{fun.initWithdrawal()}}到<i class="iconfont icon-close11"
             @click="show1 = false"></i>
        </h2>
        <div class="userinfo">
          <ul>
            <li>
              <span class="top">{{ totalwithdrawal }}</span><br />
              <span class="bottom">{{fun.initWithdrawal()}}金额合计</span>
            </li>
          </ul>
          <ul>
            <li>
              <span class="top">{{ poundage }}</span><br />
              <span class="bottom">{{poundage_name}}合计</span>
            </li>
          </ul>
          <ul v-if="service_switch == 1">
            <li>
              <span class="top">{{ servicetax }}</span><br />
              <span class="bottom">{{special_service_tax_text}}合计</span>
            </li>
          </ul>
        </div>

        <div class="deduction_value" v-if="deduction_love.deduction_status && TeamDividendModel">
          扣除{{deduction_love.love_name}}： {{deduction_love.deduction_value}}
        </div>

        <div class="recharge_way">
          <ul class="choose_box">
            <van-radio-group v-model="pay_type">
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="balance.value"
                         v-if="isBalance">
                <template v-if="balance_special">
                  <li>
                    <i class="iconfont icon-balance_g"></i>{{ balance.name }}
                  </li>
                  <p style="font-size: 13px; color: #8c8c8c; text-align: left; margin-left: 3rem;">
                    （{{poundage_name}}:{{ independent_poundage}}
                        <em v-if="service_switch == 1">
                          {{ special_service_tax_text }}:{{independent_special}}
                        </em>)
                    </p>
                </template>
                <template v-if="!balance_special">
                  <li>
                    <i class="iconfont icon-balance_g"></i>{{ balance.name }}
                  </li>
                </template>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="wechat.value"
                         v-if="isWechat">
                <li>
                  <i class="iconfont icon-balance_i"></i>{{ wechat.name }}
                </li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="yop_pay.value"
                         v-if="isyop_pay">
                <li>
                  <i class="iconfont icon-balance_i"></i>{{ yop_pay.name }}
                </li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="yee_pay.value"
                         v-if="isyee_pay">
                <li>
                  <i class="iconfont icon-balance_g"></i>{{ yee_pay.name }}
                </li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="high_light_alipay.value"
                         v-if="ishigh_light_alipay">
                <li>
                  <i class="iconfont icon-balance_g"></i>{{ high_light_alipay.name }}
                </li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="high_light_bank.value"
                         v-if="ishigh_light_bank">
                <li>
                  <i class="iconfont icon-balance_g"></i>{{ high_light_bank.name }}
                </li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="high_light_wechat.value"
                         v-if="ishigh_light_wechat">
                <li>
                  <i class="iconfont icon-balance_g"></i>{{ high_light_wechat.name }}
                </li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="alipay.value"
                         v-if="isAlipay">
                <li>
                  <i class="iconfont icon-balance_j"></i>{{ alipay.name }}
                </li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="manual.value"
                         v-if="isManual">
                <li>
                  <i class="iconfont icon-balance_h"></i>{{ manual.name }}
                </li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="eup.value"
                         v-if="isEup">
                <li><i class="iconfont icon-balance_h"></i>{{ eup.name }}</li>
              </van-radio>
              <van-radio label-position="left"
                         checked-color="#f15353"
                         :name="converge_pay.value"
                         v-if="isHj">
                <li>
                  <i class="iconfont icon-balance_h"></i>{{ converge_pay.name }}
                </li>
              </van-radio>
            </van-radio-group>
          </ul>
        </div>
        <div class="addPos">
          <button type="button"
                  class="btn custom_color"
                  @click="checkPayWay">
            确认{{fun.initWithdrawal()}}
          </button>
          <yzSubscribe v-on:confirm="confirmSub" v-on:error='errorSub' :tagName="'withdraw'" :styleWidth="'300px'" :styleHeight="'100px'" :couponHeight="'100px'" :styleSubWidth="'300px'"></yzSubscribe>
        </div>

      </div>
    </van-popup>
    <!-- 提现银行卡 -->
    <van-popup v-model="show2"
              position="bottom"
              :style="{height:'55%'}">
      <div class="withdrawal_box">
        <i class="fa fa-angle-left"
           style="display: inline-block; text-align: left; font-size: 24px; float: left; line-height: 2.875rem; height: 2.875rem; padding-left: 10px;"
           @click="backTap"></i>
        <h2 style="display: inline-block;">
          提现
        </h2>

        <div class="recharge_way">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 10px;"
               @click="gotoList">
            <!-- <i class="iconfont icon-close11" style="padding-left:10px;"></i> -->
            <h2 style="text-align: left;">
              {{ checkObj.bankName }}
            </h2>

            <i class="fa fa-angle-right"
               style="font-size: 24px;"></i>
          </div>

          <ul class="choose_box">
            <li style="display: flex; justify-content: space-between;">
              <span>提现金额(元)</span>
              <span>{{ totalwithdrawal }}</span>
            </li>
            <li style="display: flex; justify-content: space-between;">
              <span>{{poundage_name}}(元)</span>
              <span>{{ poundage_hj == 0 ? "0.00" : poundage_hj }}</span>
            </li>
            <li style="display: flex; justify-content: space-between;">
              <span>实际到账(元)</span>
              <span>{{ actual_amount }}</span>
            </li>
          </ul>
        </div>
        <button type="button"
                class="btn custom_color"
                @click="PayWayHj">
          确认提现
        </button>
      </div>
    </van-popup>
    <!-- 银行卡列表 -->
    <van-popup v-model="show3"
              position="bottom"
              :style="{height:'45%'}">
      <div class="withdrawal_box">
        <i class="fa fa-angle-left"
           style="display: inline-block; text-align: left; font-size: 24px; float: left; line-height: 2.875rem; height: 2.875rem; padding-left: 10px;"
           @click="show3 = false"></i>
        <h2 style="display: inline-block;">
          银行卡列表
        </h2>
        <i class="iconfont icon-close11"
           style="display: inline-block; float: right; line-height: 2.875rem; height: 2.875rem; padding-right: 10px;"
           @click="show3 = false"></i>
        <div class="recharge_way">
          <ul class="choose_box">
            <li v-for="item in withList"
                :key="item"
                @click="checkOut(item)">
              <div>
                <!-- <span><i class="iconfont icon-wode-wode"></i></span> -->
                <span>{{ item.bankName }}</span>
              </div>
              <van-checkbox style="padding-right: 10px;"
                            v-model="item.check"
                            checked-color="#f45054"></van-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import member_income_withdrawal_controller from "./member_income_withdrawal_controller";
export default member_income_withdrawal_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#withdrawal {
  padding-bottom: 80px;

  .addPos {
    position: relative;
  }

  .tbbox {
    display: flex;
    background: #fff;
    line-height: 2.5rem;
    padding-top: 1rem;

    .libg {
      flex: 2;
      background: #eef1f6;
      font-weight: bold;
    }

    .libg2 {
      flex: 2;
    }

    .ones {
      flex: 1;
      align-self: center;
      padding-left: 1.5rem;
    }
  }

  .tbbox_a {
    display: flex;
    background: #fff;
    line-height: 40px;
    height: 40px;
    width: 100%;
    position: fixed;
    top: 40px;
    z-index: 10;

    .libg {
      flex: 2;
      background: #eef1f6;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ones {
      flex: 1;
    }
  }

  #userinfo {
    background: #fff;
    margin: 0.625rem 0;

    ul {
      display: flex;
      align-items: center;
    }

    ul li:last-child {
      border: 0;
    }

    ul li {
      color: #8c8c8c;
      text-align: center;
      display: block;
      flex: 1;
    }

    ul li span {
      color: #333;
      font-size: 17px;
      display: inline-block;
      margin-bottom: 0.625rem;
    }

    ul li {
      float: left;
      width: 33.3333%;
      margin: 1rem 0;
      border-right: 0.0625rem solid #e2e2e2;
      box-sizing: border-box;
    }
  }

  .userinfo {
    background-color: #fff;
    padding: 1rem 0;
    margin-top: 0.625rem;
    display: flex;

    ul {
      flex: 33.3%;
      border-right: solid 0.0625rem #e2e2e2;

      .top {
        display: inline-block;
        margin-bottom: 0.625rem;
        font-size: 17px;
      }

      ul li {
        float: left;
        width: 33.3333%;
        margin: 16px 0;
        border-right: 1px solid #e2e2e2;
        box-sizing: border-box;
      }
    }

    .userinfo {
      background-color: #fff;
      padding: 16px 0;
      margin-top: 10px;
      display: flex;

      ul {
        flex: 33.3%;
        border-right: solid 1px #e2e2e2;

        .top {
          display: inline-block;
          margin-bottom: 10px;
          font-size: 17px;
        }

        .bottom {
          color: #8c8c8c;
        }
      }

      ul:last-child {
        border: 0;
      }
    }
  }

  .bottom_btn {
    width: 100%;
    background: #fff;
    padding: 0.625rem 0;
    position: fixed;
    bottom: 0;
    border-top: solid 0.0625rem #ebebeb;

    .btn {
      width: 21.5625rem;
      margin: 0 auto;
      height: 2.875rem;
      border-radius: 2rem;
      font-size: 16px;
      color: #fff;
      background: #f15353;
      border: none;
    }
  }

  .withdrawal_box {
    h2 {
      background: #fff;
      line-height: 2.875rem;
      font-size: 16px;
      border-bottom: solid 0.0625rem #ebebeb;
      z-index: 10;

      .icon-close11 {
        width: 3rem;
        display: inline-block;
        position: absolute;
        right: 0;
        font-size: 1rem;
        color: #666;
      }
    }

    .deduction_value {
      text-align: left;
      margin-left: 1.25rem;
    }

    .recharge_way {
      background: #fff;

      li {
        position: relative;
        display: flex;
        align-items: center;
        line-height: 2rem;
        font-size: 14px;
        margin: 0.5rem 0.5rem 0.5rem 1.25rem;
        padding-right: 1.25rem;

        /* border-bottom: solid 0.0625rem #ebebeb; */
        span {
          font-size: 13px;
          color: #8c8c8c;
        }

        .iconfont_bg {
          background: #f15353;
          width: 2.25rem;
          height: 1.5rem;
          border-radius: 0.1875rem;
          display: flex;
          align-items: center;
          margin-right: 0.625rem;
        }

        .icon-balance_d {
          color: #00908c;
        }

        .icon-balance_e {
          color: #64b42e;
        }

        .icon-balance_f {
          color: #fac337;
        }

        .icon-balance_g {
          color: #00508e;
        }

        .icon-balance_h {
          color: #fac337;
        }

        .icon-balance_i {
          color: #64b42e;
        }

        .icon-balance_j {
          color: #069ce7;
        }

        .icon-balance_z {
          background-image: url(../../../assets/images/pay_e.png);
        }

        .iconfont {
          font-size: 2rem;
          margin-right: 0.625rem;
        }
      }
    }

    .btn {
      width: 21.5625rem;
      margin: 1.25rem auto;
      height: 2.875rem;
      border-radius: 2rem;
      font-size: 16px;
      color: #fff;
      background: #f15353;
      border: none;
    }
  }
}

#withdrawal.pcStyle {
  .tbbox_a,
  .bottom_btn {
    width: 375px;
  }
}
</style>
