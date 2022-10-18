<template>
  <div id="search" transition="fadeInLeft">
    <div id="soso" class="uou set-pc-styleLeft" :class="{ mout: amout }">
      <div class="search">
        <div class="back" @click="goback"><i class="fa fa-angle-left"></i></div>
        <div class="search-box">
          <form @submit.prevent action="#">
            <input
              type="search"
              placeholder="请输入内容"
              @keypress="enterSearch"
              v-model="inputs"
              @click="hidebox"
            />
          </form>
          <i class="iconfont icon-sousuo1" custom size="1.125rem" style="color: #ccc;" @click.native="search"></i>
        </div>

        <div style="position: absolute; right: 1rem;">
          <i class="fa fa-th-large" v-show="view" @click="$store.commit('views')"></i>
          <i class="fa fa-th-list" v-show="!view" @click="$store.commit('views')"></i>
        </div>
      </div>
      <c-sort :goods="goods" :supplier="true" v-on:sortIn="sortOut"></c-sort>
    </div>
    <div style="height: 5.375rem; display: block;"></div>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop">
      <c-goodsList :goods="goods" text="搜索结果" class="osll" :loading="loading"></c-goodsList>
    </van-pull-refresh>

    <div class="screening" v-if="show">
      <header>
        <span :key="key" v-for="(val, key) in screentitle" @click="changetype(key)" :class="{ color: select == key }">{{
          val
        }}</span>
      </header>
      <div v-if="show1" id="div1">
        <div v-for="(val, key) in brand" @click="screenbrand(val.id)" :key="key">
          <img :src="val.logo" />
          <span>{{ val.name }}</span>
        </div>
      </div>
      <div v-if="show2" id="div2">
        <div v-for="(val, key) in classification1" id="divbox" :key="key">
          <p @click="classificationtype(val.id, key)">
            {{ val.name }}<span :class="{ color1: classificationkey != key }"></span>
          </p>
          <div :key="key1" v-for="(val1, key1) in val.son" id="divbox1" v-show="classificationkey == key">
            <p @click="classificationtype1(val1.id, key1)">
              {{ val1.name }}<span :class="{ color1: classificationkey1 != key1 }"></span>
            </p>
            <div
              :key="key2"
              v-for="(val2, key2) in val1.has_many_children"
              @click="classificationtype2(val2.id, key2)"
              v-show="classificationkey1 == key1"
              id="divbox2"
            >
              {{ val2.name }}
              <span :class="{ color1: classificationkey2 != key2 }"></span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="show3" id="div3">
        <p :key="key" v-for="(val, key) in attr" @click="selectattr(key, $event)">
          {{ val.name }}<span :class="{ color1: val.show }"></span>
        </p>
      </div>
      <div v-if="show4" id="div4">
        <dl :key="key" v-for="(val, key) in tagname">
          <dt>
            {{ val.name
            }}<span @click="showtagname(key)" v-if="val.value.length > 4"
              >{{ showtagnamekey != key ? '更多' : '收起'
              }}<span class="icon" :class="{ icon1: showtagnamekey == key }"></span
            ></span>
          </dt>
          <dd :class="{ color2: showtagnamekey != key }" class="div4-dd">
            <span
              :key="key1"
              v-for="(val1, key1) in val.value"
              @click="selectname($event, val1.id, key, key1)"
              :class="{ color: val1.record == 2 }"
              :data="val1.id"
              >{{ val1.name }}</span
            >
          </dd>
        </dl>
        <div @click="resetnames">重置</div>

        <div @click="screen">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import cGoodsList from 'components/goodsList';
import cSort from 'components/sort';
import { scrollMixin } from "../../../utils/mixin";

