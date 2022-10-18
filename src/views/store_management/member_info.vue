<template>
  <div id="work-wechat-sidebar" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" text="会员详情"></c-title>
    <div class="member-header">
      <div class="member-info">
        <div class="atavar">
          <img :src="memberData.avatar_image" alt="">
        </div>
        <div class="info">
          <div style="display: flex;align-items: center;">
            <h1 class="user-name overflow">{{memberData.nickname}}</h1>
            <span class="user-id">ID:{{memberData.uid}} </span>
          </div>
          <div style="display: flex;margin-top: 0.6rem">
            <div class="mermber-level overflow" v-if="memberChild.level">{{memberChild.level.level_name}}</div>
            <div class="end-time" v-if="memberChild.validity">{{memberChild.validity}} 到期</div>
          </div>
        </div>
      </div>
      <ul class="integral-detail">
        <li @click="toLink('storeIntegralList')">
            <p class="number textover-2">{{memberData.credit1 ? memberData.credit1 : 0}}</p>
            <p>{{integralName}}</p>
        </li>
        <li @click="toLink('storeBalanceList')">
            <p class="number textover-2">{{$i18n.t('money')}}{{memberData.credit2 ? memberData.credit2 : 0}}</p>
            <p>{{balanceName}}</p>
        </li>
        <li @click="toLink('storeCouponList')">
            <p class="number textover-2">{{memberData.coupon ? memberData.coupon : 0}}</p>
            <p>优惠券</p>
        </li>
      </ul>
    </div>
    <div class="member-content">
      <ul class="recharge-panel">
        <li @click="showRechargePopup('integral')">
            <div class="icon jifen">
              <i class="iconfont icon-jifen"></i>
            </div>
            <p class="text">充值{{integralName}}</p>
        </li>
        <li @click="showRechargePopup('balance')">
            <div class="icon qian">
              <i class="iconfont icon-fontclass-qian"></i>
            </div>
            <p class="text">充值{{balanceName}}</p>
        </li>
        <li @click="showCouponPopup">
            <div class="icon youhuiq">
              <i class="iconfont icon-fontclass-youhuiq"></i>
            </div>
            <p class="text">赠送优惠券</p>
        </li>
      </ul>

      <div class="detail">
        <div class="plane">
          <div class="plane-title">会员信息</div>
          <ul class="list">
            <li class="recommend item">
              <div class="left-title">推荐人：</div>
              <div class="right" v-if="memberChild.agent">
                <span class="mermber-id">ID:{{memberChild.agent.uid}}</span>
                <span>{{memberChild.agent.nickname}}</span>
              </div>
            </li>
            <li class="current item">
              <div class="left-title">来源：</div>
              <div class="right">
                <span v-if="memberData.has_one_fans">
                  <i class="iconfont icon-all_wechat_public" v-if="memberData.has_one_fans.followed == 1"></i>
                  <i class="iconfont icon-all_wechat_public not-followed" v-else></i>
                </span>
                <i class="iconfont icon-all_smallprogram" v-if="memberData.has_one_mini_app"></i>
                <i class="iconfont icon-all_app" v-if="memberData.has_one_wechat"></i>
                <i class="iconfont icon-all_wechat" v-if="memberData.has_one_unique"></i>
                <i class="iconfont icon-all_alipay" v-if="memberData.has_one_alipay"></i>
                <i class="iconfont icon-all_trill" v-if="memberData.has_one_douyin"></i>
                <i class="iconfont icon-qiyeweixin01" v-if="memberData.has_one_customers"></i>
              </div>
            </li>
            <li class="item">
              <div class="left-title">注册时间：</div>
              <span class="right">{{memberData.createtime}}</span>
            </li>
            <li class="item" v-if="memberData.yz_member">
              <div class="left-title">会员分组：</div>
              <span class="right">
                {{memberData.yz_member.group ?
                memberData.yz_member.group.group_name : '无分组'}}
              </span>
            </li>
            <li class="item" v-if="memberChild.level">
              <div class="left-title">会员等级：</div>
              <div class="right" style="display: flex;flex: 1;">
                <div style="flex: 1;">{{memberChild.level.level_name}}</div>
                <div style="color: red;padding-right: 1rem;" @click.stop="isEmitLevel = true">修改</div>
              </div>
            </li>
            <li class="item">
              <div class="left-title">姓名：</div>
              <span class="right">{{memberData.realname}}</span>
            </li>
            <li class="item">
              <div class="left-title">性别：</div>
              <span class="right">{{gender}}</span>
            </li>
            <li class="item">
              <div class="left-title">手机号：</div>
              <span class="right">{{memberData.mobile}}</span>
            </li>
            <li class="item">
              <div class="left-title">微信号：</div>
              <span class="right">{{memberChild.wechat}}</span>
            </li>
            <li class="item">
              <div class="left-title">推广员： </div>
              <span class="right">
                <van-switch v-model="memberChild.is_agent"
                  :active-value="1" :inactive-value="0" size="18px"
                  inactive-color="#bebebe"
                  @change="changeAgent"
                ></van-switch>
              </span>
            </li>
          </ul>
        </div>
        <div class="plane">
          <div class="plane-title">支付宝</div>
          <ul class="list">
            <li class="item">
              <div class="left-title">支付宝账号：</div>
              <span class="right">{{memberChild.alipay}} </span>
            </li>
            <li class="item">
              <div class="left-title">账号姓名：</div>
              <span class="right">{{memberChild.alipayname}}</span>
            </li>
          </ul>
        </div>
        <div class="plane" v-if="memberData.bank_card">
          <div class="plane-title">银行卡信息</div>
          <ul class="list">
            <li class="item">
              <div class="left-title">开户行：</div>
              <span class="right">{{memberData.bank_card.bank_name}}</span>
            </li>
            <li class="item">
              <div class="left-title">开户行省份：</div>
              <span class="right">{{memberData.bank_card.bank_province}}</span>
            </li>
            <li class="item">
              <div class="left-title">开户城市：</div>
              <span class="right">{{memberData.bank_card.bank_city}}</span>
            </li>
            <li class="item">
              <div class="left-title">开户支行：</div>
              <span class="right">{{memberData.bank_card.bank_branch}}</span>
            </li>
            <li class="item">
              <div class="left-title">银行卡号：</div>
              <span class="right">{{memberData.bank_card.bank_card}}</span>
            </li>
            <li class="item">
              <div class="left-title">姓名：</div>
              <span class="right">{{memberData.bank_card.member_name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="fixed-topping" v-if="titleBgMode == 'show'" @click="setTopping">
      <i class="iconfont icon-fontclass-zhiding"></i>
    </div>


    <!-- 充值弹框 -->
    <van-popup v-model="rechargePopup" position="bottom" class="popup">
      <div class="popup-header">
        <span class="pop-title">充值{{popText==="积分" ? integralName : balanceName}}</span>
        <van-icon class="close-icon" name="cross"  @click="closeRechargePop"></van-icon>
      </div>
      <div class="popup-content">
        <p class="current-integral">当前{{popText==="积分" ? integralName : balanceName}} <span class="integral">{{popText==='积分' ? memberData.credit1 : memberData.credit2}}</span></p>
        <div class="cell-title">
          <i class="iconfont icon-fontclass-xinghao"></i>
          <span class="text">充值{{popText==="积分" ? integralName : balanceName}}</span>
        </div>
        <!-- 积分 -->
        <div v-if="popText==='积分'">
          <van-field v-model.trim="recharge.integral" class="int-input" type="number" placeholder="请输入充值数量"></van-field>
        </div>
        <!-- 余额 -->
        <div v-else>
          <van-field v-model.trim="recharge.balance" class="int-input" type="number" placeholder="请输入充值数量"></van-field>
        </div>
          <van-field v-model="recharge.remarks" class="int-remarks" placeholder="请输入备注信息"></van-field>
      </div>
      <div class="btn-recharge" @click="confirmRecharge">充值</div>
    </van-popup>


    <!-- 赠送优惠券 -->
    <van-popup v-model="couponPopup" position="bottom" class="popup">
      <div class="popup-header">
        <span class="pop-title">赠送优惠券</span>
        <van-icon class="close-icon" name="cross" @click="closeCouponPop"></van-icon>
      </div>
      <div class="popup-content">
        <div>
          <div class="cell-title">
            <i class="iconfont icon-fontclass-xinghao"></i>
            <span class="text">优惠券</span>
          </div>
          <van-field
            v-model.trim="coupons.id"
            class="int-input" type="number"
            placeholder="请输入优惠券id"
            @keyup="throttleFn"
          ></van-field>
          <span class="tips error" v-if="coupons.id && coupons.emptyName">没有找到优惠券</span>
          <span class="tips" v-else>{{coupons.name}}</span>
        </div>

        <div class="cell-title">
          <i class="iconfont icon-fontclass-xinghao"></i>
          <span class="text">优惠券张数</span>
        </div>
        <van-field v-model.trim="coupons.number" class="int-input" type="number" placeholder="请输入赠送优惠券张数"></van-field>
      </div>
      <div class="btn-recharge" @click="confirmGive">确定</div>
    </van-popup>

    <!-- 修改会员等级 -->
    <van-popup v-model="isEmitLevel" position="bottom" class="popup">
      <div style="display:flex;">
        <div style="color:#B6B6B6;" @click="isEmitLevel=false">取消</div>
        <div style="flex:1;text-align:center;color: #333;">修改会员等级</div>
        <div style="color: #ee0a24;" @click="emitLevel">确认</div>
      </div>
      <van-radio-group v-model="memberChild.level_id" style="margin:2rem 0;">
        <van-radio :name="item.id" v-for="(item,i) in level_list" style="margin:.8rem 0;" :key="i">{{item.level_name}}</van-radio>
      </van-radio-group>
    </van-popup>
  </div>
</template>



<script>
import memberInfo from "./member_info_controller";
export default memberInfo;
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.pcStyle {
  width: 375px;
  margin: 0 auto;
}
.textover-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
}
#work-wechat-sidebar {
  font-size: 12px;
  background: #f2f2f2;
  .member-header {
    height: 15rem;
    color: #ffffff;
    padding: 1rem 0.875rem;
    background-color: #3b3b3b;
    .member-info {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      .atavar {
        width: 3.781rem;
        height: 3.75rem;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        flex: 1;
        margin-left: 0.5rem;
        .user-name {
          max-width: 10rem;
          font-size: 1.238rem;
        }
        .user-id {
          height: 1.288rem;
          padding: 0.2rem;
          margin-left: 0.5rem;
          border-radius: 0.125rem;
          background-color: #f34f47;
        }
        .iconfont {
          margin-left: 0.7rem;
          color: #ffc479;
        }
        .icon-fontclass-mingpian {
          font-size: 2rem;
        }
        .icon-fontclass-daili {
          font-size: 1.1rem;
        }
        .mermber-level {
          position: relative;
          max-width: 10rem;
          text-align: left;
          height: 1.094rem;
          color: #6c2a09;
          padding: 0 0.5rem 0 1.5rem;
          border-radius: 0.469rem;
          background-image: linear-gradient(90deg,#ffebc0 0%,#ffc479 100%), linear-gradient(#ffd821, #ffd821);

        }
        .mermber-level::before {
          position: absolute;
          top: -0.1rem;
          left: 0;
          content: '';
          width: 1.188rem;
          height: 1.094rem;
          background-image: url("../../assets/images/enterprise_wechat/level.png");
          background-size: 100% 100%;
        }
        .end-time {
          margin-left: 1rem;
          color: #e8e8e8;
        }
      }

    }
    .integral-detail {
      position: relative;
      display: flex;
      white-space: nowrap;
      padding: 1rem;
      li {
        flex: 1;
        line-height: 1.5rem;
        margin: 0 0.5rem;
        font-size: 0.69rem;
        color: #e8e8e8;
        .number {
          font-size: 0.888rem;
          font-weight: bold;
          color: #ffffff;
          white-space: pre-wrap;
          word-break: break-all;
        }
      }
    }
    .integral-detail::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 100%;
      height: 1px;
      background-color: #6f6f6f;
      transform: translateX(-50%) scaleY(0.5);

    }
  }

  .member-content {
    transform: translateY(-4rem);
    padding: 0.6rem;
    .recharge-panel {
      display: flex;
      justify-content: space-between;
      margin: 0.6rem auto;
      padding: 1rem;
      background-color: #ffffff;
      border-radius: 0.31rem;
      .icon{
        display: inline-block;
        border-radius: 0.31rem;
        padding: 0.41rem;
      }
      .iconfont {
        font-size: 1.4rem;
        color: #ffffff;
      }
      .jifen {
        background-image: linear-gradient(90deg, #ffc24b 0%, #ffaa31 100%);
      }
      .youhuiq {
        background-image: linear-gradient(90deg, #888cf8 0%, #3e52d9 100%);
      }
      .qian {
        background-image: linear-gradient(90deg, #1ca7f8 0%, #1484e3 100%);
      }
      .text {
        margin-top: 0.78rem;
        font-size: 0.69rem;
        color: #232424;
      }
    }

    .detail {
      .plane {
        margin-top: 0.625rem;
        padding: 0.75rem;
        border-radius: 0.469rem;
        background-color: #ffffff;
        text-align: left;
        .plane-title {
          position: relative;
          color: #f34f47;
          font-weight: bold;
          font-size: 0.813rem;
          padding-left: 0.5rem;
        }
        .plane-title::after{
          content: '';
          position: absolute;
          top: 15%;
          left: 0;
          height: 70%;
          width: 0.125rem;
          background-color: #f34f47;
          border-radius: 0.063rem;
        }
        .item {
          display: flex;
          align-items: center;
          color: #1a1a1a;
          margin-top: 1.2rem;
          font-size: 0.75rem;
          .left-title {
            width: 4rem;
            color: #7d7d7d;
            font-size: 0.75rem;
            white-space: nowrap;
          }
        }
        .recommend {
          .mermber-id {
            color: #ffffff;
            padding: 0.2rem;
            font-size: 0.688rem;
            margin-right: 0.5rem;
            background-color: #f34f47;
            border-radius: 0.125rem;
          }
        }
        .current {
          .iconfont {
            margin-right: 0.5rem;
            font-size: 1.2rem;
          }
          .icon-all_wechat_public {
            color: #04af82;
          }
          .not-followed {
            color: #afaeae;
          }
          .icon-all_smallprogram {
            color: #00b84b;
          }
          .icon-all_app, .icon-qiyeweixin01 {
            color: #0068ff;
          }
          .icon-all_wechat {
            color: #0ed76e;
          }
          .icon-all_alipay {
            color: #00A9EF;
          }
        }
      }
    }

  }

  .fixed-topping {
    position: fixed;
    right: 0.97rem;
    bottom: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.19rem;
    height: 2.19rem;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;

    .iconfont {
      font-size: 22px;
      color: #fff;
    }
  }

  .popup {
    padding: 1.25rem 0.97rem 0.5rem 0.97rem;
    text-align: left;
    .popup-header {
      display: flex;
      color: #2b2a2a;
      text-align: center;
      font-size: 0.94rem;
      .pop-title {
        flex: 1;
        font-weight: bold;
      }
      .close-icon {
        color: #545454;
      }
    }
    .current-integral {
      font-size: 0.88rem;
      color: #2b2a2a;
      margin-top: 1rem;
      .integral {
        color: #f15353;
      }
    }
    .cell-title {
      margin-top: 1.2rem;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 0.625rem;
        color: #f15353;
      }
      .text {
        margin-left: 0.6rem;
        font-size: 0.88rem;
        font-weight: bolder;
        color: #2b2a2a;
      }
    }
    .tips {
      display: block;
      margin-top: 0.35rem;
      font-size: 0.75rem;
      color: #737373;
    }
    .error {
      color: #f14e4e;
    }
    .int-input {
      margin-top: 1rem;
      padding: 0;
      /deep/ .van-field__control {
        padding: 0.35rem 0.65rem;
        border-radius: 0.31rem;
        border: solid 1px #cecece;
      }
    }
    .int-remarks {
      width: 100%;
      height: 7.19rem;
      margin-top: 1rem;
      padding: 0.94rem;
      background-color: #f7f7f7;
      border-radius: 0.31rem;
    }
    .btn-recharge {
      width: 100%;
      margin-top: 1.5rem;
      padding: 0.75rem 0;
      color: #fff;
      font-size: 0.88rem;
      background-color: #f15353;
      border-radius: 2rem;
      text-align: center;
    }
  }
}

</style>