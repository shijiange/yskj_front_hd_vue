import { scrollMixin } from "utils/mixin";
import { Dialog,Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      keywords: '',
      activeName: 0,
      dataList: [],
      titleArr: [],
      isLoadMore: true,
      page:1,
      total_page:0,
      showEndP: false,
      has_many_level: [],
      cloneIndex: 0,
      activeID: 0,
      showposter: false,
      poster_url: '',
      showShare: false,
      options: [
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' }
      ],
    };
  },
  // created() {
  //     this.init();
  // },
  mounted() {
    this.init();
  },
  methods: {
    onSelect(option) {
      let that = this;
      let _link =
                this.fun.getSiteRoot() +
                '/addons/yun_shop/' +
                '?menu#' +
                '/groups/' +
                that.activeID +
                '/' +
                that.$route.params.store_id +
                '?i=' +
                this.fun.getKeyByI();
      _link = this.fun.isMid(_link, this.fun.getKeyByMid());
      if (option.name == '复制链接') {
        let message = '邀请您加入门店拼团：' + _link;
        this.$copyText(message).then(
          function (e) {
            console.log(e);
            Toast("复制成功");
          },
          function (e) {
            console.log(e);
            Toast("复制失败");
          }
        );
      } else if (option.name == '分享海报') {
        this.getPoster();
      }
      this.showShare = false;
    },
    getPoster() {
      $http
        .get(
          'plugin.fight-groups.frontend.controllers.group-poster.generate-goods-poster',
          { id: this.activeID, store_id: this.$route.params.store_id },
          ''
        )
        .then(res => {
          if (res.result == 1) {
            this.poster_url = res.data.image_url;
            this.showShare = false;
            this.showposter = true;
          } else {
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showShareM(id) {
      this.activeID = id;
      this.showShare = true;
    },
    init() {
      this.dataList = [];
      this.titleArr = ['全部活动', '未开始', '活动中', '已结束'];
      this.isLoadMore = true;
      this.setNewArr();
    },
    enterSearch() {
      this.dataList[this.activeName].list = [];
      this.handleClick();
    },
    endGrouplist(item, i) {
      this.cloneIndex = i;
      this.has_many_level = item.has_many_level;
      this.showEndP = true;
    },
    closelevel(num, _id, i) {
      let that = this;
      Dialog.confirm({
        title: '提示',
        message: `是否手动结束${num}人团`
      })
        .then(() => {
          $http.get('plugin.fight-groups.frontend.store.fight-groups-store.close-level', { id: _id }, "").then(response => {
            if (response.result === 1) {
              Toast(response.msg);
              that.$set(that.dataList[that.activeName].list[that.cloneIndex].has_many_level[i], "status", 2);
            } else {
              Toast(response.msg);
            }
          })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    gotoUrl(name, params) {
      this.$router.push(this.fun.getUrl(name, params));
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      console.log("dataList:::", this.dataList);
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }

      $http
        .post('plugin.fight-groups.frontend.store.fight-groups-store.index', {
          page: 1, status: this.activeName, store_id: this.$route.params.store_id, title: this.keywords
        }, "").then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.data);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    editActivity(_id){
      this.$router.push(this.fun.getUrl("createGroup", {store_id:this.$route.params.store_id,id:_id }));
    },
    createActivity(){
      this.$router.push(this.fun.getUrl("createGroup", {store_id:this.$route.params.store_id }));
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false;// 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {
          status: this.activeName, store_id: this.$route.params.store_id, title: this.keywords
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get('plugin.fight-groups.frontend.store.fight-groups-store.index', _json, "加载中").then((response) => {
          that.isLoadMore = true;
          that.dataList[that.activeName].isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.data;
            that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
          } else {
            that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
            that.dataList[that.activeName].isLoadMore = false;
            that.isLoadMore = false;
          }
        },
        function (response) {
          // error callback
        }
        );
      }
    },
  },
  components: {}
};
