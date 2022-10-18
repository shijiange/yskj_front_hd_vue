import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      isOpenCompany: false,
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
      Memoinformation:'',
      companyNames: '',
      companyRadio: null,
      insuranceTypeshow:false,
      selectCompanyPopup:false,
      companyList:[],
      //more
      isLoadMore: false,
      page: 1,
      total_page: 0,
      questTag: true,
      kwd: '',
      columns: [
        { text: '火险+盗抢', },
        { text: '单独盗抢',}
      ],
      id:''
    };
  },
  methods: {
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
    getJson(){
      let that = this;
      let json = {id: that.id};
      let urls = 'plugin.supplier.frontend.insurance.insurance-edit';
      $http.post(urls, json).then(function (response) {
        if (response.result == 1) {
          that.serial_number = response.data.serial_number;
          that.storeName = response.data.shop_name;
          that.insuer =  response.data.insured;
          that.certificateNumber = response.data.identification_number;
          that.information = response.data.phone;
          that.insuranceAddress = response.data.address;
          that.insuredProperty = response.data.insured_property;
          that.usertype = response.data.customer_type;
          that.amountForce = response.data.insured_amount;
          that.insurancePeriod= response.data.guarantee_period;
          that.premium = response.data.premium;
          that.insurer = response.data.insurance_company;
          that.insuranceTypeVal=response.data.insurance_coverage;
          that.glassRisk= response.data.additional_glass_risk;
          that.Memoinformation=response.data.note;
          that.companyNames=response.data.has_one_company?response.data.has_one_company.name:'';
          that.companyRadio=response.data.company_id;
        } else {
          that.$notify(response.msg);
        }
      }, function (response) {});
    },
    submit(){
      let that = this;
      let json ={
        id: this.id,
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
          additional_glass_risk :this.glassRisk,
          company_id: this.companyRadio,
          note:this.Memoinformation
        }
      };
      let urls = this.$route.params.type == 'edit'?'plugin.supplier.frontend.insurance.insurance-edit':'plugin.supplier.frontend.insurance.insurance-add';
      $http.post(urls, json).then(function (response) {
        if (response.result == 1) {
          Toast(response.msg);
          that.$router.go(-1);
        } else {
          that.$notify(response.msg);
        }
      }, function (response) {});
    },
    showCompany(){
      this.kwd = "";
      this.selectCompanyPopup=true;
    },
    searchCompany(){
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
  },
  activated() {
    this.id = this.$route.params.id;
    this.getJson();
    this.searchCompany();
  },
  components: {
    cTitle
  }
};
