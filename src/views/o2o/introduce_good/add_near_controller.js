import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show_num:'',
      keyword:'',
      arr:[],
      datas: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      result:[],
      store_id:'',
      first:'',
      second:'',
      option1: [],
      option2: [
      ]
    };
  },
  activated() {
    this.initData();
    this.store_id=this.$route.params.id;
    this.getNum();
    this.getNetData();
  },
  methods: {
    getNum(){
      let that = this;
      let json = {store_id:this.store_id };
      $http
        .get(
          "plugin.store-cashier.frontend.store.near-by-goods.get-store-goods",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.show_num=response.data.show_num;
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    toSearch(){
      this.$router.push(this.fun.getUrl('nearSearch',{keyword:this.keyword,store_id:this.store_id}));
    },
    initData(){
      this.show_num='';
      this.arr=[];
      this.datas=[];
      this.loading=false;
      this.allLoaded=false;
      this.goload=true;
      this.isLoadMore=true;
      this.page=1;
      this.total_page=0;
      this.result=[];
      this.store_id='';
      this.first='';
      this.second='';
      this.option1=[];
      this.option2=[];
    },
    add(){
      let json={store_id:this.store_id,choose_goods:this.result};
      $http
        .post(
          "plugin.nearby-store-goods.frontend.controllers.goods.index",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              Toast(response.msg);
              this.$router.go(-1);
            } else {
              Toast(response.msg);
            }
          });
    },
    changeSecond(value){
      this.result=[];
      this.page=1;
      let that = this;
      let json = { store_id: this.store_id,page:this.page,category:{
        parentid:this.first,
        childid:this.second
      }};
      $http
        .post(
          "plugin.store-cashier.frontend.store.near-by-goods.get-goods-list",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.datas=response.data.list.data;
              that.total_page = response.data.list.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    changeCategory(value){
      this.page=1;
      this.result=[];
      this.option2=[];
      this.arr.forEach((item,index,key)=>{
        if(item.id==value){
          let obj=item.childrens;
          obj.forEach((list,index,key)=>{
            let o={};
            o.text=list.name;
            o.value=list.id;
            this.option2.push(o);
          });
        }
      });
      let that = this;
      let json = { store_id: this.store_id,page:this.page,category:{
        parentid:this.first,
        childid:''
      }};
      $http
        .post(
          "plugin.store-cashier.frontend.store.near-by-goods.get-goods-list",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.datas=response.data.list.data;
              that.total_page = response.data.list.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getNetData() {
      let that = this;
      let json = { store_id: this.store_id,page:this.page};
      $http
        .post(
          "plugin.store-cashier.frontend.store.near-by-goods.index",
          json,
          "获取中"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.arr=response.data.category;
              that.datas=response.data.goods_data.data;
              that.total_page = response.data.goods_data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.arr.forEach((item,index,key)=>{
                let json={};
                json.text=item.name;
                json.value=item.id;
                that.option1.push(json);
              });
            } else {
              // 判断权限
              if (response.data.url) {
                that.$notify(response.msg);
                window.location.href = response.data.url;
                return 0;
              } else {
                // that.$message.error(response.msg);
                // that.$message.error("暂无商品分类,请添加分类");
                that.$notify("暂无商品分类,请添加分类");
              }
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getMoreData() {
      var that = this;
      let url='';
      let json={};
      if (this.page === this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        if(this.first.length<=0){
          json = { page: this.page,store_id: this.store_id };
          url= "plugin.store-cashier.frontend.store.near-by-goods.index";
        }else{
          json = { page: this.page,store_id: this.store_id,category:{
            parentid:this.first,
            childid:this.second
          }};
          url= "plugin.store-cashier.frontend.store.near-by-goods.get-goods-list";
        }
        $http
          .post(
            url,
            json,
            "加载中"
          )
          .then(
            function(response) {
              if (response.result === 1) {
                that.loading = false;
                that.allLoaded = false;
                if(that.first.length<=0){
                  that.datas = that.datas.concat(response.data.goods_data.data);
                }else{
                  that.datas = that.datas.concat(response.data.list.data);
                }
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
  },
  components: {
    cTitle
  }
};
