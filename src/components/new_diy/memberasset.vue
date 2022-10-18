<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="html-box">
      <div id="userinfo">
        <div style="text-align: center; font-size: 18px;" v-if="datas.show_list.length <= 0">请设置显示板块内容</div>
        <ul v-if="datas.show_list.length > 0">
          <template v-for="(item,index) in datas.show_list">
            <li v-if="item.value === 'consume_coupon_show' && member_item.consume_coupon_show" @click="goUrl('CardIndex')" :key="index">
              <span>{{ member_item.consume_coupon_show.amount }}</span>
              <span>{{ member_item.consume_coupon_show.text }}</span>
            </li>
            <li v-if="item.value === 'Integral_love' && member_item.integral_show" @click="goUrl(item.value)" :key="index">
              <span>{{ member_item.integral_show.data }}</span>
              <span>{{ member_item.integral_show.text }}</span>
            </li>
            <li v-if="item.value === 'love_index_1' && member_item.love_show.unable_love_show==1" @click="goUrl('love_index')" :key="index">
              <span>{{ member_item.love_show.unable_data }}</span>
              <span>{{ member_item.love_show.unable_text }}</span>
            </li>
            <li v-if="item.value === 'love_index_2' && member_item.love_show.usable_love_show==1" @click="goUrl('love_index')" :key="index">
              <span>{{ member_item.love_show.usable_data }}</span>
              <span>{{ member_item.love_show.usable_text }}</span>
            </li>
            <li v-if="item.value === 'balance' && member_item.credit" @click="goUrl(item.value)" :key="index">
              <span><span>{{$i18n.t('money')}}</span>{{ member_item.credit.data }}</span>
              <span>{{ member_item.credit.text }}</span>
            </li>
            <li v-if="item.value === 'integral_v2' && member_item.integral" @click="goUrl(item.value)" :key="index">
              <span>{{ member_item.integral.data }}</span>
              <span>{{ member_item.integral.text }}</span>
            </li>
            <li v-if="item.value === 'extension' && member_item.integral_show" @click="goUrl(item.value)" :key="index">
              <span><span>{{$i18n.t('money')}}</span>{{ member_item.income || "0.00" }}</span>
              <span>{{name_of_withdrawal_text}}</span>
            </li>
            <li v-if="item.value === 'red_packet' && member_item.consumer_reward_show" @click="goUrl('consumerRewardIndex')" :key="index">
              <span><span>{{$i18n.t('money')}}</span>{{ member_item.consumer_reward_show.amount || "0.00" }}</span>
              <span>{{member_item.consumer_reward_show.text}}</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 自定义样式
const css = function () {
  if(this.datas.preview_color) {
    const {preview_color,} = this.datas;

    return `
		    .component-${this.id} .html-box {
		        background-color: ${preview_color.color};
            background-image: url(${preview_color.isColor == 2 ? preview_color.image : ''});
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
		    }
		`;
  }
};

export default {
  props: ["id", "datas", "member_item"],
  data() {
    return {
      name_of_withdrawal_text: ""
    };
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
  },
  mounted() {
    this.customizeIncome();
  },
  methods: {
    goUrl(str) {
      this.$router.push(this.fun.getUrl(str));
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义提现字段
      this.name_of_withdrawal_text = mailLanguage.income.name_of_withdrawal;
    }
  }
};
</script>

<style lang="scss" scoped>
  * {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  // 默认
  .component-wrapper {
    width: 375/37.5rem;
  }

  .html-box {
    min-height: 30px;
    padding: 10px 0;
  }

  #userinfo {
    /* background: #fff; */

    /* border-top: solid 1px #ebebeb; */
    ul {
      display: flex;
      overflow-x: scroll;
      white-space: nowrap;

      li {
        flex: 1;
        margin: 5px;
        box-sizing: border-box;
        border: 0;
        text-align: center;
        display: flex;
        flex-direction: column;
      }

      li span {
        color: #222;
        font-size: 14px;
        margin-bottom: 5px;
        height: 20px;
        line-height: 20px;
        display: inline-block;
      }

      li small {
        font-size: 12px;
      }
    }
  }
</style>
