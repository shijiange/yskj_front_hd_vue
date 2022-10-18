import lable from "./component/lable.vue";
import steps from "./component/steps.vue"
import { Toast , ImagePreview} from 'vant';
export default {
  data(){
    return {
      list:["订单提交","订单完成","开票完成"],
      isInvoicing:false,
      radio:"1",
      checked:true,
      data:{},
      active:1,
      show:false,
      email:"",
      invoiceDetails:{},
      has_one_order:{},
      goods:[],
      invoice_image:"",
      showInvoice_image:false
    }
  },
  created(){
    this.getData(this.$route.params.id)
  },
  methods:{
    get_invoice_type(type){
      // 发票类型代码：0-电子发票；1-普通发票；2-专用发票；
      switch (type) {
        case 0: return "电子发票";
        case 1: return "普通发票";
        case 2: return "专用发票";
        default: return "其他发票";
      }
    },
    getData(id){
      if (!id) {
        this.goBack();
        return
      }
      $http.get("plugin.invoice.frontend.index.details",{id},"正在加载中...").then(({result,msg,data})=>{
        if(result == 1){
          this.initData(data);
        } else Toast(msg)
      })
    // this.initData(data.data);
    },
    initData(data){
      if (data.event == 0) {
        this.list[1] = "订单付款"
      }
      this.invoiceDetails = data;
      this.goods = data.has_one_order.has_many_order_goods || [];
      this.has_one_order = data.has_one_order;
    },
    goBack(){
      history.go(-1);
    },
    sendEmail(){
      this.show = true;
    },
    send(){
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '正在发送中...',
        selector: '#custom-selector',
      })
      $http.post("plugin.invoice.frontend.index.go-email",{email:this.email,invoice_sn:this.invoiceDetails.invoice_sn}).then(({result,msg,data})=>{
        Toast.clear();
        this.show = false;
        if(result == 1)Toast.success(msg);
        else Toast(msg);
      })
    },
    preview(invoice_image){
      ImagePreview([invoice_image]);
    },
    downpdf({invoice_pdf}){
      try {
        let aTag = document.createElement("a");
        aTag.download = "发票" + ".pdf";
        aTag.href = invoice_pdf;
        document.body.append(aTag);
        aTag.click();
        Toast.success("下载成功")
      } catch (e) {
        Toast.fail("下载失败")
      }
    }
  },
  components:{
    item:lable,
    "actict-steps":steps
  }
}