import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      dowm: "",
      previewUrl:"",
      list: [],
      show1: false,
      //order_id: "",
      invoice_status: "",  //开票状态
      //invoice_title:"",
      invoice_type: "",    //"电子普通发票"
      call: "",           //抬头名称
      order_number: "",   //订单编号
      rise_type: "",      //抬头类型
      phone: "",          //手机号
      company_number:"",  //纳税人识别号 
      invoice_time:"",    //开票时间
      apply_time:"",      //申请时间
      invoice_price:""    //开票金额
    };
  },
  mounted() {
    this.getInvoiceDet();
    this.initDownload();
  },
  methods: {
    checkInvoice() {
      $http
        .get(
          "order.rise.get-invoice",
          {
            order_id:this.$route.params.order_id
          },
          "加载中.."
        )
        .then(res => {
          if (res.result === 1) {
            this.list = [];
            this.list.push(res.data.previewUrl); 
            this.show1 = true;
          }else{
            this.$dialog.alert('预览失败！');
          } 
        });
    },
    initDownload() {
      let that = this;
      $http
        .get(
          "order.rise.get-invoice",
          {
            order_id:this.$route.params.order_id
          },
          "加载中.."
        )
        .then(res => {
          if (res.result == 1) { 
             this.dowm = res.data.invoice;  //下载地址            
             this.previewUrl = res.data.previewUrl;  //预览地址                
            /*let url = this.dowm.split('.');
            if(url[url.length-1] == 'pt') {
              let str = that.dowm.slice(0,5);
             
              if(str=='https') {
                that.is_pdf = 3;
              }
              else {
                that.is_pdf = 2;
              }
            }
            else {
              this.is_pdf = false;
            }*/
          }
        });
    },
    getInvoiceDet() {
      $http
        .get(
          "order.detail",
          {
            order_id: this.$route.params.order_id
          },
          "加载中..."
        )
        .then(res => {
          if (res.result == 1) {
            this.invoice_type ="电子普通发票";

            if( res.data.state == 1){
              this.invoice_status = "已开票";
            }else if(res.data.state == 2){
              this.invoice_status = "开票中";
            }else if(res.data.state == 3){
              this.invoice_status = "开票失败";
            }

           //this.invoice_title = res.data.call;
            this.order_number = res.data.order_sn;
            this.call = res.data.collect_name;
            this.phone = res.data.phone;
             
            if(res.data.rise_type == 0){
               this.rise_type = "单位";
            }else{
               this.rise_type = "个人";
            }
            
            this.invoice_time = res.data.invoice_time;
            this.apply_time = res.data.apply_time;  
            this.company_number = res.data.company_number;  //纳税人识别号  
            this.invoice_price = res.data.invoice_price;
          }
        });
    },
    // 去掉下载发票按钮
    // exportData() {
    //   if (!this.dowm) {
    //     Toast("访问链接不存在");
    //     return false;
    //   }
    //   //注释掉 time:19-10-08 原因：莫名跳转到下面图片链接地址，不明需求
    //   // location.href = "https://saas.ytbaina.com/attachment/images/73/2019/05/oBX1dxXd1MXthBxxBXl5dHt11jhkK4.jpg";
    // }
  },
  components: {
    cTitle
  }
};
