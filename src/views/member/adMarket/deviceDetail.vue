<!-- 广告市场-设备详情 -->
<template>
  <div id="deviceDetail">
    <c-title :hide="false" text="我的设备"></c-title>

    <div class="top">
      <div class="SN-num">设备SN码：{{ equipment.sn }}</div>
      <div class="top-main">
        <div class="left">
          <div>累计时长(min)</div>
          <div>支付展示次数(次)</div>
          <div>累计广告收入(元)</div>
          <div>累计结算广告收入(元)</div>
          <div>累计结算店长提成(元)</div>
        </div>
        <div class="right">
          <div>{{ equipment.time_total }}</div>
          <div>{{ equipment.show_total }}</div>
          <div>{{ equipment.amount_total }}</div>
          <div>{{ equipment.sellte_total }}</div>
          <div>{{ equipment.sellte_total }}</div>
        </div>
      </div>
    </div>
    <div class="titles">
      广告收入记录
    </div>
    <div class="ul">
      <div class="li" v-for="item in logs" :key="item.id">
        <div class="mDetail">
          <div class="id">ID:{{ item.id }}</div>
          <div class="money">{{$i18n.t('money')}}{{ item.amount }}</div>
          <div class="type">
            {{ item.code_name }}:{{ item.view_count }}{{ item.unit_code_name }}
          </div>
          <div class="time">{{ item.created_at }}</div>
        </div>
        <div class="btn" @click="gotoLog(item.id)">查看记录</div>
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      equipment: {},
      logs: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.init();
    this.getEquipmentDetail();
  },

  components: { cTitle },

  computed: {},

  methods: {
    init() {
      this.equipment = {
        id: null,
        sn: "",
        time_total: "",
        show_total: null,
        amount_total: "",
        sellte_total: ""
      };
      this.logs = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    },
    getEquipmentDetail() {
      $http
        .get(
          "plugin.advert-market.frontend.center.getEquipmentDetail",
          { sn: this.$route.params.sn },
          ""
        )
        .then(response => {
          if (response.result == 1) {
            this.equipment = response.data.equipment;
            this.isLoadMore = true;
            this.total_page = response.data.logs.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.logs = response.data.logs.data;
          } else {
            Toast(response.msg);
            this.logs = response.data.logs.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoLog(_id) {
      this.$router.push(this.fun.getUrl("managerCommission", { log_id: _id }));
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get(
            "plugin.advert-market.frontend.center.getEquipmentDetail",
            { page: that.page, sn: this.$route.params.sn },
            ""
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.logs.data;
              that.logs = that.logs.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#deviceDetail {
  text-align: left;
  background: #fff;

  .top {
    background: #f15353;
    padding: 0 0.938rem;
    margin-bottom: 4.25rem;
    height: 8.625rem;

    .SN-num {
      height: 2.875rem;
      line-height: 2.875rem;
      color: #fff;
      font-size: 0.875rem;
    }

    .top-main {
      background: #fff;
      display: flex;
      //   transform: translateY(30%);
      padding: 0.25rem 0.875rem;
      box-shadow: 0 0 0.313rem 0 rgba(255, 73, 73, 0.2);
      border-radius: 0.563rem;

      .left,
      .right {
        width: 50%;
        display: flex;
        flex-direction: column;
        color: #999;

        div {
          height: 1.825rem;
          line-height: 1.825rem;
          font-size: 0.75rem;
        }
      }

      .right {
        color: #333;
        text-align: right;
      }
    }
  }

  .titles {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    height: 3rem;
    line-height: 3rem;
    padding: 0 0.938rem;
  }

  .ul {
    padding: 0 0.938rem;

    .li {
      padding: 1rem 0.531rem 0.625rem;
      border-bottom: 0.0625rem solid #f0f6fb;
      align-items: center;
      display: flex;
      line-height: 1.5rem;

      .mDetail {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        padding-right: 1.75rem;

        div {
          width: 50%;
          font-size: 1rem;
          color: #333;
        }

        .money {
          color: #f15353;
          text-align: right;
        }

        .type {
          color: #999;
          font-size: 0.75rem;
        }

        .time {
          color: #999;
          text-align: right;
          font-size: 0.75rem;
        }
      }

      .btn {
        font-size: 0.75rem;
        height: 1.188rem;
        line-height: 1.188rem;
        background: #feeded;
        color: #f15353;
        padding: 0 0.425rem;
        border-radius: 0.578rem;
      }
    }
  }
}
</style>
