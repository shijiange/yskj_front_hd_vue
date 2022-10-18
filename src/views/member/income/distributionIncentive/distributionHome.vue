<!-- 分销管理奖励首页 -->
<template>
  <div id="distributionHome">
    <c-title :hide="false"
             :text="pluginName"> </c-title>
    <div class="topBox">
      <div class='childBox'>
        <div><i style="font-size: 1.25rem; font-weight: bold;">{{all_dividend}}</i> 元</div>
        <div>累计所有奖励</div>
      </div>
      <!-- <div class="line"></div>
      <div class='childBox'>
        <div><i style="font-size:1.25rem;font-weight:bold;">{{total_dividend}}</i> 元</div>
        <div>累计({{active==0?'直推奖':'管理奖'}})奖励</div>
      </div> -->
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <ul>
        <li class="list"
            v-for="item in infogl"
            :key="item.id"
            @click="gotoDetail(item.id)">
          <div class="typeb">奖励ID ：{{item.id}}</div>
          <div class="amountb">{{item.dividend_amount}}元</div>
          <div class="timeb">{{item.created_at}}</div>
        </li>
      </ul>
      <img v-if="isNo"
           src="../../../../assets/images/blank.png"
           alt=""
           style="width: 5rem; padding-top: 3rem;">
    </van-pull-refresh>
  </div>
</template>

<script>
import { scrollMixin } from "../../../../utils/mixin"; //引入加载更多
import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      pluginName: "",
      all_dividend: "",
      total_dividend: "",
      infozt: [],
      infogl: [],
      active: 0,
      isNo: false,
      isLoading:false,

      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  components: { cTitle },
  methods: {
    init() {
      this.pluginName = "";
      this.all_dividend = "";
      this.total_dividend = "";
      this.infozt = [];
      this.infogl = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    },
    getData() {
      let that = this;
      this.isNo = false;
      $http
        .get("plugin.commission-manage.frontend.controllers.reward-log", {}, "")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.list.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.infogl = response.data.list.data;
            if (that.fun.isTextEmpty(response.data.list.data)) {
              that.isNo = true;
            }
            that.pluginName = response.data.plugin_name
              ? response.data.plugin_name
              : "分销商管理奖";
            that.all_dividend = response.data.all_dividend;
            that.total_dividend = response.data.total_dividend;
            that.isLoading = false;
          } else {
            that.isLoading = false;
            Toast({
              message: response.msg,
              duration: 800
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    gotoDetail(_id) {
      this.$router.push(this.fun.getUrl("DistributionDetail", {}, { id: _id }));
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
            "plugin.commission-manage.frontend.controllers.reward-log",
            { page: that.page },
            ""
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.list.data;
              that.infogl = that.infogl.concat(nextPageData); //进行数组拼接
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
    },
    //下拉刷新
    loadTop() {
      this.init();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    }
  }
};
</script>
<style lang='scss' rel='stylesheet/scss' scoped>


#distributionHome .topBox {
  padding: 0 12px;
  width: 100%;
  height: 5rem;
  color: #fff;
  background: #f15353;
  text-align: center;
  display: flex;
  align-items: center;
}

#distributionHome .topBox .childBox {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
}

#distributionHome .topBox .childBox div {
  width: 100%;
}

#distributionHome .line {
  height: 3rem;
  width: 1px;
  background-color: #ffd5cd;
}

#distributionHome .list {
  width: 100%;
  padding: 0.825rem;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  text-align: left;
  background: #fff;
  color: #333;
  border-bottom: 0.0625rem solid #ccc;
}

#distributionHome .list:last-child {
  border: none;
}

#distributionHome .list .typeb {
  flex: 60%;
  font-size: 0.875rem;
}

#distributionHome .list .amountb {
  text-align: right;
  flex: 40%;
}

#distributionHome .list .timeb {
  padding-top: 0.5rem;
  color: #999;
}
</style>