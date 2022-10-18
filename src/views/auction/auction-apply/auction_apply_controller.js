import cTitle from "components/title";
import { Toast } from 'vant';
// import District from "src/gov_province_city_area_id";
export default {
  data() {
    return {
      street_id:'',
      districtVal: [],
      strShow:false,
      streetShow: false,
      show1: false,
      model1: '',
      district: district,
      checked: true,
      show:false,
      show2:false,
      agreement:'',
      real_name:'',
      mobile:'',
      identity_card:'',
      province_id:'',
      city_id:'',
      district_id:'',
      company:'',
      positive:'',
      back:'',
      holdID:'',
      license:'',
      remark:'',
      address:'',
      banner_img:''
    };
  },
  activated() {
    window.scrollTo(0,0);
    this.getverifyGoods();
  },
  methods: {
    getverifyGoods(){
      let json={art:'verifyGoods'};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.initData();
            this.getAgreement();
          } else {
            if(response.msg.url.length>0){
              // window.location.href=response.msg.url[0];
              // this.$dialog.alert({message:response.msg.msg});
              this.$dialog.confirm({ message:response.msg.msg})
                .then(() => {
                  window.location.href=response.msg.url[0];
                }).catch(() => {
                  this.$router.go(-1);
                });
            }else{
              // this.$router.push(this.fun.getUrl('member'));
              // this.$dialog.alert({message:response.msg.msg});
              this.$dialog.confirm({ message:response.msg.msg})
                .then(() => {
                  this.$router.push(this.fun.getUrl('member'));
                }).catch(() => {
                  this.$router.go(-1);
                });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toaucion(){
      this.$router.push(this.fun.getUrl('auctioneer'));
    },
    initData(){
      this.street_id='';
      this.districtVal=[];
      this.strShow=false;
      this.streetShow=false;
      this.show1=false;
      this.model1='';
      this.district=district;
      this.checked=true;
      this.show=false;
      this.show2=false;
      this.agreement='';
      this.real_name='';
      this.mobile='';
      this.identity_card='';
      this.province_id='';
      this.city_id='';
      this.district_id='';
      this.company='';
      this.positive='';
      this.back='';
      this.holdID='';
      this.license='';
      this.remark='';
      this.address='';
      this.banner_img='';
    },
    getApply(){
      let json={art:'getApply'};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.real_name=response.data.getApply.real_name;
            this.address=response.data.getApply.address;
            this.remark=response.data.getApply.remark;
            this.province_id=response.data.getApply.province_id;
            this.district_id=response.data.getApply.district_id;
            this.city_id=response.data.getApply.city_id;
            this.back=response.data.getApply.back;
            this.positive=response.data.getApply.positive;
            this.license=response.data.getApply.license;
            this.holdID=response.data.getApply.holdID;
            this.mobile=response.data.getApply.mobile;
            this.identity_card=response.data.getApply.identity_card;
            this.company=response.data.getApply.company;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    apply(){
      if(!this.checked){
        Toast('请同意申请协议');
        return;
      }
      let json={
        art:'apply',
        real_name:this.real_name,
        mobile:this.mobile,
        province_id:this.province_id,
        city_id:this.city_id,
        district_id:this.district_id,
        address:this.address,
        identity_card:this.identity_card,
        company:this.company,
        positive:this.positive,
        back:this.back,
        holdID:this.holdID,
        license:this.license,
        remark:this.remark,
        street_id:this.street_id
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.show=true;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    licensePhoto(e){
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      this.uploadUrl = this.fun.getRealUrl(
        'upload.uploadPic',
        {}
      );
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            this.license=response.data.data.img_url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    idback(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      this.uploadUrl = this.fun.getRealUrl(
        'upload.uploadPic',
        {}
      );
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            this.back=response.data.data.img_url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    idpositive(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      this.uploadUrl = this.fun.getRealUrl(
        'upload.uploadPic',
        {}
      );
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            this.positive=response.data.data.img_url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    idHand(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      this.uploadUrl = this.fun.getRealUrl(
        'upload.uploadPic',
        {}
      );
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            this.holdID=response.data.data.img_url;
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showPop(){
      this.show2=true;
    },
    result1(ret) {
      this.city=ret.itemName1+ret.itemName2+ret.itemName3;
      this.province_id = ret.itemValue1;
      this.city_id = ret.itemValue2;
      this.district_id=ret.itemValue3;
      this.getStreet(ret.itemValue3);
    },
    streetConfirm(item) {
      this.street = item.areaname;
      this.street_id = item.id;
      this.streetShow = false;
    },
    // 获取街道
    getStreet(param) {
      $http
        .get("member.memberAddress.street", { district_id: param })
        .then(response => {
          if (response.result === 1) {
            if (
              !this.fun.isTextEmpty(response.data) &&
              response.data.length > 0
            ) {
              this.districtVal = response.data;
              this.strShow = true;
            } else {
              this.strShow = false;
            }
          } else {
            this.strShow = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAgreement() {
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",{},"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.agreement=response.data.getAgreement.agreement;
            this.banner_img=response.data.getAgreement.banner_img;
            if(response.data.is_apply==0){
              this.getApply();
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  components: {
    cTitle
  }
};
