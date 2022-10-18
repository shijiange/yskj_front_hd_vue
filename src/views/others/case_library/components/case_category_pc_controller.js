import navigation from './mycomponents/navigation';
import caseBottom from './mycomponents/case_bottom';
import caseTemplate from './mycomponents/case';
import secrvicePc from './mycomponents/service_pc';
import bottomAdv from './mycomponents/bottom_adv';
// import { Toast } from 'vant';

export default {
  data() {
    return {
      view_show: false,
      pid: 0,
      cid: 0,
      level: 0,
      firstCategory: [],
      secondCategory: [],
      list: [],
      order_by: 'new',
      total: 0,
      per_page: 0,
      current_page: 1
    };
  },
  activated() {
    let that = this;
    that.view_show = true;
    this.initData();
    this.setTitle('全部');
    this.getFirst();

    this.getSecond(this.pid);
    if (this.level == 2) {
      setTimeout(() => {
        that.getSecondList(that.$route.query.cid, 1);
      }, 50);
    }
  },
  mounted() {
    let that = this;
    if (!that.view_show) {
      console.log(this.$store.state);
      this.initData();
      this.setTitle('全部');
      console.log(this.$route.query);
      this.getFirst();

      this.getSecond(this.pid);
      if (this.level == 2) {
        setTimeout(() => {
          that.getSecondList(that.$route.query.cid, 1);
        }, 50);
      }
    }
  },
  methods: {
    initData() {
      window.scrollTo(0, 0);
      this.pid = this.$route.query.pid || '';
      this.cid = this.$route.query.cid || '';
      this.level = this.$route.query.level || '';
      this.order_by = this.$route.query.order_by || 'new';
      if (this.level == 1) {
        this.pid = this.cid;
        this.cid = '';
      }
    },
    setTitle(category_name) {
      this.fun.setWXTitle((category_name||'')+"-"+this.$store.state.caseLibrary.set.name+"-"+this.$store.state.caseLibrary.shop_name);
    },
    getFirst() {
      let that = this;
      $http.post('plugin.case-library.api.case.get-all-category', {}, '').then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            that.firstCategory = response.data.firstCategory;
            that.firstCategory.unshift({ id: '', level: 1, category_name: '全部' });
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg
            });
          }
        },
        function(response) {

          this.$dialog.alert({
            title: '提示',
            message: response
          });
        }
      );
    },
    getSecond(pid, page) {
      let that = this;
      $http
        .post(
          'plugin.case-library.api.pc.home.cut-first-category',
          { pid: pid, page: page, order_by: that.order_by },
          ''
        )
        .then(
          response => {
            if (response.result === 1) {
              let obj = that.firstCategory.find((item,index) => {
                return item.id == pid;
              });
              this.setTitle(obj!=null?obj.category_name:'');
              that.pid = pid;
              that.cid = '';
              that.secondCategory = response.data.secondCategory;
              if (that.secondCategory.length > 0) {
                that.secondCategory.unshift({ id: '', level: 2, category_name: '全部' });
              }
              that.list = response.data.case.data;
              that.current_page = response.data.case.current_page;
              that.total = response.data.case.total;
              that.per_page = response.data.case.per_page;
            } else {

              this.$dialog.alert({
                title: '提示',
                message: response.msg
              });
            }
          },
          function(response) {

            this.$dialog.alert({
              title: '提示',
              message: response
            });
          }
        );
    },
    getSecondList(cid, page) {
      let that = this;
      let n_cid = cid ? cid : that.pid;
      $http
        .post('plugin.case-library.api.pc.home.cut-second-category', { cid: n_cid, page, order_by: that.order_by }, '')
        .then(
          response => {
            if (response.result === 1) {
              let obj = that.secondCategory.find((item,index) => {
                return item.id == n_cid;
              });
              this.setTitle(obj!=null?obj.category_name:'');
              that.cid = cid;
              that.list = response.data.case.data;
              that.current_page = response.data.case.current_page;
              that.total = response.data.case.total;
              that.per_page = response.data.case.per_page;
            } else {
              that.$dialog.alert({
                title: '提示',
                message: response.msg
              });
            }
          },
          function(response) {
            that.$dialog.alert({
              title: '提示',
              message: response.msg
            });
          }
        );
    },
    currentChange(val) {
      let that = this;
      if (this.cid) {
        that.getSecondList(this.cid, val);
      } else {
        that.getSecond(this.pid, val);
      }
    },
    changeType(type) {
      let that = this;
      if (that.order_by == type) {
        return;
      } else {
        that.order_by = type;
        if (that.cid) {
          that.getSecondList(that.cid, 1);
        } else {
          that.getSecond(that.pid, 1);
        }
      }
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl('caseLibraryHome', {}));
    }
  },
  components: { caseBottom, secrvicePc, navigation, caseTemplate, bottomAdv }
};
