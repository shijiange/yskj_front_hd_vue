<template>
  <div>
    <c-title :hide="false" :text="plugin_name"></c-title>
    <div class="r_top_box">
      <div class="image">
        <img
          :src="details.avatar_image"
          alt=""
        />
      </div>
      <div class="r_top_box_content">
        <div class="r_top_box_name">{{details.nickname}}</div>
        <div class="r_top_box_leve overflow" v-if="details.level_name">{{details.level_name}}</div>
      </div>
    </div>

    <van-tabs v-model="active">
      <van-tab title="我的任务"></van-tab>
      <van-tab title="奖励记录"></van-tab>
    </van-tabs>

    <div class="task_wrapper" v-if="active == 0">
      <div class="task_container">
        <div class="task_volume">
          任务量：<span>{{details.scalar}}</span>/{{details.total}}
        </div>
        <div class="task_progress">
          任务进度：
          <div class="task_pregress_bar_container">
            <div class="task_pregress_bar" :style="{'width':((details.scalar/details.total)*100)+'%'}"></div>
          </div>
        </div>
        <div class="hr"></div>
        <div class="task_reward">
          任务奖励：
          <span>￥{{details.goods_amount}}</span>
        </div>
      </div>
    </div>

    <div class="goods_list" v-if="active == 0">
      <div class="goods_item" v-for="item in goods_list" :key="item.goods_id" @click="gotoRecord(item.goods_id)">
        <div class="goods_face">
          <img
            :src="item.thumb"
            alt=""
          />
        </div>
        <div class="goods_content">
          <div class="goods_name">
            {{item.goods_title}}
          </div>
          <div class="goods_desc">
            <div class="count">累计数量：{{item.scalar}}</div>
            <div class="price">累计金额：￥{{item.goods_price}}</div>
          </div>
        </div>
      </div>
    </div>

    <template v-if="active == 1">
      <div class="r_je">
        <div class="r_je_d">
          <span class="r_je_m">{{wait_amount}}元</span>
          <span class="r_je_txt">未结算</span>
        </div>
        <div class="r_je_d">
          <span class="r_je_m">{{settle_amount}}元</span>
          <span class="r_je_txt">已结算</span>
        </div>
      </div>
      <div class="line"></div>
      <van-tabs v-model="active1" @change="getListData">
        <van-tab title="全部"></van-tab>
        <van-tab title="未结算"></van-tab>
        <van-tab title="已结算"></van-tab>
      </van-tabs>
      <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
      
        <div v-for="(item, index) in listData" :key="index">
          <div class="r_ls">
            <div class="r_ls_r" style="text-align: left;">
              <span class="r_li_o">任务量：{{item.scalar}}/{{item.total}}</span>
              <span class="r_li_t">{{ item.created_at }}</span>
            </div>
            <div class="r_ls_r" style="text-align: right;">
              <span>奖励金额：<span class="r_li_m">{{ item.amount }}</span></span>
              <span class="r_li_s">{{ item.status_name }}</span>
            </div>
          </div>
        </div>
      </d-list>
    </template>
  </div>
</template>

