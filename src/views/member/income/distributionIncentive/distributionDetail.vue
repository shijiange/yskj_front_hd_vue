<!-- 分销管理奖励详情页 -->
<template>
  <div id="distributionDetail">
    <c-title :hide="false"
             :text="'奖励详情'"> </c-title>
    <div class="give_money">
      <p class="text">奖励金额（元）</p>
      <p class="number">{{info.dividend_amount}}</p>
    </div>
    <ul class="give_list">
      <li>
        <span class="left">赠送ID</span>
        <span>{{info.id}}</span>
      </li>
      <li>
        <span class="left">奖励类型</span>
        <span class="time">{{info.type_name}}</span>
      </li>
      <li>
        <span class="left">赠送时间</span>
        <span class="time">{{info.created_at}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      info: []
    };
  },
  activated() {
    this.getDetail();
  },
  components: { cTitle },
  methods: {
    getDetail() {
      let that = this;
      $http
        .get(
          "plugin.commission-manage.frontend.controllers.reward-log.get-dividend-by-id",
          { id: this.$route.query.id },
          ""
        )
        .then(response => {
          if (response.result === 1) {
            that.info = response.data;
            if (that.fun.isTextEmpty(response.data)) {
              Toast({
                message: "获取数据为空",
                duration: 1000
              });
            }
          } else {
            Toast({
              message: response.msg,
              duration: 800
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
/* #distributionDetail { */

/* } */

#distributionDetail .give_money {
  background: #fff;
  padding: 0.625rem 0;
}

#distributionDetail .give_money .text {
  font-size: 14px;
  line-height: 2rem;
}

#distributionDetail .give_money .number {
  font-size: 30px;
  line-height: 3rem;
}

#distributionDetail .income_list,
#distributionDetail .give_list {
  margin-top: 0.625rem;
  background: #fff;
  padding: 0.625rem 0;
}

#distributionDetail .income_list li,
#distributionDetail .give_list li {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 2.25rem;
  padding: 0 0.875rem;
}

#distributionDetail .income_list li .left {
  color: #8c8c8c;
}

#distributionDetail .income_list li .time {
  font-size: 14px;
}
</style>