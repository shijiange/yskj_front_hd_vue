<template>
  <div id="search" transition="fadeInLeft">
    <div
      id="soso"
      class="uou"
      :class="{ mout: amout }"
      :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '100%' }"
    >
      <div class="search">
        <div>
          <div class="back" @click="goback">
            <i class="fa fa-angle-left"></i>
          </div>
        </div>
        <div class="searchBox">
          <form @submit.prevent action="#">
            <input
              type="search"
              @keypress="enterSearch"
              placeholder="搜索当前分类商品"
              v-model="inputs"
              @click="show1 = true"
            />
          </form>
        </div>
        <div class="search_icon">
          <i class="iconfont icon-sousuo1"></i>
        </div>
        <div class="search_bth" @click="search">
          <span>搜索</span>
        </div>
        <!-- <div style="position:absolute;right: 1rem;top: 1rem;">
          <i class="fa fa-th-large" v-show="view" @click="$store.commit('views')"></i>
          <i class="fa fa-th-list" v-show="!view" @click="$store.commit('views')"></i>
        </div> -->
      </div>
      <div class="sort_box">
        <ul class="sort_a" @click="getrank_1(0)">
          <li>
            <span :class="{ hascolor: hascolor === 0 }">评价</span>
            <i class="iconfont icon-up" :class="{ hascolor: colorshow == '0_1' }"></i>
            <i class="iconfont icon-down" :class="{ hascolor: colorshow == '0_2' }"></i>
          </li>
        </ul>
        <ul class="sort_b" @click="getrank_1(1)">
          <li>
            <span :class="{ hascolor: hascolor === 1 }">销量</span>
            <i class="iconfont icon-up" :class="{ hascolor: colorshow == '1_1' }"></i>
            <i class="iconfont icon-down" :class="{ hascolor: colorshow == '1_2' }"></i>
          </li>
        </ul>
        <ul class="sort_c" @click="getrank_1(2)">
          <li>
            <span :class="{ hascolor: hascolor === 2 }">价格</span>
            <i class="iconfont icon-up" :class="{ hascolor: colorshow == '2_1' }"></i>
            <i class="iconfont icon-down" :class="{ hascolor: colorshow == '2_2' }"></i>
          </li>
        </ul>
        <div class="sort_icon">
          <i class="iconfont icon-sort_b" v-show="view" @click="$store.commit('views')"></i>
          <i class="iconfont icon-sort_a" v-show="!view" @click="$store.commit('views')"></i>
        </div>
      </div>
    </div>
    <div style="height: 1.5625rem; display: block;"></div>
    <div class="page-loadmore-wrapper" ref="wrapper" style="margin-top: 35px;">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <c-goodsList
          :goods="datas"
          :goods_template="goods_template"
          text="搜索结果"
          class="osll"
          :loading="loading"
          :fatherTitle="fatherTitle"
          :newDiyIcon="newDiyIcon"
        ></c-goodsList>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import cGoodsList from 'components/goodsList';
// import cSort from 'components/sort';
import { Toast } from 'vant';
import { scrollMixin } from '../../utils/mixin'; //引入加载更多

