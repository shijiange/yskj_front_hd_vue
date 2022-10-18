//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
import District from 'ydui-district/dist/jd_province_city_area_id';
export default {
  data() {
    return {
     
      show: false,
      show2: false,
      district: District,
      name:'',
      form: {
        sex: '1',
        user_name: '',
        phone: '',
        address: '',
        dealer_user_id: ''
      },
      upgrade_level: [
        {
          id: '1',
          text: '男'
        },
        {
          id: '2',
          text: '女'
        }
      ]
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    initData(){
    
      this.show=false;
      this.show2=false;
      this.district=District;
      this.name='';
      this.form={
        sex: '1',
        user_name: '',
        phone: '',
        address: '',
        dealer_user_id: ''
      };

    },
    confirm(){
      const that = this;
      if (this.fun.isTextEmpty(this.form.user_name)) {
        Toast("请输入姓名");
        return; 
      }
      if (!this.form.phone){
        Toast("请绑定手机号");
        return; 
      }
      if (!this.form.address){
        Toast("请选择地址");
        return; 
      }
      $http.post('plugin.energy-cabin.frontend.dealer-terminal.add-member-info', {data:this.form}, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            Toast(response.msg);
            that.$router.go(-1);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getData() {
      const that = this;
      let json = {
        dealer_uid: this.$route.params.dealer_uid
      };
      $http.get('plugin.energy-cabin.frontend.dealer-terminal.show-member-page', json, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            that.form.phone = response.data.member.mobile;
            that.form.dealer_user_id=response.data.dealer_member.uid;
            that.form.user_name=response.data.member.nickname;
            that.name=response.data.dealer_member.nickname;
           
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    tobind() {
      this.$router.push(this.fun.getUrl('editmobile'));
    },
    result2(ret) {
      this.form.address = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    }
  },
  activated() {
    this.initData();
    this.getData();
  }
};
