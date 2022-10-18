<template>
  <div id="my-customer">
    <div class="team-goods">
      <div class="li">
        <p class="amount">
          {{$i18n.t('money')}}
          {{my_referral.child_order_money ? my_referral.child_order_money : 0}}
        </p>
        <p class="title">直推订单金额</p>
      </div>
      <div class="li">
        <p class="amount">
          {{$i18n.t('money')}}
          {{my_referral.child_order_total ? my_referral.child_order_total : 0}}
        </p>
        <p class="title">直推订单数</p>
      </div>
      <div class="li">
        <p class="amount">
          {{$i18n.t('money')}}
          {{my_referral.team_order_money ? my_referral.team_order_money : 0}}
        </p>
        <p class="title">团队订单金额</p>
      </div>
      <div class="li">
        <p class="amount">
          {{$i18n.t('money')}}
          {{my_referral.team_goods_total ? my_referral.team_goods_total : 0}}
        </p>
        <p class="title">团队订单数</p>
      </div>
    </div>

    <div class="top-box">
      <van-tabs v-model="customerLevel" class="tab" @change="changeLevel" type="card" title-active-color="#fff" title-inactive-color="#535353">
        <template v-for="(level, index) in level_tab">
          <van-tab v-if="level.is_show" :key="index" :title="labelValue(level)" :name="index"></van-tab>
        </template>
      </van-tabs>
    </div>
    <van-search v-model="json.keyword" placeholder="搜索订单" @search="search" shape="round"></van-search>
    <van-list
      v-if="agent_data.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="loadMore"
    >
      <div class="customer-goods" v-for="(item, idnex) in agent_data" :key="idnex">
        <div class="customer-info">
          <div class="avatar">
            <img :src="item.avatar" alt="">
          </div>
          <div class="info">
            <p class="nickname">
              <span  class="name overflow">{{item.nickname}}</span>
              <span class="id">{{item.id}}</span>
            </p>
            <p class="userName overflow" v-if="item.realname">{{item.realname}}</p>
            <p class="time">{{item.createtime}}</p>
          </div>
        </div>
        <div class="goods-info">
          <div class="goods-num">
            <span>订单数：<span class="red-text">{{ item.child_order_total }}</span> 个</span>
            <span>订单金额：<span class="red-text">{{$i18n.t('money')}}{{item.child_order_money}}</span></span>
          </div>
          <div class="customer-num">
            <span>客户数量：<span class="red-text">{{item.team_total}}</span>个</span>
            <span>客户订单：<span class="red-text">{{$i18n.t('money')}}{{item.team_order_money}}</span></span>
          </div>
        </div>
      </div>
    </van-list>
    <van-empty v-else description="空空如也" style="background: #fff;"></van-empty>
  </div>
</template>

<script>
export default {
  data () {
    return {
      strUrl: 'plugin.wechat-chat-sidebar.frontend.controller.customer.customer.get-member-list',
      workConfig: {client: 'work', type: 17},
      agent_data: [],
      level_tab: [],
      my_referral: {},
      customerLevel: 'level1',
      json: {
        relationLevel: 1,
        keyword: '',
        page: 1,
      },
      loading: false,
      finished: false,
    };
  },
  mounted () {
    this.initData();
    this.getData();
  },
  computed:{
    labelValue(item){
      return (item) => {
        return `${item.level}客户(${item.total})`;
      };
    },
  },
  methods: {
    getData () {
      if (this.finished && this.loading) {
        return;
      }
      this.loading = true;

      $http.get(this.strUrl, {...this.workConfig, ...this.json}, 'loading')
        .then(res => {
          this.loading = false;
          if (res.result === 1) {
            this.my_referral = res.data.my_referral.json;
            this.level_tab = res.data.my_agent.json;
            let agentData = res.data.agent_data.json;
            if (this.json.page >= agentData.last_page || agentData.data.length < agentData.per_page) {
              this.finished = true;
            }
            if (res.data.agent_data && res.data.agent_data.json) {
              let list = res.data.agent_data.json.data;
              this.agent_data = this.json.page > 1 ? this.agent_data.concat(list) : list;
            }
            this.json.page = ++this.json.page;
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(err => {
          this.loading = true;
        });
    },
    search () {
      this.json.page = 1;
      this.finished = false;
      this.loading = false;
      this.getData();
    },
    loadMore () {
      this.getData();
    },
    changeLevel () {
      let index = 0;
      switch (this.customerLevel) {
      case "level1":
        index = 1;
        break;
      case "level2":
        index = 2;
        break;
      default:
        break;
      }
      this.json.page = 1;
      this.json.keyword = '';
      this.json.relationLevel = index;
      this.finished = false;
      this.loading = false;
      this.getData();
    },
    initData () {
      this.json = {
        relationLevel: 1,
        keyword: '',
        page: 1,
      };
      this.loading = false;
      this.finished = false;
      this.customerLevel = 'level1';
    }
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#my-customer {
  .team-goods {
    position: relative;
    display: flex;
    background-color: #fff;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.625rem;
    padding: 0.875rem;
    line-height: 20px;

    .li {
      flex: 1;
      word-break: break-all;
    }

    .amount {
      font-size: 14px;
      font-weight: bold;
    }

    .title {
      font-size: 12px;
      color: #7d7d7d;
    }
  }

  .top-box {
    padding: 0.875rem 0;
    background-color: #fff;

    .tab {
      margin: 0 auto;
      width: 20.625rem;
    }

    /deep/ .van-tabs__nav--card {
      border-radius: 0.313rem;
      border: 1px solid #d8d8d8;
      overflow: hidden;

      .van-tab {
        font-size: 12px;
        border-right: none;
      }

      .van-tab--active {
        background-color: #f59a1f;
      }
    }

    /deep/ .van-search__content {
      background-color: #eff0f1;
    }
  }

  .customer-goods {
    margin-top: 0.625rem;
    padding: 1.03rem 0.9rem 0 0.9rem;
    background-color: #fff;

    .customer-info {
      display: flex;
      align-items: center;

      .avatar {
        width: 2.188rem;
        height: 2.188rem;
        border-radius: 50%;
        overflow: hidden;
        background-color: antiquewhite;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        flex: 1;
        margin-left: 1rem;
        text-align: left;
        color: #7d7d7d;
        font-size: 12px;
        line-height: 1rem;

        .nickname {
          padding-bottom: 0.3rem;

          .name {
            display: inline-block;
            font-size: 14px;
            color: #1a1a1a;
            max-width: 8rem;
          }

          .id {
            color: #fff;
            margin-left: 1rem;
            padding: 0.1rem 0.5rem;
            background-color: #f34f47;
            border-radius: 0.531rem;
          }
        }
      }
    }

    .goods-info {
      position: relative;
      margin-top: 0.425rem;
      padding: 0.425rem 0 0.425rem 0;
      color: #1a1a1a;
      font-size: 12px;
      line-height: 24px;

      .goods-num,
      .customer-num {
        display: flex;
        justify-content: space-between;
      }
    }

    .goods-info::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #e9e5e5;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }

    .red-text {
      color: #f34f47;
    }
  }
}
</style>