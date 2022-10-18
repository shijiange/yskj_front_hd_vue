import cTitle from "components/title";
import { Toast } from "vant";
import yz_uploader from "components/ui_components/yz_uploader";
export default {
  data() {
    return {
      show: false,
      show1: true,
      checked: "1",
      fileList1: [],
      customText: "尺寸为正方形，未上传则默认图标",
      selectShow: false,
      actions: [
        { name: "固定金额红包", id: 0 },
        { name: "拼手气红包", id: 1 }
      ],
      redpackTypeTxt: "",
      redpack_date: {
        redpack_type: 1,
        number: "",
        // 红包总金额
        amount_total: "",
        title: "红包来袭~",
        thumb: [],
        // 是否显示只限团队成员可领取 . 1显示0不显示
        child_receive: 0,
        // 单个红包金额
        unit_amount: ""
      },
      // 红包时间
      valid_hours: "",
      balance: "",
      balance_name:'',
      // 是否需要密码
      need_password:false
    };
  },
  deactivated() {},
  activated() {
    this.init();
    this.reserve();
    this.balance_name = localStorage.getItem('balanceLang')?JSON.parse(localStorage.getItem('balanceLang')).balance:"余额";
  },
  methods: {
    init() {
      this.redpackTypeTxt = "拼手气红包";
      this.redpack_date.redpack_type = 1;
      this.redpack_date.number = "";
      this.redpack_date.amount_total = "";
      this.redpack_date.title = "红包来袭~";
      this.redpack_date.thumb = "";
      this.redpack_date.child_receive = 0;
      this.redpack_date.unit_amount = "";
    },
    checkSelect(e){
      if(e){
        this.redpack_date.child_receive = 1;
      }else{
        this.redpack_date.child_receive = 0;
      }
    },
    // 发红包
    tapRedbtn() {
      // console.log(this.redpack_date);
      this.redpackPost();
    },
    // 选择红包类型
    onSelect(e) {
      this.init();
      this.redpackTypeTxt = e.name;
      this.redpack_date.redpack_type = e.id;
    },
    // 固定红包总额 计算后传给接口
    totalInp() {
      if (this.redpack_date.redpack_type == 0) {
        if (!this.redpack_date.number) {
          return;
        }
        let count = (Number(this.redpack_date.unit_amount) * Number(this.redpack_date.number)).toFixed(2);
        this.redpack_date.amount_total = count;
        console.log(count);
      }
      console.log(this.redpack_date.unit_amount, this.redpack_date.number);
    },
    // 总红包金额
    unitInp() {
      if(this.fun.isTextEmpty(this.redpack_date.amount_total)){
        console.log(this.redpack_date.amount_total,'空就不处理了');
      } else {
        console.log(this.redpack_date.amount_total,'不空');
        this.redpack_date.amount_total = Number(this.redpack_date.amount_total).toFixed(2);
      }
    },
    numInp(e) {
      console.log(e);
      if (this.redpack_date.redpack_type == 0) {
        if (!this.redpack_date.unit_amount) {
          return;
        }
        this.redpack_date.amount_total = (Number(this.redpack_date.unit_amount) * Number(this.redpack_date.number)).toFixed(2);
      }
    },
    reserve() {
      $http
        .get("plugin.redpack-user.frontend.redpack.index", {}, "")
        .then(response => {
          if (response.result === 1) {
            this.valid_hours = response.data.valid_hours;
            this.child_receive = response.data.setting_child_receive;
            this.balance = response.data.balance;
            this.need_password = response.data.need_password;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    redpackPost() {
      if (this.fun.isTextEmpty(this.redpack_date.number)) {
        Toast("请输入红包个数");
        return;
      }

      if (this.fun.isTextEmpty(this.redpack_date.amount_total)) {
        // 拼手气必填红包总额
        if (this.redpack_date.redpack_type == 1) {
          Toast("请输入红包总额");
          return;
        } else if (this.redpack_date.redpack_type == 0) {
          // 固定必填单个红包金额
          Toast("请输入单个红包金额");
          return;
        }
      }
      // if (this.fun.isTextEmpty(this.redpack_date.title)) {
      //   Toast("请输入红包名称");
      //   return;
      // }
      console.log(this.redpack_date);
      if (this.fun.isTextEmpty(this.redpack_date.thumb) || this.redpack_date.thumb.length == 0) {
        this.redpack_date.thumb = "";
      } else {
        this.redpack_date.thumb = String(this.redpack_date.thumb);
      }
      let info = JSON.stringify(this.redpack_date);
      let member = {
        balance: this.balance,
        need_password:this.need_password
      };
      member = JSON.stringify(member);
      this.$router.push(this.fun.getUrl("personRedPay", { json: info, lis: member }));
    }
  },
  components: { cTitle, yz_uploader }
};
