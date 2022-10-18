<template>
  <div id="tokerIndex">
    <c-title :hide="false" :text="plugin_name"></c-title>
    <van-tabs v-model="active" background="#f2f2f2" title-active-color="#ee2e2b">
      <van-tab title="离我最近"></van-tab>
      <!-- <van-tab title="好评优先"></van-tab> -->
    </van-tabs>
    <div class="list" v-for="(item,ind) in list" :key="ind">
      <div class="lis">
        <div class="top">
          <div class="img">
            <img :src="item.thumb" alt="" />
            <div class="shopname">{{item.store_name}}</div>
          </div>
          <div class="distance">{{item.distance}}{{item.distance_unit}}</div>
        </div>
        <div class="bottom" v-for="(datas,index) in item.has_many_goods" :key="index" @click="toDetail(datas.goods_id)">
          <div class="left">
            <img :src="datas.has_one_goods.thumb" alt="" />
          </div>
          <div class="right">
            <div class="title">{{datas.has_one_goods.title}}</div>
            <div class="rightBottom">
              <div class="price">￥{{datas.has_one_goods.price}}</div>
              <div class="sales">销量：<span>{{datas.has_one_goods.real_sales}}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from 'components/title';
import { scrollMixin } from '../../../utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      list: [],
      lng:'',
      lat:'',
      city_name:'',
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      plugin_name:''
    };
  },
  activated() {
    this.city_name = this.$route.params.city;
    this.lng = JSON.parse(this.$route.params.point).lng;
    this.lat = JSON.parse(this.$route.params.point).lat;
    this.getData();
  },
  methods: {
    toDetail(id){
      console.log(id);
      this.$router.push(this.fun.getUrl('goods', { id: id }));
    },
    getData(){
      var url;
      url = "plugin.customer-development.Frontend.controllers.store.index";
      var that = this;
      let p = this.fun.bd_encrypt(this.lng, this.lat);
      let json ={
        lng : p.lng,
        lat : p.lat,
        city_name : this.city_name,
        page:that.page
      };
      $http.post(url, json, "").then(response => {
        if (response.result === 1) {
          that.list = response.data.stores.data;
          that.plugin_name = response.data.plugin_name?`${response.data.plugin_name}列表`:'拓客卡列表';
          that.fun.setWXTitle(response.data.plugin_name?`${response.data.plugin_name}列表`:'拓客卡列表');
          that.isLoadMore = true;
          that.total_page = response.data.last_page;
          if (!that.total_page) {
            that.total_page = 0;
          }
        }
      });
    },
    getMoreData() {
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let json ={
        lng : p.lng,
        lat : p.lat,
        city_name : this.city_name,
        page:that.page
      };
      if (this.page >= this.total_page) {
        return;
      } else {
        $http.get("plugin.customer-development.Frontend.controllers.store.index", json,'').then(response => {
          if (response.result == 1) {
            that.isLoadMore = true;
            that.list.concat(response.data.data);
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        });
      }
    },
  },
  components: {
    cTitle
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#tokerIndex {
  .list {
    display: flex;
    justify-content: center;
    align-items: center;

    .lis {
      background-color: #fff;
      width: 21.56rem;
      border-radius: 0.47rem;
      margin: 0.63rem 0 0.63rem 0;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom:last-child {
        margin-bottom: 0;
      }

      .bottom {
        display: flex;
        margin-bottom: 0.8rem;

        .left {
          width: 5.63rem;
          height: 5.63rem;
          background-color: #d8d8d8;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .right {
          flex: 1;
          margin-left: 0.63rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .rightBottom {
            display: flex;
            justify-content: space-between;

            .price {
              font-size: 1.06rem;
              color: #ee2e2b;
            }

            .sales {
              font-size: 0.75rem;
              color: #666;
              line-height: 1.5rem;

              span {
                margin-left: 0.5rem;
              }
            }
          }

          .title {
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-size: 0.94rem;
            color: #202020;
          }
        }
      }

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.78rem;

        .distance {
          color: #ee2e2b;
          font-size: 0.88rem;
        }

        .img {
          img {
            width: 2.19rem;
            height: 2.19rem;
            background-color: #d8d8d8;
            border-radius: 100%;
          }

          display: flex;
          align-items: center;
          font-size: 0.88rem;

          .shopname {
            font-size: 0.88rem;
            margin-left: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
