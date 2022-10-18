import cTitle from 'components/title';
import { Toast } from 'vant';
// import { resolve } from '_uri-js@4.2.2@uri-js'
import { scrollMixin } from '../../../../utils/mixin';
export default {
  mixins: [scrollMixin], // 加载更多
  data() {
    return {
      coupon: [],
      isShowNoTest: false,
      isLoadMore: true, // 判断是否能够加载更多
      last_page: 0, // 总页数
      page: 1,
      coupon_length: '' ,// 优惠券总数
      is_publish:false,//优惠券按钮是否开启
      isLoading:false
    };
  },
  activated() {
    this.initPageData();
    this.getData();
  },
  methods: {
    initPageData() {
      this.coupon_length = '';
      this.coupon = [];
      this.page = 1;
      this.isShowNoTest = false;
      this.is_publish = false;
    },
    getData() {
      let json = {
        page: 1
      };
      $http.get('plugin.store-cashier.frontend.store.center.coupon.index', json, '加载中').then(response => {
        if (response.result === 1) {
          this.is_publish = response.data.publish;
          for (var i = 0;i < response.data.data.length;i++) {
            response.data.data[i].edit_active = false;
          }
          if (!this.last_page) {
            this.last_page = 0;
          }
          if (response.data.data.length > 0) {
            this.isShowNoTest = false;
            this.isLoadMore = true;
            this.last_page = response.data.last_page;
            this.coupon = response.data.data;
            this.coupon_length = response.data.total;
          }
          if (response.data.data.length <= 0) {
            this.isShowNoTest = true;
          }
          this.isLoading = false;
        }
        else if (response.result === 0) {
          this.isLoading = false;
          if (response.data.url) {
            window.location.href = response.data.url;
          }else {
            Toast(response.msg);
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    moreEvent(index) {
      if (this.coupon[index].edit_active == false) {
        this.emptyEditActive();
        this.coupon[index].edit_active = true;
      }else {
        this.emptyEditActive();
      }
    },
    emptyEditActive() {
      for (var i = 0;i < this.coupon.length;i++) {
        this.coupon[i].edit_active = false;
      }
    },
    loadTop() {
      this.initPageData();
      this.getData();
      // this.$refs.coupon_loadmore.onTopLoaded()
    },
    Toedit(Id) {
      this.$router.push(this.fun.getUrl('CommodityCouponEdit', {id: Id}));
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      let json = {
        page: this.page
      };
      if (this.page >= this.last_page) {
        return;
      }else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get('plugin.store-cashier.frontend.store.center.coupon.index', json, '加载中').then((response) => {
          this.isLoadMore = true;
          if (response.result === 1) {
            for (var i = 0;i < response.data.data.length;i++) {
              response.data.data[i].edit_active = false;
            }
            this.coupon = this.coupon.concat(response.data.data);
          }else {
            this.page = this.page - 1;
            this.isLoadMore = false;
            return;
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    commodityDelete(index) {
      let that = this;
      this.emptyEditActive();
      this.$dialog.confirm({
        title: "提示",
        message: '此操作将永久删除该优惠券, 是否继续?',
      }).then(() => {
        // on confirm

        let json = {id: this.coupon[index].id};
        let urls = 'plugin.store-cashier.frontend.store.center.coupon.destroy';
        $http.post(urls, json).then(function (response) {
          if (response.result == 1) {
            // that.$message({
            // 	message: '商品删除成功',
            // 	type: 'success'
            // })
            that.$notify({
              background: '#f0f9eb',
              message: '优惠券删除成功',
              color: '#67c23a'
            });

            that.coupon.splice(index, 1);
            that.coupon_length = Number(that.coupon_length) - 1;
          }
          else if (response.result === 0) {
            if (response.data.url) {
              window.location.href = response.data.url;
            }else {
              Toast(response.msg);
            }
          }else {
            // that.$message.error(response.msg)
            that.$notify(response.msg);
          }
        }, function (response) {});
      }).catch(() => {
        // on cancel
        this.$notify({
          background: '#edf2fc',
          message: '已取消删除',
          color: '#909399'
        });
      });

    },
    provide(Id) {
      this.$router.push(this.fun.getUrl('CommodityCouponGive', {id: Id}));
    }
  },
  components: {cTitle}
};
