import cTitle from 'components/title';
import { Toast } from 'vant';

export default {

  data() {
    return {
      activityName: '',
      average: '',
      personNumber: '',
      credit1: 0,
      clicktag: 0,
      integral: window.localStorage.integral,
    };
  },
  computed: {
    total() {
      return Number(this.average) * Number(this.personNumber);
    }
  },
  methods: {
    getIntegral() {

      var that = this;
      $http.get('finance.point-page.index', {}, "").then(function (response) {

        if (response.result === 1) {
          that.credit1 = response.data.credit1;
        } else {
          that.$dialog.alert({message:response.msg});
        }

      }, function (response) {
        that.$dialog.alert({message:response.msg});
      });

    },
    checkScore() {
      const that = this;
      if (this.total > Number(this.credit1)) {
        Toast({
          message: '您的' + that.integral + '不够',
          duration: 1500
        });
        return false;
      }
      return true;

    },
    createActivity() {
      if (!this.activityName || !this.average || !this.personNumber) {
        Toast({
          message: '信息不能为空',
          duration: 1500
        });
        return;
      }
      if (!this.checkScore()) return;
      const that = this;

      if (this.clicktag === 0) {
        this.clicktag = 1;
        $http.post('plugin.point-activity.Frontend.Modules.Activity.Controllers.create.index', {
          name: that.activityName,
          average: that.average,
          total: that.personNumber
        }).then(function (response) {
          if (response.result === 1) {
            that.activityName = '';
            that.average = '';
            that.personNumber = '';
            Toast({
              message: '创建成功',
              duration: 1500
            });
            setTimeout(() => {
              that.$router.go(-1);
              this.clicktag = 0;
            }, 1000);

          } else {
            that.$dialog.alert({message:response.msg});
          }
        }, function (response) {
          // error callback
        });

      }


    }
  },
  activated() {
    this.clicktag = 0; // 防止快速点击
    this.getIntegral();
  },
  components: {cTitle}
};