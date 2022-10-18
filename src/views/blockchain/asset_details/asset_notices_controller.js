import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      notice: {},
      id: '',
      type: '',
      lang: {},
    };
  },
  activated() {
    this.id = this.$route.params.notice_id;
    this.getLang();
    this.getData();
  },
  methods: {
    getLang() {
      $http.get('plugin.asset.Frontend.Controllers.Lang.index', {}, "加载中").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
          this.checkTitle(this.$route.query.name);
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    checkTitle(type) {
      switch (type) {
      case 'notice':
        this.type = this.lang.capital_name+'数字化公告';
        this.fun.setWXTitle(this.lang.capital_name+'数字化公告');
        break;
      default:
        this.type = this.lang.capital_name+'公告';
        this.fun.setWXTitle(this.lang.capital_name+'公告');
        break;
      }
    },
    getData() {
      $http.get('plugin.asset.Frontend.Modules.Notice.Controllers.detail.index', {notice_id: this.id}, "加载中...").then(response => {
        if (response.result === 1) {
          this.notice = response.data.notice;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        document.write(error);
      });
    },
  },
  components: {cTitle}
};
