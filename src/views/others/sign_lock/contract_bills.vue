<template>
  <div>
    <c-title :hide="false" :text="'合同账单'">
    </c-title>
    <ul class="head">
      <li>
        <p class="num">{{dataInfo.contract_num_sum || 0}}</p>
        <p>购买数量</p>
      </li>
      <li>
        <p class="num">{{dataInfo.use_num_sum || 0}}</p>
        <p>已使用数量</p>
      </li>
      <li>
        <p class="num">{{dataInfo.rest_num_sum || 0}}</p>
        <p>可使用数量</p>
      </li>
    </ul>
    <div class="bill-box">
      <div class="blank" v-if="recordsList.length<=0">
        <img src="../../../assets/images/blank.png">
        <span>还没有记录哦</span>
      </div>
      <div class="item-box" v-for="item in recordsList" :key="item.id">
        <div class="top">
          <!--<div class="left">-->
            <!--<img src="https://b.yunzmall.com/image/7ddfbe47f490da923a777062779c4142.jpg" alt="">-->
          <!--</div>-->
          <div class="left">
            <p class="title">{{item.change_mode}}</p>
            <!--<p class="price">{{$i18n.t('money')}}500</p>-->
            <!--<p class="time">购买时间2020-02-15 15:25:24</p>-->
            <!--<p class="time">可用合同数：180</p>-->
          </div>
          <div class="right">
            <p class="price" v-if="item.income_type == 1">{{item.contract_num}}份</p>
            <p class="green" v-else>{{item.contract_num}}份</p>
          </div>
        </div>
        <div class="bottom">
          <p class="time">可用合同数：{{item.after_num}}</p>
          <p class="time right">购买时间{{item.created_at}}</p>
        </div>
        <p class="end_time" v-if="item.income_type == 1">有效期{{item.end_time}}</p>
      </div>
    </div>

    <signButton :signIndex="'signContractLock'"></signButton>
  </div>
</template>

<script>
import signButton from "../sign/component/sign_button";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      dataInfo: {},
      recordsList: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      this.page = 1;
      $http
        .get(
          "plugin.yun-contract-lock.frontend.contract-num-log.get-list",
          { page: 1 },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.dataInfo = response.data;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            this.recordsList = response.data.list.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.yun-contract-lock.frontend.contract-num-log.get-list",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.list.data;
                that.recordsList = that.recordsList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
  },
  components: { signButton }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .head {
    background: #fff;
    display: flex;
    padding: 1rem;

    li {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    p {
      color: #999;
    }

    .num {
      font-size: 18px;
      color: #000;
      font-weight: bold;
    }
  }

  .item-box {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 0.5rem;

    .top {
      display: flex;

      .left {
        flex: 1;
        text-align: left;

        .title {
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price {
          color: #ff2c29;
          font-size: 18px;
        }

        .time {
          font-size: 12px;
          color: #666;
        }
      }

      .right {
        flex: 0 0 5rem;
        text-align: right;

        .price {
          color: #ff2c29;
          font-size: 18px;
        }

        .green {
          color: #009c00;
          font-size: 18px;
        }
      }
    }

    .bottom {
      margin-top: 0.5rem;
      display: flex;
      font-size: 12px;

      .time {
        flex: 1;
        text-align: left;
        font-size: 12px;
        color: #666;
      }

      .right {
        text-align: right;
      }
    }

    .end_time {
      text-align: right;
      font-size: 12px;
      color: #ff2c29;
    }
  }

</style>
