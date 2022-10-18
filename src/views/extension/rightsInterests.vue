<template>
  <div id="rightsInterests">
    <c-title :hide="false" :text="datas.plugin_name"></c-title>
    <div class="top">
      <div class="img">
        <img :src="datas.avatar" alt="" />
      </div>
      <div class="user">
        <div class="name">{{ datas.nickname }}</div>
        <div class="leave" v-if="datas.level_name">{{ datas.level_name }}</div>
      </div>
    </div>
    <div class="contenLis">
      <div class="leftLis">
        <div class="rightLis">
          <div style="font-size: 1rem; color: #f15353;">{{ datas.equity?datas.equity:'0' }}个</div>
          <div style="font-size: 0.88rem; color: #8c8c8c;">权益值</div>
        </div>
        <div class="rightLis">
          <div style="font-size: 1rem; color: #f15353;">{{ $i18n.t('money') }}{{ datas.equity_amount?datas.equity_amount:'0' }}</div>
          <div style="font-size: 0.88rem; color: #8c8c8c;">权益价值</div>
        </div>
      </div>
      <div class="leftLis">
        <div class="rightLis">
          <div style="font-size: 1rem; color: #f15353;">{{ datas.expect_amount?datas.expect_amount:'0' }}{{$i18n.t('元')}}</div>
          <div style="font-size: 0.88rem; color: #8c8c8c;">预计奖励金额</div>
        </div>
        <div class="rightLis">
          <div style="font-size: 1rem; color: #f15353;">{{ datas.total_amount?datas.total_amount:'0' }}{{$i18n.t('元')}}</div>
          <div style="font-size: 0.88rem; color: #8c8c8c;">已结算金额</div>
        </div>
      </div>
    </div>
    <div style="width: 23.41rem; height: 0.63rem; background-color: #ebebeb;"></div>
    <van-tabs v-model="active" title-active-color="#ee2e2b">
      <van-tab title="奖励记录页"></van-tab>
    </van-tabs>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功">
      <div class="lis">
        <div class="lisbox" v-for="(item, index) in dividend" :key="index">
          <div class="lisLeft">
            <div class="idlis">
              <div style="font-size: 0.81rem; color: #333; margin-bottom: 0.5rem;">奖励 ID:{{ item.id }}</div>
              <div style="font-size: 0.75rem; color: #8c8c8c;">时间：{{ item.created_at }}</div>
            </div>
          </div>
          <div class="lisRight" style="font-size: 1rem; color: #f15353; display: flex; align-items: center;">
            {{ item.dividend_amount }}{{$i18n.t('元')}}
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import cTitle from 'components/title';
import { scrollMixin } from '../../utils/mixin';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      active: 0,
      isLoading: false,
      // data
      datas: [],
      dividend:[],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    onRefresh() {
      this.isLoading = false;
    },
    getData() {
      var that = this;
      $http.get('plugin.equity-reward.api.home', {}, '加载中...').then(
        function (response) {
          if (response.result === 1) {
            that.datas = response.data;
            that.dividend = that.datas.dividend.data;
            that.isLoadMore = true;
            that.total_page = that.datas.dividend.last_page;
            that.fun.setWXTitle(that.datas.plugin_name);
            if (!that.total_page) {
              that.total_page = 0;
            }
          } else {
            console.log(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get('plugin.equity-reward.api.home', {page:that.page}, '加载中...')
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.dividend.data;
              that.dividend = that.dividend.concat(nextPageData); //进行数组拼接
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
  },
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.rightLis {
  width: 25%;
}

#rightsInterests {
  min-height: 100vh;
  background-color: #fff;
}

.lis {
  background-color: #fff;
  padding: 0 0.97rem 0 0.91rem;
  border-top: 1px solid #ebebeb;
  padding-bottom: 3rem;

  .lisbox {
    height: 3.91rem;
    width: 100%;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .lisLeft {
      // height: 2.06rem;
      flex: 1;
      height: 100%;

      .idlis {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
      }
    }
  }
}

.contenLis {
  height: 10.69rem;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: #fff;
  flex-direction: column;

  .leftLis {
    height: 50%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}

.top {
  width: 100%;
  height: 7rem;
  background-color: #ee2e2b;
  display: flex;
  align-items: center;
  padding: 1.69rem 1.53rem 2.09rem 1.53rem;
  justify-content: flex-start;

  .img {
    width: 2.88rem;
    height: 2.88rem;
    border-radius: 100%;
    background-color: #000;
    margin-right: 0.66rem;

    img {
      border-radius: 100%;
      width: 100%;
      height: 100%;
    }
  }

  .user {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 2.88rem;

    .name {
      font-size: 1rem;
      color: #fff;
    }

    .leave {
      padding: 0.08rem 0.5rem 0.08rem 0.5rem;
      background-color: rgba(255, 255, 255, 0.29);
      border-radius: 0.63rem;
      color: #fff;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>