<!-- 口令红包 祝大家新年快乐，奥力给！ -->
<template>
  <div id="redEnvelope" :style="{ backgroundColor: activity_info.bg_color }">
    <div class="top_music">
      <i class="iconfont icon-active_music_open xuanzhuan" @click.stop="play()" v-show="!songStop"></i>
      <i class="iconfont icon-active_music_close" @click.stop="play()" v-show="songStop"></i>
    </div>
    <audio
      id="audio"
      ref="audio"
      loop="loop"
      @loadedmetadata="onLoadedmetadata"
      controls="controls"
      autoplay
      preload
      :src="audio_link"
      style="display: none;"
    ></audio>
    <div class="callBoss" @click.stop="showCall = true">
      <!-- 联系商家 -->
      <i class="iconfont icon-service_m" style="font-size: 1rem;"></i>
      <div style="font-size: 0.75rem; line-height: 1.125rem;">联系商家</div>
    </div>
    <div
      class="topMain"
      :style="{
        backgroundImage:
          'url(' +
          (activity_info.top_img
            ? activity_info.top_img
            : require('../../../assets/images/redEnvelope/default_banner@2x.png')) +
          ')'
      }"
    >
      <img v-if="activity_info.brand_logo" :src="activity_info.brand_logo" alt="" class="logo" />
      <div v-if="!activity_info.brand_logo" style="height: 11rem;"></div>
      <div class="Countdown">
        <div class="backgroundIcons">活动倒计时</div>
        <div class="time-up" style="display: flex; align-items: center;" v-if="activity_info.countdown_time&& activity_info.countdown_time.length > 0">
          <template v-if="(activity_info.countdown_time[0] * 1000) - Date.parse(new Date()) > 0">
            <span style="font-weight: bold; margin-right: 5px;">距 离 活 动 开 始</span>
            <van-count-down class="bottom_time" :time="(activity_info.countdown_time[0] * 1000) - Date.parse(new Date())" >
              <template #default="timeData">
                <em class="aa">{{ timeData.days }}</em>
                <span class="colon">天</span>
                <em class="aa" style="font-weight: bold;">{{ timeData.hours }}</em>
                <span class="colon">时</span>
                <em class="aa">{{ timeData.minutes }}</em>
                <span class="colon">分</span>
                <em class="aa">{{ timeData.seconds }}</em>
                <span class="colon">秒</span>
              </template>
            </van-count-down>
          </template>

          <template v-else-if="(activity_info.countdown_time[1] * 1000) - Date.parse(new Date()) > 0">
            <span style="font-weight: bold; margin-right: 5px;">距 离 活 动 结 束</span>
            <van-count-down class="bottom_time" :time="(activity_info.countdown_time[1] * 1000) - Date.parse(new Date())" >
              <template #default="timeData">
                <em class="aa">{{ timeData.days }}</em>
                <span class="colon">天</span>
                <em class="aa" style="font-weight: bold;">{{ timeData.hours }}</em>
                <span class="colon">时</span>
                <em class="aa">{{ timeData.minutes }}</em>
                <span class="colon">分</span>
                <em class="aa">{{ timeData.seconds }}</em>
                <span class="colon">秒</span>
              </template>
            </van-count-down>
          </template>

          <template v-else>
            <span style="font-weight: bold; display: inline-block; margin: 0 auto;">活 动 已 经 结 束</span>
          </template>

        </div>
        <div class="time-down">
          <div class="time-left">
            <ul v-if="info.browse_log">
              <li v-for="(item, i) in info.browse_log" :key="i" v-if="i < 5">
                <img :src="item.member ? item.member.avatar : require('../../../assets/images/photo-mr.jpg')" alt="" />
              </li>
            </ul>
            {{ info.browse_count ? info.browse_count : 0 }}人浏览
          </div>
          <div class="time-right">
            累计挑战<em style="color: #de1620;">{{ info.challenge_count }}</em
            >人
          </div>
        </div>
      </div>
    </div>
    <div class="operat">
      <div class="warnClass" :class="[!fun.isTextEmpty(warntexts) ? 'baColors' : '']">
        {{ warntexts }}
      </div>
      <div class="voice-remote-main">
        <div class="voice-remote" :class="[recording ? 'recordingClass' : '']" v-show="recording">
          <span class="cover"></span>
          <span class="icon" :class="[recording ? 'recordingClass' : '']"></span>
        </div>
      </div>
      <div class="btn-box">
        <router-link :to="fun.getUrl('redEnvelopeRecord', { tag: 1, aid: aid })" tag="span">邀请记录</router-link>
        <router-link :to="fun.getUrl('redEnvelopeRecord', { tag: 2, aid: aid })" tag="span">挑战记录</router-link>
      </div>
      <div class="Password" v-show="passWordTest">您的口令：{{ passWordTest }}</div>
      <div>
        <div
          class="buttonClass"
          @click="saidPassword()"
          v-show="btnStatus"
          :style="{
            backgroundImage: 'url(' + require('../../../assets/images/redEnvelope/btn_default@2x.png') + ')'
          }"
          id="longpressBtn"
        >
          喊出口令
        </div>
        <div
          class="buttonClass"
          v-show="!btnStatus"
          @click="smokePaddword()"
          :style="{
            backgroundImage:
              'url(' +
              (!btn_shixiao&&autoStop
                ? require('../../../assets/images/redEnvelope/btn_default@2x.png')
                : require('../../../assets/images/redEnvelope/btn_shixiao@2x.png')) +
              ')'
          }"
        >
          {{autoStop?'抽取口令':'加载中...'}}
        </div>
      </div>
      <p class="nun">剩余挑战次数:{{ info.challenge_number_total }}次</p>
    </div>
    <div class="Introduction">
      <!-- <p class="text">
        *邀请{{ activity_info.invite_people }}个好友完成挑战即可增加1次挑战次数！每人限{{
          activity_info.max_challenge_number
        }}次增加机会！
      </p> -->
      <div class="IntroductionText">
        <div class="left-a">第一步</div>
        <div class="rigth-a">
          点击抽取口令按钮，随机抽取口令！<em v-if="activity_info.verify_mobile == 1" style="color: #de262a;"
            >参加活动需验证手机号！</em
          >
        </div>
      </div>
      <div class="IntroductionText">
        <div class="left-a">第二步</div>
        <div class="rigth-a">
          点击喊出口令按钮,长按录音按钮,<em style="color: #de262a;">提示开始录音时</em
          >,对着手机说出抽取到的口令!系统将上传您的口令录音到微信语音识别接口,将语音口令识别为文字,如果识别结果和口令一致，您将获得<em
            style="color: #de262a;"
          >
            {{ activity_info.min_withdraw }}-{{ activity_info.max_withdraw }} </em
          >区间随机【{{ activity_info.withdraw_code_name }}】奖励!
        </div>
      </div>
    </div>

    <div class="templateStyle addNumber-box">
      <div class="backgroundIcons">更多挑战机会</div>
      <div class="main" v-if="!fun.isTextEmpty(info.exchange_detail)">
        <div class="addNumber-list" v-for="item in info.exchange_detail" :key="item.key" @click.stop="addNumberM(item)">
          <div class="addNumber-child-left">
            <div class="title">{{ item.rule_title }}</div>
            <div class="description">{{ item.rule_text }}</div>
          </div>
          <div
            class="addNumber-child-btn"
            :style="{
              backgroundColor: item.key == 'invite_people' && item.data.is_max == 1 ? '#999' : '#de262a'
            }"
          >
            {{ item.btn_text }}
          </div>
        </div>
      </div>
    </div>

    <div class="templateStyle darebox">
      <div class="backgroundIcons">挑战榜</div>
      <div class="dare-num">
        <div class="dare-flex-top">
          <div class="pnum">{{ info.challenge_count }}人</div>
          <div class="pnum">{{ info.challenge_success_count }}人</div>
          <div class="pnum">{{ info.finish_amount }}</div>
          <div class="pnum">{{ info.surplus_amount }}</div>
        </div>
        <div class="dare-flex-bottom">
          <div class="text">累计挑战</div>
          <div class="text">成功挑战</div>
          <div class="text">已发奖励({{ activity_info.withdraw_code_name }})</div>
          <div class="text">剩余奖励({{ activity_info.withdraw_code_name }})</div>
        </div>
      </div>
      <div class="dare-title">
        <div class="ranking">排名</div>
        <div class="member">会员</div>
        <div class="number">挑战次数</div>
        <div class="Integral text-over">累积奖励({{ activity_info.withdraw_code_name }})</div>
      </div>
      <div class="main">
        <div class="dare-list" v-for="(item, i) in ranking" :key="i">
          <div class="ranking">{{ i }}</div>
          <div class="member">
            <div class="img">
              <img :src="item.member.avatar_image" alt="" />
            </div>
          </div>
          <div class="number">{{ item.count }}</div>
          <div class="Integral">{{ item.total }}</div>
        </div>
      </div>
    </div>
    <div class="templateStyle daralists">
      <div class="backgroundIcons">挑战列表</div>
      <div class="main">
        <div class="list" v-for="(item, i) in info.challenge_log" :key="i">
          <div class="img">
            <img :src="item.member.avatar" alt="" />
          </div>
          <div class="memberinfo">
            <p class="text-over">{{ item.member.nickname }}</p>
            <p>{{ item.member.mobile | hidePhone }}</p>
          </div>
          <div class="total">{{ item.amount }}</div>
          <div class="statusIcon">
            <img v-if="!item.status" src="../../../assets/images/redEnvelope/failed@2x.png" alt="" />
            <img v-if="item.status" src="../../../assets/images/redEnvelope/success@2x.png" alt="" />
          </div>
        </div>
        <img
          style="width: 5rem;"
          v-if="fun.isTextEmpty(info.challenge_log)"
          src="../../../assets/images/blank.png"
          alt=""
        />
      </div>
    </div>
    <div class="templateStyle">
      <div class="backgroundIcons">活动规则</div>
      <div style="padding: 0 0.875rem; line-height: 1.375rem;" class="clearOl" v-html="activity_info.agreement"></div>
    </div>
    <!--垫高-->
    <div style="height: 1.5rem;"></div>

    <van-popup v-model="showVerification" round :close-on-click-overlay="false">
      <div class="verification">
        <!-- 验证码弹窗 -->
        <div class="text">
          根据挑战要求，您需要验证手机号才可以参加挑战，感谢您的支持！
        </div>
        <div class="inputBox">
          <em class="name">手机号</em>
          <input type="number" placeholder="请输入手机号" id="phone" v-model="form.mobile" />
        </div>
        <div class="inputBox" v-if="imgcode">
          <em class="name">验证码</em>
          <input type="text" placeholder="请输入图形验证码" id="code" v-model="form.captcha" />
          <img class="getcodeImg" style="width: 100%; height: 2.5rem; z-index: 999;" :src="imgcode" @click="getimgdata()" />
        </div>
        <div class="inputBox">
          <em class="name">验证码</em>
          <input type="number" placeholder="请输入验证码" id="code" v-model="form.code" /><span
            class="getcodeClass"
            @click="VerificationCode"
            v-show="!cationCode"
            >获取验证码</span
          ><span class="getcodeClass" v-show="cationCode">{{ count }}秒后重新获取</span>
        </div>
        <div class="bottomBox">
          <div class="btn1" @click="showVerification = false">取消</div>
          <div class="btn2" @click="alterAction">确认</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showCommand" round :close-on-click-overlay="false">
      <div class="command">
        <!-- 抽取口令弹窗 -->
        <div class="text">
          {{ shopname }}
          提示您，您抽中的口令如下，请点击确认后，长按喊出口令按钮，读出您抽取到的口令，微信识别准确后，您将获得对应奖励！
        </div>
        <div class="commandText">{{ passWordTest }}</div>
        <div class="btn2" @click="setPassWord">确认</div>
      </div>
    </van-popup>
    <van-popup v-model="showCountdown" round :close-on-click-overlay="false">
      <div class="countdownPopup">
        <!-- 活动结束弹窗：：1.进入链接时活动已结束、2.活动倒计时结束触发 -->
        <div class="text1">您来晚了，本次活动已经结束！</div>
        <div class="text2">您可以了解其他活动！</div>
        <div class="countdownPopup-list">
          <div class="list" v-for="(item, i) in activityList" :key="i" @click="gotoOther(item.id)">
            <div class="img">
              <img :src="item.top_img ? item.top_img : require('../../../assets/images/photo-mr.jpg')" alt="" />
            </div>
            <div class="com">
              <div class="title">
                {{ item.activity_name }}
              </div>
              <div class="time">{{ item.end_time }}</div>
            </div>
          </div>
          <img
            v-if="fun.isTextEmpty(activityList)"
            src="../../../assets/images/redEnvelope/active_end@2x.png"
            alt=""
            style="width: 6rem; padding: 1rem 0;"
          />
        </div>
        <div class="countdownPopup-btn" @click="gotoHome">去商城逛逛</div>
      </div>
    </van-popup>
    <!-- 红包弹窗 -->
    <van-popup v-model="showredEnvelope" class="clearPopup" :close-on-click-overlay="false">
      <transition name="bounce">
        <div class="redEnvelopePopup" v-if="showredEnvelopes">
          <template v-if="isType == 1">
            <div class="total">{{ amount }}</div>
            <div class="type">{{ activity_info.withdraw_code_name }}</div>
          </template>
          <template v-if="isType == 0">
            <div class="wxresultText">微信语音识别结果</div>
            <div class="wxresult">{{ translateResult }}</div>
          </template>
          <div class="logo">
            <img
              :src="
                activity_info.brand_logo ? activity_info.brand_logo : require('../../../assets/images/addcheck.png')
              "
              alt=""
            />
          </div>
          <template v-if="isSucceed">
            <div class="companyName">{{ activity_info.brand_name }}</div>
            <div class="warntext">恭喜您挑战成功,并获得奖励！</div>
          </template>
          <template v-if="!isSucceed">
            <div class="companyName">挑战失败</div>
            <div class="warntext">很遗憾挑战失败,请继续努力</div>
          </template>
          <div class="btn" @click="closeRedPadck">确认</div>
          <p class="redEnvelopePopup-text">
            邀请好友参加挑战即可增加1次挑战机会
          </p>
        </div>
      </transition>
    </van-popup>
    <!-- <van-popup v-model="showRecorddd" class="clearPopup" position="bottom" :close-on-click-overlay="false" closeable
  close-icon-position="top-right">
          <div class="RecordPopup" id="longpressBtn">
            <div class="voice-remote">
              <span class="cover"></span>
              <span class="icon"></span>
            </div>
            <div  class="warntexts"><em style="font-size:1.25rem;">开始录音...</em><br/><em style="font-size:0.875rem;">长按说出口令</em><br/>{{warntexts}}</div>
            <p>请长按按钮说出口令文字 ~</p>
          </div>
      </van-popup> -->
    <van-popup v-model="showCall" round>
      <div class="callPhone">
        <a @click.stop :href="'tel:' + activity_info.service_mobile">
        <i slot="icon" class="iconfont icon-dianhua1" style="color: #fff; font-size: 1.2rem;"></i>
          一键拨打
        </a>
        <div class="code">
          <img :src="activity_info.service_qr" alt="" />
          <p>长按识别二维码联系我们</p>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showBuyGoods" round class="BuyGoods-popup-class">
      <div class="BuyGoods-popup-title">
        购买指定商品
        <div class="iconfont icon-close11" @click.stop="closedBuyGoodsPopup"></div>
      </div>
      <div class="BuyGoods-popup-text">购买以下商品获取抽奖资格</div>
      <div class="BuyGoods-popup-list">
        <div
          class="BuyGoods-popup-child"
          v-for="item in showBuyGoodslist"
          :key="item.id"
          @click.stop="gotoGoods(item.id)"
        >
          <img :src="item.thumb" alt="" />
          <div class="BuyGoods-popup-child-title">{{ item.title }}</div>
          <div class="BuyGoods-popup-child-price">{{ $i18n.t('money') }} {{ item.price }}</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showRedeem" round class="showRedeem-popup-class">
      <div class="showRedeem-popup-title">
        积分兑换
      </div>
      <div class="">当前积分：{{ integralInfo.member_credit }}</div>
      <div class="showRedeem-popup-main">
        <div class="showRedeem-popup-text">兑换挑战次数</div>
        <van-stepper
          v-model="Redeemvalue"
          integer
          :max="parseInt(Number(integralInfo.member_credit) / Number(integralInfo.exchange_credit))"
        />次
      </div>
      <div style="color: #999; font-size: 0.75rem;">
        当前兑换次数需消耗{{ integralInfo.exchange_credit * Redeemvalue }}积分
      </div>
      <div class="showRedeem-popup-btn">
        <div class="btn" @click="showRedeem = false">取消</div>
        <div
          class="btn btncolor"
          v-if="parseInt(Number(integralInfo.member_credit) / Number(integralInfo.exchange_credit)) > 1"
          @click="exchangeNum('credit', Redeemvalue)"
        >
          兑换
        </div>
        <div
          class="btn btncolor"
          v-if="parseInt(Number(integralInfo.member_credit) / Number(integralInfo.exchange_credit)) < 1"
          style="background-color: #999;"
        >
          兑换
        </div>
      </div>
    </van-popup>
    <!-- 微信分享提示 -->
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import redEnvelope_controller from './redEnvelope_controller';

