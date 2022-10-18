<template>
  <div>
    <c-title :hide="false" :text="'门店消费卡收入明细'"> </c-title>
    <div class="user-info">
      <div class="head-portrait">
        <img :src="userInfo.avatar" alt="" />
      </div>
      <div class="name">{{userInfo.nickname}}</div>
    </div>

    <div class="cumulative">
      <span class="left-text">累计金额</span>
      <span class="price">&#165; {{userInfo.amount}}</span>
    </div>

    <div class="list">
      <div class="income">
        <span>收入明细</span>
      </div>

      <div class="info-item" v-for="item in detailLst" :key="item.id">
        <div class="left-info">
          <p class="color-text">会员ID: {{item.uid}}</p>
          <p class="top-distance right-mar">{{item.card_name}}</p>
        </div>
        <div class="right-info">
          <p class="right-price">&#165; {{item.amount}}</p>
          <p class="color-text top-distance">{{item.created_at}}</p>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px; color: #666;" v-if="incomeStata">还没有收入明细哦</div>
     <div v-if="!incomeStata">
      <div
        style="width: 100%; height: 40px; line-height: 40px; text-align: center;"
        v-if="!incomeStata && !noneMore && !isLoadMore && activatedStatus"
        @click="getMoreData"
      >
        {{ $i18n.t('加载更多') }}
      </div>
      <div style="width: 100%; height: 80px; line-height: 40px; text-align: center;" v-if="!incomeStata && noneMore && !isLoadMore">
        {{ $i18n.t('没有更多了') }}
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { scrollMixin } from 'utils/mixin';


export default {
  mixins: [scrollMixin],
  data() {
    return {
      page:1,
      userInfo:{},
      detailLst:[],
      incomeStata:false,
      isLoadMore: true, //判断是否要加载更多的标识
      total_page: 0, //总共有多少页
      activatedStatus:false
    };
  },
  activated() {
    this.activatedStatus = false;
    this.isLoadMore= true;
    this.noneMore = false;
    this.incomeStata=false,
    this.getComsume(this.page);
  },
  methods: {
    getComsume(page) {
      $http.get("plugin.store-card.Frontend.Modules.Income.Controllers.records.index",{page:page}).then(response => {
        if (response.result === 1) {
          console.log(response);
          this.userInfo = response.data.base_data;
          this.detailLst = response.data.page_list.data;
          if(this.detailLst.length == 0) {
            this.incomeStata = true;
          }
        } else {
          Toast(response.msg);
        }
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
            "plugin.store-card.Frontend.Modules.Income.Controllers.records.index",{page:this.page},
            '加载中'
          )
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.page_list.data;
                that.detailLst = that.detailLst.concat(myData); //数组拼接
                this.noneMore = true;
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.user-info {
  width: 100%;
  height: 6.6563rem;
  background-color: #ee2e2b;
  overflow: hidden;
}

.head-portrait {
  float: left;
  margin: 1.6rem 0 0 1rem;
  width: 2.875rem;
  height: 2.875rem;
  overflow: hidden;
  border-radius: 50%;
  background: pink;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.name {
  margin: 1.6rem 0 0 0.5rem;
  float: left;
  font-size: 16px;
  color: #fff;
}

.cumulative {
  padding-left: 0.9375rem;
  height: 2.8125rem;
  line-height: 2.8125rem;
  background: #fff;
  text-align: left;
}

.left-text {
  padding-right: 10px;
  color: #333;
}

.price {
  color: #f14e4e;
}

.list {
  margin-top: 10px;
  background: #fff;
}

.income {
  width: 100%;
  height: 2.75rem;
  line-height: 2.75rem;
  border-bottom: 1px solid #ebebeb;

  span {
    display: inline-block;
    line-height: 2.45rem;
    color: #ee2e2b;
    border-bottom: 3px solid #ee2e2b;
  }
}

.info-item {
  padding: 0.8rem 0;
  margin: 0 1rem;
  border-bottom: 1px solid #ebebeb;
}

.info-item {
  display: flex;
  justify-content: space-between;
}

.right-price {
  text-align: right;
  font-size: 16px;
  color: #f15353;
}

.color-text {
  color: #8c8c8c;
  text-align: left;
  white-space: nowrap;
}

.top-distance {
  margin-top: 5px;
  text-align: left;
}

.right-mar {
  margin-right: 0.8rem;
}
</style>
