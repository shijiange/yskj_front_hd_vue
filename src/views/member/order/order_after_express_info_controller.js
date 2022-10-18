import cTitle from 'components/title';
import yz_uploader from "components/ui_components/yz_uploader";
//import QrCode from "qrcode-decoder";
import Quagga from 'quagga';
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      form:
                {
                  refund_id: '',
                  express_sn: '',
                  express_company: '',
                  "i": this.fun.getKeyByI(),
                  "type": this.fun.getTyep()

                },

      express: [],

      companyShow: false,
      expressName: "",
      expressCode:"",

      expressImage:""


    };
  },
  methods: {
    // change(value){
    //     console.log(value);
    //     this.form.express_code = value.code;
    //     this.express_company_name = value.name;
    // },
    upExpressImage(arr){
      this.expressImage = arr[0];
    },
    upExpress(file){
      console.log(file);
      this.decode(file);

    },
    decode(file) {
      Quagga.decodeSingle(
        {
          inputStream: {
            size: 1800, // 这里指定图片的大小，需要自己测试一下
            //   singleChannel: false
          },
          locator: {
            patchSize: 'medium',
            halfSample: false
          },
          numOfWorkers: 1,
          decoder: {
            readers: [
              {
                format: 'code_128_reader', // ean_reader 这里指定ean条形码，就是国际13位的条形码   code39    code_128
                config: {}
              }
            ]
          },
          // readers: ['code_128_reader'],
          locate: true,
          src: URL.createObjectURL(file)
        },
        (result) => {
          // let code = result.codeResult.code
          console.log(result,result.codeResult);
          if(result.codeResult && result.codeResult.code){
            this.form.express_sn = result.codeResult.code;
          }
        }
      );
    },
    handleFileChange(evt) {
      const file = evt.target.files[0];
      this.decode(file);
    },

    // getQrUrl(file){
    //   const URi = window.webkitURL.createObjectURL(file) || window.URL.createObjectURL(file);
    //   const url = URi;
    //   const qr = new QrCode();
    //   return qr.decodeFromImage(url);
    // },
    // resolveQR(event){
    //   const result = this.getQrUrl(event);
    //   result.then(res=>{
    //     console.log(res);
    //     if(res.data){
    //       console.log(res.data);
    //       this.expressCode = res.data;
    //     }else {
    //       this.$toast("识别二维码失败");
    //     }
    //   }).catch(err=>{
    //     console.log(JSON.stringify(err));
    //   });
    // },
    companyConfirm(item) {
      this.expressName = item.name;
      this.expressCode = item.value;

      this.companyShow=false;
    },
    getExpressInfo() {
      var that = this;
      $http.get('dispatch.express-list', { "i": this.fun.getKeyByI(), "type": this.fun.getTyep() }).then(function (response) {

        if (response.result == 1) {


          console.log(response.data);
          var myData = response.data;
          that.express = myData.express_companies;

        }
      }, function (response) {
        // error callback
      });
    },
    submitInfo() {
      var that = this;
      console.log(this.form.express_company);
      $http.get('refund.operation.send', {
        refund_id: this.form.refund_id,
        express_sn: this.form.express_sn,
        images:this.expressImage,
        express_company_name: this.expressName,
        express_company_code: this.expressCode,
        "i": this.fun.getKeyByI(),
        "type": this.fun.getTyep()
      }, '正在提交申请').then(function (response) {
        if (response.result == 1) {
          that.$dialog.alert({message:response.msg}).then(()=>{
            that.$router.go(-1);
          });

        } else {
          that.$dialog.alert({message:response.msg});

        }
      }, function (response) {
        // error callback
      });

    }

  },
  activated() {
    this.toi = this.fun.getKeyByI();
    this.form.refund_id = this.$route.params.refund_id;
    this.getExpressInfo();

  },
  components: {cTitle,yz_uploader}
};

