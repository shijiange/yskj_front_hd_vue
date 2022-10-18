<template>
  <div id="member-all">
    <ul class="user_sum user_sum_style1" :style="{
        backgroundColor: Params.memberincomecolor,
        backgroundImage:
          'url(' +
          (Params.memberincomebg == '2'
            ? Params.memberincomeimg
            : '') +
          ')',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }"
        v-if="Params.membercredit||Params.memberpoint ||Params.memberincome||Params.memberwhitelove||Params.memberredlove||Params.memberintegral">
      <li v-if="Params.memberintegral && member_item.integral_show">
        <router-link :to="fun.getUrl('Integral_love')">
          <span class="sum"> <small></small>{{ member_item.integral_show.data }}</span>
          <br /><span class="text">{{ member_item.integral_show.text }}</span>
        </router-link>
      </li>
      <li v-if="Params.memberwhitelove && member_item.love_show.unable_love_show==1">
        <router-link :to="fun.getUrl('love_index')">
          <span class="sum"> <small></small>{{ member_item.love_show.unable_data }}</span>
          <br /><span class="text">{{ member_item.love_show.unable_text }}</span>
        </router-link>
      </li>
      <li v-if="Params.memberredlove && member_item.love_show.usable_love_show==1">
        <router-link :to="fun.getUrl('love_index')">
          <span class="sum"> <small></small>{{ member_item.love_show.usable_data }}</span>
          <br /><span class="text">{{ member_item.love_show.usable_text }}</span>
        </router-link>
      </li>
      <li v-if="Params.membercredit && member_item.credit">
        <router-link :to="fun.getUrl('balance')"><span class="sum"><span>{{$i18n.t('money')}}</span>{{ member_item.credit.data }}</span><br /><span class="text">{{ member_item.credit.text }}</span></router-link>
      </li>
      <li v-if="Params.memberpoint && member_item.integral">
        <router-link :to="fun.getUrl('integral_v2')"><span class="sum">{{ member_item.integral.data }}</span><br /><span class="text">{{ member_item.integral.text }}</span></router-link>
      </li>
      <li v-if="Params.memberincome">
        <router-link :to="fun.getUrl('extension')"><span class="sum"><span>{{$i18n.t('money')}}</span>{{ member_item.income || "0.00" }}</span><br /><span class="text">{{name_of_withdrawal_text}}</span></router-link>
      </li>
    </ul>
  </div>
</template>

<script>
// import { Toast } from 'vant';
export default {
  props: ["Params", "member_item"],
  data() {
    return {
      name_of_withdrawal_text: ""
    };
  },
  mounted() {
    this.customizeIncome();
  },
  methods: {
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义提现字段
      this.name_of_withdrawal_text = mailLanguage.income.name_of_withdrawal;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #member-all {
    .user_sum_style1 {
      width: 100%;
      background: #fff;
    }

    .user_sum {
      overflow-x: scroll;
      white-space: nowrap;
      display: flex;
      text-align: center;

      /* padding: 14px 0; */
    }

    .user_sum li {
      flex: 1;
      margin: 0.625rem;
      box-sizing: border-box;
      border: 0;
    }

    .user_sum .sum {
      font-size: 16px;
      display: inline-block;
      margin-bottom: 6px;
    }

    .sum span {
      font-size: 12px;
    }

    .user_sum .text {
      color: #8c8c8c;
      font-size: 12px;
    }
  }
</style>
