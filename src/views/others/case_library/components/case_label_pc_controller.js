import navigation from './mycomponents/navigation';
import caseTemplate from './mycomponents/case';
import caseBottom from './mycomponents/case_bottom';
import secrvicePc from './mycomponents/service_pc';
import bottomAdv from './mycomponents/bottom_adv';

// import { Toast } from 'vant';

export default {
  data() {
    return {
      id: 0,
      label:{},
      list:[],
      total:0,
      current_page:1,
      per_page:0,
      type_name:'',
    };
  },
  activated() {
    this.view_show = true;
    this.id = this.$route.params.id;
    this.type_name = this.$route.name;
    console.log(this.$route.params);
    this.getDatas(1);
  },
  mounted() {
    if (!this.view_show) {
      this.id = this.$route.params.id;
      this.type_name = this.$route.name;
      console.log(this.$route.name);

      this.getDatas(1);
    }
  },
  methods: {
    getDatas(page) {
      let that = this;
      let url = '';
      let json = {};
      if(that.type_name == 'caseLibraryMypublish') {
        url = 'plugin.case-library.api.release.get-my-case';
      }
      else {
        url='plugin.case-library.api.pc.home.label-case';
        json={
          page: page,
          label_id: that.id
        };
      }
      $http.post(url, json, '').then(
        response => {
          if (response.result === 1) {
            that.view_show = true;
            if(that.type_name == 'caseLibraryMypublish') {
              that.list = response.data.list.data;
              that.current_page = response.data.list.current_page;
              that.total = response.data.list.total;
              that.per_page = response.data.list.per_page;
              // that.label = response.data.label
              that.setTitle('我的发布');
            }
            else {
              that.list = response.data.case.data;
              that.current_page = response.data.case.current_page;
              that.total = response.data.case.total;
              that.per_page = response.data.case.per_page;
              that.label = response.data.label;
              that.setTitle(that.label.label_name);
            }
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

    setTitle(name) {
      this.fun.setWXTitle(name+"-"+this.$store.state.caseLibrary.set.name+"-"+this.$store.state.caseLibrary.shop_name);
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl('caseLibraryHome', {}));
    },
    currentChange(page) {
      this.getDatas(page);
    }
  },
  components: { caseBottom, secrvicePc, navigation, caseTemplate,bottomAdv }
};
