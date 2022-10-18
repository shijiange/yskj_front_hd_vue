<!-- 团队单数分红 #75841 -->
<template>
  <div id="team_odd_dividend">
    <c-title :hide="false" :text="`${plugin_name}`"></c-title>
    <div class="top-dividend-box">
      <div class="flex-box tt">
        <div class="bold-text">今日团队订单数</div>
        <div>佣金单价 ￥{{ info.rewards_each }}</div>
      </div>
      <div class="flex-box tt">
        <div class="bold-text" style="font-size: 20px; line-height: 2.5rem;">{{ info.team_nums }}</div>
      </div>
      <div class="flex-box tb" style="line-height: 1.875rem; font-size: 18px;">
        <div class="bold-text">{{ info.is_settle }}</div>
        <div class="bold-text">{{ info.no_settle }}</div>
      </div>
      <div class="flex-box tb">
        <div>已结算佣金</div>
        <div>未结算佣金</div>
      </div>
    </div>

    <van-tabs v-model="activeName" @change="handleClick" sticky :ellipsis="false" swipeable>
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <li v-for="(item, index) in dataList[ind].list" :key="index" class="li">
            <div class="li-odd-top flex-box">
              <div style="font-size: 10px; color: #868686;">{{ item.date }}</div>
              <div style="color: #f15353;">{{ item.status_name }}</div>
            </div>
            <div class="flex-box">
              <div>团队订单数：{{ item.order_nums }}</div>
              <div style="color: #606060;">佣金</div>
            </div>
            <div class="flex-box">
              <div>佣金单价：￥{{ item.commission }}</div>
              <div style="color: #f15353;">￥{{ item.commission_total }}</div>
            </div>
            <div class="flex-box">
              <div>失效订单数：{{ item.invalid_order }}</div>
            </div>
            <div class="flex-box">
              <div>失效扣除：￥{{ item.invalid_price }}</div>
            </div>
          </li>
        </ul>
        <yz-blank v-else></yz-blank>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      plugin_name: "",
      info: {
        rewards_each: "---",
        team_nums: "---",
        is_settle: "---",
        no_settle: "---"
      },
      activeName: 0,
      dataList: [],
      titleArr: [],
      isLoadMore: true
    };
  },
  created() {
    this.init();
  },
  activated() {},

  components: { yzBlank },

  computed: {},

  mounted() {},

  methods: {
    init() {
      this.dataList = [];
      this.titleArr = ["全部", "未结算", "已结算", "已失效"];
      this.isLoadMore = true;
      this.setNewArr();
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      this.handleClick();
    },
    handleClick() {
      if (!this.fun.isTextEmpty(this.dataList[this.activeName].list)) {
        this.isLoadMore = this.dataList[this.activeName].isLoadMore;
        return;
      }
      let record_type = ["", "no_settle", "is_settle", "invalid"];
      let index = this.activeName;
      $http
        .post("plugin.order-quantity-bonus.frontend.controllers.center.index", { page: 1, record_type: record_type[index] }, "")
        .then(response => {
          if (response.result === 1) {
            this.plugin_name = response.data.info.name;
            this.fun.setWXTitle(this.plugin_name);
            this.info = response.data.info;
            this.isLoadMore = true;
            this.$set(this.dataList[index], "isLoadMore", true);
            this.$set(this.dataList[index], "total_page", response.data.list.last_page);
            if (!this.dataList[index].total_page) {
              this.$set(this.dataList[index], "total_page", 0);
              this.dataList[index].total_page = 0;
            }
            this.$set(this.dataList[index], "list", response.data.list.data);
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      this.dataList[this.activeName].isLoadMore = false;
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.dataList[this.activeName].page >= this.dataList[this.activeName].total_page) {
        return;
      } else {
        let record_type = ["", "no_settle", "is_settle", "invalid"];
        let index = this.activeName;
        let _json = {
          record_type: record_type[index]
        };
        this.dataList[index].page = this.dataList[index].page + 1;
        _json.page = this.dataList[index].page;

        $http.get("plugin.order-quantity-bonus.frontend.controllers.center.more-records", _json, "加载中").then(
          response => {
            this.isLoadMore = true;
            this.dataList[index].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              this.dataList[index].list = this.dataList[index].list.concat(myData); //数组拼接
            } else {
              this.dataList[index].page = this.dataList[index].page - 1;
              this.dataList[index].isLoadMore = false;
              this.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#team_odd_dividend {
  background: #fff;
  padding-bottom: 2rem;

  .flex-box {
    display: flex;
  }

  .top-dividend-box {
    color: #fff;
    width: 90%;
    margin: 0.875rem;
    background-image: linear-gradient(-50deg, #fe8b30 0%, #fbce68 100%);
    box-shadow: 0 20px 30px 0 rgba(251, 166, 98, 0.2);
    border-radius: 24px;
    padding: 1rem;

    .tt {
      justify-content: space-between;
    }

    .tb {
      justify-content: space-around;
    }

    .bold-text {
      font-weight: 600;
    }
  }

  .content {
    padding: 0.75rem;
    background: #f7f7f7;

    .li {
      background: #fff;
      border-radius: 0.313rem;
      padding: 0 0.75rem 0.5rem;
      margin-bottom: 0.75rem;

      .flex-box {
        justify-content: space-between;
        line-height: 1.875rem;
      }

      .li-odd-top {
        justify-content: space-between;
        border-bottom: 1px solid #f2f2f2;
        height: 2.25rem;
        line-height: 2.25rem;
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
