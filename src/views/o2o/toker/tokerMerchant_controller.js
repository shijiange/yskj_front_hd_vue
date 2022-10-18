import cTitle from 'components/title';
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  data() {
    return {
      active: 0,
      asda: { asdasd: '111' },
      // onearr: [],
      // twoarr: [],
      info: [],
      id: '',
      many_form: [],
      once_form: '',
      member: [],
      order: [],
      card: [],
      checked: '',
      manyStatus: false,
      merchant: false,
      cheackSta:false,
      plugin_name:''
    };
  },
  activated() {
    let id = this.$route.params.id;
    this.id = id;
    this.merchant = false;
    this.getdata();
  },
  methods: {
    stepChange(ind, info) {
      let that = this;
      if(that.many_form.length > 0){
        for (let index = 0; index < this.many_form.length; index++) {
          if(this.many_form[index].id == info.id){
            this.many_form[index].num = info.num;
            console.log('勾选过当前的重新选添加一下数量');
          }else{
            console.log('没勾选过当前重新选添加一下数量');
            this.info.member_many[index].num = info.num;
          }
        }
        console.log(this.many_form,this.info.member_many);
      }else{
        console.log('没勾选');
        this.info.member_many[ind].num = info.num;
        console.log(this.info.member_many);
      }
      
    },
    manyChange(e, info) {
      if (info.checked) {
        this.manyStatus = true;
        let arr = {
          id: info.id,
          num: info.num
        };
        this.many_form.push(arr);
        console.log(this.many_form,'勾选的时候');
      }else{
        // this.many_form.splice(e,'1');
        for (let i = 0; i < this.many_form.length; i++) {
          if(this.many_form[i].id == info.id){
            console.log(i);
            this.many_form.splice(i,'1');
          }
        }
        console.log(this.many_form,'取消勾选的时候');
      }
    },
    onceChange(e) {
      if (e) {
        this.once_form = '1';
      } else {
        this.once_form = '';
      }
    },
    getdata() {
      var that = this;
      $http.get('plugin.customer-development.Frontend.controllers.write-off.store', { id: that.id }, '').then(response => {
        if (response.result === 1) {
          that.info = response.data.member_card;
          that.member = response.data.member_card.member;
          that.order = response.data.member_card.order;
          that.card = response.data.member_card.card.goods;
          that.plugin_name = response.data.plugin_name?response.data.plugin_name:'拓客卡';
          that.fun.setWXTitle(that.plugin_name?that.plugin_name:'拓客卡');
          let cheackSta = false;
          if (response.data.member_card.member_many.length > 0) {
            for (let i = 0; i < that.info.member_many.length; i++) {
              that.info.member_many[i].num = '1';
              that.$set(that.info.member_many[i], 'num', 1);
            }
            for (let j = 0; j < that.info.member_many.length; j++) {
              if(that.info.member_many[j].status == 1){
                cheackSta = true;
              }else if(that.info.member_many[j].status == 0){
                cheackSta = false;
                break; 
              }
            }
            console.log(cheackSta);
            that.cheackSta = cheackSta;
          }

        }else{
          Toast(response.msg);
          that.plugin_name = response.data.plugin_name?response.data.plugin_name:'拓客卡';
          that.fun.setWXTitle(that.plugin_name?that.plugin_name:'拓客卡');
        }
      });
    },
    submit() {
      if (this.fun.isTextEmpty(this.once_form) && !this.manyStatus) {
        Toast('请选择核销内容');
        return;
      }
      let that = this;
      Dialog.confirm({
        // title: '标题',
        message: '是否确认核销',
      })
        .then(() => {
          console.log('1111');
          that.submitGet();
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    submitGet() {
      let that = this;
      // var r = that.many_form.filter((s=>s));
      // console.log(r)
      let json = {
        id: that.id,
        once: that.once_form ? that.once_form : '',
        many: that.manyStatus ? that.many_form : ''
      };
      console.log(json);
      $http.post('plugin.customer-development.Frontend.controllers.write-off.store-handle', json, '').then(response => {
        if (response.result === 1) {
          console.log(response.data);
          Toast(response.msg);
          that.merchant = true;
        }else{
          Toast(response.msg);
        }
      });
    }
  },

  components: {
    cTitle
  }
};