var n = 1;
export default {
  mixins: [scrollMixin],
  data() {
    return {
      title: '搜索',
      inputs: '',
      amout: false,
      loading: false,
      allLoaded: true,
      topStatus: '',
      bottomStatus: '',
      // wrapperHeight: 0,
      order_by: '',
      order_field: '',
      datas: [],
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      age: {}, //年龄
      brand: {}, //品牌
      type1: {}, //一级分类
      smalltype: [], //二级分类
      threetype: [], //三级分类
      searchvalue: '', //关键字搜索
      filterstring: '', //销量价格评价
      sortstring: '', //商品类型
      sortingstring: '', //商品类型排序
      typekey: null, //样式开关
      activekey: null,
      threekey: null,
      sort: ['评价', '销量', '价格'],
      sorting: ['从高到低', '从低到高'],
      rank: ['销量从高到低', '价格降序', '价格升序', '评论数从高到低'],
      moretype1: true, //更多内容显隐开关
      moretype2: false,
      moretype3: false,
      hascolor: '', //跟据数字选颜色
      colorshow: '', //根据数据显示上下箭头颜色
      goods_template: '',

      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      postUrl: 'plugin.overseas.frontend.goods.search-goods', //默认请求接口
      isLoading:false,
      fatherTitle:'',
      newDiyIcon:''
    };
  },
  computed: {
    ...mapState(['message', 'blurst', 'view']),

    zoneId() {
      if (this.$store.state.zoneId == '') {
        this.$store.commit('setZoneId', window.localStorage.getItem('zoneId'));
      }

      return this.$store.state.zoneId;
    }
  },

  mounted() {
    this.slider();
    window.CateListScrollTop = 0;
  },
  methods: {
    ...mapMutations(['views']),
    // 初始化数据
    initPageData() {
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    },
    //销量，评价，价格排序
    getrank_1(index) {
      switch (index) {
      case 0:
        if (this.colorshow == '0_2') {
          this.colorshow = '0_1';
          this.sortingstring = '&order_by=asc';
        } else {
          this.colorshow = '0_2';
          this.sortingstring = '&order_by=desc';
        }
        this.sortstring = '&order_field=comment_num';
        this.hascolor = 0;
        //诸葛统计
          zhuge.track('分类列表页点击排序标签',{
            '标签名称':'评价',
            '分类名称':this.newDiyIcon
          });
        break;
      case 1:
        if (this.colorshow == '1_2') {
          this.colorshow = '1_1';
          this.sortingstring = '&order_by=asc';
        } else {
          this.colorshow = '1_2';
          this.sortingstring = '&order_by=desc';
        }
        this.sortstring = '&order_field=show_sales';
        this.hascolor = 1;
        //诸葛统计
          zhuge.track('分类列表页点击排序标签',{
            '标签名称':'销量',
            '分类名称':this.newDiyIcon
          });
         

        break;
      case 2:
        if (this.colorshow == '2_2') {
          this.colorshow = '2_1';
          this.sortingstring = '&order_by=asc';
        } else {
          this.colorshow = '2_2';
          this.sortingstring = '&order_by=desc';
        }
        this.sortstring = '&order_field=price';
        this.hascolor = 2;
        //诸葛统计
          zhuge.track('分类列表页点击排序标签',{
            '标签名称':'价格',
            '分类名称':this.newDiyIcon
          });

        break;
      }
      this.searchfilter();
    },
    searchfilter() {
      //完成筛选
      Toast.loading({
        message: '排序中',
        forbidClick: true,
      });
      this.datas = [];
      this.initPageData();
      document.documentElement.scrollTop = 0;
      let srtArr = JSON.parse(this.$route.params.id);
      let json = {
        'search[category]': srtArr,
        'search[keyword]': this.inputs
      };
      if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
        //抢团分类聚合页
        json.art = 'catGoods';
      }
      $http.get(this.postUrl + this.filterstring + this.sortstring + this.sortingstring, json,'.').then(res => {
        this.isLoadMore = true;

        if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
          this.total_page = res.data.catGoods.goods.last_page;
          this.datas = res.data.catGoods.goods.data;
        } else {
          this.total_page = res.data.last_page;
          this.datas = res.data.data;
        }

        if (!this.total_page) {
          this.total_page = 0;
        }

        Toast.clear();
        this.hide();
      });
    }, //重置筛选
    searchreset() {
      this.filterstring = ''; //分类过滤
      this.sortstring = ''; //商品搜索销量价格评价
      this.sortingstring = ''; //排序规则
      this.typekey = null;
      this.activekey = null;
      this.sortkey = null;
      this.sortingkey = null;
      this.threekey = null;
    },
    searchwords() {
      //关键字搜索
      let data = { 'search[keyword]': this.searchvalue };
      this.screen(data);
    },
    showmore1() {
      let check1 = document.querySelector('#check1');
      let boxheight = check1.offsetHeight;
      if (boxheight >= 88) {
        this.moretype1 = !this.moretype1;
      }
    },
    showmore2() {
      let check2 = document.querySelector('#check2');
      let boxheight = check2.offsetHeight;
      if (boxheight >= 88) {
        this.moretype2 = !this.moretype2;
      }
    },
    showmore3() {
      let check3 = document.querySelector('#check3');
      let boxheight = check3.offsetHeight;
      if (boxheight >= 88) {
        this.moretype3 = !this.moretype3;
      }
    },
    searchtype(id, key) {
      //二级分类
      this.filterstring = '&search[category]=' + id;
      this.activekey = key;
      this.threetype = this.smalltype[key].has_many_children;
    },
    searchthree(id, key) {
      this.filterstring = '&search[category]=' + id;
      this.threekey = key;
    },
    changetype(id, key) {
      //改变分类
      this.filterstring = '';
      this.smalltype = '';
      this.threetype = '';
      this.typekey = key; //点亮图标
      let data = { parent_id: id };
      $http.get('goods.category.get-children-category', data).then(res => {
        this.smalltype = res.data.data;
      });
    },
    gettype() {
      $http.get('goods.category.get-category').then(res => {
        this.type1 = res.data;
      });
    },
    screenbrand(id) {
      //品牌筛选
      let data = { 'search[brand_id]': id };
      this.screen(data);
    },
    getbrand() {
      $http.post('goods.brand.get-brand').then(res => {
        this.brand = res.data;
      });
    },
    screenage(id) {
      //年龄筛选
      let data = { 'search[filtering]': id };
      this.screen(data);
    },
    screen(data) {
      $http.get(this.postUrl, data,'.').then(res => {
        this.datas = res.data.data;
        this.hide();
      });
    },
    all() {
      let arr = this.age.value.map(res => {
        return res.id;
      });
      let str = arr.join(',');
      let data = { 'search[filtering]': str };
      $http.get(this.postUrl, data,'.').then(res => {
        this.datas = res.data.data;
        this.hide();
      });
    },
    getage() {
      $http.get('goods.filtering.index').then(res => {
        if (res.data.length > 0) {
          this.age = res.data[0];
        }
        // console.log(res)
        // this.age=res.data[0]
      });
    },
    hide() {
      this.show1 = false;
    },
    sortOut(e) {
      if (this.datas.length == 0) {
        return;
      }
      console.log('得到的信息', e);
      n = 1;
      this.datas = [];
      this.order_field = e.order_field;
      this.order_by = e.order_by;
      this.gotoSearch(n);
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    //更新
    loadTop() {
      n = 1;
      this.datas = [];
      this.initPageData();
      this.gotoSearch(n);
      // this.$refs.loadmore.onTopLoaded()
    },
    // 加载更多
    // loadBottom() {
    //   console.log("加载更多启动");
    //   n++;
    //   this.gotoSearch(n);
    //   this.$refs.loadmore.onBottomLoaded();
    // },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      let that = this;
      this.loading = false;
      if (that.page >= that.total_page) {
        this.loading = true;
        return;
      } else {
        let srtArr = JSON.parse(that.$route.params.id);
        that.page += 1;
        let json = {
          'search[keyword]': that.inputs,
          page: that.page,
          'search[category]': srtArr,
          'search[couponid]': that.$route.params.coupon,
          'search[as_id]': that.zoneId
        };
        if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
          //抢团分类聚合页
          json.art = 'catGoods';
        }
        let nextPageData ;
        $http
          .get(this.postUrl + that.filterstring + that.sortstring + that.sortingstring, json, '加载中...')
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
                nextPageData = res.data.catGoods.goods.data;
              } else {
                nextPageData = res.data.data;
              }

              that.datas = that.datas.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              that.loading = true;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if (top < 80) {
          that.amout = false;
        } else {
          that.amout = true;
        }
      };
    },
    goback() {
      localStorage.setItem('isset', 1);
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl('home', {}));
      } else {
        this.$router.go(-1);
      }
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    search() {
      n = 1;
      this.datas = [];
      this.gotoSearch(n, false);
    },
    gotoSearch(page = 1, j = true) {
      let srtArr = JSON.parse(this.$route.params.id);

      let json = {
        'search[keyword]': this.inputs,
        page: page,
        'search[category]': srtArr,
        // order_field: this.order_field,
        // order_by: this.order_by,
        'search[couponid]': this.$route.params.coupon,
        'search[as_id]': this.zoneId
      };

      if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
        //抢团分类聚合页
        json.art = 'catGoods';
      }
      $http.get(this.postUrl + this.filterstring + this.sortstring + this.sortingstring, json,'.').then(response => {
        if (response.result === 1) {
          this.loading = false;
          this.allLoaded = false;

          this.isLoadMore = true;

          if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
            this.total_page = response.data.catGoods.goods.last_page;
          } else {
            this.total_page = response.data.last_page;
          }

          if (!this.total_page) {
            this.total_page = 0;
          }
          if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
            this.datas.push(...response.data.catGoods.goods.data);
          } else {
            this.datas.push(...response.data.data);
          }
          // 搜索结果为空
          if (this.datas.length <= 0) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
          // 如果当前页数大于总页数 就不加载了
          // if (response.data.current_page > response.data.last_page) {
          //   this.loading = true;
          //   this.allLoaded = true;
          //   return;
          // }

          this.goods_template = response.data.goods_template;

          // if (response.data.data.length < 20) {
          //   this.loading = true;
          //   this.allLoaded = true;
          //   return;
          // }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          console.log(response);
        }
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    window.CateListScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  activated() { 
    if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
      //抢团分类聚合页
      this.postUrl = 'plugin.snatch-regiment.api.index.getSnatchData';
    }
    this.amout = false;
    this.slider();
    if (this.$route.params.fromHome !== 1 && window.location.href.indexOf('#/catelist/') > -1) {
      setTimeout(() => {
        window.scrollTo(0, window.CateListScrollTop);
      }, 200);
    }

    // this.wrapperHeight =
    //   document.documentElement.clientHeight -
    //   this.$refs.wrapper.getBoundingClientRect().top; //keep分类不相同时，重载数据
    this.order_field = '';
    this.order_by = '';
    this.hascolor = '';
    this.colorshow = '';
    //this.loadMore();
    this.isset = localStorage.getItem('isset');
    
    this.fatherTitle = document.title;
    if(window.sessionStorage.getItem('newDiyIcon')){
      console.log(window.sessionStorage.getItem('newDiyIcon'));
      this.newDiyIcon = window.sessionStorage.getItem('newDiyIcon');
      
      zhuge.track('进入分类列表页',{
        '分类名称':this.newDiyIcon
      });
      window.sessionStorage.setItem('newDiyIcon','');//执行完诸葛统计，就赋值为空

    }
    if (this.isset && this.$route.params.fromHome !== 1) {
      // localStorage.removeItem("isset");
      // this.wrapperHeight = window.scrollTo(0, 0);
    } else if (this.$route.params.fromHome !== 1) {
      // 不是从上一级点进的不清空
    } else {
      n = 1;
      this.page = 1; //分页数，当前页数
      this.isLoadMore = true; //判断是否要加载更多的标志
      this.total_page = 0; //总页数
      this.datas = [];
      this.inputs = '';
      this.gotoSearch(n);
    }
  },
  created() {
    // this.getage()//得到年龄
    // this.getbrand()//得到品牌
    // this.gettype()//得到分类
    if (this.$route.params.type && this.$route.params.type == 'snatchRegiment') {
      //抢团分类聚合页
      this.postUrl = 'plugin.snatch-regiment.api.index.getSnatchData';
    }
    if (this.$route.params.fromHome !== 1) {
      n = 1;
      //more
      this.page = 1; //分页数，当前页数
      this.isLoadMore = true; //判断是否要加载更多的标志
      this.total_page = 0; //总页数
      this.datas = [];
      this.inputs = '';
      this.gotoSearch(1);
    }
  },
  components: {
    cGoodsList,
    // cSort
  },

  watch: {
    $route(to, from) {
      if (to.name == 'catelist' && from.name == 'catelist') {
        this.amout = false;
        this.slider();
        // this.wrapperHeight =
        //   document.documentElement.clientHeight -
        //   this.$refs.wrapper.getBoundingClientRect().top; //keep分类不相同时，重载数据
        this.datas = [];
        this.order_field = '';
        this.order_by = '';
        n = 1;
        //this.loadMore();
        this.gotoSearch(n);
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// 弹窗样式
#search {
  .showmoretype {
    height: 5.5rem !important;
  }

  .icon {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border: solid 0.0625rem #000;
    border-left: transparent;
    border-bottom: transparent;
    transform: rotate(135deg);
    margin-left: 0.1875rem;
    position: relative;
    top: -0.125rem;
  }

  .color {
    border: solid 0.0625rem #ff5e53;
    background: #fff !important;
    color: #ff5e53;
  }

  .btn {
    width: 23%;
    height: 26px;
    border: solid 0.0625rem #fff;
    border-radius: 0.25rem;
    margin: 0 0.3125rem;
  }

  .top-tab {
    padding: 0 0.875rem;
    display: flex;
    justify-content: space-between;
    height: 2.8125rem;
    line-height: 2.8125rem;

    .search-text {
      font-size: 14px;
    }

    .search-box {
      margin: 0 1rem;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      height: 1.875rem;
      background-color: #f2f2f2;
      border-radius: 0.9375rem;
      flex: 2;

      input {
        flex: 3;
        border: none;
        color: #8c8c8c;
      }

      i {
        line-height: 1.875rem;
      }
    }
  }

  .age {
    .select {
      color: rgb(255, 94, 83);
    }

    text-align: left;

    li {
      height: 2.75rem;
      line-height: 2.75rem;
      border-bottom: solid 0.0625rem #e2e2e2;
      padding: 0 0.875rem;
      font-size: 14px;
    }
  }

  .middle {
    padding: 0.625rem 0;
    border-bottom: solid 0.0625rem #e2e2e2;

    ul {
      display: flex;
      justify-content: space-between;
      padding: 0 0.875rem;
      line-height: 2.25rem;
      height: 2.25rem;

      span {
        color: #8c8c8c;
      }

      i {
        font-size: 18px;
        color: #c9c9c9;
        margin-left: 0.375rem;
      }
    }

    .button {
      padding: 0 0.875rem;

      .first,
      .second {
        display: flex;
        margin-top: 0.625rem;
        margin-bottom: 0.625rem;

        button:first-child {
          margin-right: 0.3125rem;
        }

        button:last-child {
          margin-left: 0.3125rem;
        }

        button:nth-child(2),
        button:nth-child(3) {
          margin: 0 0.3125rem;
        }

        button {
          width: 23%;
          height: 1.625rem;
          border: solid 0.0625rem #e2e2e2;
          border-radius: 0.25rem;
        }
      }
    }
  }

  .bottom {
    padding: 0 0.875rem;
    margin-top: 0.625rem;
    margin-bottom: 0.625rem;

    .button {
      display: flex;
      justify-content: flex-end;

      button {
        width: 23%;
        height: 1.625rem;
        border: solid 0.0625rem #e2e2e2;
        border-radius: 0.25rem;
      }

      button:first-child {
        margin-right: 0.3125rem;
      }

      button:last-child {
        margin-left: 0.3125rem;
      }

      #complete {
        background-color: #ff5e53;
        color: #fff;
        border: none;
      }
    }
  }

  .brand {
    .hot {
      h1 {
        height: 1.875rem;
        line-height: 1.875rem;
        text-align: left;
        padding: 0 0.875rem;
        font-size: 14px;
        background-color: #f5f5f5;
        color: #8c8c8c;
        margin-bottom: 0.625rem;
      }

      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          width: 25%;
          margin: 0.625rem 0;

          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}

// 弹窗样式结束
#search {
  .osll {
    min-height: 100vh;
    margin-top: 1.75rem;
    box-sizing: border-box;
  }
  // 	@descendent wrapper {
  //     overflow: scroll;
  // }
  .page-loadmore-wrapper2 {
    height: 100vh;
    overflow: hidden;
  }

  .uou {
    position: fixed;
    z-index: 99;
    top: 0;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    width: 100%;
    background: #fff;
  }

  .mout {
    top: -2.8125rem;
  }
}

.search {
  .back {
    width: 2.8125rem;

    i {
      line-height: 2.8125rem;
      font-size: 1.5rem;
    }
  }

  overflow: hidden;
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .mint-button.mint-button--default {
    /* float: left; */

    /* width: 10%; */
    border: none;
    padding-top: 0.4rem;
    box-shadow: none;
  }

  .searchBox {
    position: relative;
    font-size: 14px;
    display: inline-table;
    float: left;
    width: 70%;
    // margin-left: -1.5rem;
    height: 1.875rem;
    background: #f2f2f2;
    border-radius: 1rem;

    input {
      vertical-align: middle;
      border: none;
      box-sizing: border-box;
      outline: 0;
      padding: 0 1rem;
      height: 1.875rem;
      line-height: 1.875rem;
      color: #8c8c8c;
      font-size: 14px;
      width: 14rem;
      border-radius: 0.9375rem;
      z-index: 10;

      /* margin-left: 2rem; */
    }
  }

  .search_bth {
    width: 3.75rem;
    height: 2.8125rem;
    line-height: 2.8125rem;

    span {
      font-size: 16px;
      color: #333;
    }
  }

  .search_icon {
    position: absolute;
    left: 3.75rem;
    height: 2.8125rem;

    i {
      line-height: 2.8125rem;
      color: #999;
      font-size: 1rem;
    }
  }
}

.sort_box {
  height: 2.5rem;
  line-height: 2.5rem;
  display: flex;
  background: #fff;
  border-top: solid 0.0625rem #ebebeb;
  border-bottom: solid 0.0625rem #ebebeb;

  .sort_a,
  .sort_b,
  .sort_c {
    width: 6.9787rem;
    display: flex;
    justify-content: center;
    position: relative;
    font-size: 15px;

    li {
      display: flex;

      i {
        font-size: 12px;
        margin-left: 0.375rem;
        color: #999;
      }

      .icon-up {
        margin-top: -0.1875rem;
      }

      .icon-down {
        position: absolute;
        right: 2rem;
        top: 0.25rem;
      }
    }
  }

  .sort_icon {
    width: 2.5rem;
    height: 2.5rem;

    i {
      font-size: 1.5rem;
      color: #666;
    }
  }

  .hascolor {
    color: #f15353 !important;
  }
}
</style>
