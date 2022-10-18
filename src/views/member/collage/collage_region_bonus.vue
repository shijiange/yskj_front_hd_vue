<template>
  <div>
    <c-title :hide="false" text="拼单区域分红"></c-title>
    <div
      v-for="(item, index) in datas"
      :key='index'
      style="margin-top: 0.5rem; background: #fff;"
    >
      <van-cell
        :title="item.create_month"
        is-link
        @click="getOtherList(item.create_month, index)"
      />
      <ul class="rationList1" v-show="item.is_show == 1">
        <li v-for="(item1, index1) in item.data" :key='index1'>
          <div class="detail">
            <div class="info">
              <ul class="left">
                <li>订单号：{{ item1.project_id }}</li>
                <li class="time">时间：{{ item1.created_at }}</li>
              </ul>
              <ul class="right">
                <li>分红+{{ item1.price }}</li>
                <li class="state"></li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
      <div
        style="text-align: center; padding: 10px 0;"
        v-if="item.current_page < item.last_page"
      >
        <van-button
          type="default"
          size="small"
          @click="getMore(item.create_month, index)"
        >加载更多+
        </van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import cTitle from "components/title";

export default {
  data() {
    return {
      datas: []
    };

  },
  components: { cTitle },
  created() {
    this.getDividendList();
  },
  methods: {
    //获取佣金列表
    getDividendList(status) {
      let that = this;
      let json = {
        "status": status
      };
      $http.get("plugin.collage.api.Income.getCollageAreaDividend", json, "获取中").then(function(response) {
        if (response.result == 1) {
          that.time_list = response.data.time;
          that.time_list.forEach((item, index) => {
            that.datas.push({
              create_month: item.created_month,
              data: [],
              total: 0,
              current_page: 1,
              last_page: 1,
              is_loading: 0,
              is_show: 0
            });
          });
          that.datas[0].data = response.data.list_data.data;
          that.datas[0].total = response.data.list_data.total;
          that.datas[0].last_page = response.data.list_data.last_page;
          that.datas[0].current_page = response.data.list_data.current_page;
          that.datas[0].is_loading = 1;
          that.datas[0].is_show = 1;
        } else {
          Toast(response.msg);
        }
        console.log(that.datas[0]);
      }, function(response) {
        Toast(response.msg);
      });
    },
    //设置选择后的数据
    getMore(date, index) {
      let that = this;
      that.datas[index].current_page = that.datas[index].current_page + 1;
      let json = {
        status: that.status,
        page: that.datas[index].current_page,
        created_month: date
      };
      console.log(that.datas[index]);
      $http.get("plugin.collage.api.Income.getCollageAreaDividend", json, "获取中").then(function(response) {
        if (response.result == 1) {
          that.datas[index].data = that.datas[index].data.concat(response.data.list_data.data);

        } else {
          Toast(response.msg);
        }
        console.log(that.datas);
      }, function(response) {
        Toast(response.msg);
      });
      console.log(date, index);

    },
    getOtherList(date, index) {
      console.log("hahahah");
      let that = this;
      //隐藏数据
      if (that.datas[index].is_show == 1) {
        that.datas[index].is_show = 0;
        return;
      } else {
        that.datas[index].is_show = 1;
        //已经加载首页数据
        if (that.datas[index].is_loading == 1) {
          return;
        }
      }
      let json = {
        status: that.status,
        page: 1,
        created_month: date
      };
      $http.get("plugin.collage.api.Income.getCollageAreaDividend", json, "获取中").then(function(response) {
        if (response.result == 1) {
          that.datas[index].data = response.data.list_data.data;
          that.datas[index].total = response.data.list_data.total;
          that.datas[index].last_page = response.data.list_data.last_page;
          that.datas[index].current_page = response.data.list_data.current_page;
          that.datas[index].is_loading = 1;
          that.datas[index].is_show = 1;
        } else {
          Toast(response.msg);
        }
        console.log(that.datas);
      }, function(response) {
        Toast(response.msg);
      });

    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .rationList1 {
    padding: 0;
    margin: 0;

    li {
      span.month {
        display: block;
        text-align: left;
        line-height: 2.25rem;
        padding: 0 0.75rem;
        font-size: 16px;
        background: #f0f0f0;
      }

      .info {
        border-bottom: 0.0625rem solid #e2e2e2;
        overflow: hidden;
        padding: 0.625rem 0.75rem;
        line-height: 1.25rem;
        font-size: 14px;

        li {
          line-height: 1.5rem;
        }

        .time,
        .state {
          color: #8c8c8c;
          font-size: 12px;
        }

        .left {
          width: 70%;
          float: left;
          text-align: left;
          box-sizing: border-box;

          span {
            font-size: 14px;
            font-weight: 400;
            color: #333;
          }

          p {
            font-size: 12px;
            color: #999;
          }
        }

        .right {
          float: left;
          width: 30%;
          color: #20b86a;
          text-align: right;

          p {
            margin: 0;
            padding: 0;
            font-size: 12px;
            color: #888;
          }
        }
      }
    }
  }
</style>