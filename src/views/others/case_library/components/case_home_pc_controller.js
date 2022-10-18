import navigation from './mycomponents/navigation';
import caseBottom from './mycomponents/case_bottom';
import caseTemplate from './mycomponents/case';
import secrvicePc from './mycomponents/service_pc';
import emptyImage from '../../../../assets/images/new_diy/image.png';

// import { Toast } from 'vant';

export default {
  data() {
    return {
      emptyImage,
      view_show: false,
      banner: [],
      hotCategory: [],
      hotCases: [],
      special: [],
      newCase: [],
      rank: [],
      category: [],
      ad1: {},
      ad2: {},
      choosed_category_id: '',

      case_page: 1,
      case_total: 0,
      case_last: 1
    };
  },
  activated() {
    this.view_show = true;
    this.getDatas();
    this.setTitle();
  },
  mounted() {
    if (!this.view_show) {
      this.getDatas();
      this.setTitle();
    }
  },
  watch: {},
  methods: {
    getDatas() {
      let that = this;
      $http.post('plugin.case-library.api.pc.home.index', {}, '').then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            that.banner = response.data.banner;
            that.hotCategory = response.data.hotCategory;
            that.hotCases = response.data.hotCases;
            if (that.hotCategory.length >= 1) {
              that.choosed_category_id = that.hotCategory[0].id;
            }
            that.special = response.data.special;
            that.newCase = response.data.newCase.data;
            that.case_page = response.data.newCase.current_page;
            that.case_total = response.data.newCase.total;
            that.case_last = response.data.newCase.last_page;

            that.rank = response.data.rank;
            that.category = response.data.category;
            let advert = response.data.advert;
            that.ad1 = advert.ad1.length && advert.ad1.length == 0 ? '' : advert.ad1;
            that.ad2 = advert.ad2.length && advert.ad2.length == 0 ? '' : advert.ad2;
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        function(response) {
          this.$dialog.alert({
            title: '提示',
            message: response,
          });

        }
      );
    },
    setTitle() {
      this.fun.setWXTitle(this.$store.state.caseLibrary.set.name+"-"+this.$store.state.caseLibrary.shop_name);
    },

    changeCategory(id) {
      let that = this;
      that.choosed_category_id = id;
      $http.post('plugin.case-library.api.pc.home.home-cut-hot-category', { cid: id }, '').then(
        response => {
          if (response.result === 1) {
            that.hotCases = response.data.hotCases;
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        function(response) {

          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    changeCasePage() {
      let that = this;
      that.case_page += 1;
      if (that.case_last <= that.case_page) {
        that.case_page = 1;
      }

      $http.post('plugin.case-library.api.pc.home.home-new-case', { page: that.case_page }, '').then(
        response => {
          if (response.result === 1) {
            that.newCase = response.data.newCase.data;
          } else {

            this.$dialog.alert({
              title: '提示',
              message: response.msg,
            });
          }
        },
        function(response) {

          this.$dialog.alert({
            title: '提示',
            message: response,
          });
        }
      );
    },
    gotoCaseDetail(id) {
      this.$router.push(this.fun.getUrl('caseLibraryDetail', { id: id }));
    },

    gotoSpecialList() {
      this.$router.push(this.fun.getUrl('caseLibrarySubjectList', {}));
    },

    gotoSpecial(id) {
      this.$router.push(this.fun.getUrl('caseLibrarySubjectDetail', { id: id }));
    },
    gotoCategory(pid, cid, level) {
      if (!cid) {
        this.$router.push(this.fun.getUrl('caseLibraryCategory', {}));
      }
      else {
        this.$router.push(this.fun.getUrl('caseLibraryCategory', {},{pid:pid,cid:cid,level:level}));
      }
    },
    gotoCategory1() {
      this.$router.push(this.fun.getUrl('caseLibraryCategory', {},{order_by:'hot'}));
    }
  },
  props: {},
  components: { secrvicePc, navigation, caseBottom, caseTemplate }
};
