<template>
  <div id="rentIndex">

    <div id="soso" class="uou" :class="{'mout':amout}">
      <div class="search">
        <div slot="prepend" @click='goback'>
          <i class="iconfont icon-back"></i>
        </div>
        <div class="searchBox">
          <form @submit.prevent action="#">
            <input type="search" placeholder="请输入要搜索的内容" @keypress="enterSearch" v-model="inputs">
          </form>
          <div class="img-icon" @click='isso'>
            <div class="img-icon-btn"></div>
          </div>
        </div>

      </div>
    </div>

    <!--  旧的租赁插件不用了-->
    <div class="proBox">
      <div class="list" v-for="(items,i) in goodsListData" :key='i'>
        <div class="imgs">
          <router-link :to="fun.getUrl('goodsDetail',{ id: items.goods_id })">
            <img :src="items.thumb"/>
          </router-link>
        </div>
        <div class="shop_info">
          <h4>
            <router-link :to="fun.getUrl('goodsDetail',{ id: items.goods_id })">{{items.title}}</router-link>
          </h4>
          <span>
						<router-link
              :to="fun.getUrl('goodsDetail',{ id: items.goods_id })">{{$i18n.t("money")}}{{items.price}}起/每天</router-link>
					</span>
        </div>
      </div>
    </div>
    <!-- </mt-loadmore> -->

    <div class="loadNomore" v-show='loadNomore'><img src="../../assets/images/no-more-product.png"/></div>
    <c-Footer></c-Footer>
  </div>
</template>

<script>
import cFooter from "./component/rentFoot";
import { scrollMixin } from "utils/mixin";

export default {
  components: { cFooter },
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      inputs: "",
      loadNomore: false,
      allLoaded: true,
      goodsListData: []
    };
  },

  activated() {

  },

  mounted() {
    this.indexData();
  },

  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) { //如果按的是enter键
        event.preventDefault();
        this.isso();
      }
    },
    isso() {
      this.indexData();
    },
    //输入关键字在当前页面进行搜索，与后台交接关键字定义的名字
    indexData() {

      $http.get("plugin.lease.frontend.modules.shop.controllers.index.get-default-index", { soso: this.inputs }).then((response) => {
        if (response.result == 1) {

          this.loadNomore = false;
          this.allLoaded = false;
          // 搜索结果为空
          if (response.data.goods.length <= 0) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
          // 如果当前页数大于总页数 就不加载了
          if (response.data.current_page > response.data.last_page) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
          this.goodsListData.push(...response.data.goods);

          if (response.data.goods.length < 20) {
            this.loadNomore = true;
            this.allLoaded = true;
          }


        } else {
          console.log(response.msg);
        }

      }, function(response) {
        // error callback
        console.log(response);
      });
    },
    // 加载更多
    loadBottom() {
      console.log("加载更多启动");
      //this.gotoSearch(n);
      this.$refs.loadmore.onBottomLoaded();

    },
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #rentIndex {
    .search {
      overflow: hidden;
      background: #fff;
      border-bottom: 0.0625rem solid #f5f5f5;
      display: flex;
      align-items: center;
      padding-left: 1rem;

      .el-button.el-button--default {
        float: left;
        width: 10%;
        border: none;
        padding-top: 1rem;
      }

      .el-input.el-input-group.el-input-group--append {
        float: left;
        width: 88%;
        margin-left: 2%;
        height: 2.8125rem;
      }

      .el-input-group__append .el-button.el-button--default {
        background: #f5f5f5;
        padding-top: 0.5625rem;
        line-height: 1rem;
        padding-right: 0.9375rem;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      .el-input.el-input-group.el-input-group--append .el-input-group__append {
        background: #f5f5f5;
      }

      .el-col-1 {
        margin: 0.75rem 0;
        color: #666;
        font-size: 16px;
      }
    }

    .loadNomore img {
      width: 20%;
    }

    .input {
      margin: 0.625rem 1.25rem;

      input {
        width: 100%;
        height: 2.1875rem;
        padding-left: 1.875rem;
        margin: 0.625rem 0;
        outline: 0;
        border: 0.0625rem solid #ccc;
        border-radius: 0.375rem;
        background: url(../../assets/images/search.png) no-repeat 0.625rem 0.5625rem #fff;
      }
    }

    .proBox {
      margin-bottom: 0.625rem;
      margin-top: 0.625rem;
      overflow: hidden;

      .list:nth-child(2n-1) {
        margin-right: 4%;
      }

      .list {
        width: 48%;
        overflow: hidden;
        float: left;
        background: #fff;
        box-sizing: border-box;
        margin-bottom: 0.625rem;

        .imgs {
          width: 100%;
          height: 9.375rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .shop_info {
          h4 {
            font-size: 14px;
            margin: 0.3125rem;
            height: 2.625rem;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
            overflow: hidden;
            line-height: 1.375rem;
            text-align: justify;
            font-weight: normal;

            a {
              color: #101010;
            }
          }

          span {
            float: right;
            padding: 0.3125rem;

            a {
              color: #e51c60;
            }
          }
        }
      }
    }
  }

  .search {
    overflow: hidden;
    background: #fff;
    border-bottom: 0.0625rem solid #f5f5f5;
    width: 100%;

    /* .el-button.el-button--default { */

    /* float: left; */

    /* width: 10%; */

    /* border: none; */

    /* padding-top: 1rem; */

    /* } */
    .mint-button.mint-button--default {
      float: left;
      width: 10%;
      border: none;
      padding-top: 0.4rem;
      box-shadow: none;
    }

    .el-input.el-input-group.el-input-group--append {
      float: left;
      width: 80%;
      margin-left: 2%;
      height: 2.8125rem;
    }

    .el-input-group__append .el-button.el-button--default {
      background: #f5f5f5;
      padding-top: 0.5625rem;
      line-height: 1rem;
      padding-right: 1.8125rem;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .el-input.el-input-group.el-input-group--append .el-input-group__append {
      background: #f5f5f5;
    }

    .el-col-1 {
      margin: 0.75rem 0;
      color: #666;
      font-size: 16px;
    }

    .searchBox {
      position: relative;
      font-size: 14px;
      display: inline-table;
      float: left;
      width: 80%;
      margin-left: 2%;
      height: 2.8125rem;

      input {
        vertical-align: middle;
        border: none;
        background: #f2f2f2 none;
        box-sizing: border-box;
        outline: 0;
        padding: 0.1875rem 0.625rem;
        height: 1.875rem;
        line-height: 1.875rem;
        margin-top: 0.5rem;
        color: #8c8c8c;
        font-size: 14px;
        width: 17.75rem;
        border-radius: 0.9375rem;
        z-index: 10;
      }

      .img-icon {
        border: none;
        color: #a9a9a9;
        display: table-cell;
        position: relative;
        border-radius: 0;
        height: 1.875rem;
        top: 0.0625rem;
        opacity: 2;
        left: -2.25rem;

        .img-icon-btn {
          position: absolute;
          z-index: 12;
          width: 1rem;
          height: 1rem;
          top: 50%;
          left: 50%;
          margin-left: -0.5rem;
          margin-top: -0.5rem;
          background: url("../../assets/images/search.png") no-repeat center center;
          background-size: 80% 80%;
        }
      }
    }
  }
</style>
