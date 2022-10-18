<template>
  <div id="withdrawal" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title
      :hide="false"
      :text="`${income_name_text}${fun.initWithdrawal()}`"
      tolink="presentationRecord"
      :totext="`${fun.initWithdrawal()}记录/说明`"
      :setQuery="{ extension: 'extension' }"
      :showToast="true"
      :toastTxt="toastTxt"
      @postUrlTap="titleTap"
    ></c-title>
    <div class="withdrawal_complete">
      <div class="elementsin">
        <div class="elementsin_top">
          <span class="elementsin_top_txt">可{{ fun.initWithdrawal() }}总金额</span>
          <div class="elementsin_top_money">
            <span class="amount_type">{{ $i18n.t("money") }}</span>
            <span class="amount">{{ numberToFix(all_withdraw_income) }}</span>
          </div>
        </div>
        <van-sticky :offset-top="40" @change="stickChange">
          <div class="elementsin_bottom" v-if="checkList.length > 0" @click="getWithdrawType" :style="{ 'background-color': stickStatus ? 'rgb(250, 138, 77,1)' : '' }">
            <i class="iconfont" :class="[withTypeTipsIcon]"></i>
            <div class="elementsin_bottom_text" v-if="pay_type">
              <span class="elementsin_bottom_text_top">{{ withTypeTipsTitle }} </span>
              <span v-if="pay_type == 'manual' && pay_typeList.manual && pay_typeList.manual.manual_type == 1 && pay_typeList.manual.member_name">
                (
                <span>{{ pay_typeList.manual.member_name }} </span>
                <span>{{ cardSplice(pay_typeList.manual.bank_card) }}</span>
                )
              </span>
              <span>{{ withTypeTips }}</span>
            </div>
            <div v-else class="elementsin_bottom_text">
              <span>请选择{{ fun.initWithdrawal() }}方式</span>
            </div>
            <i class="iconfont icon-advertise-next"></i>
          </div>
        </van-sticky>
      </div>
    </div>
    <div class="mtype">
      <div class="mtype_left">{{ income_name_text }}类型</div>
      <div class="mtype_right">
        全选
        <van-checkbox
          style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
          checked-color="#f15353"
          @change="allSelect"
          v-model="checkAll"
          :checked="checkAll"
          :disabled="!isCheckAll"
        >
        </van-checkbox>
      </div>
    </div>
    <div class="mtypeList">
      <van-checkbox-group @change="allSelectHandle" v-if="Data.length > 0" v-model="checkList">
        <template v-for="(item, index) in datasource">
          <div class="mtlis" :key="index">
            <div class="mtlis_left">
              <div class="mtlis_left_top">{{ item.type_name }}</div>
              <div class="mtlis_left_bottom" v-if="!item.can">最低{{ fun.initWithdrawal() }}额:{{ item.roll_out_limit }}</div>
            </div>
            <div class="mtlis_conten">
              <div class="price">
                {{ $i18n.t("money") }}<span>{{ numberToFix(item.income) }}</span>
              </div>
              <div class="poundagetype" v-if="pay_type == 'balance' && balance_special">
                <template v-if="Number(item.special_poundage) > 0">
                  {{ poundage_name }}：<span>{{ $i18n.t("money") }}{{ numberToFix(item.special_poundage) }}</span>
                </template>
              </div>
              <div class="poundagetype" v-else>
                <template v-if="Number(item.poundage) > 0">
                  {{ poundage_name }}：<span>{{ $i18n.t("money") }}{{ numberToFix(item.poundage) }}</span>
                </template>
              </div>
            </div>
            <van-checkbox shape="square" checked-color="#f96d20" :key="item" :name="item" :disabled="!item.can || (income_type && item.income_type !== income_type)"></van-checkbox>
          </div>
        </template>
      </van-checkbox-group>
    </div>

    <div class="confirm">
      <span>合计</span>
      <div class="confirm_conten">
        <div class="total">
          <span class="no">{{ $i18n.t("money") }}</span
          >{{ numberToFix(totalwithdrawal) }}
        </div>
        <!-- <span class="btxt"
          >{{poundage_name}}:{{ $i18n.t("money") }}{{ pay_type == "balance" && balance_special ? numberToFix(independent_poundage) : numberToFix(poundage) }}
          <span v-if="service_switch == 1"
            >{{ special_service_tax_text ? special_service_tax_text : "劳务税" }}:{{ $i18n.t("money") }}{{ pay_type == "balance"&& balance_special ? numberToFix(independent_special) : numberToFix(servicetax) }}</span
          >
        </span> -->
        <span class="btxt" v-if="pay_type == 'balance' && balance_special">
          <template v-if="Number(numberToFix(independent_poundage)) > 0"> {{ poundage_name }}:{{ $i18n.t("money") }}{{ numberToFix(independent_poundage) }} </template>
          <span v-if="service_switch == 1 && Number(numberToFix(independent_special)) > 0"
            >{{ special_service_tax_text ? special_service_tax_text : "劳务税" }}:{{ $i18n.t("money") }}{{ numberToFix(independent_special) }}</span
          >
        </span>
        <span class="btxt" v-else>
          <template v-if="Number(numberToFix(poundage)) > 0"> {{ poundage_name }}:{{ $i18n.t("money") }}{{ numberToFix(poundage) }} </template>
          <span v-if="service_switch == 1 && Number(numberToFix(servicetax))">{{ special_service_tax_text ? special_service_tax_text : "劳务税" }}:{{ numberToFix(servicetax) }}</span>
        </span>
      </div>
      <div class="confirmBtn" @click="getMergeServicetax">
        {{ fun.initWithdrawal() }}
        <yzSubscribe v-on:confirm="confirmSub" v-on:error="errorSub" :tagName="'withdraw'" :styleWidth="'300px'" :styleHeight="'100px'" :couponHeight="'100px'" :styleSubWidth="'300px'"></yzSubscribe>
      </div>
    </div>
    <!-- 设置手动打款 微信 -->
    <van-popup v-model="setWX" position="bottom" :style="{ height: '30%' }">
       <div class="bandBox">
        <h2>填写微信号<i class="iconfont icon-close11" @click="setWX = false"></i></h2>
        <div class="rule">
          <div class="ruleLeft">微信号：</div>
          <div class="ruleRighe">
            <van-field v-model="setinWX" placeholder="请输入微信号" />
          </div>
        </div>
        <div class="bandSave" @click="bindSet('wx')">保存</div>
       </div>
    </van-popup>
    <!-- 设置手动打款 支付宝 -->
    <van-popup v-model="setAlipay" position="bottom" :style="{ height: '30%' }">
       <div class="bandBox">
        <h2>填写支付宝信息<i class="iconfont icon-close11" @click="setAlipay = false"></i></h2>
        <div class="rule">
          <div class="ruleLeft">支付宝号：</div>
          <div class="ruleRighe">
            <van-field v-model="setinAlipay" placeholder="请输入支付宝帐号" />
          </div>
        </div>
        <div class="rule">
          <div class="ruleLeft">帐号姓名：</div>
          <div class="ruleRighe">
            <van-field v-model="setinAlipayName" placeholder="请输入支付宝帐号姓名：" />
          </div>
        </div>
        <div class="bandSave" @click="bindSet('ali')">保存</div>
       </div>
    </van-popup>
    <!-- 提现方式弹窗 -->
    <van-popup v-model="show1" position="bottom" :style="{ height: '60%' }">
      <div class="withdrawal_box_no">
        <h2>选择{{ fun.initWithdrawal() }}方式<i class="iconfont icon-close11" @click="show1 = false"></i></h2>
        <van-radio-group v-model="pay_type" @change="SelectHandle">
          <div class="withdrawal_box_listBox">
            <!-- 余额 -->
            <div class="withdrawal_box_list" v-if="isBalance">
              <i class="iconfont icon-fontclass-fanli"></i>
              <div class="withdrawal_box_list_wrap">
                <span class="txt">{{ pay_typeList.balance.other_name || pay_typeList.balance.name }}</span>
                <span class="txtTwo">通过审核后将打款到系统{{ pay_typeList.balance.other_name || pay_typeList.balance.name }}！</span>
              </div>
              <div class="withdrawal_box_list_check">
                <van-radio checked-color="#f96d20" name="balance"></van-radio>
              </div>
            </div>
            <!-- 微信 -->
            <div class="withdrawal_box_list" v-if="isWechat">
              <i class="iconfont icon-card_weixin"></i>
              <div class="withdrawal_box_list_wrap">
                <span class="txt">{{pay_typeList.wechat.other_name}}</span>
                <span class="txtTwo">通过审核后将打款到个人微信零钱！</span>
              </div>
              <div class="withdrawal_box_list_check">
                <van-radio checked-color="#f96d20" name="wechat"></van-radio>
              </div>
            </div>
            <!-- 支付宝 -->
            <div class="withdrawal_box_list" v-if="isAlipay">
              <i class="iconfont icon-all_alipay"></i>
              <div class="withdrawal_box_list_wrap">
                <span class="txt">{{ pay_typeList.alipay.other_name }}</span>
                <span class="txtTwo">通过审核后将打款到个人支付宝！</span>
              </div>
              <div class="withdrawal_box_list_check">
                <van-radio checked-color="#f96d20" name="alipay"></van-radio>
              </div>
            </div>
            <!-- 高灯支付宝 -->
            <div class="withdrawal_box_list" v-if="ishigh_light_alipay">
              <i class="iconfont icon-all_alipay"></i>
              <div class="withdrawal_box_list_wrap">
                <span class="txt">{{ high_light_alipay.other_name }}</span>
                <span class="txtTwo">通过审核后将打款到个人支付宝！</span>
              </div>
              <div class="withdrawal_box_list_check">
                <van-radio checked-color="#f96d20" name="high_light_alipay"></van-radio>
              </div>
            </div>
            <!-- 高灯银行卡 -->
            <div class="withdrawal_box_list" v-if="ishigh_light_bank">
              <i class="iconfont icon-balance_g"></i>
              <div class="withdrawal_box_list_wrap">
                <span class="txt">{{ high_light_bank.other_name }}</span>
                <span></span>
              </div>
              <div class="withdrawal_box_list_check">
                <van-radio checked-color="#f96d20" name="high_light_bank"></van-radio>
              </div>
            </div>
            <!-- 高灯微信 -->
            <div class="withdrawal_box_list" v-if="ishigh_light_wechat">
              <i class="iconfont icon-card_weixin"></i>
              <div class="withdrawal_box_list_wrap">
                <span class="txt">{{ high_light_wechat.other_name }}</span>
                <span></span>
              </div>
              <div class="withdrawal_box_list_check">
                <van-radio checked-color="#f96d20" name="high_light_wechat"></van-radio>
              </div>
            </div>
            <!-- 手动打款 微信 银行卡 支付宝-->
            <div class="withdrawal_box_list" v-if="isManual">
              <i class="iconfont icon-pay_otherpay"></i>
              <div class="withdrawal_box_list_wrap">
                <span class="txt" v-if="manual.manual_type == 1">{{ manual.other_name }}-银行卡</span>
                <span class="txt" v-if="manual.manual_type == 2">{{ manual.other_name }}-微信</span>
                <span class="txt" v-if="manual.manual_type == 3">{{ manual.other_name }}-支付宝</span>
                <span class="txtTwo">通过审核后将由工作人员打款到您的{{ manual.manual_type == 1 ? "银行卡" : manual.manual_type == 2 ? "微信" : "支付宝" }}！</span>
                <div class="userTxt txtTwo">
                  <span v-if="manual.manual_type == 1">{{ manual.member_name }} {{ manual.bank_card }}</span>
                  <span class="modify" v-if="manual.manual_type == 1 && manual.bank_card" @click="editUser">修改信息</span>
                </div>
              </div>
              <div class="withdrawal_box_list_check">
                <van-radio checked-color="#f96d20" name="manual"></van-radio>
              </div>
            </div>
            <!-- 汇聚 -->
            <div class="withdrawal_box_list" v-if="isHj">
              <i class="iconfont icon-pay_otherpay"></i>
              <div class="withdrawal_box_list_wrap">
                <span class="txt">{{ pay_typeList.converge_pay.other_name }}</span>
                <span>通过审核后将由工作人员打款到您的银行卡</span>
              </div>
              <div class="withdrawal_box_list_check">
                <van-radio checked-color="#f96d20" name="converge_pay"></van-radio>
              </div>
            </div>
          </div>
        </van-radio-group>
      </div>
    </van-popup>
    <van-popup v-model="createCardShow" position="bottom" :style="{ height: '60%' }">
      <div class="bandBox">
        <h2>填写银行卡<i class="iconfont icon-close11" @click="createCardShow = false"></i></h2>
        <div class="rule">
          <div class="ruleLeft">开户行:</div>
          <div class="ruleRighe">
            <van-field v-model="bankdata.bankname" placeholder="请输入开户行" />
          </div>
        </div>
        <div class="rule" @click="addressShowProvince">
          <div class="ruleLeftDist">所在省:</div>
          <div class="rightDist">
            <span>{{ bankdata.Province }}</span>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="rule" @click="addressShowCity">
          <div class="ruleLeftDist">所在市:</div>
          <div class="rightDist">
            <span>{{ bankdata.city }}</span>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="rule">
          <div class="ruleLeft">支行名称:</div>
          <div class="ruleRighe">
            <van-field v-model="bankdata.branchName" placeholder="请输入支行名称" />
          </div>
        </div>
        <div class="rule">
          <div class="ruleLeft">卡号:</div>
          <div class="ruleRighe">
            <van-field v-model="bankdata.card" placeholder="请输入您的卡号" />
          </div>
        </div>
        <div class="rule">
          <div class="ruleLeft">姓名:</div>
          <div class="ruleRighe">
            <van-field v-model="bankdata.name" placeholder="请输入您的姓名" />
          </div>
        </div>
        <div class="bandSave" @click="bindCard">保存</div>
      </div>
    </van-popup>
    <van-popup v-model="addressShow_p" position="bottom" :style="{ height: '45%' }">
      <van-picker title="" show-toolbar :columns="provinceData" @confirm="addressCallback" @cancel="onCancel" value-key="areaname" @change="onChange" />
    </van-popup>
    <van-popup v-model="addressShow_c" position="bottom" :style="{ height: '45%' }">
      <van-picker title="" show-toolbar :columns="showCityData" @confirm="addressCallback_c" @cancel="onCancel" value-key="areaname" @change="onChange" />
    </van-popup>

    <!-- 提现银行卡 -->
    <van-popup v-model="show2" position="bottom" :style="{ height: '55%' }">
      <div class="withdrawal_box">
        <i class="fa fa-angle-left" style="display: inline-block; text-align: left; font-size: 24px; float: left; line-height: 2.875rem; height: 2.875rem; padding-left: 10px" @click="backTap"></i>
        <h2 style="display: inline-block">{{ fun.initWithdrawal() }}</h2>

        <div class="recharge_way">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 10px" @click="gotoList">
            <!-- <i class="iconfont icon-close11" style="padding-left:10px;"></i> -->
            <h2 style="text-align: left">
              {{ checkObj.bankName }}
            </h2>

            <i class="fa fa-angle-right" style="font-size: 24px"></i>
          </div>

          <ul class="choose_box">
            <li style="display: flex; justify-content: space-between">
              <span>{{ fun.initWithdrawal() }}金额(元)</span>
              <span>{{ totalwithdrawal }}</span>
            </li>
            <li style="display: flex; justify-content: space-between">
              <span>{{ poundage_name }}(元)</span>
              <span>{{ poundage_hj == 0 ? "0.00" : poundage_hj }}</span>
            </li>
            <li style="display: flex; justify-content: space-between">
              <span>实际到账(元)</span>
              <span>{{ actual_amount }}</span>
            </li>
          </ul>
        </div>
        <button type="button" class="btn custom_color" @click="PayWayHj">确认{{ fun.initWithdrawal() }}</button>
      </div>
    </van-popup>
    <!-- 银行卡列表 -->
    <van-popup v-model="show3" position="bottom" :style="{ height: '45%' }">
      <div class="withdrawal_box">
        <i
          class="fa fa-angle-left"
          style="display: inline-block; text-align: left; font-size: 24px; float: left; line-height: 2.875rem; height: 2.875rem; padding-left: 10px"
          @click="show3 = false"
        ></i>
        <h2 style="display: inline-block">银行卡列表</h2>
        <i class="iconfont icon-close11" style="display: inline-block; float: right; line-height: 2.875rem; height: 2.875rem; padding-right: 10px" @click="show3 = false"></i>
        <div class="recharge_way">
          <ul class="choose_box">
            <li v-for="item in withList" :key="item" @click="checkOut(item)">
              <div>
                <!-- <span><i class="iconfont icon-wode-wode"></i></span> -->
                <span>{{ item.bankName }}</span>
              </div>
              <van-checkbox style="padding-right: 10px" v-model="item.check" checked-color="#f45054"></van-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="customer_show" position="center" :style="{ width: '80%' }" round>
      <div class="pop-content" v-if="customer_service">
        <div class="pop-top">
          <div class="left" v-if="!fun.isTextEmpty(customer_service.service)">
            <div class="wrap">
              <a :href="customer_service.service">
                <div class="image"><img src="../../../assets/images/kf_online_contect@2x.png" /></div>
                <!-- assets/images/kf_online_contect@2x.png -->
              </a>
              <div>在线联系</div>
            </div>
          </div>
          <div style="display: flex; align-items: center" v-if="!fun.isTextEmpty(customer_service.service) && !fun.isTextEmpty(customer_service.mobile)">
            <div class="line"></div>
          </div>
          <div class="right" v-if="!fun.isTextEmpty(customer_service.service_mobile)">
            <div class="wrap">
              <div class="image">
                <a :href="`tel:${customer_service.service_mobile}`"><img src="../../../assets/images/kf_tel_contect@2x.png" /></a>
              </div>

              <div>{{ customer_service.service_mobile }}</div>
            </div>
          </div>
        </div>
        <div class="pop-bottom" v-if="!fun.isTextEmpty(customer_service.service_QRcode)">
          <div class="image">
            <img :src="customer_service.service_QRcode" style="width: 100%; height: 100%" />
          </div>
        </div>
        <i class="iconfont icon-close11" @click="customer_show = false"></i>
      </div>
    </van-popup>
    <van-popup v-model="withdraw_rich_show" position="left" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar :title="`${fun.initWithdrawal()}规则说明`" left-arrow @click-left="onClickLeft" />
      <div v-html="withdraw_rich_text.content"></div>
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
  .confirm {
    width: 23.44rem;
    height: 3.44rem;
    background-color: #ffffff;
    box-shadow: 0rem -0.12rem 0.28rem 0rem rgba(205, 205, 205, 0.4);
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 0.94rem;
    align-items: center;
    box-sizing: border-box;
    .confirm_conten {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      margin-left: 0.53rem;
      .total {
        font-size: 1rem;
        color: #f96d20;
        .no {
          font-size: 0.75rem;
        }
      }
      .btxt {
        font-size: 0.69rem;
        color: #747474;
        text-align: left;
      }
    }
    .confirmBtn {
      width: 5.63rem;
      height: 2.5rem;
      background-color: #f96d20;
      border-radius: 1.25rem;
      font-size: 0.94rem;
      color: #ffffff;
      text-align: center;
      line-height: 2.5rem;
    }
  }
  .mtypeList {
    .mtlis {
      display: flex;
      align-items: center;
      padding-left: 1rem;
      padding-right: 0.94rem;
      height: 3.75rem;
      background: #fff;
      .mtlis_left {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        .mtlis_left_bottom{
          font-size: 0.69rem;
          color: #858585;
          margin-top: 0.53rem;
        }
      }
      .mtlis_conten {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin-right: 1.38rem;
        .price {
          font-size: 0.94rem;
          color: #f96d20;
          width: 100%;
          text-align: left;
          .no {
            font-size: 0.75rem;
          }
        }
        .poundagetype {
          color: #a3a3a3;
          font-size: 0.75rem;
          margin-top: 0.31rem;
        }
      }
    }
  }
  .mtype {
    display: flex;
    align-items: center;
    height: 2.69rem;
    justify-content: space-between;
    padding: 0 0.94rem;
    box-sizing: border-box;
    .mtype_left {
      font-size: 1rem;
      color: #f96d20;
    }
    .mtype_right {
      width: 3.13rem;
      height: 1.44rem;
      background-color: #f96d20;
      border-radius: 0.19rem;
      font-size: 0.75rem;
      line-height: 1.44rem;
      display: flex;
      justify-content: center;
      color: #ffffff;
      position: relative;
    }
  }
  .withdrawal_complete {
    padding: 0.91rem 0.91rem 1.09rem 0.97rem;
    box-sizing: border-box;
    background: #fff;
    .elementsin {
      width: 21.56rem;
      min-height: 9.06rem;
      background-image: linear-gradient(-50deg, #f96d20 0%, #fcab4f 100%);
      box-shadow: 0rem 0.31rem 0.47rem 0rem rgba(250, 128, 46, 0.2);
      border-radius: 0.75rem;
      display: flex;
      flex-direction: column;
      .elementsin_bottom {
        min-height: 2.91rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.41rem 1rem;
        background-color: rgba(255, 255, 255, 0.2);
        box-sizing: border-box;
        color: #fff;
        .iconfont {
          font-size: 1.3rem;
        }
        .elementsin_bottom_text {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 0.53rem;
          .elementsin_bottom_text_top {
            font-size: 0.88rem;
          }
          span {
            text-align: left;
            font-size: 0.75rem;
          }
        }
      }
      .elementsin_top {
        flex: 1;
        padding-top: 1.41rem;
        padding-left: 2.25rem;
        display: flex;
        flex-direction: column;
        .elementsin_top_txt {
          font-size: 0.81rem;
          color: #ffffff;
          text-align: left;
        }
        .elementsin_top_money {
          display: flex;
          font-size: 1.69rem;
          color: #ffffff;
          .amount_type {
            line-height: 2.7rem;
            font-size: 0.94rem;
          }
        }
      }
    }
  }
}
// 提现方法
.withdrawal_box_no {
  h2 {
    background: #fff;
    line-height: 2.875rem;
    font-size: 16px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
    // border-bottom: solid 0.0625rem #ebebeb;

    .icon-close11 {
      width: 3rem;
      display: inline-block;
      position: absolute;
      right: 0;
      font-size: 1rem;
      color: #666;
    }
  }
  .withdrawal_box_listBox {
    // overflow-y: auto;
  }
  .withdrawal_box_list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0.97rem 1rem 1.13rem;
    box-sizing: border-box;
    .iconfont {
      color: #f96d20;
      font-size: 1.5rem;
    }
    .withdrawal_box_list_wrap {
      flex: 1;
      margin-left: 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 0.81rem;
      .txt {
        font-size: 0.94rem;
        font-weight: 600;
      }
      .txtTwo {
        margin-top: 0.66rem;
      }
      .userTxt {
        display: flex;
        align-items: center;
      }
      .modify {
        margin-left: 0.91rem;
        color: #ee3131;
      }
    }
    .withdrawal_box_list_check {
      position: relative;
    }
  }
}
// 提现到银行卡
.bandBox {
  .bandSave {
    width: 20rem;
    height: 2.5rem;
    background-color: #f96d20;
    border-radius: 1.25rem;
    font-size: 0.94rem;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-top: 2rem;
  }
  .rule {
    display: flex;
    align-items: center;
    padding: 0 0.94rem;
    margin-bottom: 1.38rem;
    .ruleLeftDist {
      display: flex;
      align-items: center;
      font-size: 0.94rem;
    }
    .rightDist {
      height: 22px;
      flex: 1;
      display: flex;
      justify-content: flex-end;
      font-size: 0.94rem;
      align-items: center;
      span {
        margin-right: 0.39rem;
      }
      i {
        margin-top: 3px;
      }
    }
    .ruleRighe {
      flex: 1;
      ::-webkit-input-placeholder {
        /* placeholder字体大小 */
        font-size: 0.94rem;
      }
      .van-cell {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
    .ruleLeft {
      display: flex;
      align-items: center;
      font-size: 0.94rem;
      margin-top: -5px;
    }
  }
  h2 {
    margin-bottom: 2rem;
    background: #fff;
    line-height: 2.875rem;
    font-size: 16px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
    // border-bottom: solid 0.0625rem #ebebeb;

    .icon-close11 {
      width: 3rem;
      display: inline-block;
      position: absolute;
      right: 0;
      font-size: 1rem;
      color: #666;
    }
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
// 客服
.pop-content {
  width: 100%;
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
</style>
