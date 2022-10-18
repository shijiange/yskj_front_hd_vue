import cTitle from "components/title";
import { Toast } from "vant";
// import { Toast } from 'vant';

const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      active: "",
      id: "0",
      banner: "",
      title: "",
      datas: [],
      categories: [],
      isLoadMore: true,
      page: 1,
      total_page: 0,
      show1: false,
      noNotice: false,
      article_pay:'',
      searchText: '',
    };
  },
  activated() {

    zhuge.track('进入文章列表页');

    this.initData();
    //获取数据
    this.getNetData('true');
    window.addEventListener("scroll", this.handleScroll);
    if(this.fun.getKey("class_id")){
      this.active = "";
    }else{
      this.active = 0;
    }
  },
  deactivated() {
    this.activeName = "-1";
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    zhuge.startTrack('文章列表页停留时长');
    next();
  },
  beforeRouteLeave(to, from, next) {
    zhuge.endTrack('文章列表页停留时长');
    next();
  },
  methods: {
    toEssay(){
      this.$router.push(this.fun.getUrl("payEssay"));
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.datas = [];
    },

    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(
          body.clientHeight,
          documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          body.clientHeight,
          documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },

    handleScroll() {
      //滚动事件触发
      if (
        this.getScrollTop() + this.getClientHeight() + 105 >
        this.getScrollHeight()
      ) {
        // console.log('下拉刷新了')
        //此处发起请求
        if (this.isLoadMore) {
          this.getMoreData();
        } else {
          console.log("没有更多数据");
        }
      }
    },

    searchArt () {
      zhuge.track('文章列表页-点击搜索',{
        '搜索关键词':this.searchText
      });
      this.getNetData();
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.getNetData();
      }
    },

    //获取数据
    getNetData(flag) {
      let that = this;
      if(this.fun.getKey("class_id") && flag) {
        this.id = this.fun.getKey("class_id");
      }
      let json = { category_id: this.id, keyword: encodeURIComponent(this.searchText), page: 1 };
      $http.get("plugin.article.api.article.get-articles", json, "获取中").then(
        response => {
          if (response.result == 1) {
            this.noNotice = false;
            that.total_page = response.data.articles.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.isLoadMore = true;
            if (response.data.categories.length <= 0) {
              this.noNotice = true;
            }
            // that.banner = response.data.banner;
            that.title = response.data.title;
            that.datas = response.data.articles.data;
            that.categories = response.data.categories;
            that.fun.setWXTitle(response.data.title);
            that.article_pay=response.data.article_pay;
            if(this.fun.getKey("class_id") && flag) {
              for(let i=0;i<this.categories.length;i++) {
                if(this.categories[i].id == this.fun.getKey("class_id")){
                  that.active = i+1;
                  this.$refs.act.resize();
                }
              }
            }
          } else {
            Toast(response.msg);
            this.noNotice = true;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    getMoreData(page) {
      let that = this;

      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        console.log("getMoreData", this.total_page);
        return;
      } else {
        this.page = this.page + 1;
        let json = { category_id: this.id, keyword: this.searchText, page: this.page };
        $http
          .get("plugin.article.api.article.get-articles", json, "加载中")
          .then(
            function(response) {
              if (response.result === 1) {
                that.isLoadMore = true;
                that.total_page = response.data.articles.last_page;

                that.datas = that.datas.concat(response.data.articles.data);
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

    toNoticeInfo(item) {
      if(item.has_one_article_pay){
        if(item.has_one_record){
          this.$router.push(this.fun.getUrl("articleContent", { id: item.id }));
        }else{
          this.$router.push(this.fun.getUrl("payList", { id: item.id }));
          return;
        }
      }else{
        zhuge.track('文章列表页-点击文章',{
          '文章名称':item.title,
          '文章id':item.id,
          '发布人':item.author,
          '发布人id':'',      
          '发布时间':item.created_at,
          '所属标签':item.belongs_to_category.name,
          '搜索关键词':this.searchText
        });

        zhuge.track('通用-点击文章',{
          '文章名称':item.title,
          '文章id':item.id,
          '发布人':item.author,
          '发布人id':'',      
          '发布时间':item.created_at,
          '所属板块':item.belongs_to_category.name   
        });
        this.$router.push(this.fun.getUrl("articleContent", { id: item.id }));
        return;
      }
    },
    onClick(index, title) {
      zhuge.track('文章列表页-点击分类标签',{
        '分类标签':title
      });
      this.initData();
      //console.log(index);
      // let tab = document.getElementById("tab");
      // let tabChild = tab.getElementsByClassName("tabChild");
      // console.log(tab,tabChild)
      // this.id = tabChild[index].getAttribute("id");
      if(index == 0){
        this.id = 0;
      }else{
        this.id = this.categories[index - 1].id;
      }
      this.getNetData();
    }
  },
  components: { cTitle }
};