// const HOT_GOODS_URL = "plugin.supplier.frontend.shop.index.getIsHot";
// const CATEGORY_GOODS_URL = "plugin.supplier.frontend.shop.index.get-category-goods";
var n = 1;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      goodsListHot:[], // 热销商品列表
      status: 0, // 不同按钮点进来的状态：0:搜索btn 1:查看更多(热销) 2:分类点击 
      title: '搜索',
      //inputs: this.$route.params.kyes,
      inputs: '',
      amout: false,
      loading: false,
      allLoaded: true,
      goload: false,
      goods: [],
      order_by: '',
      order_field: '',
      screentitle: ['品牌', '分类', '属性', '高级选项'], //筛选标题
      show: false,
      show1: true,
      show2: false,
      show3: false,
      show4: false,
      select: '',
      brand: {},
      //attr: ['推荐商品', '新品上市', '热卖商品', '促销商品', '限时抢购'],
      attr: [
        {
          name: '推荐商品',
          show: true
        },

        {
          name: '新品上市',
          show: true
        },

        {
          name: '热卖商品',
          show: true
        },

        {
          name: '促销商品',
          show: true
        },

        {
          name: '限时抢购',
          show: true
        }
      ],
      attrstr: [],
      attrkey: [],
      classification1: [],
      classification2: [],
      classificationkey: null,
      classificationkey1: null,
      classificationkey2: null,
      typestring: '', //搜索分类id
      namestring: '',
      namekey: null,
      classificationshow: false,
      tagname: [],
      showtagnamekey: null,
      more_show: false,
      shownum: 9000,
      show5: true,

      brandId: '',

      filterId: [],

      nameNotice: false,

      tag: null,
      isLoadMore:true,
      page:1,
      isLoading:false,
      total_page:0
    };
  },
  computed: {
    ...mapState(['view']),
    zoneId() {
      if (this.$store.state.zoneId == '') {
        this.$store.commit('setZoneId', window.localStorage.getItem('zoneId'));
      }
      return this.$store.state.zoneId;
    }
  },
  mounted() {
    console.log(this.$route.params);
    this.slider();
  },
  methods: {
    // getCategoryGoodsList(){
    //   this.status = this.$route.params.status;
    //   if(this.status == 2){
    //     $http.post(CATEGORY_GOODS_URL,{sid:this.$route.params.sid},'加载中...').then(res=>{
    //       console.log(208,res);
    //       // this.categoryGoodsList = res.data.data;
    //       // console.log(this.categoryGoodsList);
    //     });
    //   }
    // },
    // getGoodsListHot () {
    //   this.status = this.$route.params.status;
    //   if(this.status == 1){
    //     $http.post(HOT_GOODS_URL,{sid:this.$route.params.sid},'加载中...').then(res=>{
    //       if(res.result == 1) {
    //         this.goodsListHot = res.data.data;
    //       }
    //     });
    //   }
      
    // },
    ...mapMutations(['views']),
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    //通用功能
    showbox() {
      this.show = !this.show;
    },
    hidebox() {
      this.show = false;
    },
    screen() {
      // $http.get('plugin.overseas.frontend.goods.search-goods', data).then((res) => {
      // 	this.goods = res.data.data
      // 	console.log(this.goods)
      // 	this.hidebox()
      // 	this.goload = true
      // }).catch(error =>{
      // 	console.log(error);
      // })
      this.goods = [];

      this.goload = true;
      this.hidebox();
      this.gotoSearch();
    },
    changetype(key) {
      this.select = key;
      this.resetselect();
      switch (key) {
      case 0:
        this.show1 = true;
        break;
      case 1:
        this.show2 = true;
        break;
      case 2:
        this.show3 = true;
        break;
      case 3:
        this.show4 = true;
        break;
      default:
        break;
      }
    },
    resetselect() {
      this.show1 = false;
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
    },
    //品牌相关的功能
    getbrand() {
      $http.post('goods.brand.get-brand').then(res => {
        this.brand = res.data.data;
      });
    },
    screenbrand(id) {
      this.goods = [];
      this.brandId = id;
      this.goload = true;
      this.hidebox();
      this.gotoSearch();
    },
    //分类相关的功能
    getclassification() {
      $http
        .get('goods.category.search-goods-category')
        .then(res => {
          this.classification1 = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    classificationtype(id, key) {
      this.classification2 = [];
      this.typestring = id;

      if (this.classificationkey == key) {
        this.classificationkey = null;
        return;
      } else {
        this.classificationkey = key;
      }
      this.classificationkey1 = null;
      this.classificationkey2 = null;
      this.classificationshow = false;
      // let data = {
      // 	'parent_id': id
      // }
      // $http.get('goods.category.get-children-category', data).then((res) => {
      // 	this.classification2 = res.data.data
      // })
    },
    classificationtype1(id, key) {
      this.typestring = id;

      this.classificationshow = true;
      //this.classificationkey1 = key;

      if (this.classificationkey1 == key) {
        this.classificationkey1 = null;
        return;
      } else {
        this.classificationkey1 = key;
      }
    },
    classificationtype2(id, key) {
      this.typestring = id;
      //this.classificationkey2 = key;

      if (this.classificationkey2 == key) {
        this.classificationkey2 = null;
        return;
      } else {
        this.classificationkey2 = key;
      }
    },
    resettypes() {
      this.classification2 = [];
      this.typestring = '';
      this.classificationkey = null;
      this.classificationkey1 = null;
      this.classificationkey2 = null;
    },
    searchsure() {
      let data = {
        '&search[category]': this.typestring
      };
      this.screen(data);
    },
    //属性相关的功能
    findstr(attrstr, key) {
      let index = this.attrstr.indexOf(attrstr);
      index + 1 ? this.attrstr.splice(index, 1) : this.attrstr.push(attrstr);
      let index1 = this.attrkey.indexOf(key);
      index1 + 1 ? this.attrkey.splice(index1, 1) : this.attrkey.push(key);
    },
    resetattrs() {
      this.attrstr = [];
      this.attrkey = [];
    },
    suresearch() {
      let data = {
        'search[product_attr]': this.attrstr.join(',')
      };
      this.screen(data);
    },
    selectattr(key, e) {
      //属性选择项
      switch (key) {
      case 0:
        this.findstr('is_recommand', key);
        break;
      case 1:
        this.findstr('is_new', key);
        break;
      case 2:
        this.findstr('is_hot', key);
        break;
      case 3:
        this.findstr('is_comment', key);
        break;
      case 4:
        this.findstr('limit_buy', key);
        break;
      }

      console.log(this.attrstr.toString());

      if (this.attr[key].show == true) {
        this.attr[key].show = false;
      } else {
        this.attr[key].show = true;
      }

      console.log(e.target.getElementsByTagName('span'));

      if (e.target.getElementsByTagName('span')[0].className.indexOf('color') == -1) {
        e.target.getElementsByTagName('span')[0].className = 'color1';
      } else {
        e.target.getElementsByTagName('span')[0].className = '';
      }

      // if(this.tagname[key1].value[key2].record == 1){
      // 	this.$set(this.tagname[key1].value[key2],'record',2);

      // }else{
      // 	this.$set(this.tagname[key1].value[key2],'record',1);
      // }
    },
    //标签组相关功能
    showtagname(key) {
      if (key == this.showtagnamekey) {
        this.showtagnamekey = null;
        return;
      } else {
        this.showtagnamekey = key;
      }
    },
    getname() {
      $http
        .get('goods.filtering.index')
        .then(res => {
          if (res.result == 1) {
            this.tagname = res.data;
            for (let i = 0; i < this.tagname.length; i++) {
              for (let y = 0; y < this.tagname[i].value.length; y++) {
                this.tagname[i].value[y].record = 1;
              }
            }

            console.log(this.tagname);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectname(e, id, key1, key2) {
      if (e.target.className.indexOf('color') == -1) {
        e.target.className = 'color'; //切换按钮样式
        if (this.filterId.includes(id)) {
          return;
        } else {
          this.filterId.push(id);
        }

        //写逻辑 增加name
      } else {
        e.target.className = ''; //切换按钮样式
        let index = this.filterId.indexOf(id);
        this.filterId.splice(index, 1);
        //写逻辑 减少name
      }

      if (this.tagname[key1].value[key2].record == 1) {
        this.$set(this.tagname[key1].value[key2], 'record', 2);
      } else {
        this.$set(this.tagname[key1].value[key2], 'record', 1);
      }

      //console.log(this.filterId);
    },
    resetnames() {
      this.namestring = null;
      this.showtagnamekey == null;
      this.namekey = null;

      this.brandId = '';

      this.attrstr = [];

      this.filterId = [];

      this.typestring = '';

      this.removeClass();

      this.attr = [
        {
          name: '推荐商品',
          show: true
        },

        {
          name: '新品上市',
          show: true
        },

        {
          name: '热卖商品',
          show: true
        },

        {
          name: '促销商品',
          show: true
        },

        {
          name: '限时抢购',
          show: true
        }
      ];

      this.classificationkey = null;

      this.classificationkey1 = null;
      this.classificationkey2 = null;

      this.brandId = '';
    },

    removeClass() {
      var dd = document.getElementsByClassName('div4-dd');

      for (let i = 0; i < dd.length; i++) {
        var span = dd[i].getElementsByTagName('span');

        for (let y = 0; y < span.length; y++) {
          span[y].setAttribute('class', '');
        }
      }
      for (let i = 0; i < this.tagname.length; i++) {
        for (let y = 0; y < this.tagname[i].value.length; y++) {
          if (this.tagname[i].value[y].record == 2) {
            this.tagname[i].value[y].record = 1;
          }
        }
      }

      console.log(this.filterId);
    },

    suretagname() {
      let data = {
        'search[filtering]': this.namestring,
        'search[product_attr]': this.attrstr.toString(),
        'search[keyword]': this.inputs,
        'search[category]': ''
      };
      this.screen(data);
    },
    sortOut(e) {
      this.hidebox();
      console.log('得到的信息', e);
      if (this.goods.length == 0) {
        return;
      }
      n = 1;
      this.goods = [];
      this.page= 1;
      this.isLoadMore = true;
      this.order_field = e.order_field;
      this.order_by = e.order_by;
      this.gotoSearch(n);
    },
    search() {
      n = 1;
      this.goods = [];
      this.page= 1;
      this.isLoadMore = true;
      this.goload = true;
      this.gotoSearch();
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
    loadTop() {
      n = 1;
      this.goods = [];
      this.gotoSearch(n);
      // this.$refs.loadmore.onTopLoaded()
    },
    // // 加载更多
    // loadBottom() {
    //   console.log('加载更多启动')
    //   n++
    //   this.gotoSearch(n)
    //   this.$refs.loadmore.onBottomLoaded()
    // },
    goback() {
      this.$router.go(-1);
    },
    getMoreData(){
      var that = this;
      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          'search[keyword]': this.inputs,
          page: this.page,
          order_field: this.order_field,
          order_by: this.order_by,
          sid: this.$route.params.sid
        };
        if(this.$route.params.is_hot){
          json.is_hot = 1;
        }
        if(this.$route.params.cid){
          json.category_id = this.$route.params.cid;
        }
        $http
          .get(
            "plugin.supplier.frontend.shop.index.search-goods",
            json,
            "加载中..."
          )
          .then(
            function(response) {
              if (response.result == 1) {
                that.loading = false;
                that.allLoaded = false;
                that.goods = that.goods.concat(response.data.data); //数组拼接
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
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
    gotoSearch(page = 1) {
      let json = {
        'search[keyword]': this.inputs,
        page: page,
        order_field: this.order_field,
        order_by: this.order_by,
        // 'search[couponid]': this.$route.params.coupon,
        // 'search[as_id]': this.zoneId,
        // 'search[brand_id]': this.brandId,
        // 'search[product_attr]': this.attrstr.toString(),
        // 'search[filtering]': this.filterId.toString(),
        // 'search[category]': this.
        sid: this.$route.params.sid
      };
      if(this.$route.params.is_hot){
        json.is_hot = 1;
      }
      if(this.$route.params.cid){
        json.category_id = this.$route.params.cid;
      }
      $http.get('plugin.supplier.frontend.shop.index.search-goods', json).then(json => {
        if (json.result == 1) {
          this.loading = false;
          this.allLoaded = false;
          // 搜索结果为空
          if (json.data.total.length <= 0) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
          // 如果当前页数大于总页数 就不加载了
          if (json.data.current_page > json.data.last_page) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
          console.log(json.data.current_page,json.data.last_page);
          this.goods.push(...json.data.data);
          this.isLoading = false;
          this.total_page = json.data.last_page;
          console.log('商品内容', this.goods);
          if (json.data.data.length < 20) {
            this.loading = true;
            this.allLoaded = true;
            return;
          }
        } else {
          this.isLoading = false;
        }
      });
    }
  },
  activated() {
    // this.getGoodsListHot();
    this.getbrand();
    this.getclassification();
    this.getname();
    this.amout = false;
    if (this.$route.params.fromHome === 1) {
      n = 1;
      this.goods = [];
      this.inputs = '';
    } else {
      // let json = JSON.parse(window.localStorage.getItem('searchBrandJSON'));
      // let key = window.localStorage.getItem('searchBrandKey');
      // this.searchAgain(json);
      // this.inputs = key;
      // 不是从上一级点进的不清空
    }

    this.show = false;
    if (this.$route.params.coupon) {
      this.search(n);
    }
    if (this.$route.params.kyes) {
      this.search(n);
    }

    this.search(n);
    //this.gotoSearch(n);
  },
  components: {
    cGoodsList,
    cSort
  },
  destroyed(){
    console.log(33);
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#search {
  .screening {
    width: 100%;
    min-height: 46.875rem;
    background: #fff;
    position: absolute;
    left: 0;
    top: 5.1875rem;

    header {
      display: flex;
      justify-content: space-around;
      padding: 0.625rem 0;
      border-bottom: solid 0.0625rem #ebebeb;

      span {
        display: block;
        width: 20%;
        background: #f5f5f5;
        line-height: 1.6875rem;
        border-radius: 0.1875rem;
      }
    }

    #div1 {
      display: flex;
      flex-wrap: wrap;

      div {
        padding-top: 0.625rem;
        width: 25%;

        img {
          display: block;
          width: 76%;
          height: 4.375rem;
        }

        span {
          display: inline-block;
          margin-top: 0.625rem;
        }
      }
    }

    #div2 {
      padding-left: 0.875rem;

      #divbox {
        box-sizing: border-box;

        & > p {
          width: 100%;
          font-size: 15px;
          text-align: left;
          line-height: 2.5rem;
          height: 2.5rem;
          font-weight: bold;
          text-indent: 0.625rem;
          border-bottom: solid 0.0625rem #ebebeb;
          position: relative;

          span {
            position: absolute;
            right: 1rem;
            top: 1rem;
            display: block;
            width: 1.25rem;
            height: 0.625rem;
            border: solid 0.1875rem #f15353;
            border-top: transparent;
            border-right: transparent;
            transform: rotate(-45deg);
          }
        }

        #divbox1 {
          p {
            width: 100%;
            font-size: 15px;
            text-align: left;
            line-height: 2.5rem;
            text-indent: 2.125rem;
            border-bottom: solid 0.0625rem #ebebeb;
            position: relative;

            span {
              position: absolute;
              right: 1rem;
              top: 1rem;
              display: block;
              width: 1.25rem;
              height: 0.625rem;
              border: solid 0.1875rem #f15353;
              border-top: transparent;
              border-right: transparent;
              transform: rotate(-45deg);
            }
          }

          #divbox2 {
            width: 100%;
            font-size: 15px;
            text-align: left;
            line-height: 2.5rem;
            text-indent: 3.125rem;
            color: rgba(0, 0, 0, 0.5);
            border-bottom: solid 0.0625rem #ebebeb;
            position: relative;

            span {
              position: absolute;
              right: 1rem;
              top: 1rem;
              display: block;
              width: 1.25rem;
              height: 0.625rem;
              border: solid 0.1875rem #f15353;
              border-top: transparent;
              border-right: transparent;
              transform: rotate(-45deg);
            }
          }
        }
      }

      footer {
        div {
          width: 3.5rem;
          line-height: 1.5rem;
          text-align: center;
          border-radius: 0.1875rem;
          float: left;

          &:nth-of-type(1) {
            border: solid 0.0625rem #f15353;
            background: #f15353;
            color: #fff;
            margin: 1rem 0 0 60%;
          }

          &:nth-of-type(2) {
            border: solid 0.0625rem #f15353;
            color: #f15353;
            background: #fff;
            margin: 1rem 0 0 5%;
          }
        }
      }
    }

    #div3 {
      box-sizing: border-box;
      padding-left: 0.875rem;

      p {
        font-size: 15px;
        text-align: left;
        line-height: 2.5rem;
        height: 2.5rem;
        text-indent: 0.625rem;
        border-bottom: solid 0.0625rem #ebebeb;
        position: relative;

        span {
          position: absolute;
          right: 1rem;
          top: 1rem;
          display: block;
          width: 1.25rem;
          height: 0.625rem;
          border: solid 0.1875rem #f15353;
          border-top: transparent;
          border-right: transparent;
          transform: rotate(-45deg);
        }
      }

      div {
        width: 3.5rem;
        line-height: 1.5rem;
        text-align: center;
        border-radius: 0.1875rem;
        float: left;

        &:nth-of-type(1) {
          border: solid 0.0625rem #f15353;
          background: #f15353;
          color: #fff;
          margin: 1rem 0 0 60%;
        }

        &:nth-of-type(2) {
          border: solid 0.0625rem #f15353;
          color: #f15353;
          background: #fff;
          margin: 1rem 0 0 5%;
        }
      }
    }

    #div4 {
      dl {
        box-sizing: border-box;
        padding: 0 0.875rem;
        font-size: 15px;

        dt {
          text-align: left;
          line-height: 2.5rem;
          text-indent: 0.9375rem;
          font-weight: bold;

          span {
            float: right;
            font-size: 13px;
            color: #c9c9c9;
            font-weight: normal;

            .icon {
              width: 0.4375rem;
              height: 0.4375rem;
              margin: 0.9375rem 0.9375rem 0 0.3125rem;
              border: solid 0.0625rem #c9c9c9;
              border-left: transparent;
              border-top: transparent;
              transform: rotate(45deg);
            }

            .icon1 {
              width: 0.4375rem;
              height: 0.4375rem;
              margin: 0.9375rem 0.9375rem 0 0.3125rem;
              border: solid 0.0625rem #c9c9c9;
              border-left: transparent;
              border-top: transparent;
              transform: rotate(225deg);
            }
          }
        }

        dd {
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
          border-bottom: solid 0.0625rem #ebebeb;

          span {
            display: block;
            background: #f5f5f5;
            width: 4.9375rem;
            line-height: 1.875rem;
            height: 1.875rem;
            float: left;
            margin: 0 0.625rem 0.75rem 0;
            border-radius: 0.1875rem;
            padding: 0 0.125rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          span:nth-child(4n) {
            margin-right: 0;
          }
        }
      }

      div {
        width: 3.5rem;
        line-height: 1.5rem;
        text-align: center;
        border-radius: 0.1875rem;
        float: left;

        &:nth-of-type(1) {
          border: solid 0.0625rem #f15353;
          background: #f15353;
          color: #fff;
          margin: 1rem 0 0 60%;
        }

        &:nth-of-type(2) {
          border: solid 0.0625rem #f15353;
          color: #f15353;
          background: #fff;
          margin: 1rem 0 0 5%;
        }
      }
    }
  }

  .color {
    color: #f15353;
    background: #fff !important;
    border: solid 0.0625rem #f15353;
  }

  .color1 {
    display: none !important;
  }

  .color2 {
    max-height: 2.625rem;
  }

  .fade1-enter-active {
    transition: 0.3s;
  }

  .fade1-enter,
  .fade1-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    transform: translateX(100%);
  }

  .osll {
    min-height: 100vh;
    overflow: scroll;
  }

  .uou {
    position: fixed;
    z-index: 99;
    top: 0;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    background: #fff;
  }

  .mout {
    top: -2.25rem;
  }
}

#search {
  .osll {
    min-height: 100vh;
    overflow: scroll;
  }

  .uou {
    width: 100%;
    position: fixed;
    z-index: 99;
    top: 0;
    transition: 0.2s;
    -webkit-transition: 0.2s;
    background: #fff;
  }

  #sort {
    /* line-height: 2.5rem; */
    font-size: 14px;
  }

  .mout {
    top: -2.25rem;
  }
}

.search {
  height: 2.8125rem;
  line-height: 2.8125rem;
  position: relative;
  display: flex;
  overflow: hidden;
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;

  .back {
    width: 2.8125rem;

    i {
      line-height: 2.8125rem;
      font-size: 1.5rem;
    }
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    width: 75%;
    margin-top: 0.5rem;
    padding: 0 0.625rem;
    background-color: #f2f2f2;
    height: 1.75rem;
    line-height: 1.75rem;
    border-radius: 0.875rem;

    form {
      flex: 1;
      margin-right: 0.5rem;
    }

    input {
      width: 100%;
      line-height: 1.75rem;
      border: none;
      color: #333;
    }
  }
}
</style>