<script>
import DList from "@/components/dlist";
export default {

  components:{DList},
  data() {
    return {
      active: 0,
      active1: 0,
      details:{},
      plugin_name:'',
      goods_list:[],

      loading: false,
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      wait_amount:0,
      settle_amount:0
    };
  },
  created() {
    this.getDetails();
    this.getListData();
  },
  methods: {
    gotoRecord(goods_id){
      this.$router.push(this.fun.getUrl("dealerTaskRewardRecord", {},{goods_id,task_id:this.details.task_id}));
    },
    initPage() {
      this.loading = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    getDetails() {
      $http.get("plugin.dealer-task-reward.frontend.controllers.page.index").then(
        response => {
          if (response.result === 1) {
            this.details = response.data;
            this.goods_list = response.data.goods_list;
            this.plugin_name = response.data.plugin_name;
            this.fun.setWXTitle(this.plugin_name);
          } else {
            this.$toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },

    getListData() {
      this.initPage();
      let json = {};
      if (this.active1 > 0) {
        json.status = this.active1;
      }

      $http.get("plugin.dealer-task-reward.frontend.controllers.reward.index", json, "").then(
        res => {
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.listData = res.data.reward_list.data;
          this.total_page = res.data.reward_list.total;
          this.wait_amount = res.data.wait_amount;
          this.settle_amount = res.data.settle_amount;
          if (this.total_page <= 0) {
            this.total_page = 1;
          }
          if (this.total_page <= this.page) {
            this.loading = true;
            this.isLoadMore = false;
          }
        },
        response => {
          this.$toast(response.msg);
        }
      );
    },

    getMoreData() {
      if(this.active!=1) return ;
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }

      // console.log('加载更多启动');
      this.loading = true; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.isLoadMore = false;
        //console.log('没了');
      } else {
        this.page += 1;
        let json = {
          page: this.page
        };
        if (this.tabsIndex > 0) {
          json.status = this.tabsIndex;
        }
        $http
          .get("plugin.dealer-task-reward.frontend.controllers.reward.index", json, "...")
          .then(res => {
            this.loading = false;
            if (res.result == 1) {
              let nextPageData = res.data.reward_list.data;
              this.listData = this.listData.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.r_top_box {
  width: 100%;
  height: 7rem;
  background-color: #ee2e2b;
  padding: 1.69rem 1.56rem 2.09rem 1.56rem;
  display: flex;
  align-items: center;

  .image {
    width: 2.88rem;
    height: 2.88rem;
    margin-right: 0.69rem;

    img {
      width: 2.88rem;
      height: 2.88rem;
      background-color: #000;
      border-radius: 50%;
    }
  }

  .r_top_box_content {
    height: 2.88rem;
    text-align: left;
  }

  .r_top_box_name {
    font-size: 1rem;
    color: #fff;
    text-align: left;
  }

  .r_top_box_leve {
    display: inline-block;
    max-width: 10rem;
    padding: 0.1rem 0.594rem;
    margin-top:0.5rem;
    border-radius: 0.63rem;
    font-size: 0.75rem;
    color: #fff;
    text-align: left;
    background-color: rgba(255, 255, 255, 0.29);
  }
}

.task_wrapper {
  padding: 0.625rem;

  .task_container {
    padding: 0.625rem;
    font-size: 0.813rem;
    color: #2c2c2c;
    text-align: left;
    background: #fff;
    border-radius: 0.313rem;

    .task_volume {
      padding-bottom: 0.625rem;

      span {
        color: #fd8a49;
      }
    }

    .task_progress {
      display: flex;
      align-items: center;
      padding-bottom: 0.625rem;

      .task_pregress_bar_container {
        position: relative;
        width: 11.094rem;
        height: 0.5rem;
        background-color: #e6e6e6;
        border-radius: 0.25rem;
        overflow: hidden;

        .task_pregress_bar {
          position: absolute;
          left: 0;
          height: 0.5rem;
          background-color: #fd8a49;
          border-radius: 0.25rem;
        }
      }
    }

    .hr {
      width: 20.938rem;
      height: 0.031rem;
      background-color: #eee;
    }

    .task_reward {
      padding-top: 0.781rem;
    }
  }
}

.goods_list {
  padding: 0 0.625rem;

  .goods_item {
    display: flex;
    width: 100%;
    height: 5.313rem;
    padding: 0.625rem;
    margin-bottom: 0.625rem;
    background-color: #fff;
    border-radius: 0.313rem;

    .goods_face {
      width: 4.063rem;
      height: 4.063rem;
      border-radius: 0.313rem;

      img {
        width: 4.063rem;
        height: 4.063rem;
        border-radius: 0.313rem;
      }
    }

    .goods_content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0.563rem;
      text-align: left;

      .goods_name {
        font-size: 0.875rem;
        color: #2c2c2c;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .goods_desc {
        display: flex;
        font-size: 0.688rem;
        color: #8a8a8a;

        .price {
          margin-left: 1.781rem;
        }
      }
    }
  }
}

.r_je {
  width: 100%;
  height: 5.38rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;

  .r_je_d {
    display: flex;
    flex-direction: column;

    .r_je_m {
      font-size: 1rem;
      color: #f15353;
    }

    .r_je_txt {
      font-size: 0.88rem;
      color: #8c8c8c;
    }
  }
}

.r_ls {
  height: 3.84rem;
  padding: 0 0.94rem;
  background-color: #fff;
  border-bottom: 0.06rem solid #ebebeb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .r_ls_r {
    display: flex;
    flex-direction: column;

    .r_li_o {
      font-size: 0.75rem;
      color: #333;
    }

    .r_li_t {
      font-size: 0.81rem;
      color: #8c8c8c;
    }

    .r_li_m {
      font-size: 1rem;
      color: #f15353;
    }

    .r_li_s {
      font-size: 0.75rem;
      color: #8c8c8c;
    }
  }
}

.line {
  width: 100%;
  height: 0.63rem;
}
</style>