export default redEnvelope_controller;
</script>
<style lang="scss">
.clearOl {
  ol {
    list-style: decimal !important;
  }

  img {
    max-width: 100%;
    height: auto;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
#redEnvelope {
  background: #f44841;
  padding-bottom: 3rem;
  position: relative;
  -moz-user-select: none;
  user-select: none;

  .text-over {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .topMain {
    /* height: 11.5rem; */
    width: 100%;
    background-size: contain;
    background-repeat: no-repeat;

    .logo {
      width: 7.156rem;
      height: 2.281rem;
      border-radius: 0.156rem;
      overflow: hidden;
      margin-top: 4rem;
      object-fit: contain;
      margin-bottom: 3.875rem;
    }

    .Countdown {
      width: 21.875rem;
      height: 8.25rem;
      background-color: #fff;
      border-radius: 0.438rem;
      border: solid 0.063rem #fdcd66;
      display: block;
      margin: 2.625rem auto 0;
      position: relative;
      padding: 1.125rem 0.406rem 0;

      .time-up {
        font-size: 0.75rem;
        font-weight: bold;
        height: 2.5rem;
        line-height: 2.5rem;
        border-bottom: 1px solid #ee8a8f;
        margin-top: 1.125rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        .bottom_time {
          color: #de1620;

          .aa {
            display: inline-block;
            font-size: 1rem;
            font-weight: bold;
            color: #de1620;
            width: 2.25rem;
            height: 1.5rem;
            line-height: 1.5rem;
            background: #f8d0d2;
            border-radius: 0.2rem;
          }
        }
      }

      .time-down {
        height: 2.5rem;
        line-height: 3.5rem;
        overflow: hidden;
        display: flex;
        justify-content: space-between;

        .time-left {
          width: 60%;
          overflow: hidden;
          text-align: left;

          ul {
            display: inline-block;
            padding-left: 0.45rem;
            vertical-align: sub;

            li {
              width: 1.5rem;
              height: 1.5rem;
              object-fit: cover;
              margin-left: -0.45rem;
              border: 1px solid #fff;
              border-radius: 100%;
              overflow: hidden;
              background: url('../../../assets/images/photo-mr.jpg') no-repeat center center;
              background-size: 100%;
              display: inline-block;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                vertical-align: top;
              }
            }
          }
        }
      }
    }
  }

  .addNumber-box {
    .main {
      padding: 0 0.75rem;

      .addNumber-list {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 0.625rem;

        .addNumber-child-left {
          flex: 1;
          text-align: left;

          .description {
            font-size: 0.75rem;
            color: #999;
          }
        }

        .addNumber-child-btn {
          width: 3.5rem;
          height: 1.5rem;
          line-height: 1.5rem;
          margin-left: 0.5rem;
          color: #fff;
          text-align: center;
          background: #de262a;
          border-radius: 1rem;
          overflow: hidden;
          font-size: 0.75rem;
        }
      }
    }
  }

  .operat {
    margin-top: 3.5rem;
    height: 23.875rem;
    background: url('../../../assets/images/redEnvelope/default_pic@2x.png') no-repeat;
    background-size: cover;
    color: #fff;

    .warnClass {
      display: inline-block;
      font-size: 1.125rem;
      font-weight: bold;
      height: 1.5rem;
      line-height: 1.5rem;
      padding: 0 0.875rem;
      margin: 1rem 0 0;
      border-radius: 1rem;
    }

    .baColors {
      background: rgba(0, 0, 0, 0.5);
    }

    .btn-box {
      width: 20rem;
      height: 1.625rem;
      line-height: 1.625rem;
      display: flex;
      justify-content: space-around;
      padding: 2.125rem 0 1.5rem;
      margin: 0 auto;

      span {
        display: inline-block;
        width: 4.425rem;
        height: 1.625rem;
        background: #8991ee;
        border-radius: 0.875rem;
      }
    }

    .buttonClass {
      width: 9.875rem;
      height: 3rem;
      line-height: 3rem;
      margin: 1.5rem auto 0;
      border-radius: 1.5rem;
      font-weight: bold;
      font-size: 1.5rem;
      background-size: 100% 100%;
      -moz-user-select: none;
      -khtml-user-select: none;
      user-select: none;
    }

    .nun {
      height: 2rem;
      line-height: 2rem;
    }

    .Password {
      padding: 0 0.875rem;
      line-height: 1rem;
      background: rgba($color: #fff, $alpha: 0.5);
      display: inline-block;
      border-radius: 1rem;
      margin: 0.875rem 1.5rem 0;
      overflow: hidden;
    }

    // 录音按钮
    .voice-remote-main {
      height: 5rem;
      margin: 0.625rem auto 0;
    }

    .voice-remote {
      border-radius: 50%;
      width: 5rem;
      height: 5rem;
      overflow: hidden;
      background: #f6f6f6;
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      transition: all 0.2s;
      -webkit-transition: all 0.2s;
      margin: 0 auto;
    }

    .voice-remote.recordingClass {
      width: 5.5rem;
      height: 5.5rem;
      bottom: 3rem;
      border: 1px solid #e7e7e7;
    }

    .voice-remote::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      border-radius: 50%;
      background-image: linear-gradient(-90deg, transparent 50%, #ff8200 50%);
    }

    .voice-remote::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 3;
      bottom: 0;
      left: 0;
      border-radius: 50%;
      background-image: linear-gradient(-90deg, transparent 50%, #ff8200 50%);
    }

    .voice-remote .cover {
      position: absolute;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      z-index: 4;
      top: 0;
      left: 0;
      background-image: linear-gradient(-90deg, transparent 50%, #f6f6f6 50%);
    }

    .voice-remote .icon {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: url('../../../assets/images/recordIcon2.png') no-repeat center center;
      background-color: #fff;
      background-size: 60%;
      border-radius: 50%;
      z-index: 5;
    }

    .voice-remote .icon.recordingClass {
      width: 90%;
      height: 90%;
      top: 5%;
      left: 5%;
      background-size: 70%;
    }

    .voice-remote.recordingClass::before {
      -webkit-animation: scoll linear 30s;
      animation: scoll linear 30s;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    .voice-remote.recordingClass::after {
      -webkit-animation: xscoll linear 60s;
      animation: xscoll linear 60s;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    .voice-remote.recordingClass .cover {
      -webkit-animation: hide linear 60s;
      animation: hide linear 60s;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    @-webkit-keyframes scoll {
      0% {
        -webkit-transform: rotate(0deg);
      }

      100% {
        -webkit-transform: rotate(180deg);
      }
    }

    @keyframes scoll {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(180deg);
      }
    }

    @-webkit-keyframes xscoll {
      0% {
        -webkit-transform: rotate(0deg);
      }

      100% {
        -webkit-transform: rotate(360deg);
      }
    }

    @keyframes xscoll {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    @-webkit-keyframes hide {
      0% {
        opacity: 1;
      }

      49.9% {
        opacity: 1;
      }

      50% {
        opacity: 0;
      }

      100% {
        opacity: 0;
      }
    }

    @keyframes hide {
      0% {
        opacity: 1;
      }

      49.9% {
        opacity: 1;
      }

      50% {
        opacity: 0;
      }

      100% {
        opacity: 0;
      }
    }
  }

  .Introduction {
    width: 21.875rem;
    background-color: #fff;
    border-radius: 0.438rem;
    border: solid 1px #fdcd66;
    margin: -2rem auto 0;
    padding: 0.875rem 0.25rem;

    .text {
      color: #7901c5;
      font-size: 10px;
    }

    .IntroductionText {
      display: flex;
      text-align: left;
      font-weight: bold;
      color: #000;
      margin-top: 0.875rem;

      .left-a {
        width: 20%;
      }

      .rigth-a {
        flex: 1;
      }

      em {
        font-weight: bold;
      }
    }
  }

  .darebox {
    .dare-num {
      width: 21.25rem;
      height: 5.125rem;
      background-color: #ffe2b7;
      border-radius: 0.5rem;

      .dare-flex-top,
      .dare-flex-bottom {
        width: 100%;
        height: 2.5625rem;
        display: flex;

        .pnum {
          line-height: 2.875rem;
          flex: 1;
          color: #dd1520;
          font-size: 1rem;
          font-weight: bold;
        }

        .text {
          line-height: 2.125rem;
          flex: 1;
          color: #323232;
          font-size: 0.625rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    .dare-title {
      height: 2.125rem;
      line-height: 2.5rem;
      font-weight: bold;
    }

    .main {
      max-height: 21rem;
      overflow: scroll;
    }

    .dare-list {
      height: 3.75rem;
      line-height: 3.75rem;
      border-bottom: 1px solid #ffb200;
    }

    .dare-title,
    .dare-list {
      display: flex;
      font-size: 0.875rem;
      text-align: center;

      .ranking {
        width: 12%;
      }

      .member {
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;

        .img {
          width: 2.25rem;
          height: 2.25rem;
          object-fit: cover;
          border-radius: 100%;
          overflow: hidden;
          background: url('../../../assets/images/photo-mr.jpg') no-repeat center center;
          background-size: 100%;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .number {
        width: 33%;
      }

      .Integral {
        width: 35%;
      }
    }
  }

  .daralists {
    .main {
      max-height: 21rem;
      overflow: scroll;

      .list {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3.75rem;
        line-height: 3.75rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid #ffb200;
        font-size: 1rem;

        .img {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 100%;
          overflow: hidden;
          margin: 0 0.5rem;
          background: url('../../../assets/images/photo-mr.jpg') no-repeat center center;
          background-size: 100%;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .memberinfo {
          display: flex;
          flex-direction: column;
          width: 30%;
          height: 100%;
          overflow: hidden;
          text-align: left;

          p {
            height: 1.125rem;
            line-height: 1.125rem;
          }
        }

        .total {
          width: 40%;
        }

        .statusIcon {
          width: 2.125rem;
          height: 2.125rem;
          border-radius: 100%;
          overflow: hidden;
          margin: 0 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .verification {
    width: 17.5rem;
    padding: 0 0.75rem;

    .text {
      padding: 1.725rem 2rem 2.125rem;
      color: #666;
      text-align: center;
      font-size: 0.75rem;
    }

    .inputBox {
      height: 2.625rem;
      line-height: 2.625rem;
      display: flex;
      border-bottom: 0.0625rem solid #ebebeb;
      text-align: left;
      align-items: center;
      margin-top: 0.625rem;

      .name {
        width: 3.875rem;
        color: #000;
      }

      input {
        border: none;
      }

      #phone {
        flex: 1;
      }

      #code {
        width: 40%;
      }

      .getcodeClass {
        display: inline-block;
        height: 1.25rem;
        line-height: 1.25rem;
        background-color: #f54242;
        color: #fff;
        border-radius: 0.625rem;
        padding: 0 0.625rem;
      }

      .getcodeImg {
        display: inline-block;
        height: 1.25rem;
        line-height: 1.25rem;
        flex: 1;
      }
    }

    .bottomBox {
      padding-top: 2.688rem;
      padding-bottom: 2.625rem;
      display: flex;
      justify-content: space-around;

      .btn1,
      .btn2 {
        width: 7.2rem;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        color: #fff;
        font-size: 1.125rem;
        font-weight: bold;
        border-radius: 1.234rem;
      }

      .btn1 {
        background: #bcbcbc;
      }

      .btn2 {
        background: #f71515;
      }
    }
  }

  .command {
    width: 17.5rem;
    background-color: #fff;
    position: relative;

    .text {
      padding: 1.875rem 1rem 3rem;
      color: #666;
      line-height: 1.125rem;
      text-align: left;
      font-size: 0.875rem;
    }

    .commandText {
      font-size: 1.125rem;
      color: #ff6c00;
      font-weight: bold;
      padding: 0 1rem 2rem;
    }

    .btn2 {
      width: 7.2rem;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: center;
      color: #fff;
      font-size: 1.125rem;
      font-weight: bold;
      border-radius: 1.234rem;
      background: #f71515;
      margin: 0 auto;
      margin-bottom: 2.25rem;
    }
  }

  .countdownPopup {
    width: 17.5rem;
    background-color: #fff;
    padding: 1.625rem 0.725rem 0.875rem;

    .text1 {
      font-size: 0.75rem;
      color: #000;
    }

    .text2 {
      font-size: 0.875rem;
      color: #666;
    }

    .countdownPopup-list {
      padding-top: 0.875rem;
      max-height: 13.5rem;
      overflow: scroll;

      .list {
        display: flex;
        padding: 0.875rem 0;
        border-bottom: 0.0625rem solid #e7e7e7;

        .img {
          width: 4.5rem;
          height: 3.25rem;
          border-radius: 0.25rem;
          overflow: hidden;
          background: url('../../../assets/images/photo-mr.jpg') no-repeat center center;
          background-size: 100%;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .com {
          flex: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
          margin-left: 0.425rem;
          color: #000;

          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 0.875rem;
            font-weight: bold;
            height: 2.4rem;
            line-height: 1.125rem;
          }

          .time {
            font-size: 0.75rem;
          }
        }
      }
    }

    .countdownPopup-btn {
      width: 7.2rem;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: center;
      color: #fff;
      font-size: 1.125rem;
      font-weight: bold;
      border-radius: 1.234rem;
      background: #f71515;
      margin: 0.875rem auto 0.25rem;
    }
  }

  .callPhone {
    padding: 2rem 3rem;

    a {
      display: inline-block;
      background-color: #fe4848;
      border-radius: 1.156rem;
      color: #fff;
      font-size: 1.125rem;
      padding: 0.5rem 0.625rem;
      font-weight: bold;
    }

    .code {
      margin-top: 3.375rem;

      img {
        width: 7.906rem;
        height: 7.969rem;
        margin: 0 1.25rem;
      }
    }
  }

  .redEnvelopePopup {
    width: 22.625rem;
    height: 31.875rem;
    background: url('../../../assets/images/redEnvelope/reward_bg@2x.png') no-repeat center;
    background-size: cover;

    .total {
      padding-top: 7.875rem;
      font-weight: bold;
      font-size: 3.125rem;
      color: #ec4638;
    }

    .type {
      font-size: 1.125rem;
      color: #ec4638;
    }

    .wxresultText {
      padding-top: 7.875rem;
      font-size: 1.125rem;
      color: #ec4638;
    }

    .wxresult {
      font-size: 1.325rem;
      padding: 0 3.425rem;
      color: #ec4638;
      font-weight: bold;
      height: 4.325rem;
      overflow: scroll;
    }

    .logo {
      width: 4.275rem;
      height: 4.275rem;
      border-radius: 100%;
      overflow: hidden;
      margin: 1.325rem auto 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .companyName {
      position: relative; /* 定位横线（当横线的父元素） */
      color: #fff; /* 居中文字的颜色 */
      text-align: center;
      font-weight: bold;
      padding: 0 6rem;
      font-size: 1.125rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin: 0.875rem auto;
    }

    .companyName::before,
    .companyName::after {
      content: '';
      position: absolute; /* 定位背景横线的位置 */
      top: 50%;
      background: #fff; /* 背景横线颜色 */
      width: 12%; /* 单侧横线的长度 */
      height: 1px;
    }

    .companyName::before {
      left: 15%; /* 调整背景横线的左右距离 */
    }

    .companyName::after {
      right: 15%;
    }

    .warntext {
      text-align: center;
      font-weight: bold;
      font-size: 1.125rem;
      color: #fff;
    }

    .btn {
      width: 9.125rem;
      height: 1.875rem;
      line-height: 1.875rem;
      color: #cd312c;
      font-weight: bold;
      font-size: 1rem;
      margin: 0 auto;
      background-image:
        linear-gradient(
          180deg,
          rgba(253, 229, 184, 0.99) 0%,
          rgba(253, 229, 184, 0.99) 25%,
          rgba(253, 213, 154, 0.99) 48%,
          rgba(252, 196, 123, 1) 72%,
          #fcc47b 100%
        ),
        linear-gradient(#fcd094, #fcd094);
      background-blend-mode: normal, normal;
      box-shadow:
        0 0.344rem 1.188rem 0 rgba(159, 11, 0, 0.23),
        inset 0.006rem -0.125rem 0.5rem 0 rgba(255, 228, 201, 0.31);
      border-radius: 0.656rem;
      margin-top: 2rem;
    }

    .redEnvelopePopup-text {
      font-size: 0.75rem;
      color: #fff;
      margin-top: 0.625rem;
    }
  }

  .templateStyle {
    width: 21.875rem;
    background-color: #fff;
    border-radius: 0.438rem;
    border: solid 0.063rem #fdcd66;
    display: block;
    margin: 2.625rem auto 0;
    position: relative;
    padding: 1.725rem 0.25rem 1.375rem;
  }

  .backgroundIcons {
    position: absolute;
    width: 8.75rem;
    height: 2.25rem;
    line-height: 2.25rem;
    color: #fff;
    font-size: 1.125rem;
    font-weight: bold;
    text-align: center;
    top: -1.125rem;
    left: 50%;
    margin-left: -4.375rem;
    background: url('../../../assets/images/redEnvelope/title_bg@2x.png');
    background-size: 100% 100%;
  }

  .clearPopup {
    background: none;
  }

  .bounce-enter-active {
    animation: bounce-in 1.5s;
  }

  .bounce-leave-active {
    animation: bounce-in 1.5s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(1);
    }

    100% {
      transform: scale(1);
    }
  }

  .callBoss {
    z-index: 10;
    position: fixed;
    top: 60%;
    right: 0;
    height: 2.375rem;
    line-height: 2.375rem;
    width: 3.875rem;
    padding: 0 0.625rem;
    text-align: right;
    border-top-left-radius: 1.172rem;
    border-bottom-left-radius: 1.172rem;
    color: #fff;
    display: flex;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .top_music {
    z-index: 10;
    position: fixed;
    top: 1rem;
    height: 2.5rem;
    line-height: 2.5rem;
    width: 100%;
    padding: 0 0.625rem;
    text-align: right;

    .icon-active_music_open {
      font-size: 2.25rem;
      color: #fff;
      display: block;
      position: absolute;
      right: 0.2rem;
    }

    .icon-active_music_close {
      font-size: 2.25rem;
      color: #fff;
      display: block;
      position: absolute;
      right: 0.2rem;
    }

    .xuanzhuan {
      animation: xz 2s linear infinite;
    }

    @keyframes xz {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }
  }

  .RecordPopup {
    position: relative;

    .warntexts {
      color: rgb(255, 255, 255);
      padding: 3rem;
      font-size: 1rem;
      font-weight: bold;
    }

    p {
      color: #fff;
      padding: 7rem 0 1rem;
    }

    .voice-remote {
      border-radius: 50%;
      width: 5rem;
      height: 5rem;
      overflow: hidden;
      position: absolute;
      background: #f6f6f6;
      bottom: 3rem;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      transition: all 0.2s;
      -webkit-transition: all 0.2s;
    }

    .voice-remote:active {
      width: 5.5rem;
      height: 5.5rem;
      bottom: 3rem;
      border: 1px solid #e7e7e7;
    }

    .voice-remote::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      border-radius: 50%;
      background-image: linear-gradient(-90deg, transparent 50%, #1dc61c 50%);
    }

    .voice-remote::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 3;
      bottom: 0;
      left: 0;
      border-radius: 50%;
      background-image: linear-gradient(-90deg, transparent 50%, #1dc61c 50%);
    }

    .voice-remote .cover {
      position: absolute;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      z-index: 4;
      top: 0;
      left: 0;
      background-image: linear-gradient(-90deg, transparent 50%, #f6f6f6 50%);
    }

    .voice-remote .icon {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: url('../../../assets/images/recordIcon.png') no-repeat center center;
      background-color: #e25b5b;
      background-size: 60%;
      border-radius: 50%;
      z-index: 5;
    }

    .voice-remote .icon:active {
      width: 86%;
      height: 86%;
      top: 7%;
      left: 7%;
      background-size: 100%;
    }

    .voice-remote:active::before {
      -webkit-animation: scoll linear 30s;
      animation: scoll linear 30s;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    .voice-remote:active::after {
      -webkit-animation: xscoll linear 60s;
      animation: xscoll linear 60s;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    .voice-remote:active .cover {
      -webkit-animation: hide linear 60s;
      animation: hide linear 60s;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    @-webkit-keyframes scoll {
      0% {
        -webkit-transform: rotate(0deg);
      }

      100% {
        -webkit-transform: rotate(180deg);
      }
    }

    @keyframes scoll {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(180deg);
      }
    }

    @-webkit-keyframes xscoll {
      0% {
        -webkit-transform: rotate(0deg);
      }

      100% {
        -webkit-transform: rotate(360deg);
      }
    }

    @keyframes xscoll {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    @-webkit-keyframes hide {
      0% {
        opacity: 1;
      }

      49.9% {
        opacity: 1;
      }

      50% {
        opacity: 0;
      }

      100% {
        opacity: 0;
      }
    }

    @keyframes hide {
      0% {
        opacity: 1;
      }

      49.9% {
        opacity: 1;
      }

      50% {
        opacity: 0;
      }

      100% {
        opacity: 0;
      }
    }
  }

  .showRedeem-popup-class {
    width: 18rem;
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: 0 0.875rem;

    .showRedeem-popup-title {
      height: 3rem;
      line-height: 3rem;
      font-size: 1rem;
      text-align: center;
      font-weight: bold;
      color: #333;
    }

    .showRedeem-popup-main {
      display: flex;
      align-items: center;
      padding: 0.875rem 0;

      .showRedeem-popup-text {
        flex: 1;
      }
    }

    .showRedeem-popup-btn {
      display: flex;
      justify-content: space-around;
      padding: 0.875rem 0;

      .btn {
        padding: 0 1rem;
        height: 2rem;
        line-height: 2rem;
        border: 1px solid #333;
        border-radius: 0.5rem;
      }

      .btncolor {
        background-color: #e25b5b;
        border-color: #e25b5b;
        color: #fff;
      }
    }
  }

  .BuyGoods-popup-class {
    width: 18rem;
    height: 25rem;
    display: flex;
    flex-direction: column;

    .BuyGoods-popup-title {
      height: 3rem;
      line-height: 3rem;
      font-size: 1rem;
      text-align: center;
      font-weight: bold;
      color: #333;

      .iconfont {
        position: absolute;
        right: 0.5rem;
        top: 0;
        width: 2rem;
        height: 2rem;
      }
    }

    .BuyGoods-popup-text {
      color: #666;
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: left;
      text-indent: 0.875rem;
    }

    .BuyGoods-popup-list {
      width: 18rem;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 0.625rem;
      overflow-y: scroll;

      .BuyGoods-popup-child {
        width: 8rem;
        height: 12.125rem;
        flex-shrink: 0;
        overflow: hidden;
        text-align: left;
        border-radius: 0.375rem;
        margin: 0 0 0.875rem;
        border: 1px solid #f5f5f5;

        img {
          width: 8rem;
          height: 8rem;
        }

        .BuyGoods-popup-child-title {
          height: 2.375rem;
          line-height: 1rem;
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          padding: 0.375rem;
        }

        .BuyGoods-popup-child-price {
          color: #f15353;
          padding: 0 0.375rem 0.375rem;
        }
      }
    }
  }
}
</style>
