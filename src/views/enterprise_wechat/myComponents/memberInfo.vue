<template>
  <div v-if="userInfo">
    <div class="plane">
      <div class="plane-title">会员信息</div>
      <ul class="list">
        <li class="recommend item" v-if="userInfo.referral">
          <div class="left-title">推荐人：</div>
          <div class="right">
            <span class="mermber-id">ID:{{userInfo.referral.uid}}</span>
            <span>{{userInfo.referral.nickname}}</span>
          </div>
        </li>
        <li class="current item" v-if="userInfo.get_member_type">
          <div class="left-title">来源：</div>
          <div class="right">
            <el-tooltip
              v-for="(icon, index) in userInfo.get_member_type"
              :key="index"
              effect="dark"
              :content="icon.type"
              placement="top"
              v-if="icon.is_open"
            >
              <i  :class="['iconfont', icon.icon ? icon.icon : '']"></i>
            </el-tooltip>
          </div>
        </li>
        <li class="item" v-if="userInfo.createtime">
          <div class="left-title">注册时间：</div>
          <div class="right">
            <span class="mermber-id">{{userInfo.createtime}}</span>
          </div>
        </li>
        <li class="item">
          <div class="left-title">会员分组：</div>
          <div class="right" v-if="memberInfo.group && memberInfo.group.group_name">
            <span class="mermber-id">{{memberInfo.group.group_name}}</span>
          </div>
          <div class="right" v-else>
            <span class="mermber-id">无分组</span>
          </div>
        </li>
        <li class="item" v-if="userInfo.realname">
          <div class="left-title">姓名：</div>
          <div class="right">
            <span class="mermber-id">{{userInfo.realname}}</span>
          </div>
        </li>
        <li class="item" v-if="userInfo.mobile">
          <div class="left-title">手机号：</div>
          <div class="right">
            <span class="mermber-id">{{userInfo.mobile}}</span>
          </div>
        </li>
        <li class="item" v-if="userInfo.birthday">
          <div class="left-title">生日：</div>
          <div class="right">
            <span class="mermber-id">{{userInfo.birthday}}</span>
          </div>
        </li>
        <li class="item" v-if="memberInfo.wechat">
          <div class="left-title">微信号：</div>
          <div class="right">
            <span class="mermber-id">{{memberInfo.wechat}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="plane" v-if="memberInfo.alipay">
      <div class="plane-title">支付宝</div>
      <ul class="list">
        <li class="item">
          <div class="left-title">支付账号：</div>
          <div class="right">
            <span class="mermber-id">{{memberInfo.alipay}}</span>
          </div>
        </li>
        <li class="item">
          <div class="left-title">账号姓名：</div>
          <div class="right">
            <span class="mermber-id">{{memberInfo.alipayname}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="plane" v-if="bankCard">
      <div class="plane-title">银行卡信息</div>
      <ul class="list">
        <li class="item">
          <div class="left-title">开户行：</div>
          <div class="right">
            <span class="mermber-id">{{bankCard.bank_name}}</span>
          </div>
        </li>
        <li class="item">
          <div class="left-title">开户行省份：</div>
          <div class="right">
            <span class="mermber-id">{{bankCard.bank_province}}</span>
          </div>
        </li>
        <li class="item">
          <div class="left-title">开户城市：</div>
          <div class="right">
            <span class="mermber-id">{{bankCard.bank_city}}</span>
          </div>
        </li>
        <li class="item">
          <div class="left-title">开户支行：</div>
          <div class="right">
            <span class="mermber-id">{{bankCard.bank_branch}}</span>
          </div>
        </li>
        <li class="item">
          <div class="left-title">银行卡号</div>
          <div class="right">
            <span class="mermber-id">{{bankCard.bank_card}}</span>
          </div>
        </li>
        <li class="item">
          <div class="left-title">姓名</div>
          <div class="right">
            <span class="mermber-id">{{bankCard.member_name}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['memberId'],
  data () {
    return {
      strUrl: 'plugin.wechat-chat-sidebar.frontend.controller.customer.customer.get-user-info',
      getConfig: {client: 'work',type: 17}, //企业微信公共参数
      userInfo: '',
      memberInfo: '',
      bankCard: {},
    };
  },
  mounted () {
    this.getData();
  },

  methods: {
    async getData () {
      try {
        let res = await $http.get(this.strUrl, {...this.getConfig, member_id: this.memberId});
        if (res.result === 1) {
          this.userInfo = res.data;
          this.memberInfo = res.data.yz_member;
          this.bankCard = res.data.bank_card;
        } else {
          this.$toast(res.msg);
        }
      } catch (err) {
        console.log("接口报错::",err);
      }
    },
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.plane {
  margin: 0.625rem;
  padding: 0.75rem;
  border-radius: 0.469rem;
  background-color: #fff;
  text-align: left;

  .plane-title {
    position: relative;
    color: #f78b00;
    font-weight: bold;
    font-size: 0.813rem;
    padding-left: 0.5rem;
  }

  .plane-title::after {
    content: '';
    position: absolute;
    top: 15%;
    left: 0;
    height: 70%;
    width: 0.125rem;
    background-color: #f78b00;
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
    }
  }

  .recommend {
    .mermber-id {
      color: #fff;
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

    .icon-all_smallprogram {
      color: #00b84b;
    }

    .icon-all_app,
    .icon-qiyeweixin01 {
      color: #0068ff;
    }

    .icon-all_wechat {
      color: #0ed76e;
    }
  }
}
</style>