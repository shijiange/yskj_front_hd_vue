import cTitle from "components/title";
import { Toast } from 'vant';
let self = this;
export default {
  data() {
    return {
      isOpenCompany: false,
      kwd:'',
      companyRadio: null,
      serial_number:'',
      storeName:'',
      insuer:'',
      certificateNumber:'',
      information:'',
      insuranceAddress:'',
      insuredProperty:'',
      usertype:'',
      amountForce:'',
      insurancePeriod:'',
      premium:'',
      insuranceTypeVal:'',
      glassRisk:'',
      insurer:'',
      companyNames: '',
      Memoinformation:'',
      insuranceTypeshow:false,
      selectCompanyPopup:false,
      columns: [
        { text: '火险+盗抢', },
        { text: '单独盗抢',}
      ],
      companyList: [],
      //more
      isLoadMore: false,
      page: 1,
      total_page: 0,
      questTag: true
    };
  },
  methods: {
    showCompany(){
      this.kwd = "";
      this.selectCompanyPopup=true;
    },
    searchCompany(){
      // 有分页
      $http
        .get('plugin.supplier.frontend.insurance.searchCompany',{kwd:this.kwd},"").then(response => {
          this.isloading = false;
          if (response.result === 1) {
            this.isOpenCompany = true;
            this.companyList = response.data.data;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
              this.isLoadMore = false;
            }else{
              this.isLoadMore = true;
            }
          } else {
            this.isOpenCompany = false;
            console.log(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      if(!this.questTag){
        return;
      }
      that.questTag = false; // 防止多次请求分页数据
      this.page = this.page + 1;
      if (this.page >= this.total_page) {
        that.isLoadMore = false;
      }
      $http.get('plugin.supplier.frontend.insurance.searchCompany',{kwd:this.kwd,page:this.page},"加载中").then((response)=> {
        that.questTag = true;
        if (response.result === 1) {
          var myData = response.data.data;
          that.companyList = that.companyList.concat(myData); //数组拼接
        } else {
          that.page = that.page - 1;
          that.isLoadMore = true;
        }
      },
      function(response) {
        // error callback
      }
      );

    },
    clickRadio(data){
      this.companyNames = data.name;
      this.companyRadio = data.id;
      this.selectCompanyPopup = false;
    },
    onCancel() {
      this.kwd = "";
      this.searchCompany();
    },
    insuranceTypeshowBtn(){
      this.insuranceTypeshow = true;
    },
    insuranceTypebtn(e){
      this.insuranceTypeVal = e.text;
      this.insuranceTypeshow = false;
    },
    insuranceTypeClose(){
      this.insuranceTypeshow = false;
    },
    submit(){
      let that = this;
      if(this.fun.isTextEmpty(this.serial_number)){
        Toast("请填写序号！");
        return;
      }
      if(this.fun.isTextEmpty(this.storeName)){
        Toast("请填写店面名称！");
        return;
      }
      if(this.fun.isTextEmpty(this.insuer)){
        Toast("请填写被保险人！");
        return;
      }
      if(this.fun.isTextEmpty(this.certificateNumber)){
        Toast("请填写证件号码！");
        return;
      }
      if(this.fun.isTextEmpty(this.information)){
        Toast("请填写被保险人联系方式！");
        return;
      }
      if(this.fun.isTextEmpty(this.insuranceAddress)){
        Toast("请填写保险地址！");
        return;
      }
      if(this.fun.isTextEmpty(this.insuredProperty)){
        Toast("请填写投保财产！");
        return;
      }
      if(this.fun.isTextEmpty(this.usertype)){
        Toast("请填写用户类型！");
        return;
      }
      if(this.fun.isTextEmpty(this.amountForce)){
        Toast("请填写保额！");
        return;
      }

      if(this.fun.isTextEmpty(this.insurancePeriod)){
        Toast("请填写保险期限！");
        return;
      }
      if(this.fun.isTextEmpty(this.premium)){
        Toast("请填写保费！");
        return;
      }
      if(this.fun.isTextEmpty(this.insurer)){
        Toast("请填写投保人！");
        return;
      }
      if(this.fun.isTextEmpty(this.insuranceTypeVal)){
        Toast("请选择投保险种！");
        return;
      }
      if(this.fun.isTextEmpty(this.glassRisk)){
        Toast("请选择玻璃险！");
        return;
      }
      if(this.isOpenCompany&&this.fun.isTextEmpty(this.companyRadio)){
        Toast("请选择保险公司！");
        return;
      }
      let json = {
        data:{
          serial_number:this.serial_number,
          shop_name:this.storeName,
          insured:this.insuer,
          identification_number:this.certificateNumber,
          phone:this.information,
          address:this.insuranceAddress,
          insured_property:this.insuredProperty,
          customer_type:this.usertype,
          insured_amount:this.amountForce,
          guarantee_period:this.insurancePeriod,
          premium:this.premium,
          insurance_company:this.insurer,
          insurance_coverage:this.insuranceTypeVal,
          additional_glass_risk:this.glassRisk,
          company_id: this.companyRadio,
          note:this.Memoinformation
        }
      };
      let urls = 'plugin.supplier.frontend.insurance.insurance-add';
      $http.post(urls, json).then(function (response) {
        if (response.result == 1) {
          Toast(response.msg);
          that.$router.go(-1);
        } else {
          that.$notify(response.msg);
        }
      }, function (response) {});
    }
  },
  beforeRouteLeave: function(to, from, next) {
    if(self.selectCompanyPopup){
      self.selectCompanyPopup = false;
      next(false);
    }else{
      next();
    }
  },
  activated() {
    self = this;
    this.searchCompany();
  },
  components: {
    cTitle
  }
};
