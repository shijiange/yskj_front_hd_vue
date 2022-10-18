<template>
  <div id="work-wechat-sidebar" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <div class="member-header">
      <div class="member-info">
        <div class="atavar">
          <img :src="memberInfo.avatar" alt="">
        </div>
        <div class="info">
          <div style="display: flex; align-items: center;">
            <h1 class="user-name overflow">{{memberInfo.nickname}}</h1>
            <span class="user-id" v-if="memberInfo.uid">ID: {{memberInfo.uid}}</span>
            <el-tooltip v-if="memberInfo.is_agent" effect="dark" content="推广员" placement="top">
              <i class="iconfont icon-fontclass-daili" ></i>
            </el-tooltip>
            <el-tooltip v-if="memberInfo.is_existence" effect="dark" content="名片" placement="top" >
              <i class="iconfont icon-fontclass-mingpian" @click="toCard(memberInfo.card_id)"></i>
            </el-tooltip>
          </div>
          <div style="display: flex; margin-top: 0.6rem;">
            <div class="mermber-level" v-if="memberInfo.level_name" @click="gotoMemberGrade">{{memberInfo.level_name}}</div>
            <div class="end-time" v-if="memberInfo.yz_member && memberInfo.yz_member.validity">{{memberInfo.yz_member.validity}}到期</div>
          </div>
        </div>
      </div>
      <div class="border"></div>

      <ul class="integral-detail">
        <!-- 余额 -->
        <li v-if="memberInfo.credit && memberInfo.credit.is_show == 1">
            <p class="amount">{{$i18n.t('money')}}{{memberInfo.credit.data}}</p>
            <p>{{memberInfo.credit.text}}</p>
        </li>
        <!-- 冻结爱心值 -->
        <li v-if="memberInfo.love_show && memberInfo.love_show.unable_love_show == 1">
            <p class="amount">{{$i18n.t('money')}}{{memberInfo.love_show.unable_data}}</p>
            <p>{{memberInfo.love_show.unable_text}}</p>
        </li>
        <!-- 可用爱心值 -->
        <li v-if="memberInfo.love_show && memberInfo.love_show.usable_love_show == 1">
            <p class="amount">{{$i18n.t('money')}}{{memberInfo.love_show.usable_data}}</p>
            <p>{{memberInfo.love_show.usable_text}}</p>
        </li>
        <!-- 爱心积分 -->
        <li v-if="memberInfo.integral_show && memberInfo.integral_show.is_show">
            <p class="amount">{{$i18n.t('money')}}{{memberInfo.integral_show.data}}</p>
            <p>{{memberInfo.integral_show.text}}</p>
        </li>
        <!-- 积分 -->
        <li v-if="memberInfo.integral && memberInfo.integral.is_show == 1">
            <p class="amount">{{$i18n.t('money')}}{{memberInfo.integral.data}}</p>
            <p>{{memberInfo.integral.text}}</p>
        </li>
        <!-- 优惠券 -->
        <li v-if="memberInfo.coupon && memberInfo.coupon.is_show == 1">
            <p class="amount">{{memberInfo.coupon.data}}</p>
            <p>{{memberInfo.coupon.text}}</p>
        </li>
      </ul>
    </div>

    <div class="center-box">
      <van-tabs v-model="income_statistic_type" class="time-tabs" @change="selectTime">
        <van-tab title="全部" name="0"></van-tab>
        <van-tab title="今日" name="1"></van-tab>
        <van-tab title="昨日" name="2"></van-tab>
        <van-tab title="本周" name="3"></van-tab>
        <van-tab title="上周" name="4"></van-tab>
        <van-tab title="本月" name="5"></van-tab>
      </van-tabs>
      <div class="income-detail" v-if="income_statistic.length > 0">
        <div class="item" v-for="(item,index) in income_statistic" :key="index">
          <el-tooltip  effect="dark" :content="item.value" placement="top">
            <div>
              <p class="num overflow">{{item.value}}</p>
              <p class="name">{{item.title}}</p>
            </div>
          </el-tooltip>
        </div>


      </div>
      <p class="tips">团队粉丝不随周期变化</p>

      <div class="my-tags">
        <div class="header">
          <div class="title">
            <span>标签</span>
            <el-tooltip v-if="memberInfo.is_agent" effect="dark" content="每个企业最多设置3000个标签" placement="top">
              <i class="iconfont icon-ht_tips" ></i>
            </el-tooltip>
          </div>
          <div>
            <span class="history-tag" @click="showAddSheet=true">历史标签</span>
            <div class="add-tags" @click="showAddTagPop=true">+添加标签</div>
          </div>
        </div>
        <div class="tag-list">
          <van-tag
            v-for="(item, index) in tags"
            :key="index"
            plain
            class="tag"
            closeable
            type="primary"
            color="#f78b00"
            text-color="#f78b00"
            @close="deleteTag(item.tag_id)"
          >{{item.name}}</van-tag>
        </div>
      </div>
    </div>

    <div class="tab-bar">
      <!-- <div class="title">会员信息</div> -->
      <van-tabs v-model="navActive" class="tabs">
        <van-tab :title="item" :name="index" v-for="(item, index) in tabList" :key="index"></van-tab>
      </van-tabs>
    </div>

    <div class="bottom-box" v-if="showChild">
      <user-info v-if="navActive === 0"
        :memberId="memberInfo.yz_member ? memberInfo.yz_member.member_id : ''"
      ></user-info>
      <template v-else>
        <component :is="componentName"></component>
      </template>
    </div>

    <van-action-sheet v-model="showAddSheet" :actions="actions" @select="selectTags"></van-action-sheet>
    <van-popup v-model="showAddTagPop" :style="{ height: '12rem', width: '80%' }" :closeable="true" round get-container="#work-wechat-sidebar">
      <div class="addtag-popup">
        <p class="popup-title">添加标签</p>
        <van-field class="tag-input" v-model="addTagText" placeholder="请输入标签内容" />
        <div class="btn-confirm" @click="confirmAdd">确定</div>
      </div>
    </van-popup>

    <!--<c-foot></c-foot>-->
  </div>

