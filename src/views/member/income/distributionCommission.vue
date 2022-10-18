<template>

  <div id="distributionCommission">
    <c-title :hide="false"
             :text='`未${this.fun.initWithdrawal()}分销佣金`'></c-title>
    <!-- tab-container -->
    <div id="income">
      <p>可{{this.fun.initWithdrawal()}}{{income_name_text}}（元）</p>
      <h3>981.87</h3>
      <span>成功{{this.fun.initWithdrawal()}}{{income_name_text}}：984533.59</span>
    </div>
    <ul id="gongge">
      <li>
        累计{{income_name_text}}<br />
        <b>33,811.03</b><br />
        <span>所有{{income_name_text}}</span>
      </li>
      <li>
        累计{{income_name_text}}<br />
        <b>33,811.03</b><br />
        <span>所有{{income_name_text}}</span>
      </li>
      <li>
        累计{{income_name_text}}<br />
        <b>33,811.03</b><br />
        <span>所有{{income_name_text}}</span>
      </li>
    </ul>
    <van-button type="danger">
      <router-link to="/member/withdrawal">我要{{this.fun.initWithdrawal()}}</router-link>
    </van-button>
    <!--<el-button type="danger"><router-link to="/member/withdrawal">我要提现</router-link></el-button>-->
  </div>

</template>
<script>
import cTitle from "components/title";
export default {
  data() {
    return {
      toi: window.localStorage.i,
      selected: "1",

      income_name_text: ""
    };
  },
  mounted() {
    this.customizeIncome();
    this.fun.setWXTitle(`未${this.fun.initWithdrawal()}分销佣金`);
  },
  methods: {
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#distributionCommission {
  a {
    color: #000;
  }

  #income {
    background: #f15353;
    padding: 0.625rem;
    color: #fff;
    text-align: left;

    h3 {
      border-bottom: 0.0625rem #fff solid;
      line-height: 3rem;
      font-size: 24px;
      margin: 0.3125rem 0;
    }

    p {
      font-size: 16px;
    }
  }

  #gongge {
    display: flex;
    background: #fff;
    padding: 0 0.9375rem;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;

    li {
      flex: 50%;
      text-align: left;
      padding: 0.625rem 0;

      b {
        font-size: 18px;
        line-height: 2rem;
      }

      span {
        color: #bbb;
      }
    }
  }

  /* .el-button{width: 95%;margin: 0.625rem 0; a{color: #FFF;display: block;}} */
  .van-button {
    width: 95%;
    margin: 0.625rem 0;

    a {
      color: #fff;
      display: block;
    }
  }
}
</style>