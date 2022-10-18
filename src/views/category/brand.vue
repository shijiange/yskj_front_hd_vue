<template>
  <div id="brand">
    <c-title :hide="false" text="品牌"></c-title>
    <div id="category-content" ref="menucontent">
      <div id="carcontent">
        <ul>
          <div style="margin: 0 auto;" v-if="contentlist.length <= 0">
            <van-empty description="暂无数据" />
          </div>
          <template v-for="(brand,index) in contentlist" >
              <li class="brand-item" v-if="brand.is_recommend" :key="index">
                <div class="item">
                  <router-link :to="fun.getUrl('brandgoods', { id: brand.id, fromHome: 1 })">
                    <div class="thumb"><img :src="brand.logo" /></div>
                    <p>{{ brand.name }}</p>
                  </router-link>
                </div>
              </li>
          </template>
        </ul>
      </div>
    </div>
    <div style="height: 5rem; clear: both; display: block;"></div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
// import cCarcontent from "components/carcontent";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 99,
      allLoaded: false,
      topStatus: "",
      list: [],
      contentlist: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  methods: {
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
            "goods.brand.get-brand",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.data;
                that.contentlist = that.contentlist.concat(myData); //数组拼接
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
    getContentlist() {
      // is_recommend == 1查询推荐的品牌  不传查询全部
      $http.get("goods.brand.get-brand",{page:1,is_recommend:1}, "加载中").then(res => {
        if (res.result == 1) {
          this.isLoadMore = true;
          this.total_page = res.data.last_page;
          this.contentlist = res.data.data;
        }
      });
    },
  },
  mounted() {
    //区分是否首页跳转进来
    this.isset = localStorage.getItem("isset");
    localStorage.removeItem("isset");
    this.getContentlist();
  },
  activated() {},
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#brand {
  #rootlists {
    height: 100vh;
    overflow: hidden;
    width: 23%;
    float: left;
    border-right: 0.0625rem solid #d9d9d9;
  }

  #category-content {
    background: #fff;
    overflow: hidden;
    width: 100%;

    #carcontent {
      padding: 1.25rem 0;
      word-wrap: break-word;
    }
  }
}

#rootList {
  width: 100%;
  background: #fff;
  font-size: 12px;

  .active {
    color: red;
  }

  li {
    line-height: 2.875rem;
    border-bottom: solid 0.0625rem #e5e5e5;
  }
}

#carcontent {
  background: #fff;
  color: #686868;

  .sote {
    clear: both;
    overflow: hidden;
  }

  h3 {
    text-align: left;
    font-size: 14px;
    margin: 0;
    padding: 0.3125rem 0.4375rem;
    font-weight: normal;
    display: block;
    clear: both;
    color: #000;
  }

  a span {
    line-height: 1.125rem;
    color: #686868;
    // display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: -webkit-center;
  }

  .branch img {
    width: 100%;
  }

  .thumb {
    /* line-height: 16vw; */
    height: 5rem;
    overflow: hidden;
  }

  ul {
    display: flex;

    /* flex-flow: row wrap; */
    flex-wrap: wrap;
    margin-right: -1.875rem;

    /* clear: both; */
    width: 100%;
  }

  .brand-item {
    display: inline-block;
    width: 25%;
  }

  .item {
    height: 6rem;
    text-align: center;

    /* float: left; */
    margin-bottom: 0.625rem;
    font-size: 12px;
    box-sizing: border-box;

    img {
      width: 80%;
    }

    p {
      max-height: 2.5rem;
      line-height: 1.25rem;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      display: flex;
      justify-content: center;
      word-break: break-all;
    }
  }
}
</style>