</template>



<script>
import wechat_sidebar from "./wechat_sidebar_controller";
export default wechat_sidebar;
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.pcStyle {
  width: 375px;
  margin: 0 auto;
}

#work-wechat-sidebar {
  font-size: 12px;
  background: #f2f2f2;

  .header-tabs {
    width: 12rem;
  }

  .member-header {
    color: #fff;
    padding: 1rem 0.875rem;
    background-color: #3b3b3b;

    .member-info {
      display: flex;
      align-items: center;

      .atavar {
        width: 3.781rem;
        height: 3.75rem;
        border-radius: 50%;
        overflow: hidden;
        background-color: #000;

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
          height: 1.094rem;
          color: #6c2a09;
          padding: 0 0.5rem 0 1.5rem;
          border-radius: 0.469rem;
          background-image: linear-gradient(90deg, #ffebc0 0%, #ffc479 100%), linear-gradient(#ffd821, #ffd821);
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

    .border {
      margin: 1.2rem 0;
      height: 1px;
      background-color: #6f6f6f;
    }

    .integral-detail {
      display: flex;
      white-space: nowrap;
      align-items: center;
      overflow-x: auto;
      overflow-y: hidden;

      li {
        flex: 1;
        line-height: 1.5rem;
        margin: 0 0.5rem;

        .amount {
          font-size: 0.888rem;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }

  .center-box {
    background-color: #fff;
    padding: 0.875rem;

    .time-tabs {
      width: auto;
    }

    .income-detail {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 0.5rem;
      margin-top: 1rem;
      color: #fff;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-image: url("../../assets/images/enterprise_wechat/income_bg.png");
      text-align: left;
      white-space: pre-wrap;
      word-break: break-all;

      .item {
        display: inline-block;
        position: relative;
        width: 32%;
        padding: 0.5rem;
        text-align: center;
        white-space: nowrap;
        font-size: 0.813rem;
      }

      .item::before {
        position: absolute;
        content: '';
        top: 50%;
        left: 0;
        width: 1px;
        height: 1.5rem;
        background-color: #fff;
        transform: translateY(-50%) scaleX(0.5);
      }

      .item:first-child::before,
      .item:nth-child(3n+4)::before {
        width: 0;
      }
    }

    .tips {
      color: #6e6e6e;
      text-align: left;
      font-size: 0.688rem;
      margin-top: 0.5rem;
    }

    .my-tags {
      margin-top: 1rem;

      .header {
        display: flex;
        justify-content: space-between;

        .title {
          font-size: 0.938rem;
        }

        .history-tag {
          margin-right: 0.625rem;
          color: #f14e4e;
          font-size: 600;
        }

        .add-tags {
          display: inline-block;
          color: #f14e4e;
          font-size: 0.688rem;
          padding: 0.1rem 0.5rem;
          border-radius: 0.125rem;
          border: solid 0.031rem #f14e4e;
        }

        .icon-ht_tips {
          color: #cda881;
        }
      }

      .tag-list {
        text-align: left;

        .tag {
          padding: 0.2rem;
          margin: 1.5rem 1.5rem 0 0;
          font-size: 0.688rem;
        }

        /deep/ .van-tag--plain::before {
          transform: translateX(-0.3rem);
        }

        /deep/ .van-tag__close {
          margin: 0;
          cursor: pointer;
          transform: translate(0.88rem, -0.788rem);
        }
      }
    }
  }

  .tab-bar {
    position: relative;
    padding: 1rem 0.875rem 0.3rem 0.875rem;
    background-color: #fff;
    margin-top: 0.5rem;

    .title {
      text-align: left;
      font-size: 0.938rem;
      margin-bottom: 0.5rem;
    }

    /deep/ .van-tabs {
      .van-tabs__nav--complete {
        padding-left: 0;
      }

      .van-tabs__wrap--scrollable .van-tab {
        padding: 0 24px 0 0;
      }

      .van-tabs__line {
        left: -12px;
      }
    }
  }

  .tab-bar::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #e9e5e5;
    transform: scaleY(0.5);
  }

  .bottom-box {
    // margin-top: 0.5rem;
  }

  .addtag-popup {
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .popup-title {
      color: #252525;
      font-size: 0.938rem;
    }

    .tag-input {
      margin: 0.5rem 0;
      padding: 5px 16px;
      border: solid 1px #afaaaa;
      border-radius: 2rem;
    }

    .btn-confirm {
      width: 80%;
      color: #fff;
      border-radius: 1rem;
      padding: 0.46rem 0;
      font-size: 0.938rem;
      background-color: #f59a1f;
    }
  }
}

</style>