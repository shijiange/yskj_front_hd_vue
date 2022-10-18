/**
 * @file
 * Created by liang into on 19/10/30.
 */

import BlockChain from "./blockchain";
// 根目录
const rootPath = "";
const conferenceList = r => require.ensure([], () => r(require("@/views/conference/home")), "conferenceList");
const activity = r => require(["../views/conference/activity"], r);
const MyActivityInfo = r => require(["../views/conference/my_activity_info"], r);
const conferenceSign = r => require(["../views/conference/conferenceSign"], r);
const ActivityTaskList = r => require(["../views/conference/activity_task_list"], r);

const userAgreement = r => require(["../views/member/user_agreement"], r);

const goodsGroup = r => require(["../views/goods/goodsGroup"], r);

// 案例库
const caseLibrary = r => require(["../views/others/case_library/case_library"], r);
const caseLibraryHome = r => require(["../views/others/case_library/home"], r);
const caseLibraryCategory = r => require(["../views/others/case_library/category"], r);
const caseLibraryLabel = r => require(["../views/others/case_library/label"], r);
const caseLibrarySubjectList = r => require(["../views/others/case_library/subject_list"], r);
const caseLibrarySubjectDetail = r => require(["../views/others/case_library/subject_detail"], r);
const caseLibraryDetail = r => require(["../views/others/case_library/case_detail"], r);
const caseLibraryMypublish = r => require(["../views/others/case_library/label"], r);
const caseLibraryNewMobile = r => require(["../views/others/case_library/new_mobile"], r);
const caseLibraryAreaMobile = r => require(["../views/others/case_library/new_mobile"], r);
const caseLibraryRankingMobile = r => require(["../views/others/case_library/ranking_mobile"], r);
// 应用市场
const applicationMarket = r => require(["../views/others/application_market/application_market"], r);
const bindingSite = r => require(["../views/others/application_market/binding_site"], r);
const changeSite = r => require(["../views/others/application_market/change_site"], r);

const o2oHome = r => require(["../views/o2o/home"], r);
const o2oStore = r => require(["../views/o2o/store/store"], r);
const o2oStore_v2 = r => require(["../views/o2o/store/store_v2"], r);
const o2oLocation = r => require(["../views/o2o/location/home"], r);
const o2oLocation_loc = r => require(["../views/o2o/location/location"], r);
const o2oCity = r => require(["../views/o2o/location/city"], r);
const o2oSearch = r => require(["../views/o2o/search"], r);
const o2oSearchMultiple = r => require(["../views/o2o/search_multiple"], r);
const o2oCategory = r => require(["../views/o2o/category"], r);
const StoreApply = r => require(["../views/o2o/store/store_apply"], r);
const StoreWithdrawals = r => require(["../views/o2o/store/withdrawals"], r);
const StoreManage = r => require(["../views/o2o/store_manage"], r);
const StoreSearch = r => require(["../views/o2o/store/store_search"], r);
//门店拼团
const o2oGroupActivitylist = r => require(["../views/o2o/o2oGroup/o2oGroup_activitylist"], r);
const openGroupList = r => require(["../views/o2o/o2oGroup/open_group_list"], r);
const openGroupDetail = r => require(["../views/o2o/o2oGroup/openGroup_detail"], r);
const groupDataStatistics = r => require(["../views/o2o/o2oGroup/groupDataStatistics"], r);
const createGroup = r => require(["../views/o2o/o2oGroup/createGroup"], r);

const qrCode = r => require(["../views/o2o/qr_code"], r);
const collectionCode = r => require(["../views/o2o/collectionCode"], r);
const o2oGrouplist = r => require(["../views/o2o/o2o_grouplist"], r);
// const privacy = r => require(["../views/o2o/privacy"], r);
const cloudHorn = r => require(["../views/o2o/cloud_horn"], r);
const zkzDevice = r => require(["../views/o2o/zkzDevice"], r);

const Home = r => require(["../views/home/home"], r);
const Category = r => require(["../views/category/category"], r);
const CategoryChild = r => require(["../views/category/category_child"], r);
const Catelist = r => require(["../views/category/catelist"], r);
const Brand = r => require(["../views/category/brand"], r);
const BrandGoods = r => require(["../views/category/brandgoods"], r);
const Cart = r => require(["../views/cart/cart"], r);
const CartShare = r => require(["../views/cart/cart_share"], r);
const Settlement = r => require(["../views/cart/settlement"], r);
const Diy = r => require(["../views/diy"], r);
const newDiy = r => require(["../views/new_diy"], r);
const Share = r => require(["../views/home/share"], r);
const CloseSite = r => require(["../views/close_site"], r);
const DiyForm = r => require(["../views/diy_form"], r);
const LimitedTimeGoods = r => require(["../views/home/limited_time_goods"], r);
// 收银台
const cashier = r => require(["../views/cashier/cashier"], r);
const cashier_pay = r => require(["../views/cashier/pay"], r);
const cashier_qr = r => require(["../views/cashier/qrcode"], r);
const cashier_withdrawals = r => require(["../views/cashier/withdrawals"], r);
const cashier_stat = r => require(["../views/cashier/stat"], r);
const show_balances = r => require(["../views/cashier/showBalances"], r);
const cashier_income = r => require(["../views/cashier/income"], r);
// article
const Notice = r => require(["../views/article/notice"], r);
const ArticleContent = r => require(["../views/article/articleContent"], r);
const NoticeByCategory = r => require(["../views/article/notice_by_category"], r);
const NoticeReport = r => require(["../views/article/notice_report"], r);
const payList = r => require(["../views/article/pay_list"], r);
const payEssay = r => require(["../views/article/pay_essay"], r);
// 期刊杂志
const periodicalIndex = r => require(["../views/article/periodicalIndex"], r);
const periodicalDetail = r => require(["../views/article/periodicalDetail"], r);
const periodicalWatch = r => require(["../views/article/periodicalWatch"], r);

// Member
const MemberBank = r => require(["../views/member/bank/bank_info"], r);
const BankCard = r => require(["../views/member/bank/bankCard"], r);
const Member = r => require(["../views/member/member"], r);
const MemberAvatar = r => require(["../views/member/member_avatar"], r);
const changeMemberAvatar = r => require(["../views/member/change_member_avatar"], r);
const morePlugins = r => require(["../views/member/plugins_page"], r);
// const Po = r => require(['../views/member/po'], r)
// const Tabs = r => require(['../views/member/tabs'], r)
const Info = r => require(["../views/member/info/info_v2"], r);
const Editmobile = r => require(["../views/member/info/member_editmobile_v2"], r);
const WithdrawEditmobile = r => require(["../views/member/info/member_withdraw_editmobile"], r);
const scanEditmobile = r => require(["../views/member/info/scan_editmobile"], r);
const codePage = r => require(["../views/member/tool/code_page"], r);
// //visit
// const Visit = r => require(['../views/member/visit/Visit'], r)

const AlterAddress = r => require(["../views/member/address/alterAddress_v2"], r);
// const AppendAddress = r => require(['../views/member/address/appendAddress'], r)
const AppendAddress = r => require(["../views/member/address/appendAddress_v2"], r);
const Balance = r => require(["../views/member/balance/member_balance"], r);
const Integral = r => require(["../views/member/integral/member_integral"], r);
const IntegralV2 = r => require(["../views/member/integral_v2/member_integral_v2"], r);
const IntegralV2Transfer = r => require(["../views/member/integral_v2/member_integral_v2_transfer"], r);
const InfoCostom = r => require(["../views/member/info/info_custom"], r);
const BalancePassword = r => require(["../views/member/info/balance_password_v2"], r);
const SetBalancePassword = r => require(["../views/member/info/set_balance_password_v2"], r);
const MemberCancel = r => require(["../views/member/info/member_cancel"], r);
const MemberCancelContent = r => require(["../views/member/info/member_cancel_content"], r);

// score
const IntegralActivity = r => require(["../views/member/score/integral_activity"], r);
const IntegralGeneralization = r => require(["../views/member/score/integral_generalization"], r);
const IntegralGetRecord = r => require(["../views/member/score/integral_get_record"], r);
const IntegralPresent = r => require(["../views/member/score/integral_present"], r);
const IntegralRecord = r => require(["../views/member/score/integral_record"], r);

// sign
const Sign = r => require(["../views/member/sign/member_sign"], r);
const Signrules = r => require(["../views/member/sign/member_signrules"], r);
const Signrecord = r => require(["../views/member/sign/member_signrecord"], r);

// member_integraldetailed
const Integraldetail = r => require(["../views/member/integral/member_integraldetailed"], r);
const IntegralList = r => require(["../views/member/integral/member_integrallist"], r);
const Balance_recharge = r => require(["../views/member/balance/member_balance_recharge"], r);
// 门店独立余额充值
const storeBalance = r => require(["../views/member/balance/member_balance_recharge_store"], r);
const Balance_transfer = r => require(["../views/member/balance/member_balance_transfer"], r);
const Balance_withdrawals = r => require(["../views/member/balance/member_balance_withdrawals"], r);
const cmcPayInfo = r => require(["../views/member/balance/cmcPayInfo"], r);
// 保单管理
const Balance_manage = r => require(["../views/member/balance/member_balance_manage"], r);
// 保单管理的详情
const Balance_manageDetail = r => require(["../views/member/balance/member_balance_manageDetail"], r);
// 保单添加
const Add_Balance_manage = r => require(["../views/member/balance/add_member_balance"], r);
// 编辑保单
const Edit_Balance_manage = r => require(["../views/member/balance/edit_member_balance"], r);
const Detailed = r => require(["../views/member/balance/member_balance_detailed"], r);
// 保单支付
const policyPay = r => require(["../views/member/balance/policy_pay"], r);
// const Screen = r => require(['../views/member/balance/member_balance_screen'], r);
const Details = r => require(["../views/member/balance/member_balance_details"], r);
// const Income = r => require(['../views/member/income/member_income'], r)
// const Withdrawal = r => require(["../views/member/income/member_income_withdrawal"], r);
const Withdrawal = r => require(["../views/member/income/member_income_withdrawal_v2"], r);
const Incomedetails = r => require(["../views/member/income/member_income_incomedetails"], r);
const IncomedetailsInfo = r => require(["../views/member/income/member_income_incomedetails_info"], r);
const PresentationRecord = r => require(["../views/member/income/member_income_presentationRecord"], r);
const PresentationDetails = r => require(["../views/member/income/member_income_presentationRecord_presentationDetails"], r);
const Supplier = r => require(["../views/member/supplier/supplier"], r);
const CreditInfo = r => require(["../views/member/credit/credit_info"], r);
const CommodityManagement = r => require(["../views/member/supplier/commodity_management/management"], r);
const CommodityEditor = r => require(["../views/member/supplier/commodity_management/editor"], r);
const CommodityRelease = r => require(["../views/member/supplier/commodity_management/release"], r);

const CommodityCoupon = r => require(["../views/member/supplier/commodity_coupon/management"], r);
const CommodityCouponEdit = r => require(["../views/member/supplier/commodity_coupon/edit"], r);
const CommodityCouponGive = r => require(["../views/member/supplier/commodity_coupon/give_out"], r);

const GoodsClassify = r => require(["../views/member/supplier/classify/goods_classify"], r);
const AddClassify = r => require(["../views/member/supplier/classify/add_classify"], r);
const FirstEdit = r => require(["../views/member/supplier/classify/first_edit"], r);

const Income = r => require(["../views/member/income/member_income_v2"], r);

const Message = r => require(["../views/member/message_list"], r);
const MessageInfo = r => require(["../views/member/message_info"], r);

// order
// order_after_express_info
const OrderExpress = r => require(["../views/member/order/order_after_express_info"], r);
const OrderList = r => require(["../views/member/order/order_list"], r);
const Goodsinfo = r => require(["../views/member/order/order_detail"], r);
const Refund = r => require(["../views/member/order/order_list_refund"], r);
const Logistics = r => require(["../views/member/order/order_list_logistics"], r);
const track = r => require(["../views/member/order/order_list_track"], r);
const Evaluate = r => require(["../views/comment/evaluate"], r);
const ReplyEvaluate = r => require(["../views/member/order/order_list_replyEvaluate"], r);
const Addevaluate = r => require(["../views/comment/addevaluate"], r);
const Aftersales = r => require(["../views/member/order/order_aftersales"], r);
const Aftersaleslist = r => require(["../views/member/order/order_aftersaleslist"], r);
const OrderPay = r => require(["../views/member/order/order_payment"], r);
const OrderVerification = r => require(["../views/member/order/order_verification"], r);
const OrderCash = r => require(["../views/member/order/order_cash"], r);
const OrderRecord = r => require(["../views/member/order/order_record"], r);
const NegotiationRecord = r => require(["../views/member/order/negotiation_record"], r);

const PayErr = r => require(["../views/member/order/order_payErr"], r);
const PayYes = r => require(["../views/member/order/order_payYes"], r);
const Blacklist = r => require(["../views/member/order/order_blacklist"], r);
const Mandate = r => require(["../views/member/order/order_mandate"], r);

//同城配送物流详情
const OrderLogisticsDetails = r => require(["../views/member/order/order_logistics_details"], r);

// Extension
const Manage = r => require(["../views/extension/manage"], r);
const Extension = r => require.ensure([], () => r(require("@/views/extension/index")), "Extension");
const Distribution = r => require(["../views/extension/distribution"], r);
const Commission = r => require(["../views/extension/commission"], r);
const CommissionDetails = r => require(["../views/extension/commissionDetails"], r);
const Unsettled = r => require(["../views/extension/unsettled"], r);
const UnsettledDetails = r => require(["../views/extension/unsettledDetails"], r);
const AlreadySettled = r => require(["../views/extension/alreadySettled"], r);
const AlreadySettledDetails = r => require(["../views/extension/alreadySettledDetails"], r);
const NotPresent = r => require(["../views/extension/notPresent"], r);
const NotPresentDetails = r => require(["../views/extension/notPresentDetails"], r);
const Present = r => require(["../views/extension/present"], r);
const PresentDetails = r => require(["../views/extension/presentDetails"], r);
const DistributionOrder = r => require(["../views/extension/distributionOrder"], r);

const AwardRanking = r => require(["../views/extension/spread/awardRanking"], r);
const ExtensionPage = r => require(["../views/extension/spread/extension"], r);
const RecordOfAwards = r => require(["../views/extension/spread/recordOfAwards"], r);
const MyIncome = r => require(["../views/extension/spread/my_income"], r);
const myEarnings = r => require(["../views/extension/spread/my_earnings"], r);
const earningList = r => require(["../views/extension/spread/earning_list"], r);

const stockholderBonus = r => require(["../views/extension/stockholder-bonus/stockholder_bonus"], r);
const point_activity_award_center = r => require(["../views/extension/pointActivityAwardCenter"], r);
const rightsInterests = r => require(["../views/extension/rightsInterests"], r);

//区域选择
const Selectionarea = r => require(["../views/regionalmanage/selectionarea"], r);
//区域分红
const Regionaldividend = r => require(["../views/regionalmanage/regionaldividend"], r);
//区域分红详情
const Detailsdividends = r => require(["../views/regionalmanage/detailsdividends"], r);
// plug
// const Marketing = r => require(['../views/member/plug/marketing'], r)
// const MessageSettings = r => require(['../views/member/plug/messageSettings'], r)
// income
const DistributionCommission = r => require(["../views/member/income/distributionCommission"], r);
const ExtendIncome = r => require(["../views/member/income/extendIncome"], r); // new
const MerchantsDividendRatio = r => require(["../views/member/income/merchants/merchants_dividend_ratio"], r);
const ShareholderCenter = r => require(["../views/member/income/shareholderCenter/shareholderCenter"], r);
const TeamAgentCenter = r => require(["../views/member/income/teamAgentCenter/teamAgentCenter"], r);
const newAgentCenter = r => require(["../views/member/income/teamAgentCenter/newAgentCenter"], r);
const TeamPerformance = r => require(["../views/member/income/teamAgentCenter/teamPerformance"], r);
const newTeamPerformance = r => require(["../views/member/income/teamAgentCenter/newteamPerformance"], r);
const TeamCode = r => require(["../views/member/income/teamAgentCenter/teamCode"], r);
const newTeamCode = r => require(["../views/member/income/teamAgentCenter/newteamCode"], r);
const TeamClient = r => require(["../views/member/income/teamAgentCenter/teamClient"], r);
const newTeamClient = r => require(["../views/member/income/teamAgentCenter/newteamClient"], r);
const CodeHistory = r => require(["../views/member/income/teamAgentCenter/codeHistory"], r);
const newCodeHistory = r => require(["../views/member/income/teamAgentCenter/newcodeHistory"], r);
const InvestmentCenter = r => require(["../views/member/income/investmentCenter/investmentCenter"], r);
const RegionalAgencyCenter = r => require(["../views/member/income/regionalAgencyCenter/regionalAgencyCenter"], r);
const ApplyRegionalAgency = r => require(["../views/member/income/regionalAgencyCenter/applyRegionalAgency"], r);
const FixedReward = r => require(["../views/member/income/fixedReward/fixed_reward"], r);
const CourseIncome = r => require(["../views/member/income/course/index"], r);
const Helpcenter = r => require(["../views/member/helpcenter"], r);

// 经销商红包奖励
const FranchiserRed = r => require(["../views/member/income/teamAgentCenter/franchiser_red"], r);
const newFranchiserRed = r => require(["../views/member/income/teamAgentCenter/newfranchiser_red"], r);
const RedReward = r => require(["../views/member/income/red_reward"], r);

//每日红包
const DailyRed = r => require(["../views/others/daily_red/daily_red"], r);
const GetRedRecord = r => require(["../views/others/daily_red/get_red_record"], r);
const RedAmount = r => require(["../views/others/daily_red/red_amount"], r);
const redRank = r => require(["../views/others/daily_red/redRank"], r);
// 每日红包二开
const DailyRedHome = r => require(["../views/others/daily_red/daily_red_home"], r);

// microshop
const MicroShop_apply = r => require(["../views/member/microshop/microShop_apply.vue"], r);
const MicroShop_apply_reg_info = r => require(["../views/member/microshop/microShop_apply_reg_info.vue"], r);
const MicroShop_baseInfo = r => require(["../views/member/microshop/baseInfo.vue"], r);
const MicroShop_Category = r => require(["../views/member/microshop/category/category.vue"], r);
const Catelist1 = r => require(["../views/member/microshop/category/catelist.vue"], r);
const MicroShop_home = r => require(["../views/member/microshop/home/home"], r);
const MicroShop_ShopKeeperCenter = r => require(["../views/member/microshop/shopKeeperCenter"], r);
const MicroShop_orderDetail = r => require(["../views/member/microshop/orderDetail"], r);
const MicroShop_shareList = r => require(["../views/member/microshop/shareList.vue"], r);
const MicroShop_shareDetail = r => require(["../views/member/microshop/shareDetail"], r);
const MicroShop_selectedGoods = r => require(["../views/member/microshop/selectedGoods"], r);
// microshop 分享出去的模块
const MicroShop_Share_home = r => require(["../views/member/microshop/microshophome/micros_shop_home"], r);
const MicroShop_ShareCategory = r => require(["../views/member/microshop/categoryshare/category"], r);
// 添加商品的分类
const ManageShop = r => require(["../views/member/microshop/manage_shop"], r);
const MicroShop_AddCategory = r => require(["../views/member/microshop/category_add/category"], r);
const CatelistShare = r => require(["../views/member/microshop/categoryshare/catelist.vue"], r);

// love 爱心值
const Love_index = r => require(["../views/love/love_index"], r);
const Love_list = r => require(["../views/love/love_list"], r);
const Love_transfer = r => require(["../views/love/love_transfer"], r);
const Love_trading_sell = r => require(["../views/love/love_trading_sell"], r);
const Love_trading = r => require(["../views/love/love_trading"], r);
const Love_changein = r => require(["../views/love/love_changein"], r);
const Love_changeto = r => require(["../views/love/love_changeto"], r);
const Love_give = r => require(["../views/love/love_give"], r);
const Love_agent = r => require(["../views/love/love_agent"], r);
const Love_push = r => require(["../views/love/love_push"], r);
const Love_cash = r => require(["../views/love/love_cash"], r);
const Love_record = r => require(["../views/love/love_record"], r);
const Love_details = r => require(["../views/love/love_details"], r);
const Love_activation = r => require(["../views/love/love_activation"], r);
const Love_explain = r => require(["../views/love/love_explain"], r);
const LoveWithdrawals = r => require(["../views/love/love_withdrawals"], r);
const lovePeriod = r => require(["../views/love/love_period/love_period"], r);
const lovePerformance = r => require(["../views/love/love_performance/love_performance"], r);
const LoveGiftBag = r => require(["../views/love/love_gift_bag"], r);
const LoveCycleReceive = r => require(["../views/love/love_cycle_receive"], r);
const LoveCashbackRecord = r => require(["../views/love/love_cashback_record"], r);
const LoveGiftQueue = r => require(["../views/love/love_gift_queue"], r);
const Love_Speed_Released = r => require(["../views/love/love_speed_released/love_speed_released"], r);
// 消费积分-爱心值
const Integral_love = r => require(["../views/love/integral_love/integral_love"], r);
const Integral_invest = r => require(["../views/love/integral_love/Integral_love_invest"], r);
const Integral_love_detail = r => require(["../views/love/integral_love/Integral_love_detail"], r);
const Integral_love_transfer = r => require(["../views/love/integral_love/Integral_love_transfer"], r);
const Integral_love_cash = r => require(["../views/love/integral_love/Integral_love_cash"], r);
const Integral_change = r => require(["../views/love/integral_love/Integral_love_change"], r);
// 华侨币 overseas
const Overseas_index = r => require(["../views/overseas/overseas_index"], r);
const Overseas_explain = r => require(["../views/overseas/overseas_explain"], r);
const Overseas_transfer = r => require(["../views/overseas/overseas_transfer"], r);
const Overseas_record = r => require(["../views/overseas/overseas_record"], r);
const Overseas_list = r => require(["../views/overseas/overseas_list"], r);
const Overseas_balance_withdrawals = r => require(["../views/overseas/overseas_balance_withdrawals"], r);

//  爱心币，信用值
const CreditValeuIndex = r => require(["../views/love/credit_value/credit_value_index"], r);
const CreditRecharge = r => require(["../views/love/credit_value/recharge.vue"], r);
const CreditGive = r => require(["../views/love/credit_value/give.vue"], r);
const ActivateHistory = r => require(["../views/love/credit_value/activate_history.vue"], r);
const GiveHistory = r => require(["../views/love/credit_value/give_history.vue"], r);
const ViewDetails = r => require(["../views/love/credit_value/view_details.vue"], r);

// tool
const Footprint = r => require(["../views/member/tool/footprint"], r);
const Collection = r => require(["../views/member/tool/collection"], r);
const MyRelationship = r => require(["../views/member/tool/my_relationship_v2"], r);
const MyRelationshipAmount = r => require(["../views/member/tool/my_relationship_amount"], r);
const MyRelationshipDetail = r => require(["../views/member/tool/my_relationship_detail"], r);
const OfflineSearch = r => require(["../views/member/tool/search"], r);
const MyEvaluation = r => require(["../views/comment/myEvaluation"], r);
const Comment = r => require(["../views/member/tool/comment"], r);
const EvaluationDetails = r => require(["../views/member/tool/evaluationDetails"], r);
// 我的朋友
const MyFriendApply = r => require(["../views/member/tool/my_friends"], r);

// 兑换中心
const CouponExchange = r => require(["../views/member/coupon_exchange/index"], r);

// Other
const Address = r => require(["../views/member/address/addresslist_v2"], r);
const Search = r => require(["../views/search"], r);
const ActSearch = r => require(["../views/act_search"], r);
const SearchAll = r => require(["../views/searchall"], r);
// const Goods = r => require(['../views/goods/goods'], r)
const Goods = r => require(["../views/goods/goods_v2"], r);
const GoodsComment = r => require(["../components/goods/children/commentList"], r);
const PackageGoods = r => require(["../views/goods/package_goods"], r);

const GoodsO2O = r => require(["../views/goods/goods_v2"], r);
const GoodsOrder = r => require(["../views/goods/goods_order"], r);
const GoodsOrderDiyForm = r => require(["../views/goods/diyFormPage"], r);
const Goodstabs = r => require(["../views/goods/goodstabs"], r);
const Login = r => require.ensure([], () => r(require("@/views/login/login.vue")), "Login");
const Register = r => require(["../views/register/register_v2"], r);
const haifenRegister = r => require(["../views/register/haifen_register"], r);
const RegisterAgreement = r => require(["../views/register/register_agreement"], r);
const Findpwd = r => require(["../views/register/findpwd"], r);
const RegisterGuide = r => require(["../views/register/guide"], r);

const NotFound = r => require(["../views/notfound"], r);
// alipay_detail.vue
const Alipay = r => require(["../views/member/pay/alipay_detail"], r);
const AlipayClockin = r => require(["../views/member/pay/alipay_detail"], r);

//微信支付中间页
const Wxpay = r => require(["../views/member/pay/wxpay_detail"], r);

// Coupon
const Coupon = r => require(["../views/coupon/coupon_index"], r);
const CouponStore = r => require(["../views/coupon/coupon_store"], r);
const CouponIndependent = r => require(["../views/coupon/coupon_independent_share"], r);
const CouponInfo = r => require(["../views/coupon/coupon_info"], r);
const CouponShareCode = r => require(["../views/coupon/coupon_share_code"], r);
const CouponShareShow = r => require(["../views/coupon/shareShow"], r);
const CouponShareGet = r => require(["../views/coupon/shareGet"], r);
const CouponCheckList = r => require(["../views/coupon/checkList"], r);
const get_coupon_from = r => require(["../views/coupon/get_coupon_from"], r);
// Coupon-share
const CouponShare = r => require(["../views/coupon/coupon_share"], r);
const getCoupon = r => require(["../views/coupon/get_coupon"], r);
// Coupon_details
const coupon_v2_detail = r => require(["../views/coupon/coupon_v2_detail"], r);

// comment
const CommentDetails = r => require(["../views/comment/CommentDetails"], r);
const ReCommentDetails = r => require(["../views/comment/ReCommentDetails"], r);
const OtherCommentDetails = r => require(["../views/comment/OtherCommentDetails"], r);

// service
const Service = r => require(["../views/member/service/service"], r);
const ServiceOrderList = r => require(["../views/member/service/order/order_list"], r);
// phone
const PhoneRecharge = r => require(["../views/member/service/phone/phoneRecharge"], r);
const MobileBinding = r => require(["../views/member/service/phone/mobileBinding"], r);
const RechargePay = r => require(["../views/member/service/phone/rechargePay"], r);
const OrderDetailsPaied = r => require(["../views/member/service/phone/orderDetailsPaied"], r);
const OrderDetailsNoPay = r => require(["../views/member/service/phone/orderDetailsNoPay"], r);
const RechargeRecord = r => require(["../views/member/service/phone/rechargeRecord"], r);
const FlowRechargeRecord = r => require(["../views/member/service/phone/flowRechargeRecord"], r);
const RechargeDetail = r => require(["../views/member/service/phone/rechargeDetail"], r);
const FlowRechargeDetail = r => require(["../views/member/service/phone/flowRechargeDetail"], r);
// oilCard
const AddCard = r => require(["../views/member/service/oilCard/addCard"], r);
const CardServer = r => require(["../views/member/service/oilCard/cardServer"], r);
const OilNoPay = r => require(["../views/member/service/oilCard/oilNoPay"], r);
const OilDetailsPaied = r => require(["../views/member/service/oilCard/oilDetailsPaied"], r);
const OilRecharge = r => require(["../views/member/service/oilCard/oilRecharge"], r);
const OilRechargePay = r => require(["../views/member/service/oilCard/oilRecharge_pay"], r);
// ticket 机票
const Ticket = r => require(["../views/member/service/ticket/index"], r);
const City = r => require(["../views/member/service/ticket/city"], r);
const TicketOrder = r => require(["../views/member/service/ticket/ticketOrder"], r);
const SearchResults = r => require(["../views/member/service/ticket/searchResults"], r);
const FlightPrice = r => require(["../views/member/service/ticket/flightPrice"], r);
const NewAddPassenger = r => require(["../views/member/service/ticket/newAddPassenger"], r);
const ModifyContacts = r => require(["../views/member/service/ticket/modifyContacts"], r);

const AddOrder = r => require(["../views/member/service/ticket/addOrder"], r);
const RefundApplication = r => require(["../views/member/service/ticket/refundApplication"], r);
const TicketOrderDetail = r => require(["../views/member/service/ticket/ticketOrderDetail"], r);
const ChangeAgreement = r => require(["../views/member/service/ticket/changeAgreement"], r);
const Ticket_pay = r => require(["../views/member/service/ticket/ticket_pay"], r);

// Game
const GameSearch = r => require(["../views/member/service/game/gameSearch"], r);
const GameIsPay = r => require(["../views/member/service/game/gameIsPay"], r);
const GameNoPay = r => require(["../views/member/service/game/gameNoPay"], r);
const GameFlingRecharge = r => require(["../views/member/service/game/gameFlingRecharge"], r);
const GamePasswordRecharge = r => require(["../views/member/service/game/gamePasswordRecharge"], r);

// newService
const LifeService = r => require(["../views/member/service/lifeService"], r);
const Telephone = r => require(["../views/member/service/telephone/telephone"], r);
const Flow = r => require(["../views/member/service/flow/flow"], r);
// lifePayment
const Electricity = r => require(["../views/member/service/lifePayment/electricity"], r);
const ElectricityPay = r => require(["../views/member/service/lifePayment/electricity_pay"], r);
const WaterFee = r => require(["../views/member/service/lifePayment/waterFee"], r);
const WaterFeePay = r => require(["../views/member/service/lifePayment/waterFee_pay"], r);
const FixedTelephone = r => require(["../views/member/service/lifePayment/fixedTelephone"], r);
const FixedTelephonePay = r => require(["../views/member/service/lifePayment/fixedTelephone_pay"], r);

const Broadband = r => require(["../views/member/service/lifePayment/broadband"], r);
const BroadbandPay = r => require(["../views/member/service/lifePayment/broadband_pay"], r);
const GasCosts = r => require(["../views/member/service/lifePayment/gasCosts"], r);

const LifePayNoPay = r => require(["../views/member/service/lifePayment/lifePayNoPay"], r);
const LifePayIsPaied = r => require(["../views/member/service/lifePayment/lifePayIsPaied"], r);
const LifePayIndex = r => require(["../views/member/service/lifePayment/lifePayIndex"], r);
const PaymentRecord = r => require(["../views/member/service/lifePayment/paymentRecord"], r);

// 交通罚款
const TrafficIndex = r => require(["../views/member/service/trafficFine/trafficIndex"], r);
const TrafficConfirmOrder = r => require(["../views/member/service/trafficFine/trafficConfirmOrder"], r);
const TrafficCity = r => require(["../views/member/service/trafficFine/trafficCity"], r);
const TrafficRecord = r => require(["../views/member/service/trafficFine/trafficRecord"], r);
const TrafficOrderNoPay = r => require(["../views/member/service/trafficFine/trafficOrderNoPay"], r);
const TrafficOrderlsPaied = r => require(["../views/member/service/trafficFine/trafficOrderlsPaied"], r);
// 火车票
const TrainTicket = r => require(["../views/member/service/trainTicket/trainTicket"], r);
const TrainTicketOrder = r => require(["../views/member/service/trainTicket/trainTicketOrder"], r);
const TrainCity = r => require(["../views/member/service/trainTicket/trainCity"], r);
const TrainSearchResults = r => require(["../views/member/service/trainTicket/trainSearchResults"], r);
const TrainFlightPrice = r => require(["../views/member/service/trainTicket/trainFlightPrice"], r);
const TrainAddOrder = r => require(["../views/member/service/trainTicket/trainAddOrder"], r);
const TrainOrderDetail = r => require(["../views/member/service/trainTicket/trainOrderDetail"], r);
const TrainRefundApplication = r => require(["../views/member/service/trainTicket/trainRefundApplication"], r);
const Policy = r => require(["../views/member/service/trainTicket/policy"], r);
const TrainPay = r => require(["../views/member/service/trainTicket/train_pay"], r);

//代理商分红
const AgentBonus = r => require(["../views/extension/agency-bonus/agent_bonus"], r);
const GroupOrder = r => require(["../views/extension/agency-bonus/group_orders"], r);
const AgentCustomer = r => require(["../views/extension/agency-bonus/my_customer"], r);

// Enterpr
const EnterpriseIndex = r => require(["../views/member/enterprise/enterprise_index"], r);
const EnterpriseApply = r => require(["../views/member/enterprise/enterprose_apply"], r);
const EnterpriseSupplier = r => require(["../views/member/enterprise/enterprise_supplier"], r);
const EnterpriseSupplierInfo = r => require(["../views/member/enterprise/enterprise_supplier_info"], r);
const EnterpriseCenterApply = r => require(["../views/member/enterprise/enterprose_center_apply"], r);
const EnterpriseCenterSupplier = r => require(["../views/member/enterprise/enterprise_center_supplier"], r);
//招商-我的门店
const EnterpriseStore = r => require(["../views/member/enterprise/enterprise_store"], r);

// 积分商城中转页
const integral_shop = r => require(["../views/others/integral_shop"], r);

// rentCenter
const RentIndex = r => require(["../views/rent/rentIndex"], r);
const GoodsDetail = r => require(["../views/rent/goodsDetail"], r);
const ConfirmOrder = r => require(["../views/rent/confirmOrder"], r);
const RentOrderPay = r => require(["../views/rent/orderPay"], r);
const RentCenter = r => require(["../views/rent/rentCenter"], r);
const RentMyOrder = r => require(["../views/rent/rentMyOrder"], r);
const RentCharge = r => require(["../views/rent/rentCharge"], r);
const RentDeposit = r => require(["../views/rent/rentDeposit"], r);
const RentDepositDetail = r => require(["../views/rent/rentDepositDetail"], r);
const RentReturnGoods = r => require(["../views/rent/rentReturnGoods"], r);

const ToBeReturned = r => require(["../views/rent/allRentOrders/toBeReturned"], r);
const OverdueReturn = r => require(["../views/rent/allRentOrders/overdueReturn"], r);
const HasTransferred = r => require(["../views/rent/allRentOrders/hasTransferred"], r);
const HasBeenReturned = r => require(["../views/rent/allRentOrders/hasBeenReturned"], r);
const TransferRecord = r => require(["../views/rent/allRentOrders/transferRecord"], r);
const RentGuide = r => require(["../views/rent/allRentOrders/rentGuide"], r);
const RentAfterSalas = r => require(["../views/rent/allRentOrders/rentAfterSalas"], r);
const ReturnRecord = r => require(["../views/rent/allRentOrders/returnRecord"], r);
const ToBePay = r => require(["../views/rent/allRentOrders/toBePay"], r);
const ToBeSend = r => require(["../views/rent/allRentOrders/toBeSend"], r);
const ToBetakeGoods = r => require(["../views/rent/allRentOrders/toBetakeGoods"], r);
const ToBeClose = r => require(["../views/rent/allRentOrders/toBeClose"], r);
const ToBeComplete = r => require(["../views/rent/allRentOrders/toBeComplete"], r);
const ToBeReturneding = r => require(["../views/rent/allRentOrders/toBeReturneding"], r);

// 订单全返
const SingleReturnCenter = r => require(["../views/member/income/singleReturn/single_return_center"], r);
const SingleReturnListInfo = r => require(["../views/member/income/singleReturn/single_return_list_info"], r);

// 团队等级全返
const TeamLevelReturnCenter = r => require(["../views/member/income/teamLevelReturn/teamlevel_return_center"], r);
const TeamLevelReturnListInfo = r => require(["../views/member/income/teamLevelReturn/teamlevel_return_list_info"], r);

// 满额全返
const FullReturnCenter = r => require(["../views/member/income/fullReturn/full_return_center"], r);
const FullReturnListInfo = r => require(["../views/member/income/fullReturn/full_return_list_info"], r);

// 股东分红
const ShareholderDividend = r => require(["../views/member/income/shareholderDividend/shareholder_dividend"], r);
// 股东奖励
const ShareholderReward = r => require(["../views/member/income/ShareholderReward/Shareholder_reward"], r);

// 分销管理奖励
const DistributionHome = r => require(["../views/member/income/distributionIncentive/distributionHome"], r);
// 分销管理奖励详情
const DistributionDetail = r => require(["../views/member/income/distributionIncentive/distributionDetail"], r);
// 分销商分红
const LevelReturn = r => require(["../views/member/income/levelReturn/level_return"], r);

// 排行榜 old
// const RankingIndex = r => require(["../views/ranking/index"], r);
// const RankingListFirst = r =>
//   require(["../views/ranking/list_first_ranking"], r);
// const RankingListSecond = r =>
//   require(["../views/ranking/list_second_ranking"], r);

//排行榜 new
const RankingIndex = r => require(["../views/extension/ranking/ranking"], r);
// const RankingListFirst = r => require(['../views/ranking/list_first_ranking'], r);
// const RankingListSecond = r => require(['../views/ranking/list_second_ranking'], r);

// 早起打卡
const ClockPunch = r => require(["../views/clockin/clockin"], r);
// 早起打卡挑战规则
const ClockPunchRule = r => require(["../views/clockin/clockinrule"], r);
// 早起打卡我的战绩
const ClockPunchRecord = r => require(["../views/clockin/clockinrecord"], r);

// 我的关系筛选
const MyRelationshipSearch = r => require(["../views/member/tool/my_relationship_v2_search"], r);

// o2o首页商家
const HomeSeller = r => require(["../views/o2o/home_seller"], r);

// o2o首页商家详情
// const HomeSellerDetail = r => require(['../views/o2o/home_seller_detail'], r)

// o2o首页商家地址
//const HomeSellerAddress = r => require(["../views/o2o/home_seller_address"], r);

// 代付
const PayAnother = r => require(["../views/member/pay/pay_another"], r);

// 代付详情
const PayAnotherDetail = r => require(["../views/member/pay/pay_another_detail"], r);

const MyInfo = r => require(["../views/member/address/myinfo"], r);

const MyInfoOverseas = r => require(["../views/member/address/myinfo_overseas"], r);

// 充值码
const RechargeCode = r => require(["../views/qr_recharge/index"], r);

// 课程中心--首页

const CourseIndex = r => require(["../views/member/course/course_index"], r);

// 课程中心--搜索

const CourseSearch = r => require(["../views/member/course/course_search"], r);

// 课程中心--管理

const CourseManage = r => require(["../views/member/course/course_manage"], r);

// 课程详情

const CourseDetail = r => require(["../components/goods/course"], r);

// 课程-我的打赏

const CourseReward = r => require(["../views/member/course/course_reward"], r);

// 课程-我的课程

const CourseMy = r => require(["../views/member/course/course_mycourse"], r);

// 课程-观看历史

const CourseHistory = r => require(["../views/member/course/course_history"], r);

// 课程-升级会员

const CourseMemberUpdate = r => require(["../views/member/course/course_member_level"], r);

// 音频列表

const VoiceList = r => require(["../views/member/course/voice/voice_list"], r);

// 音频详情

const VoiceDetail = r => require(["../views/member/course/voice/voice_detail"], r);

// 推广申请

const ExtensionApply = r => require(["../views/extension/extensionApple"], r);

// 会员等级

const MemberGradeList = r => require(["../views/member/member_grade/member_grade_list"], r);

// 会员详情

const MemberGradeListDetail = r => require(["../views/member/member_grade/member_grade_detail"], r);

// 待退还

const OrderReturn = r => require(["../views/member/order/order_refund"], r);

// 待退还中

const OrderReturnCheck = r => require(["../views/member/order/order_return_check"], r);

// 待确定

const OrderReturnSure = r => require(["../views/member/order/order_return_sure"], r);

// 租赁归还售后详情

const OrderReturnAftersalesDetail = r => require(["../views/member/order/order_return_after_detail"], r);

// 会员权益退款迁移

const MemberRefundsMigration = r => require(["../views/member/member_grade/member_grade_refunds_migration"], r);

// 商品详情品牌

const GoodsBrand = r => require(["../views/goods/goods_brand"], r);

// 柜子商品中转页面

const CupboardTransfer = r => require(["../views/member/cupboard/cupboard_transfer"], r);

// 柜子商品操作员页面

const CupboardOperator = r => require(["../views/member/cupboard/cupboard_operator"], r);

// 柜子商品操作员页面--投放页面

const CupboardDelivery = r => require(["../views/member/cupboard/cupboard_delivery"], r);

// 柜子商品操作员页面--清空页面

const CupboardEmpty = r => require(["../views/member/cupboard/cupboard_empty"], r);

// 柜子商品详情

const CupGoods = r => require(["../views/goods/goods_v2"], r);

// 区域选择

const ZoneChoose = r => require(["../views/home/home_zone"], r);

// 商品详情供应商店铺

const SupplierShop = r => require(["../views/member/supplier/goods_supplier"], r);
const SupplierShop2 = r => require(["../views/member/supplier/goods_supplier2"], r);

// 供应商店铺信息
const SupplierInfo = r => require(["../views/member/supplier/supplier_info"], r);
// 转账

const TransferAccount = r => require(["../views/member/pay/pay_transfer_account"], r);

// 供应商管理
const SupplierCenter = r => require(["../views/member/supplier/supplier_center"], r);

// 供应商--信息管理页面

const SupInfoManage = r => require(["../views/member/supplier/info_manage"], r);

// 排队奖励记录

const QueueRecord = r => require(["../views/extension/spread/reward_record"], r);

// 冻结币
const FrozenCoin = r => require(["../views/member/frozen/frozen_coin"], r);
const RechargeCoin = r => require(["../views/member/frozen/recharge_coin"], r);
const LookDetailsCoin = r => require(["../views/member/frozen/look_details_coin"], r);
const PutForwardCoin = r => require(["../views/member/frozen/put_forward_coin"], r);
// 开户信息
const AccoutInfo = r => require(["../views/member/accout/accout_info"], r);

// 登录中专页面
const LoginValidate = r => require(["../views/login/login_validation"], r);

// 文章列表
const ArticleList = r => require(["../views/article/articleList"], r);

// 供应商搜素
const SupplierSearch = r => require(["../views/member/supplier/search"], r);

// 共享链
const RewardQueue = r => require(["../views/extension/share_link/reward_queue"], r);
const RewardDetail = r => require(["../views/extension/share_link/reward_detail"], r);
const RewardProcess = r => require(["../views/extension/share_link/reward_process"], r);

// mryt
const MRYT = r => require(["../views/extension/mryt/mryt"], r);
const SaleCommission = r => require(["../views/extension/mryt/sale_commission"], r);
const AwardRecord = r => require(["../views/extension/mryt/award_record"], r);
const AwardDetail = r => require(["../views/extension/mryt/award_detail"], r);
//连锁店--首页
const ChainShopIndex = r => require(["../views/member/chain_shop/chain_shop_index"], r);
const ChainShopInfo = r => require(["../views/member/chain_shop/chain_shop_info"], r);

//手动分红
const Profit = r => require(["../views/extension/profit/Profit.vue"], r);

//武昌医院--会务活动
const MeetingIndex = r => require(["../views/conference/meeting/entry_record"], r); //报名记录
const MeetingIndexDetail = r => require(["../views/conference/meeting/entry_record_detail"], r); //报名记录详情
const MeetingExtendList = r => require(["../views/conference/meeting/extend_enroll_list"], r); //推广报名列表
const MeetingExtendDetail = r => require(["../views/conference/meeting/extend_enroll_detail"], r); //推广报名详情

//入驻商品
const EnterShop = r => require(["../views/member/enter_shop/enter_shop"], r);
const EnterProtocol = r => require(["../views/member/enter_shop/enter_protocol"], r);
const SubmitSucceed = r => require(["../views/member/enter_shop/submit_succeed"], r);
const ApplyMerchant = r => require(["../views/member/enter_shop/apply_merchant"], r);
const TruckList = r => require(["../views/member/enter_shop/truck_list"], r);
//爱心值充值
const LoveRecharge = r => require(["../views/love/love_recharge"], r);

//区间消费返点
const consumerReturnPoint = r => require(["../views/extension/consumer_return_point/consumer_return_point"], r);
//推广中心--专区商品
const ExtensionGoods = r => require(["../views/extension/extension_goods"], r);
//团队销量管理
const salesManagement = r => require(["../views/extension/teamSales/sales_management"], r);
//398二期：团队数据统计
const TeamDataCount = r => require(["../views/extension/mryt/team_data_count"], r);
//398 一卡通
const CardIndex = r => require(["../views/o2o/card/card_index"], r);
const CardOpenMembership = r => require(["../views/o2o/card/card_open_membership"], r);
const CardChooseMembership = r => require(["../views/o2o/card/card_choose_membership_time"], r);
const CardRight = r => require(["../views/o2o/card/card_rights"], r);
const NewCard = r => require(["../views/o2o/card/new_card"], r);
const NewCardList = r => require(["../views/o2o/card/newcard_list"], r);
//门店优惠券
const StoreCoupon = r => require(["../views/o2o/store/store_coupon"], r);

//酒店优惠券
const hotelCoupon = r => require(["../views/hotel/hotel_coupon"], r);

//邀请页面
const InputVisit = r => require(["../views/member/visit/inputVisit"], r);
const Inviter = r => require(["../views/member/visit/inviter"], r);

//发票中心
const invoiceCenter = r => require(["../views/invoice/invoice-center"], r);
//发票编辑或者添加
const invoiceOperation = r => require(["../views/invoice/invoiceOperation"], r);
//新发票详情
const invoiceDetails = r => require(["../views/invoice/invoice-details"], r);
//发票详情
const Invoice = r => require(["../views/invoice/invoice"], r);
const ApplyInvoice = r => require(["../views/invoice/apply_invoice"], r);
//酒店相关页面
const HotelIndex = r => require(["../views/hotel/index"], r);
const HotelSearch = r => require(["../views/hotel/search"], r);
const HotelHome = r => require(["../views/hotel/homepage"], r);
const HotelChooseRoom = r => require(["../views/hotel/choose_room"], r);
// const HotelGood= r => require(['../views/hotel/goods'], r);
const HotelGoodsOrder = r => require(["../views/hotel/goods_order"], r);
// const HotelOrderList = r => require(['../views/hotel/order_list'], r);
// const HotelOrderDetail = r => require(['../views/hotel/order_detail'], r);
const HotelManage = r => require(["../views/hotel/manage"], r);

// 增加酒店供应链搜索页
const HotelSupplySearch = r => require(["../views/hotelSupply/search"], r);
// 增加酒店供应链首页
const HotelSupplyIndex = r => require(["../views/hotelSupply/index"], r);
// 增加酒店供应链酒店主页
const HotelSupplyHome = r => require(["../views/hotelSupply/homepage"], r);
// 增加酒店供应链酒店房型详情页
const hotelSupplyGoods = r => require(["../views/hotelSupply/hotelSupplyGoods"], r);
// 增加酒店供应链酒店房型下单页
const HotelSupplyGoodsOrder = r => require(["../views/hotelSupply/goods_order"], r);
// 增加酒店供应酒店详情页
const hotelOrder = r => require(["../views/hotelSupply/hotelOrder"], r);
//营业额
const Performance = r => require(["../views/extension/performance/Performance"], r);

//合伙人团队
const PartnershipTeam = r => require(["../views/extension/team_recorded/partnership_team"], r);
const ManagementRecord = r => require(["../views/extension/team_recorded/management_record"], r);
const TaskList = r => require(["../views/extension/team_recorded/task_list"], r);

//消费红包
const ConsumePacket = r => require(["../views/extension/consume_packet/index"], r);
const ConsumePacketSuccess = r => require(["../views/extension/consume_packet/success"], r);
//团队分销商统计
const TeamDistribution = r => require(["../views/member/team_distribution/team_distribution"], r);

//聚合/易合支付 Bank card settlement
const AggregateIndReg = r => require(["../views/member/aggregate_payment/aggregate_ind_reg"], r);
const AggregateIndRegEdit = r => require(["../views/member/aggregate_payment/aggregate_ind_reg_edit"], r);
const AggregateMeReg = r => require(["../views/member/aggregate_payment/aggregate_mer_reg"], r);
const AggregateMeRegEdit = r => require(["../views/member/aggregate_payment/aggregate_mer_reg_edit"], r);
const AggregateEntReg = r => require(["../views/member/aggregate_payment/aggregate_ent_reg"], r);
const AggregateEntRegEdit = r => require(["../views/member/aggregate_payment/aggregate_ent_reg_edit"], r);
const AggregateBankCardSet = r => require(["../views/member/aggregate_payment/aggregate_bank_card_set"], r);
const AggregateAuditPart = r => require(["../views/member/aggregate_payment/aggregate_audit_part"], r);
const CompanyEdit = r => require(["../views/member/aggregate_payment/company_edit"], r);
const IndividualEdit = r => require(["../views/member/aggregate_payment/individual_edit"], r);
const ShowApply = r => require(["../views/member/aggregate_payment/show_apply"], r);

//口令红包
const redEnvelope = r => require(["../views/member/redEnvelope/redEnvelope"], r);
//口令红包 邀请记录
const redEnvelopeRecord = r => require(["../views/member/redEnvelope/record"], r);

//挂单
const EntryExchange = r => require(["../views/extension/entry_orders/coupon_exchange"], r);
const EntryVolume = r => require(["../views/extension/entry_orders/entry_volume"], r);
const MoneyDetail = r => require(["../views/extension/entry_orders/money_detail"], r);
const MyVolume = r => require(["../views/extension/entry_orders/my_volume"], r);
const VolumeDetail = r => require(["../views/extension/entry_orders/volume_detail"], r);
const WholesaleVolume = r => require(["../views/extension/entry_orders/wholesale_volume"], r);
const paddingOrder_Home = r => require(["../views/extension/entry_orders/paddingOrder_Home"], r);
const CouponExrecord = r => require(["../views/extension/entry_orders/coupon_exrecord"], r);

// 活动聚合页
const businessActivity = r => require(["../views/Activity/Activity"], r);
// 活动聚合页
const ActivityDetail = r => require(["../views/Activity/activity_detail"], r);
// 素材中心
const materialCenter = r => require(["../views/others/material_center"], r);
const materialSearch = r => require(["../views/others/material_search"], r);
//虚拟币
const addressManage = r => require(["../views/others/virtual/address_manage"], r);
const addressAdd = r => require(["../views/others/virtual/address_add"], r);
const reviseAddress = r => require(["../views/others/virtual/revise_address"], r);
const handWithdraw = r => require(["../views/others/virtual/hand_withdraw"], r);
// 经销商奖励
const DealerAward = r => require(["../views/extension/dealer_award/dealer_award"], r);
const DriverDetail = r => require(["../views/extension/dealer_award/dealer_detail"], r);
const WeightedDividend = r => require(["../views/extension/dealer_award/WeightedDividend"], r);
//经销商平级奖（七件事平级奖开发）
const DealerPeerAward = r => require(["../views/extension/dealer_award/peerAward"], r);
const peerAwardes_withdraw = r => require(["../views/extension/dealer_award/peerAwardes_withdraw"], r);

//团队管理奖
const TeamManageReward = r => require(["../views/extension/team_manage_reward/rewards_record"], r);

const Lottery = r => require(["../views/others/lottery"], r);
const LotteryRecord = r => require(["../views/others/lottery_record"], r);
// 分销订单统计
const DistributionOrders = r => require(["../views/member/distribution_orders/distribution_orders"], r);

const ServiceStation = r => require(["../views/serviceStation/index"], r); //服务站

const CommissionList = r => require(["../views/serviceStation/commissionList"], r); //提成明细

// 自定义队列
const CustomQueue = r => require(["../views/extension/custom_queue/custom_queue"], r);

//权益商品
const RightGood = r => require(["../views/member/member_grade/right_good"], r);
//保单
const policyManage = r => require(["../views/others/policy/policy_manage"], r);
// 没用到
// const policyAdd = r => require(['../views/others/policy/policy_add'], r);

//小视频
const myVideo = r => require(["../views/video_goods/little_video/my_video"], r);
const VideoList = r => require(["../views/video_goods/little_video/video_list"], r);
const VideoDetail = r => require(["../views/video_goods/little_video/video_detail"], r);
const videoAgreement = r => require(["../views/video_goods/video_agreement"], r); //小视频的用户协议，非协议内容
const releaseVideo = r => require(["../views/video_goods/release_video"], r); //小视频的用户协议，非协议内容
const addVideoGood = r => require(["../views/video_goods/video_good"], r); //选择添加视频上商品
const VideoReward = r => require(["../views/video_goods/video_reward"], r); //商品奖励记录

//团队业绩奖励
const TeamPerformanceAward = r => require(["../views/extension/team_performance_award/index"], r);

//广告中心
const advertiser = r => require(["../views/advertising_market/advertiser"], r); //广告主
const addAdvertising = r => require(["../views/advertising_market/add_advertising"], r); //添加广告
const advertisingFee = r => require(["../views/advertising_market/advertising_fee"], r); //广告费列表
const placedAdvertising = r => require(["../views/advertising_market/placed_advertising"], r); //投放的广告

// 电子合同
const signIndex = r => require(["../views/others/sign/index"], r);
const signBusiness = r => require(["../views/others/sign/sign_business"], r);
const signPerson = r => require(["../views/others/sign/sign_person"], r);
//const signGuide = r => require(["../views/others/sign/guide"], r);
const personBank = r => require(["../views/others/sign/person_bank"], r);
const identifyResult = r => require(["../views/others/sign/identify_result"], r);
const faceResult = r => require(["../views/others/sign/face_result"], r);
const signCompany = r => require(["../views/others/sign/company"], r);
const contractBills = r => require(["../views/others/sign/contract_bills"], r);
const staffManagement = r => require(["../views/others/sign/staff_management"], r);
const addStaff = r => require(["../views/others/sign/add_staff"], r);
const contractList = r => require(["../views/others/sign/contract_list"], r);
const companyContractList = r => require(["../views/others/sign/company_contract_list"], r);
const signMission = r => require(["../views/others/sign/mission"], r);
const signPage = r => require(["../views/others/sign/sign_page"], r);
//电子合同优化页面
const signSeeTemplate = r => require(["../views/others/sign/sign_see_template"], r);
const launchSign = r => require(["../views/others/sign/launch_sign"], r);
const contractFilling = r => require(["../views/others/sign/contract_filling"], r);

// 电子合同插件
const signIndexPlu = r => require(["../views/others/sign_plugin/index"], r);
const personBankPlu = r => require(["../views/others/sign_plugin/person_bank"], r);
const identifyResultPlu = r => require(["../views/others/sign_plugin/identify_result"], r);
const signCompanyPlu = r => require(["../views/others/sign_plugin/company"], r);
const contractListPlu = r => require(["../views/others/sign_plugin/contract_list"], r);
const signMissionPlu = r => require(["../views/others/sign_plugin/mission"], r);
const signPagePlu = r => require(["../views/others/sign_plugin/sign_page"], r);

// 电子合同契约锁插件
const signContractLock = r => require(["../views/others/sign_lock/index"], r);
const personBankLock = r => require(["../views/others/sign_lock/person_bank"], r);
const identifyResultLock = r => require(["../views/others/sign_lock/identify_result"], r);
const signCompanyLock = r => require(["../views/others/sign_lock/company"], r);
const contractBillsLock = r => require(["../views/others/sign_lock/contract_bills"], r);
const staffManagementLock = r => require(["../views/others/sign_lock/staff_management"], r);
const addStaffLock = r => require(["../views/others/sign_lock/add_staff"], r);
const contractListLock = r => require(["../views/others/sign_lock/contract_list"], r);
const signMissionLock = r => require(["../views/others/sign_lock/mission"], r);
const signPageLock = r => require(["../views/others/sign_lock/sign_page"], r);

// 客服
//const chatIndex = r => require(['../views/others/chat/chat'], r)
//const employeeChat = r => require(['../views/others/chat/employeeChat'], r)
const chatList = r => require(["../views/others/chat/chat_list"], r);
const chatWindow = r => require(["../views/others/chat/chatWindow"], r);
const PersonalProfile = r => require(["../views/others/chat/yun_customer_service/personalProfile"], r);

// 知识库
const knowledgeIndex = r => require(["../views/article/knowledge/knowledge_index"], r);
const knowledgeWhole = r => require(["../views/article/knowledge/knowledge_whole"], r);
const knowledgeList = r => require(["../views/article/knowledge/knowledge_list"], r);
const knowledgeSearch = r => require(["../views/article/knowledge/knowledge_search"], r);
const knowledgeDetail = r => require(["../views/article/knowledge/knowledge_detail"], r);

// service
// const Service = r => require(['../views/member/service/service'],r)
// //phone
// const PhoneRecharge = r => require(['../views/member/service/phone/phoneRecharge'],r)
// const RechargePay = r => require(['../views/member/service/phone/rechargePay'],r)
// const OrderDetailsPaied = r =>require(['../views/member/service/phone/orderDetailsPaied'],r)
// const OrderDetailsNoPay = r =>require(['../views/member/service/phone/orderDetailsNoPay'],r)
// const RechargeRecord = r =>require(['../views/member/service/phone/rechargeRecord'],r)
// //oilCard
// const AddCard = r =>require(['../views/member/service/oilCard/addCard'],r)
// const CardServer = r =>require(['../views/member/service/oilCard/cardServer'],r)
// const OilNoPay = r =>require(['../views/member/service/oilCard/oilNoPay'],r)
// const OilDetailsPaied = r =>require(['../views/member/service/oilCard/oilDetailsPaied'],r)
// const OilRecharge = r =>require(['../views/member/service/oilCard/oilRecharge'],r)
// //ticket 机票
// const Ticket = r => require(['../views/member/service/ticket/index'], r)
// const City = r => require(['../views/member/service/ticket/city'], r)
// const TicketOrder = r =>require(['../views/member/service/ticket/ticketOrder'],r)
// const AddOrder = r =>require(['../views/member/service/ticket/addOrder'],r)
// const RefundApplication = r=>require(['../views/member/service/ticket/refundApplication'],r)
//
// //Game
// const GameSearch = r => require(['../views/member/service/game/gameSearch'],r)
// const GameIsPay = r => require(['../views/member/service/game/gameIsPay'],r)
// const GameNoPay = r => require(['../views/member/service/game/gameNoPay'],r)
// const GameFlingRecharge = r =>require(['../views/member/service/game/gameFlingRecharge'],r)
// const GamePasswordRecharge =r =>require(['../views/member/service/game/gamePasswordRecharge'],r)
//微社区
const MicroHome = r => require(["../views/micro_communities/home"], r);
const MicroIndex = r => require(["../views/micro_communities/microIndex"], r);
const MicroRelease = r => require(["../views/micro_communities/microRelease"], r);
const Microsearchindex = r => require(["../views/micro_communities/microsearchindex"], r);
const Microclassification = r => require(["../views/micro_communities/microclassification"], r);
const Microcommentdetails = r => require(["../views/micro_communities/microcommentdetails"], r);
const microhomepage = r => require(["../views/micro_communities/microhomepage"], r);
const MicroEdit = r => require(["../views/micro_communities/microEdit"], r);
const microAttention = r => require(["../views/micro_communities/micro_attention"], r);
const microFanlist = r => require(["../views/micro_communities/microFanlist"], r);
//历史拼团
const historyGroup = r => require(["../views/others/history_group/index"], r);
//拼团
const GroupDetail = r => require(["../views/goods/group/group_detail"], r);
const GroupList = r => require(["../views/goods/group/group_list"], r);
// 珍惠拼 财务页面
const zhpFinance = r => require(["../views/goods/group/zhpFinance"], r);
// const GroupGoods = r => require(["../components/goods/group_good"], r); 没用
const MyGroups = r => require(["../views/goods/group/mygroups"], r);
// 新拼团
const groupContribution = r => require(["../views/goods/group/newGroup/contribution"], r);
const groupContributionDetails = r => require(["../views/goods/group/newGroup/contributionDetail"], r);
const groupContributionDetailslog = r => require(["../views/goods/group/newGroup/groupContributionDetailslog"], r);
const groupcblog = r => require(["../views/goods/group/newGroup/groupcblog"], r);
const pastLog = r => require(["../views/goods/group/newGroup/pastLog"], r);
const groupRedeem = r => require(["../views/goods/group/newGroup/redeem"], r);
const zhpgroupDetail = r => require(["../views/goods/group/newGroup/zhpgroupDetail"], r);
const redeemLog = r => require(["../views/goods/group/newGroup/redeemLog"], r);
//拼购（和拼团不一样）
const GroupBuyList = r => require(["../views/goods/group_buy/group_buy_list"], r);
const myGroupBuy = r => require(["../views/goods/group_buy/my_group_buy"], r);
const groupBuyDetail = r => require(["../views/goods/group_buy/group_buy_detail"], r);
// const groupBuyGoodslist = r => require(['../views/goods/group_buy/group_buy_goodslist'], r); 不用
const groupBuy = r => require(["../components/goods/group_buy"], r);

// 打包一口价
const fixedPrice = r => require(["../views/others/fixedPrice"], r);

//会务活动
const MyActivity = r => require(["../views/Conference_activities/my_activities/my_index"], r);
const Mylove = r => require(["../views/Conference_activities/my_activities/my_love"], r);
const Registration = r => require(["../views/Conference_activities/Registration_status"], r);
const RegistrationDetail = r => require(["../views/Conference_activities/my_activities/Registration_detail"], r);
const Myshaky = r => require(["../views/Conference_activities/my_activities/my_shaky"], r);
const lecturerDetail = r => require(["../views/Conference_activities/lecturer_detail"], r);
const enroll = r => require(["../views/Conference_activities/enroll"], r);
const activityHome = r => require(["../views/Conference_activities/activity_home"], r);
const enrollEnter = r => require(["../views/Conference_activities/enroll_enter"], r);
const searchResult = r => require(["../views/Conference_activities/search_result"], r);
const signIn = r => require(["../views/Conference_activities/sign_in"], r);
const Sort = r => require(["../views/Conference_activities/sort"], r);

//广告市场
const admarketHome = r => require(["../views/member/adMarket/home"], r);
const MyDevice = r => require(["../views/member/adMarket/myDevice"], r);
const DeviceManger = r => require(["../views/member/adMarket/deviceManger"], r);
const ADApply = r => require(["../views/member/adMarket/AD_Apply"], r);
const DeviceDetail = r => require(["../views/member/adMarket/deviceDetail"], r);
const managerCommission = r => require(["../views/member/adMarket/managerCommission"], r);

//语音商品
const VoiceGood = r => require(["../views/goods/voice_good/good_detail"], r);
const MyVoices = r => require(["../views/goods/voice_good/my_voices"], r);

const Payrecharge = r => require(["../views/member/payrecharge/payrecharge"], r);
// 第三方支付汇聚
const BankCardInformation = r => require(["../views/sanpay/bankcardinformation"], r);
const BankCardinEdit = r => require(["../views/sanpay/bankcardinedit"], r);
const BankCardinAdd = r => require(["../views/sanpay/bankcardinadd"], r);
// 归还详情
const OrderRuturnInfo = r => require(["../views/member/order/orderInfo/order_ruturn_info"], r);
// 调查表
const survey = r => require(["../views/others/survey"], r);
// 龙存管
const myWallet = r => require(["../views/member/dragon/my_wallet"], r);
const changePwd = r => require(["../views/member/dragon/change_pwd"], r);
const companyLogon = r => require(["../views/member/dragon/company_logon"], r);
const personLogon = r => require(["../views/member/dragon/person_logon"], r);
const personModify = r => require(["../views/member/dragon/person_modify"], r);
const companyModify = r => require(["../views/member/dragon/company_modify"], r);
const dragonDeposit = r => require(["../views/member/dragon/dragon_deposit"], r);
const walletDetail = r => require(["../views/member/dragon/wallet_detail"], r);
const chooseStatus = r => require(["../views/member/dragon/choose_status"], r);
const checking = r => require(["../views/member/dragon/checking"], r);
const dragonWithdraw = r => require(["../views/member/dragon/dragon_withdraw"], r);
const myBank = r => require(["../views/member/dragon/my_bank"], r);
const failApply = r => require(["../views/member/dragon/fail_apply"], r);
const infoChange = r => require(["../views/member/dragon/info_change"], r);
//柯怡 管理奖
const ManageAward = r => require(["../views/extension/manage_share/manage_award"], r);
//柯怡 分享奖
const ShareAward = r => require(["../views/extension/manage_share/share_award"], r);
//平级奖
const PeersAward = r => require(["../views/extension/peers_award/peers_award"], r);
const SelfCarryApply = r => require(["../views/member/self_carry/selfCarry_apply"], r);
//杨朗 自提点列表
const SelfCarry_info = r => require(["../views/member/self_carry/selfCarry_info"], r);
//杨朗 自提点详情
const selfCarry_reward = r => require(["../views/member/self_carry/selfCarry_reward"], r);

const Bonus = r => require(["../views/others/bonus"], r);
//收益奖
const revenus_bonus = r => require(["../views/others/revenus_bonus"], r);

//直荐奖
const recommend_reward = r => require(["../views/extension/recommend_reward/index"], r);
//分享奖
const share_reward = r => require(["../views/extension/share_reward/index"], r);

// 预约
const Appointment = r => require(["../views/appointment/appointment_index"], r);
const showAppointment = r => require(["../views/appointment/showAppointment"], r);
const AppointmentSearch = r => require(["../views/appointment/search"], r);
const ProjectDetails = r => require(["../views/appointment/project_details"], r);
const ProjectList = r => require(["../views/appointment/project_list"], r);
const TechnicianDetails = r => require(["../views/appointment/technician_details"], r);
const HotTechnician = r => require(["../views/appointment/hot_technician"], r);
const AppointmentMine = r => require(["../views/appointment/mine"], r);
const TechnicianTime = r => require(["../views/appointment/technician/add_work_time"], r);
const TechnicianWork = r => require(["../views/appointment/technician/work_day"], r);
const AppointmentProject = r => require(["../views/appointment/technician/appointment_project"], r);
const AddTechnician = r => require(["../views/appointment/manager/add_technician"], r);
const StoresTechnician = r => require(["../views/appointment/manager/stores_technician"], r);
const ClientAppointment = r => require(["../views/appointment/client/appointment"], r);
const ClientEvaluate = r => require(["../views/appointment/client/evaluate"], r);
const MakeAppointment = r => require(["../views/appointment/client/make_appointment"], r);
const ClientProject = r => require(["../views/appointment/client/project"], r);
const ClientVerification = r => require(["../views/appointment/client/verification"], r);
const AppointmentExtends = r => require(["../views/appointment/appointment_extends"], r);

// 分销队列
const DistributionIndex = r => require(["../views/others/distribution_alignment/index"], r);
const DistributionSearch = r => require(["../views/others/distribution_alignment/search"], r);
const DistributionStatistics = r => require(["../views/others/distribution_alignment/activity_statistics"], r);
const DistributionActivityDetail = r => require(["../views/others/distribution_alignment/activity_detail"], r);
const DistributionCommissionDetail = r => require(["../views/others/distribution_alignment/commission_detail"], r);
const DistributionParticipant = r => require(["../views/others/distribution_alignment/participant"], r);
// const DistributionGoods = r => require(["../views/others/distribution_alignment/goods"], r);

// 多包裹
const multiplePackages = r => require(["../views/member/order/multiple_packages"], r);

// 宣传单
const advertisingPage = r => require(["../views/others/advertisingPage"], r);
//门店附近商品
const introduceNear = r => require(["../views/o2o/introduce_good/introduce_near"], r);
const nearSearch = r => require(["../views/o2o/introduce_good/near_search"], r);
const addNear = r => require(["../views/o2o/introduce_good/add_near"], r);

//拍卖
const auctioneer = r => require(["../views/auction/auctioneer-manage/auctioneer"], r);
const auctionCollect = r => require(["../views/auction/auction-mine/auction_collect"], r);
const myIndex = r => require(["../views/auction/auction-mine/my_index"], r);
const myAuction = r => require(["../views/auction/auction-mine/my_auction"], r);
const myMoney = r => require(["../views/auction/auctioneer-manage/my_money"], r);
const passwordChange = r => require(["../views/auction/auctioneer-manage/password_change"], r);
const setPassword = r => require(["../views/auction/auctioneer-manage/set_password"], r);
const shopShare = r => require(["../views/auction/auctioneer-manage/shop_share"], r);
const goodManage = r => require(["../views/auction/auctioneer-manage/good_manage"], r);
const publishFirst = r => require(["../views/auction/auctioneer-publish/publish_first"], r);
const publishSecond = r => require(["../views/auction/auctioneer-publish/publish_second"], r);
const auctionIndex = r => require(["../views/auction/auction_index"], r);
const auctionMore = r => require(["../views/auction/auction_more"], r);
const auctionSearch = r => require(["../views/auction/auction_search"], r);
const auctionVip = r => require(["../views/auction/auction_vip"], r);
const auctionApply = r => require(["../views/auction/auction-apply/auction_apply"], r);
const auctionGood = r => require(["../views/auction/auction_good"], r);
const auctionRecord = r => require(["../views/auction/auction_record"], r);
const auctioneerShop = r => require(["../views/auction/auctioneer-shop/auctioneer_shop"], r);
const auctioneerShopSearch = r => require(["../views/auction/auctioneer-shop/auctioneer_shop_search"], r);
const auctionLove = r => require(["../views/auction/auction-mine/auction_love"], r);
const auctionLoveDetail = r => require(["../views/auction/auction-mine/auction_love_detail"], r);
const auctionLoveCash = r => require(["../views/auction/auction-mine/auction_love_cash"], r);
const auctionRecharge = r => require(["../views/auction/auction-mine/auction_recharge"], r);
//const auctiongoodsorder = r => require(["../views/auction/auction-mine/auction_goods_order"], r);
//画册
const pictureAlbum = r => require(["../views/others/picture_album/picture_album"], r);
//优惠券二维码
const qrCoupon = r => require(["../views/qr_coupon/qr_coupon"], r);

//易加油
const easyRefuel = r => require(["../views/easy-refuel/easy_refuel"], r);
const easySearch = r => require(["../views/easy-refuel/search"], r);
// 快捷支付
const chooseBank = r => require(["../views/quick_pay/choose_bank"], r);
const addBankSecond = r => require(["../views/quick_pay/add_bank_second"], r);
const addBankFirst = r => require(["../views/quick_pay/add_bank_first"], r);
const bindBank = r => require(["../views/quick_pay/bind_bank"], r);
const memberchooseBank = r => require(["../views/quick_pay/member_choose_bank"], r);
const memberaddBankSecond = r => require(["../views/quick_pay/member_add_bank_second"], r);
const memberaddBankFirst = r => require(["../views/quick_pay/member_add_bank_first"], r);
const memberbindBank = r => require(["../views/quick_pay/member_bind_bank"], r);
const memberRemoveBank = r => require(["../views/quick_pay/member_remove_bank"], r);
const quickIndex = r => require(["../views/quick_pay/quick_index"], r);
//推广小助手
const extendHelper = r => require(["../views/extend-helper/extend_helper"], r);
const extendRecord = r => require(["../views/extend-helper/extend_helper_record"], r);
const extendExplain = r => require(["../views/extend-helper/extend_explain"], r);
const popularAssistant = r => require(["../views/extend-helper/popular_assistant"], r);
// 能量舱
const powerCabin = r => require(["../views/power_cabin/power_cabin"], r);
// 没用到
// const powerCheck = r => require(['../views/power_cabin/power_check'], r);
// const powerResult = r => require(['../views/power_cabin/power_result'], r);
const powerStore = r => require(["../views/power_cabin/power_store"], r);
const powerSell = r => require(["../views/power_cabin/power_sell"], r);
const powerMember = r => require(["../views/power_cabin/power_member"], r);
const powerEquipment = r => require(["../views/power_cabin/power_equipment"], r);
const powerDetail = r => require(["../views/power_cabin/power_detail"], r);
const bindEquipment = r => require(["../views/power_cabin/bind_equipment"], r);
const powerNotes = r => require(["../views/power_cabin/power_notes"], r);
const powerAddMeb = r => require(["../views/power_cabin/power_addMeb"], r);
const cardDetail = r => require(["../views/power_cabin/card_detail"], r);
const powerCancellation = r => require(["../views/power_cabin/power_cancellation"], r);
const Cancellation = r => require(["../views/power_cabin/cancellation"], r);
const addFamily = r => require(["../views/power_cabin/add_family"], r);
const memberCard = r => require(["../views/power_cabin/member_card"], r);
// 津贴管理
const subsidyManage = r => require(["../views/extension/subsidy_manage/subsidy_manage"], r);
//团队销售佣金
const teamSell = r => require(["../views/extension/team_sell/team_sell"], r);
const teamActive = r => require(["../views/extension/team_sell/team_active"], r);
const teamCommission = r => require(["../views/extension/team_sell/team_commission"], r);
const activeRecord = r => require(["../views/extension/team_sell/active_record"], r);
const teamLimit = r => require(["../views/extension/team_sell/team_limit"], r);
const predictIncome = r => require(["../views/extension/team_sell/predict_income"], r);
// 门店股东
const storeShareholder = r => require(["../views/extension/store_shareholder/index"], r);
// 云仓
const cloudIndex = r => require(["../views/others/cloudwarehouse/cloud_index"], r);
// 提货区
const pickUpArea = r => require(["../views/others/cloudwarehouse/pickUpArea"], r);
// 提货详情
const pickUp = r => require(["../views/others/cloudwarehouse/pickUp"], r);
// 云仓下单页
const cloudOrder = r => require(["../views/others/cloudwarehouse/cloudOrder"], r);
// 提货订单
const cloudOrderList = r => require(["../views/others/cloudwarehouse/cloudOrderList"], r);
// 订单详情
const cloudOrderDetail = r => require(["../views/others/cloudwarehouse/cloudOrderDetail"], r);
// 解冻记录
const cloudRecord = r => require(["../views/others/cloudwarehouse/cloudRecord"], r);
// 云仓释放聚合页
const cloudRelease = r => require(["../views/others/cloudwarehouse/cloudRelease"], r);
// 查看详情 cloudReleaseLog
const cloudReleaseLog = r => require(["../views/others/cloudwarehouse/cloudReleaseLog"], r);

// 余额明细 balanceDetail
const balanceDetail = r => require(["../views/others/cloudwarehouse/balanceDetail"], r);

// 上级奖
const superior = r => require(["../views/extension/superior"], r);

// 厂家店铺
const managementIndex = r => require(["../views/others/managementIndex/managementIndex"], r);
// 厂家公告
const proclamation = r => require(["../views/others/managementIndex/proclamation"], r);
// 厂家列表
const managementLis = r => require(["../views/others/managementIndex/managementLis"], r);
// 商品详情 managementGoods
// const managementGoods = r => require(["../views/others/managementIndex/managementGoods"], r);
//微信会员卡
const wechatCard = r => require(["../views/wechat_card/wechat_card"], r);

//全国油站
const oilStation = r => require(["../views/others/oil_station/oil_station"], r);

//提货卡
const pickUpCardIndex = r => require(["../views/member/pick_up_card/pick_up_card_index"], r);
const pickUpCardReimburse = r => require(["../views/member/pick_up_card/pick_up_card_reimburse"], r);
const pickUpCardOrderList = r => require(["../views/member/pick_up_card/pick_up_card_order_list"], r);
const pickUpCardMy = r => require(["../views/member/pick_up_card/pick_up_card_my"], r);
const pickUpCardMyDet = r => require(["../views/member/pick_up_card/pick_up_card_my_det"], r);

//门店消费卡
const storeConsumeIndex = r => require(["../views/o2o/store_consume/index"], r);
const storeConsumeStore = r => require(["../views/o2o/store_consume/use_store"], r);
const storeConsumeShow = r => require(["../views/o2o/store_consume/show_code"], r);
const storeConsumeUse = r => require(["../views/o2o/store_consume/use_code"], r);
const storeConsumeIncome = r => require(["../views/o2o/store_consume/store_consume"], r);
const couponLog = r => require(["../views/o2o/card/couponLog"], r);

const videoQuestion = r => require(["../views/member/video_question/video_question"], r);
const mvideoAnswer = r => require(["../views/member/video_question/answer"], r);
const videoApply = r => require(["../views/member/video_question/apply"], r);
const videoWhtch = r => require(["../views/member/video_question/watch"], r);
const videoRecord = r => require(["../views/member/video_question/videoRecord"], r);
const videoRecordList = r => require(["../views/member/video_question/videoRecordList"], r);

// 下级足迹
const footprintMember = r => require(["../views/others/footprint/index"], r);
const footprintMemberDetail = r => require(["../views/others/footprint/detail"], r);

//使用H5页面中转，再跳转到Scheme实现打开小程序
const wxSchemeTool = r => require(["../views/home/wxSchemeTool"], r);

//圈子社区
const circleIndex = r => require(["../views/others/circleCommunity/circleIndex"], r);
//圈子搜索页
const circleSearch = r => require(["../views/others/circleCommunity/circleSearch"], r);
//付费记录
const circlePayRecords = r => require(["../views/others/circleCommunity/circlePayRecords"], r);
//创建圈子
const circleIssue = r => require(["../views/others/circleCommunity/circleIssue"], r);
//我的设置
const circleMySet = r => require(["../views/others/circleCommunity/circleMySet"], r);
//我的关注
const circleMyAttention = r => require(["../views/others/circleCommunity/circleMyAttention"], r);
//我的发布
const circleMyRelease = r => require(["../views/others/circleCommunity/circleMyRelease"], r);
//圈子详情
const circleDetails = r => require(["../views/others/circleCommunity/circleDetails"], r);
//我的圈子
const circleMyCircle = r => require(["../views/others/circleCommunity/circleMyCircle"], r);
//圈子简介
const circleIntroduce = r => require(["../views/others/circleCommunity/circleIntroduce"], r);
//圈子推广中心
const circleExtend = r => require(["../views/others/circleCommunity/circleExtend"], r);
//圈子审核列表
const circleChecklist = r => require(["../views/others/circleCommunity/circleChecklist"], r);
//圈子成员管理
const circleMember = r => require(["../views/others/circleCommunity/circleMember"], r);
//圈子设置
const circleSetting = r => require(["../views/others/circleCommunity/circleSetting"], r);
//圈子选择帖子或视频
const circleSelect = r => require(["../views/others/circleCommunity/circleSelect"], r);
//圈子发布视频
const circlereleaseVideo = r => require(["../views/others/circleCommunity/circlereleaseVideo"], r);
//圈子发布帖子
const circleTopic = r => require(["../views/others/circleCommunity/circleTopic"], r);
//圈子选择商品
const circleVideogood = r => require(["../views/others/circleCommunity/circleVideogood"], r);
//帖子详情
const topicDetails = r => require(["../views/others/circleCommunity/topicDetails"], r);
const circleVideodetail = r => require(["../views/others/circleCommunity/circleVideodetail"], r);
//圈子资料编辑
const circleEdit = r => require(["../views/others/circleCommunity/circleEdit"], r);
//* 圈子支付费用订单页 没用
// const circlePay = r => require(["../views/others/circleCommunity/circlePay"], r);

// 淘京拼
const cpsIndex = r => require(["../views/others/cpsIndex"], r);
// 淘京拼详情
const cpsDetail = r => require(["../views/others/cpsDetail"], r);
// 淘京拼列表
const cpsList = r => require(["../views/others/cpsList"], r);
// 淘京拼列表
const cpsCard = r => require(["../views/others/cpsCard"], r);
// 淘京拼卡密
const cpsPwd = r => require(["../views/others/cpsPwd"], r);
// cps推广页
const cpsExtension = r => require(["../views/others/cpsExtension"], r);
//销售报表
const salesTable = r => require(["../views/others/sales_table"], r);
//商品排行榜
const shopRanking = r => require(["../views/others/shopRanking/index"], r);
const shopRankingList = r => require(["../views/others/shopRanking/list"], r);
// 门店拓客卡
const tokerIndex = r => require(["../views/o2o/toker/tokerIndex"], r);
const memberTokerCard = r => require(["../views/o2o/toker/memberTokerCard"], r);
const tokerSetMeal = r => require(["../views/o2o/toker/tokerSetMeal"], r);
const tokerCode = r => require(["../views/o2o/toker/tokerCode"], r);
const tokerMerchant = r => require(["../views/o2o/toker/tokerMerchant"], r);
//* 升级码
const MemberUpgradeCode = r => require(["../views/member/upgrade_code/upgrade_code"], r);
const MemberUpgradeCodeGroupDetails = r => require(["../views/member/upgrade_code/group_details"], r);
const MemberUpgradeCodeUsedLog = r => require(["../views/member/upgrade_code/used_log"], r);
const MemberUpgradeResult = r => require(["../views/member/upgrade_code/upgrade_result"], r);

//* 云库存
const CloudStock = r => require(["../views/others/stock/index"], r);
const CloudStockRelatedLink = r => require(["../views/others/stock/related_link"], r);
const CloudStockPromotionCenter = r => require(["../views/others/stock/promotion_center"], r);
const CloudStockGoodsGuide = r => require(["../views/others/stock/guide"], r);
const ClousStockMyInventory = r => require(["../views/others/stock/my_inventory"], r);
const ClousStockDetails = r => require(["../views/others/stock/details"], r);

//商店联盟（推广中心）
const leagueExtends = r => require(["../views/o2o/store_bussiness/leagueExtends"], r);
//店商联盟（会员中心）
const LeagueStoreIndex = r => require(["../views/o2o/store_bussiness/index"], r);
const LeagueOperatingCenter = r => require(["../views/o2o/store_bussiness/operating_center"], r);
const LeagueOperatingStore = r => require(["../views/o2o/store_bussiness/operating_store"], r);
const LeagueServiceCenter = r => require(["../views/o2o/store_bussiness/service_center"], r);
const LeagueTaskCenter = r => require(["../views/o2o/store_bussiness/task_center"], r);
const LeagueTaskProgress = r => require(["../views/o2o/store_bussiness/task_progress"], r);
// 直播授权码
const liveAuthorization = r => require(["../views/member/liveAuthorization/liveAuthorization"], r);
const liveAuthorization_detail = r => require(["../views/member/liveAuthorization/liveAuthorization_detail"], r);
const liveAuthorization_collection = r => require(["../views/member/liveAuthorization/liveAuthorization_collection"], r);
const liveAuthorization_scanCode = r => require(["../views/member/liveAuthorization/liveAuthorization_scanCode"], r);
const liveAuthorization_extension = r => require(["../views/member/liveAuthorization/liveAuthorization_extension"], r);
const liveAuthorization_pay = r => require(["../views/member/liveAuthorization/liveAuthorization_pay"], r);

// 车场计时
const turnaroundTimeIndex = r => require(["../views/others/turnaroundTimeIndex/turnaroundTimeIndex"], r);
const turnaroundTimeActual = r => require(["../views/others/turnaroundTimeIndex/turnaroundTimeActual"], r);
const turnaroundTimeRank = r => require(["../views/others/turnaroundTimeIndex/turnaroundTimeRank"], r);
const turnaroundTimeActualSP = r => require(["../views/others/turnaroundTimeIndex/turnaroundTimeActualSP"], r);
// 航班信息收集
const flightInformation = r => require(["../views/others/flightInformation"], r);
const flightInformationDetailList = r => require(["../views/others/flightInformationDetailList"], r);
const flightInformationDetail = r => require(["../views/others/flightInformationDetail"], r);
// 问卷调查
const questionnaireIndex = r => require(["../views/others/question/questionnaireIndex"], r);
const questionsSearch = r => require(["../views/others/question/questionsSearch"], r);
const questions = r => require(["../views/others/question/questions"], r);
const surveyResult = r => require(["../views/others/question/surveyResult"], r);
const questioHistory = r => require(["../views/others/question/questioHistory"], r);
const history_details = r => require(["../views/others/question/history_details"], r);
//扫码支付
const scancodeAccount = r => require(["../views/member/pay/pay_scancode_account"], r);

//更新页面
const DownloadUpdate = r => require(["../views/others/update/update"], r);

// 多门店核销
const StoreVerification = r => require(["../views/appointment/project_verification/store_verification"], r);
// 核销记录
const WriteOffRecord = r => require(["../views/appointment/project_verification/write_off_record"], r);
// 门店记录
const StoreRecords = r => require(["../views/appointment/project_verification/store_records"], r);
// 核销员记录
const VerificationRecord = r => require(["../views/appointment/project_verification/verification_record"], r);
// 商家核销
const BusinessVerification = r => require(["../views/appointment/project_verification/business_verification"], r);
// 会员核销页面
const WriteOff = r => require(["../views/appointment/project_verification/write_off"], r);
// 我的项目
const MyProject = r => require(["../views/appointment/project_verification/my_project"], r);
// 项目详情
const VerificationProjectDetails = r => require(["../views/appointment/project_verification/project_details"], r);
// 项目列表
const VerificationProjectList = r => require(["../views/appointment/project_verification/project_list"], r);
// 更多门店
const MoreStores = r => require(["../views/appointment/project_verification/more_stores"], r);
//  搜索项目
const SearchProject = r => require(["../views/appointment/project_verification/search_project"], r);
// 项目分类列表
const CategoryProjectList = r => require(["../views/appointment/project_verification/category_project_list"], r);

// cps 订单
const cpsOrderList = r => require(["../views/member/order/cps/cpsOrder.vue"], r);

//* 定金阶梯团
const DepositGroupRoutes = [
  {
    path: "/depositGroupActivity",
    component: r => require(["../views/others/deposit_group/activity_index"], r),
    name: "depositGroupActivity",
    meta: {
      title: "定金阶梯",
      foot: true
    }
  },
  {
    path: "/depositGroupRanking",
    component: r => require(["../views/others/deposit_group/ranking"], r),
    name: "depositGroupRanking",
    meta: {
      title: "定金阶梯排行榜",
      foot: true
    }
  }
];
//* 招商专员
const MerchantsCommissioner = r => require(["../views/extension/merchants-commissioner/index"], r);
//* 新媒体广告插件
const NewMediaAdRoutes = [
  {
    path: "/newMediaGuide",
    component: r => require(["../views/others/new_media/guide"], r),
    name: "newMediaGuide",
    meta: {
      title: "新媒体",
      foot: false
    }
  },
  {
    path: "/newMediaPublish",
    component: r => require(["../views/others/new_media/publish"], r),
    name: "newMediaPublish",
    meta: {
      title: "发布内容",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/newMediaMy",
    component: r => require(["../views/others/new_media/my"], r),
    name: "newMediaMy",
    meta: {
      title: "我的",
      foot: false
    }
  },
  {
    path: "/newMediaAdDetails",
    component: r => require(["../views/others/new_media/ad_details"], r),
    name: "newMediaAdDetails",
    meta: {
      title: "内容详情",
      foot: true
    }
  },
  {
    path: "/newMediaAdVideo",
    component: r => require(["../views/others/new_media/ad_video"], r),
    name: "newMediaAdVideo",
    meta: {
      title: "视频",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/newMediaFans",
    component: r => require(["../views/others/new_media/fans"], r),
    name: "newMediaFans",
    meta: {
      title: "粉丝",
      foot: true
    }
  },
  {
    path: "/newMediaPoints",
    component: r => require(["../views/others/new_media/points"], r),
    name: "newMediaPoints",
    meta: {
      title: "查看明细",
      foot: true
    }
  },
  {
    path: "/newMediaExchange",
    component: r => require(["../views/others/new_media/exchange"], r),
    name: "newMediaExchange",
    meta: {
      title: "兑换流量值",
      foot: true
    }
  },
  {
    path: "/newMediaRechange",
    component: r => require(["../views/others/new_media/rechange"], r),
    name: "newMediaRechange",
    meta: {
      title: "充值流量值",
      foot: true
    }
  }
];

// 推广中心 ---> 门店奖励
const ExtendStoreRewards = r => require(["../views/extend-helper/storeRewards.vue"], r);
// 推广中心 ---> 提成概括
const CommissionSummary = r => require(["../views/extend-helper/commissionSummary.vue"], r);
// 推广中心 ---> 门店订单列表
const StoreOrder = r => require(["../views/extend-helper/storeOrder.vue"], r);
// 推广中心 ---> 门店订单列表
const CashierOrder = r => require(["../views/extend-helper/cashierOrder.vue"], r);
// 易宝代付签约
const YeePay = r => require(["../views/extension/yee_pay/yee_pay.vue"], r);

// 高灯代发薪
const HighLight = r => require(["../views/extension/high_light/high_light"], r);

// 免单记录
const FreeRecord = r => require(["../views/others/free_of_charge/free_record"], r);

// 免单详情
const FreeDetails = r => require(["../views/others/free_of_charge/free_details"], r);

// 免单抽奖
const FreeLottery = r => require(["../views/others/free_of_charge/free_lottery"], r);

// 权益赠送
const InterestsGive = r => require(["../views/member/interests_give/interests_give"], r);

//授权查询
const authorizationQuery = r => require(["../views/others/authorization_query/authorization_query"], r);

// 星级门店
const starStore = r => require(["../views/extension/star_store/star_store"], r);

// 供应商列表
const supplierShopList = r => require(["../views/member/supplier/supplier_shopList"], r);

// 页面路由
const routes = [
  // 供应商列表
  {
    path: "/supplier_shopList",
    component: supplierShopList,
    name: "supplierShopList",
    meta: {
      title: "供应商列表",
      foot: true
    }
  },
  // 支付后跳转页面
  {
    path: "/member/payrecharge",
    component: Payrecharge,
    name: "payrecharge",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "",
    redirect: {
      name: "home"
    },
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/user_agreement",
    component: userAgreement,
    name: "userAgreement",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/goodsGroup/:goodtype?",
    component: goodsGroup,
    name: "goodsGroup",
    meta: {
      title: "",
      foot: true
    }
  },

  {
    path: "/case_library",
    component: caseLibrary,
    name: "caseLibrary",
    meta: {
      title: "发布案例",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_home",
    component: caseLibraryHome,
    name: "caseLibraryHome",
    meta: {
      title: "首页",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_category",
    component: caseLibraryCategory,
    name: "caseLibraryCategory",
    meta: {
      title: "分类",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_label/:id",
    component: caseLibraryLabel,
    name: "caseLibraryLabel",
    meta: {
      title: "标签",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_subject_list",
    component: caseLibrarySubjectList,
    name: "caseLibrarySubjectList",
    meta: {
      title: "专题",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_subject_detail/:id",
    component: caseLibrarySubjectDetail,
    name: "caseLibrarySubjectDetail",
    meta: {
      title: "专题详情",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_detail/:id",
    component: caseLibraryDetail,
    name: "caseLibraryDetail",
    meta: {
      title: "案例详情",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_my_publish",
    component: caseLibraryMypublish,
    name: "caseLibraryMypublish",
    meta: {
      title: "我的发布",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_new_mobile",
    component: caseLibraryNewMobile,
    name: "caseLibraryNewMobile",
    meta: {
      title: "案例列表",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_area_mobile",
    component: caseLibraryAreaMobile,
    name: "caseLibraryAreaMobile",
    meta: {
      title: "案例列表",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/case_library_ranking_mobile",
    component: caseLibraryRankingMobile,
    name: "caseLibraryRankingMobile",
    meta: {
      title: "排行榜",
      foot: true,
      isPC: true
    }
  },

  // 一口价
  {
    path: "/fixedPrice/:id",
    component: fixedPrice,
    name: "fixedPrice",
    meta: {
      title: "一口价",
      foot: true
    }
  },

  {
    path: "/application_market",
    component: applicationMarket,
    name: "applicationMarket",
    meta: {
      title: "应用市场",
      foot: true
    }
  },
  {
    path: "/marketSub",
    component: applicationMarket,
    name: "marketSub",
    meta: {
      title: "应用市场",
      foot: true
    }
  },
  {
    path: "/binding_site",
    component: bindingSite,
    name: "bindingSite",
    meta: {
      title: "新增/绑定站点",
      foot: true
    }
  },
  {
    path: "/change_site",
    component: changeSite,
    name: "changeSite",
    meta: {
      title: "",
      foot: true
    }
  },
  // 汇聚 账户信息
  {
    path: "/member/bankCardInformation",
    component: BankCardInformation,
    name: "bankCardInformation",
    meta: {
      title: "",
      foot: false
    }
  },
  // 归还详情
  {
    path: "/member/orderruturninfo/:id",
    component: OrderRuturnInfo,
    name: "orderruturninfo",
    meta: {
      title: "归还详情",
      foot: false
    }
  },
  // 银行卡信息编辑
  {
    path: "/member/bankcardinedit",
    component: BankCardinEdit,
    name: "bankcardinedit",
    meta: {
      title: "",
      foot: false
    }
  },
  // 银行卡信息添加
  {
    path: "/member/bankcardinadd",
    component: BankCardinAdd,
    name: "bankcardinadd",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/wx-scheme-tool",
    component: wxSchemeTool,
    name: "wxSchemeTool",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/home",
    component: Home,
    name: "home",
    meta: {
      title: "首页",
      foot: true
    }
  },
  {
    path: "/limitedTimeGoods",
    component: LimitedTimeGoods,
    name: "limitedTimeGoods",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/CloseSite",
    component: CloseSite,
    name: "CloseSite",
    meta: {
      title: "站点已关闭",
      foot: true
    }
  },

  // 多包裹
  {
    path: "/multiplePackages/:order_id",
    component: multiplePackages,
    name: "multiplePackages",
    meta: {
      title: "物流信息",
      foot: true
    }
  },

  {
    path: "/diy",
    component: Diy,
    name: "diy",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/newDiy",
    component: newDiy,
    name: "newDiy",
    meta: {
      title: "",
      foot: true
    }
  },
  // {
  //   path: "/diy/:page_id",
  //   component: Diy,
  //   name: "Diy1"
  // },
  {
    path: "/diyform/:id",
    component: DiyForm,
    name: "DiyForm"
  },
  {
    path: "/diyform/:id/:goodsId/:optionsId/:total",
    component: DiyForm,
    name: "activityDiyForm"
  },
  {
    path: "/share",
    component: Share,
    name: "share",
    meta: {
      title: "分享",
      foot: false
    }
  },
  // 活动聚合页
  {
    path: "/business_activity/business_activity",
    component: businessActivity,
    name: "businessActivity ",
    meta: {
      title: "活动聚合",
      foot: true,
      is_single_share: true
    }
  },
  // 活动聚合页
  {
    path: "/activity_detail",
    component: ActivityDetail,
    name: "ActivityDetail",
    meta: {
      title: "活动详情",
      foot: true
    }
  },
  //Member
  {
    path: "/member/bank",
    component: MemberBank,
    name: "memberBank",
    meta: {
      title: "银行卡",
      foot: true
    }
  },
  {
    path: "/member/bank_card",
    component: BankCard,
    name: "BankCard",
    meta: {
      title: "银行卡",
      foot: true
    }
  },
  {
    path: "/member",
    component: Member,
    name: "member",
    meta: {
      title: "",
      foot: false
    }
  },
    //个人中心个人头像
   {
    path: "/MemberAvatar/:id",
    component: MemberAvatar,
    name: "MemberAvatar",
    meta: {
      title: "",
      foot: false
    }
  },
    //个人中心修改个人头像
   {
    path: "/changeMemberAvatar/:id",
    component: changeMemberAvatar,
    name: "changeMemberAvatar",
    meta: {
      title: "个人头像",
      foot: false
    }
  },
  {
    path: "/morePlugin",
    component: morePlugins,
    name: "morePlugin",
    meta: {
      title: "我的工具",
      foot: true
    }
  },

  // {
  //   path: '/member/tabs',
  //   component: Tabs,
  //   name: 'tabs',
  //   meta: {
  //     title: 'tabs',
  //     foot: false
  //   }
  // },
  // {
  //   path: '/member/po',
  //   component: Po,
  //   name: 'po',
  //   meta: {
  //     title: 'po',
  //     foot: false
  //   }
  // },
  {
    path: "/member/info",
    component: Info,
    name: "info",
    meta: {
      title: "会员信息",
      foot: true
    }
  },
  {
    path: "/member/editmobile/:fromTag?",
    component: Editmobile,
    name: "editmobile",
    meta: {
      title: "绑定手机",
      foot: true
    }
  },
  {
    path: "/member/withdrawEditmobile",
    component: WithdrawEditmobile,
    name: "withdrawEditmobile",
    meta: {
      title: "绑定手机",
      foot: true
    }
  },
  {
    path: "/member/scaneditmobile",
    component: scanEditmobile,
    name: "scanEditmobile",
    meta: {
      title: "绑定手机",
      foot: true
    }
  },

  {
    path: "/member/balance",
    component: Balance,
    name: "balance",
    meta: {
      title: "余额",
      foot: true
    }
  },
  {
    path: "/member/detailed",
    component: Detailed,
    name: "detailed",
    meta: {
      title: "余额明细",
      foot: true
    }
  },
  {
    path: "/member/code_page",
    component: codePage,
    name: "codePage",
    meta: {
      title: "支付码",
      foot: true
    }
  },
  {
    path: "/member/uid_code",
    component: codePage,
    name: "uidCode",
    meta: {
      title: "会员卡号",
      foot: true
    }
  },
  // {
  //   path: '/member/screen',
  //   component: Screen,
  //   name: 'screen',
  //   meta: {
  //     title: '余额筛选',
  //     foot: true
  //   }
  // },
  {
    path: "/member/details/:item/:name?",
    component: Details,
    name: "details",
    meta: {
      title: "余额详情",
      foot: true
    }
  },
  {
    path: "/member/integral",
    component: Integral,
    name: "integral",
    meta: {
      title: "积分",
      foot: true
    }
  },
  {
    path: "/member/integral_v2",
    component: IntegralV2,
    name: "integral_v2",
    meta: {
      title: "积分",
      foot: true
    }
  },
  {
    path: "/member/integral_v2Transfer",
    component: IntegralV2Transfer,
    name: "integral_v2_transfer",
    meta: {
      title: "积分转账",
      foot: true
    }
  },
  {
    path: "/member/income",
    component: Income,
    name: "income",
    meta: {
      title: "收入",
      foot: true
    }
  },
  {
    path: "/member/balance_recharge",
    component: Balance_recharge,
    name: "balance_recharge",
    meta: {
      title: "充值",
      foot: true
    }
  },
  // 门店独立余额充值
  {
    path: "/member/balance_recharge/:store_id/:name?",
    component: storeBalance,
    name: "storeBalance",
    meta: {
      title: "充值",
      foot: true
    }
  },
  {
    path: "/member/balance_transfer",
    component: Balance_transfer,
    name: "balance_transfer",
    meta: {
      title: "转账",
      foot: true
    }
  },
  {
    path: "/member/cmcPayInfo",
    component: cmcPayInfo,
    name: "cmcPayInfo",
    meta: {
      title: "账号管理",
      foot: true
    }
  },
  {
    path: "/member/balance_withdrawals",
    component: Balance_withdrawals,
    name: "balance_withdrawals",
    meta: {
      title: "提现",
      foot: true
    }
  },
  // 保单管理
  // Balance_manage
  {
    path: "/member/Balance_manage",
    component: Balance_manage,
    name: "balance_manage",
    meta: {
      title: "保单管理",
      foot: true
    }
  },
  // Balance_manageDetail
  {
    path: "/member/Balance_manageDetail",
    component: Balance_manageDetail,
    name: "balance_manageDetail",
    meta: {
      title: "保单详情",
      foot: true
    }
  },
  // 保单添加
  // Add_Balance_manage
  {
    path: "/member/add_balance_manage",
    component: Add_Balance_manage,
    name: "add_balance_manage",
    meta: {
      title: "保单添加",
      foot: true
    }
  },
  // 编辑保单
  // Edit_Balance_manage
  {
    path: "/member/edit_balance_manage/:type",
    component: Edit_Balance_manage,
    name: "edit_balance_manage",
    meta: {
      title: "编辑保单",
      foot: true
    }
  },
  {
    path: "/member/policyPay/:id/:supplier_id",
    component: policyPay,
    name: "policyPay",
    meta: {
      title: "保单支付",
      foot: true
    }
  },
  {
    path: "/member/withdrawal",
    component: Withdrawal,
    name: "withdrawal",
    meta: {
      title: "收入提现",
      foot: true
    }
  },
  {
    path: "/member/incomedetails",
    component: Incomedetails,
    name: "incomedetails",
    meta: {
      title: "收入明细",
      foot: true
    }
  },
  {
    path: "/member/member_income_incomedetails_info",
    component: IncomedetailsInfo,
    name: "income_details_info",
    meta: {
      title: "收入明细详情",
      foot: true
    }
  },
  // 修改自定义信息
  {
    path: "/member/info_costom",
    component: InfoCostom,
    name: "info_costom",
    meta: {
      title: "修改信息",
      foot: true
    }
  },
  // 余额支付密码
  {
    path: "/member/balance_password",
    component: BalancePassword,
    name: "balance_password",
    meta: {
      title: "修改支付密码",
      foot: true
    }
  },
  // 账号注销
  {
    path: "/member/memberCancel",
    component: MemberCancel,
    name: "MemberCancel",
    meta: {
      title: "账号注销",
      foot: true
    }
  },
  // 账号注销协议 聚合APP用
  {
    path: "/member/memberCancel/content",
    component: MemberCancelContent,
    name: "MemberCancelContent",
    meta: {
      title: "账号注销",
      foot: true
    }
  },
  // 设置余额支付密码
  {
    path: "/member/set_balance_password",
    component: SetBalancePassword,
    name: "set_balance_password",
    meta: {
      title: "设置支付密码",
      foot: true
    }
  },

  // 消息列表
  {
    path: "/member/message",
    component: Message,
    name: "message",
    meta: {
      title: "消息列表",
      foot: false
    }
  },
  {
    path: "/member/message_info/:id",
    component: MessageInfo,
    name: "messageInfo",
    meta: {
      title: "消息详情",
      foot: false
    }
  },

  {
    path: "/member/integraldetail/:id",
    component: Integraldetail,
    name: "integraldetail",
    meta: {
      title: "积分详情",
      foot: true
    }
  },
  {
    path: "/member/integrallist",
    component: IntegralList,
    name: "integrallist",
    meta: {
      title: "积分列表",
      foot: true
    }
  },
  {
    path: "/member/presentationRecord",
    component: PresentationRecord,
    name: "presentationRecord",
    meta: {
      title: "我的提成",
      foot: true
    }
  },
  {
    path: "/member/presentationRecord/:supplier",
    component: PresentationRecord,
    name: "supplierRecord",
    meta: {
      title: "我的提现",
      foot: true
    }
  },
  {
    path: "/member/presentationDetails/:record_id",
    component: PresentationDetails,
    name: "presentationDetails",
    meta: {
      title: "提现详情",
      foot: true
    }
  },
  {
    path: "/member/address",
    component: Address,
    name: "address",
    meta: {
      title: "默认地址",
      foot: true
    }
  },
  {
    path: "/member/alterAddress",
    component: AlterAddress,
    name: "alterAddress",
    meta: {
      title: "修改收货地址",
      foot: true
    }
  },
  {
    path: "/member/appendAddress",
    component: AppendAddress,
    name: "appendAddress",
    meta: {
      title: "添加收货地址",
      foot: true
    }
  },
  // income
  {
    path: "/member/distributionCommission",
    component: DistributionCommission,
    name: "distributionCommission",
    meta: {
      title: "未提现分销佣金",
      foot: true
    }
  },
  // tool
  {
    path: "/member/footprint",
    component: Footprint,
    name: "footprint",
    meta: {
      title: "我的足迹",
      foot: true
    }
  },
  {
    path: "/member/collection",
    component: Collection,
    name: "collection",
    meta: {
      title: "我的收藏",
      foot: true
    }
  },
  {
    path: "/member/myrelationship",
    component: MyRelationship,
    name: "myRelationship",
    meta: {
      title: "我的关系",
      foot: true
    }
  },
  {
    path: "/member/myrelationship/amount/:type",
    component: MyRelationshipAmount,
    name: "MyRelationshipAmount",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/member/myrelationship/detail/:uid",
    component: MyRelationshipDetail,
    name: "MyRelationshipDetail",
    meta: {
      title: "会员概况",
      foot: true
    }
  },
  {
    path: "/member/offlineSearch",
    component: OfflineSearch,
    name: "offlineSearch",
    meta: {
      title: "下线搜索",
      foot: true
    }
  },
  {
    path: "/member/myEvaluation",
    component: MyEvaluation,
    name: "myEvaluation",
    meta: {
      title: "我的评价",
      foot: true
    }
  },
  {
    path: "/member/comment",
    component: Comment,
    name: "comment",
    meta: {
      title: "多商品评价",
      foot: true
    }
  },
  {
    path: "/member/evaluationDetails",
    component: EvaluationDetails,
    name: "evaluationDetails",
    meta: {
      title: "评价详情",
      foot: true
    }
  },
  {
    path: "/member/myfriends",
    component: MyFriendApply,
    name: "MyFriendApply",
    meta: {
      title: "我的朋友",
      foot: true
    }
  },
  {
    path: "/member/coupon_exchange",
    component: CouponExchange,
    name: "CouponExchange",
    meta: {
      title: "兑换中心",
      foot: true
    }
  },
  {
    path: "/member/helpcenter",
    component: Helpcenter,
    name: "helpcenter",
    meta: {
      title: "帮助中心",
      foot: true
    }
  },
  // score
  {
    path: "/member/integral_activity",
    component: IntegralActivity,
    name: "IntegralActivity",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/member/Integral_generalization",
    component: IntegralGeneralization,
    name: "IntegralGeneralization",
    meta: {
      title: "发起赠送",
      foot: true
    }
  },
  {
    path: "/member/integral_get_record",
    component: IntegralGetRecord,
    name: "IntegralGetRecord",
    meta: {
      title: "领取记录",
      foot: true
    }
  },
  {
    path: "/member/integral_present",
    component: IntegralPresent,
    name: "IntegralPresent",
    meta: {
      title: "积分推广",
      foot: false
    }
  },
  {
    path: "/member/integral_record",
    component: IntegralRecord,
    name: "IntegralRecord",
    meta: {
      title: "赠送记录",
      foot: true
    }
  },
  // Love 爱心值
  {
    path: "/love_index",
    component: Love_index,
    name: "love_index",
    meta: {
      title: "",
      foot: true
    }
  },
  //冯荣成 加速池释放
  {
    path: "/love_speed_released",
    component: Love_Speed_Released,
    name: "love_speed_released",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/love_list",
    component: Love_list,
    name: "love_list",
    meta: {
      title: "明细",
      foot: true
    }
  },
  {
    path: "/love_transfer/:key?",
    component: Love_transfer,
    name: "love_transfer",
    meta: {
      title: "转账",
      foot: true
    }
  },
  {
    path: "/love_changein",
    component: Love_changein,
    name: "love_changein",
    meta: {
      title: "转入",
      foot: true
    }
  },
  {
    path: "/love_changeto",
    component: Love_changeto,
    name: "love_changeto",
    meta: {
      title: "转出",
      foot: true
    }
  },
  {
    path: "/love_give",
    component: Love_give,
    name: "love_give",
    meta: {
      title: "购物赠送详情",
      foot: true
    }
  },
  {
    path: "/love_details",
    component: Love_details,
    name: "love_details",
    meta: {
      title: "消费抵扣详情",
      foot: true
    }
  },
  {
    path: "/love_agent",
    component: Love_agent,
    name: "love_agent",
    meta: {
      title: "代理商奖励详情",
      foot: true
    }
  },
  {
    path: "/love_push",
    component: Love_push,
    name: "love_push",
    meta: {
      title: "直推奖奖励详情",
      foot: true
    }
  },
  {
    path: "/love_cash",
    component: Love_cash,
    name: "love_cash",
    meta: {
      title: "收入提现奖励详情",
      foot: true
    }
  },
  {
    path: "/love_record",
    component: Love_record,
    name: "love_record",
    meta: {
      title: "爱心值激活记录",
      foot: true
    }
  },
  {
    path: "/love_explain",
    component: Love_explain,
    name: "love_explain",
    meta: {
      title: "爱心值说明",
      foot: true
    }
  },
  {
    path: "/love_activation/:id",
    component: Love_activation,
    name: "love_activation",
    meta: {
      title: "激活详情",
      foot: true
    }
  },
  {
    path: "/loveWithdrawals",
    component: LoveWithdrawals,
    name: "loveWithdrawals",
    meta: {
      title: "提现",
      foot: true
    }
  },
  {
    path: "/lovePeriod",
    component: lovePeriod,
    name: "lovePeriod",
    meta: {
      title: "周期奖励记录",
      foot: true
    }
  },
  {
    path: "/lovePerformance",
    component: lovePerformance,
    name: "lovePerformance",
    meta: {
      title: "团队奖励记录",
      foot: true
    }
  },
  {
    path: "/loveGiftBag",
    component: LoveGiftBag,
    name: "loveGiftBag",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/loveCycleReceive",
    component: LoveCycleReceive,
    name: "loveCycleReceive",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/loveCashbackRecord",
    component: LoveCashbackRecord,
    name: "loveCashbackRecord",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/loveGiftQueue",
    component: LoveGiftQueue,
    name: "loveGiftQueue",
    meta: {
      title: "",
      foot: true
    }
  },

  // 信用值
  {
    path: "/creditValeuIndex",
    component: CreditValeuIndex,
    name: "creditValeuIndex",
    meta: {
      title: "信用值",
      foot: true
    }
  },
  {
    path: "/creditRecharge",
    component: CreditRecharge,
    name: "creditRecharge",
    meta: {
      title: "缴纳服务费",
      foot: true
    }
  },

  {
    path: "/creditGive",
    component: CreditGive,
    name: "creditGive",
    meta: {
      title: "赠送",
      foot: true
    }
  },

  {
    path: "/giveHistory",
    component: GiveHistory,
    name: "giveHistory",
    meta: {
      title: "赠送记录",
      foot: true
    }
  },
  {
    path: "/activateHistory",
    component: ActivateHistory,
    name: "activateHistory",
    meta: {
      title: "激活记录",
      foot: true
    }
  },
  {
    path: "/viewDetails",
    component: ViewDetails,
    name: "viewDetails",
    meta: {
      title: "查看明细",
      foot: true
    }
  },

  // article
  {
    path: "/notice",
    component: Notice,
    name: "notice",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/articleContent/:id",
    component: ArticleContent,
    name: "articleContent",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/noticeByCategory/:id",
    component: NoticeByCategory,
    name: "noticeByCategory",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/noticeReport/:id",
    component: NoticeReport,
    name: "noticeReport",
    meta: {
      title: "举报",
      foot: true
    }
  },
  {
    path: "/payEssay",
    component: payEssay,
    name: "payEssay",
    meta: {
      title: "已付费文章",
      foot: true
    }
  },
  {
    path: "/payList/:id",
    component: payList,
    name: "payList",
    meta: {
      title: "付费列表",
      foot: true
    }
  },
  // overseas 华侨币
  {
    path: "/overseas_index",
    component: Overseas_index,
    name: "overseas_index",
    meta: {
      title: "华侨币",
      foot: true
    }
  },
  {
    path: "/overseas_explain",
    component: Overseas_explain,
    name: "overseas_explain",
    meta: {
      title: "华侨币说明",
      foot: true
    }
  },
  {
    path: "/overseas_transfer",
    component: Overseas_transfer,
    name: "overseas_transfer",
    meta: {
      title: "华侨币转让",
      foot: true
    }
  },
  {
    path: "/overseas_record",
    component: Overseas_record,
    name: "overseas_record",
    meta: {
      title: "激活记录",
      foot: true
    }
  },
  {
    path: "/overseas_list",
    component: Overseas_list,
    name: "overseas_list",
    meta: {
      title: "激活明细",
      foot: true
    }
  },
  {
    path: "/overseas_balance_withdrawals",
    component: Overseas_balance_withdrawals,
    name: "overseas_balance_withdrawals",
    meta: {
      title: "提现到余额",
      foot: true
    }
  },

  // microshop
  {
    path: "/microShopShare/home/:shop_id",
    component: MicroShop_Share_home,
    name: "micro_shop_share_home",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/microShopShare/micro_shop_category",
    component: MicroShop_ShareCategory,
    name: "micro_shop_share_category",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/microShopShare/micro_share_catelist/:id/",
    component: CatelistShare,
    name: "micro_shop_share_carelist",
    meta: {
      title: "",
      foot: true
    }
  },

  {
    path: "/microShopAdd/micro_shop_category",
    component: MicroShop_AddCategory,
    name: "micro_shop_add_category",
    meta: {
      title: "商品分类",
      foot: true
    }
  },

  {
    path: "/microShop_apply",
    component: MicroShop_apply,
    name: "microShop_apply",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/microShop_apply_reg_info",
    component: MicroShop_apply_reg_info,
    name: "microShop_apply_reg_info",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/microShop/baseinfo",
    component: MicroShop_baseInfo,
    name: "microShop_baseinfo",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/microShop/micro_shop_category",
    component: MicroShop_Category,
    name: "micro_shop_category",
    meta: {
      title: "",
      foot: true
    }
  },

  // 参数id用来接收从分类页面传递过来的具体类别参数
  {
    path: "/catelist1/:id/",
    component: Catelist1,
    name: "catelist1",
    meta: {
      title: "分类列表",
      foot: true
    }
  },
  // {path: '/catelist1/:id/:isSelect', component: Catelist1, name: 'catelist1',meta: {	title: '分类列表', foot:true }},
  {
    path: "/microShop/home",
    component: MicroShop_home,
    name: "microShop_home",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/microShop/shopKeeperCenter",
    component: MicroShop_ShopKeeperCenter,
    name: "microShop_ShopKeeperCenter",
    meta: {
      title: "用户中心",
      foot: true
    }
  },

  // 路由参数用来控制显示哪个时间段的订单
  {
    path: "/microShop/orderDetail/:date",
    component: MicroShop_orderDetail,
    name: "microShop_orderDetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },

  // 路由参数用来控制显示哪个时间段的分红订单 （）
  {
    path: "/microShop/shareList/:date",
    component: MicroShop_shareList,
    name: "microShop_shareList",
    meta: {
      title: "分红列表",
      foot: true
    }
  },

  // 路由参数用来控制显示哪个分红订单的具体详情
  {
    path: "/microShop/shareDetail/:orderID",
    component: MicroShop_shareDetail,
    name: "microShop_shareDetail",
    meta: {
      title: "分红详情",
      foot: true
    }
  },
  {
    path: "/microShop/selectedGoods/:goods",
    component: MicroShop_selectedGoods,
    name: "microShop_selectedGoods",
    meta: {
      title: "已选商品",
      foot: true
    }
  },
  {
    path: "/microShop/manageShop",
    component: ManageShop,
    name: "manage_shop",
    meta: {
      title: "",
      foot: true
    }
  },

  // extension
  {
    path: "/extension/manage",
    component: Manage,
    name: "manage",
    meta: {
      title: "管理奖",
      foot: true
    }
  },
  {
    path: "/member/extension",
    component: Extension,
    name: "extension",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/extension/distribution",
    component: Distribution,
    name: "distribution",
    meta: {
      title: "分销商",
      foot: true
    }
  },
  {
    path: "/extension/commission",
    component: Commission,
    name: "commission",
    meta: {
      title: "预计佣金",
      foot: true
    }
  },
  {
    path: "/extension/commissionDetails",
    component: CommissionDetails,
    name: "commissionDetails",
    meta: {
      title: "预计佣金详情",
      foot: true
    }
  },
  {
    path: "/extension/unsettled",
    component: Unsettled,
    name: "unsettled",
    meta: {
      title: "未结算佣金",
      foot: true
    }
  },
  {
    path: "/extension/unsettledDetails",
    component: UnsettledDetails,
    name: "unsettledDetails",
    meta: {
      title: "未结算佣金详情",
      foot: true
    }
  },
  {
    path: "/extension/alreadySettled",
    component: AlreadySettled,
    name: "alreadySettled",
    meta: {
      title: "已结算佣金",
      foot: true
    }
  },
  {
    path: "/extension/alreadySettledDetails",
    component: AlreadySettledDetails,
    name: "alreadySettledDetails",
    meta: {
      title: "已结算佣金详情",
      foot: true
    }
  },
  {
    path: "/extension/notPresent",
    component: NotPresent,
    name: "notPresent",
    meta: {
      title: "未提现佣金",
      foot: true
    }
  },
  {
    path: "/extension/notPresentDetails",
    component: NotPresentDetails,
    name: "notPresentDetails",
    meta: {
      title: "未提现佣金详情",
      foot: true
    }
  },
  {
    path: "/extension/present",
    component: Present,
    name: "present",
    meta: {
      title: "已提现佣金",
      foot: true
    }
  },
  {
    path: "/extension/invalid/:type",
    component: Present,
    name: "invalid",
    meta: {
      title: "无效佣金",
      foot: true
    }
  },
  {
    path: "/extension/presentDetails",
    component: PresentDetails,
    name: "presentDetails",
    meta: {
      title: "已提现佣金详情",
      foot: true
    }
  },
  {
    path: "/extension/distributionOrder",
    component: DistributionOrder,
    name: "distributionOrder",
    meta: {
      title: "分销订单",
      foot: true
    }
  },
  {
    path: "/extension/extendIncome",
    component: ExtendIncome,
    name: "extendIncome",
    meta: {
      title: "推广收入",
      foot: false
    }
  }, // new
  {
    path: "/extension/merchantsDividendRatio",
    component: MerchantsDividendRatio,
    name: "merchantsDividendRatio",
    meta: {
      title: "招商员",
      foot: true
    }
  }, // new
  // 上级奖
  {
    path: "/superior",
    component: superior,
    name: "superior",
    meta: {
      title: "上级奖",
      foot: true
    }
  },
  {
    path: "/shareholderCenter",
    component: ShareholderCenter,
    name: "shareholderCenter",
    meta: {
      title: "股东中心",
      foot: true
    }
  },
  {
    path: "/teamAgentCenter",
    component: TeamAgentCenter,
    name: "teamAgentCenter",
    meta: {
      title: " ",
      foot: true
    }
  },
  {
    path: "/newAgentCenter",
    component: newAgentCenter,
    name: "newAgentCenter",
    meta: {
      title: " ",
      foot: true
    }
  },
  {
    path: "/teamPerformance",
    component: TeamPerformance,
    name: "teamPerformance",
    meta: {
      title: "团队业绩",
      foot: true
    }
  },
  {
    path: "/newteamPerformance",
    component: newTeamPerformance,
    name: "newteamPerformance",
    meta: {
      title: "团队业绩",
      foot: true
    }
  },
  {
    path: "/FranchiserRed",
    component: FranchiserRed,
    name: "FranchiserRed",
    meta: {
      title: "红包奖励记录列表",
      foot: true
    }
  },
  {
    path: "/newFranchiserRed",
    component: newFranchiserRed,
    name: "newFranchiserRed",
    meta: {
      title: "红包奖励记录列表",
      foot: true
    }
  },
  {
    path: "/teamCode",
    component: TeamCode,
    name: "teamCode",
    meta: {
      title: "我的激活码",
      foot: true
    }
  },
  {
    path: "/newteamCode",
    component: newTeamCode,
    name: "newteamCode",
    meta: {
      title: "我的激活码",
      foot: true
    }
  },
  {
    path: "/teamClient",
    component: TeamClient,
    name: "TeamClient",
    meta: {
      title: "我的客户",
      foot: true
    }
  },
  {
    path: "/newteamClient",
    component: newTeamClient,
    name: "newTeamClient",
    meta: {
      title: "我的客户",
      foot: true
    }
  },
  {
    path: "/codeHistory",
    component: CodeHistory,
    name: "codeHistory",
    meta: {
      title: "使用记录",
      foot: true
    }
  },
  {
    path: "/newcodeHistory",
    component: newCodeHistory,
    name: "newcodeHistory",
    meta: {
      title: "使用记录",
      foot: true
    }
  },
  {
    path: "/investmentCenter",
    component: InvestmentCenter,
    name: "investmentCenter",
    meta: {
      title: "招商中心",
      foot: true
    }
  },
  {
    path: "/regionalAgencyCenter",
    component: RegionalAgencyCenter,
    name: "regionalAgencyCenter",
    meta: {
      title: " ",
      foot: true
    }
  },
  {
    path: "/applyRegionalAgency",
    component: ApplyRegionalAgency,
    name: "applyRegionalAgency",
    meta: {
      title: "申请区域代理",
      foot: true
    }
  },
  {
    path: "/fixedReward",
    component: FixedReward,
    name: "fixedReward",
    meta: {
      title: "固定奖励",
      foot: true
    }
  },
  {
    path: "/courseIncome",
    component: CourseIncome,
    name: "courseIncome",
    meta: {
      title: "讲师分红",
      foot: true
    }
  },
  {
    path: "/DailyRed",
    component: DailyRed,
    name: "DailyRed",
    meta: {
      title: "",
      foot: false,
      is_single_share: true
    }
  },
  {
    path: "/GetRedRecord/:tag",
    component: GetRedRecord,
    name: "GetRedRecord",
    meta: {
      title: "红包领取记录",
      foot: true
    }
  },
  {
    path: "/RedAmount/:tag",
    component: RedAmount,
    name: "RedAmount",
    meta: {
      title: "红包额度记录",
      foot: true
    }
  },
  {
    path: "/RedReward",
    component: RedReward,
    name: "RedReward",
    meta: {
      title: "经销商红包奖励",
      foot: true
    }
  },
  {
    path: "/redRank",
    component: redRank,
    name: "redRank",
    meta: {
      title: "红包排名",
      foot: true
    }
  },
  // 红包二开
  {
    path: "/DailyRedHome",
    component: DailyRedHome,
    name: "DailyRedHome",
    meta: {
      title: "红包奖励",
      foot: false,
      is_single_share: true
    }
  },
  // 推广页
  {
    path: "/extensionPage",
    component: ExtensionPage,
    name: "ExtensionPage",
    meta: {
      title: "推广页",
      foot: true
    }
  },
  {
    path: "/awardRanking",
    component: AwardRanking,
    name: "AwardRanking",
    meta: {
      title: "奖项排行",
      foot: true
    }
  },
  {
    path: "/recordOfAwards/:id",
    component: RecordOfAwards,
    name: "RecordOfAwards",
    meta: {
      title: "奖励记录",
      foot: true
    }
  },
  {
    path: "/myIncome",
    component: MyIncome,
    name: "MyIncome",
    meta: {
      title: "我的收入",
      foot: true
    }
  },
  // 数据统计
  {
    path: "/myEarnings",
    component: myEarnings,
    name: "myEarnings",
    meta: { title: "领取收益", foot: true }
  },
  {
    path: "/earningList",
    component: earningList,
    name: "earningList",
    meta: { title: "领取收益", foot: true }
  },
  {
    path: "/stockholderBonus",
    component: stockholderBonus,
    name: "stockholderBonus",
    meta: { title: "", foot: true }
  },
  {
    path: "/point_activity_award_center",
    component: point_activity_award_center,
    name: "point_activity_award_center",
    meta: { title: "积分活动奖励", foot: true }
  },
  //区域选择
  {
    path: "/selectionarea",
    component: Selectionarea,
    name: "selectionarea",
    meta: { title: "区域选择", foot: true }
  },
  //区域分红
  {
    path: "/regionaldividend",
    component: Regionaldividend,
    name: "regionaldividend",
    meta: { title: "区域分红", foot: true }
  },
  //区域分红详情
  {
    path: "/detailsdividends",
    component: Detailsdividends,
    name: "detailsdividends",
    meta: { title: "区域分红详情", foot: true }
  },
  // 信用值
  {
    path: "/member/creditInfo",
    component: CreditInfo,
    name: "creditInfo",
    meta: {
      title: "信用值",
      foot: true
    }
  },
  // supplier
  {
    path: "/member/supplier",
    component: Supplier,
    name: "supplier",
    meta: {
      title: "供应商申请",
      foot: true
    }
  },
  // comment
  {
    path: "/CommentDetails/:order_id/:goods_id/:order_goods_id?/:comment_id/:uid",
    component: CommentDetails,
    name: "CommentDetails",
    meta: {
      title: "评价详情",
      foot: true
    }
  },
  {
    path: "/ReCommentDetails",
    component: ReCommentDetails,
    name: "ReCommentDetails",
    meta: {
      title: "追加评价",
      foot: true
    }
  },
  {
    path: "/OtherCommentDetails",
    component: OtherCommentDetails,
    name: "othercommentdetails",
    meta: {
      title: "其它评价",
      foot: true
    }
  },
  // order
  {
    path: "/member/alipay/:status/:url",
    component: Alipay,
    name: "alipayCloud",
    meta: {
      title: "支付宝",
      foot: true
    }
  },
  {
    path: "/member/alipay/:status/:recharge_money/:order_pay_id/:uid/:pid",
    component: Alipay,
    name: "alipay",
    meta: {
      title: "支付宝",
      foot: true
    }
  },
  // 冻结币--支付
  {
    path: "/member/alipay/:status/:recharge_money/:order_pay_id/:uid/:pid/:tag",
    component: Alipay,
    name: "fre_alipay",
    meta: {
      title: "支付宝",
      foot: true
    }
  },
  // 爱心值--支付
  {
    path: "/member/alipay/:status/:recharge_money/:order_pay_id/:uid/:pid/:tag",
    component: Alipay,
    name: "love_alipay",
    meta: {
      title: "支付宝",
      foot: true
    }
  },
  //汇聚支付宝
  {
    path: "/member/HJalipay/:status/:order_pay_id",
    component: Alipay,
    name: "HJalipay",
    meta: {
      title: "支付宝",
      foot: true
    }
  },
  {
    path: "/member/alipayClockin/:status/:url",
    component: AlipayClockin,
    name: "alipayClockin",
    meta: {
      title: "支付宝",
      foot: true
    }
  },
  {
    path: "/member/alipayCourse/:status/:url",
    component: Alipay,
    name: "alipayCourse",
    meta: {
      title: "支付宝",
      foot: true
    }
  },
  {
    path: "/member/wxpay/:status",
    component: Wxpay,
    name: "wxpay",
    meta: {
      title: "微信",
      foot: true
    }
  },
  {
    path: "/member/orderList/:status/:orderType?",
    component: OrderList,
    name: "orderlist",
    meta: {
      title: "我的订单",
      foot: true
    }
  },
  {
    path: "/member/orderList/:status/:orderType",
    component: OrderList,
    name: "cashierOrderlist",
    meta: {
      title: "订单",
      foot: true
    }
  },
  {
    path: "/member/orderList/:status/:orderType",
    component: OrderList,
    name: "storeOrderlist",
    meta: {
      title: "订单",
      foot: true
    }
  },
  {
    path: "/member/orderList/:status/:orderType",
    component: OrderList,
    name: "supplierOrderlist",
    meta: {
      title: "订单",
      foot: true
    }
  },
  {
    path: "/member/orderList/:status/:orderType",
    component: OrderList,
    name: "hotelOrderlist",
    meta: {
      title: "酒店订单",
      foot: true
    }
  },
  {
    path: "/member/orderList/:status/:orderType",
    component: OrderList,
    name: "auctionOrderlist",
    meta: {
      title: "拍卖订单",
      foot: true
    }
  },
  {
    path: "/group/orderList/:status/:orderType",
    component: OrderList,
    name: "GroupOrderlist",
    meta: {
      title: "拼团订单",
      foot: true
    }
  },
  {
    path: "/lease_toy/orderList/:status/:orderType",
    component: OrderList,
    name: "lease_toyOrderlist",
    meta: {
      title: "租赁订单",
      foot: true
    }
  },
  {
    path: "/stockorderList/:stock",
    component: OrderList,
    name: "stockorderList",
    meta: {
      title: "订单存货",
      foot: true
    }
  },
  {
    path: "/deliveryStation/DeliveryReplenish/:status/:orderType",
    component: OrderList,
    name: "DeliveryReplenish",
    meta: {
      title: "补货单",
      foot: true
    }
  },
  {
    path: "/hireCar/serviceReplenish/:status/:orderType",
    component: OrderList,
    name: "serviceReplenish",
    meta: {
      title: "补货单",
      foot: true
    }
  },
  {
    path: "/subsidiary/orderList",
    component: OrderList,
    name: "subsidiary",
    meta: {
      title: "分公司订单",
      foot: true
    }
  },
  {
    path: "/member/express/:refund_id",
    component: OrderExpress,
    name: "express",
    meta: {
      title: "退款快递信息",
      foot: true
    }
  },
  {
    path: "/member/orderdetail/:order_id/:orderType?",
    component: Goodsinfo,
    name: "orderdetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/member/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "cashierOrderdetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/member/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "storeOrderdetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/member/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "supplierOrderdetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/member/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "commissionOrderdetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/member/logistics",
    component: Logistics,
    name: "logistics",
    meta: {
      title: "物流详情",
      foot: true
    }
  },
  {
    path: "/member/logisticsDetails",
    component: OrderLogisticsDetails,
    name: "orderLogisticsDetails",
    meta: {
      title: "物流详情",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/member/track",
    component: track,
    name: "track",
    meta: {
      title: "物流轨迹",
      foot: true
    }
  },
  {
    path: "/member/evaluate/:order_id/:id",
    component: Evaluate,
    name: "evaluate",
    meta: {
      title: "评价",
      foot: true
    }
  },
  {
    path: "/member/replyEvaluate",
    component: ReplyEvaluate,
    name: "replyEvaluate",
    meta: {
      title: "回复评论",
      foot: true
    }
  },
  {
    path: "/member/addevaluate",
    component: Addevaluate,
    name: "addevaluate",
    meta: {
      title: "追加评价",
      foot: true
    }
  },
  {
    path: "/member/refund/:order_id/:order_type",
    component: Refund,
    name: "refund",
    meta: {
      title: "申请售后",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/member/aftersaleslist",
    component: Aftersaleslist,
    name: "aftersaleslist",
    meta: {
      title: "售后列表",
      foot: true
    }
  },
  {
    path: "/member/aftersales/:refund_id",
    component: Aftersales,
    name: "aftersales",
    meta: {
      title: "售后详情",
      foot: true
    }
  },
  {
    path: "/member/orderpay/:order_ids",
    component: OrderPay,
    name: "orderpay",
    meta: {
      title: "订单支付",
      foot: true
    }
  },
  {
    path: "/member/order/verification/:order_id/:api",
    component: OrderVerification,
    name: "orderVerification",
    meta: {
      title: "订单核销",
      foot: true
    }
  },
  {
    path: "/member/order/cash/:order_pay_id/:pid",
    component: OrderCash,
    name: "orderCash",
    meta: {
      title: "门店支付",
      foot: true
    }
  },
  {
    path: "/member/orderrecord/:order_id",
    component: OrderRecord,
    name: "OrderRecord",
    meta: {
      title: "汇款记录",
      foot: true
    }
  },
  {
    path: "/member/negotiationRecord/:refund_id",
    component: NegotiationRecord,
    name: "negotiationRecord",
    meta: {
      title: "协商记录",
      foot: true
    }
  },

  // {path: '/member/orderpay/:status/:order_ids', component: OrderPay, name: 'orderpay',meta: { title: '订单支付', foot:true }},
  // orderpay
  {
    path: "/member/payErr",
    component: PayErr,
    name: "payErr",
    meta: {
      title: "支付取消或失败",
      foot: "true"
    }
  }, // 支付错误
  {
    path: "/member/payYes",
    component: PayYes,
    name: "PayYes",
    meta: {
      title: "支付成功",
      foot: "true"
    }
  }, // 支付成功
  {
    path: "/member/blacklist",
    component: Blacklist,
    name: "blacklist",
    meta: {
      title: "黑名单",
      foot: "true"
    }
  },
  {
    path: "/member/mandate",
    component: Mandate,
    name: "mandate",
    meta: {
      title: "微信授权失败",
      foot: "true"
    }
  },
  // coupon
  {
    path: "/coupon/coupon_index",
    component: Coupon,
    name: "coupon",
    meta: {
      title: "优惠券",
      foot: false
    }
  },
  {
    path: "/coupon/coupon_store",
    component: CouponStore,
    name: "couponStore",
    meta: {
      title: "领券中心",
      foot: false
    }
  },
  {
    path: "/coupon/coupon_share_code",
    component: CouponShareCode,
    name: "CouponShareCode",
    meta: {
      title: "优惠券",
      foot: true
    }
  },
  {
    path: "/coupon/shareShow",
    component: CouponShareShow,
    name: "CouponShareShow",
    meta: {
      title: "优惠券",
      foot: true
    }
  },
  {
    path: "/coupon/shareGet",
    component: CouponShareGet,
    name: "CouponShareGet",
    meta: {
      title: "优惠券",
      foot: true
    }
  },
  {
    path: "/coupon/checkList",
    component: CouponCheckList,
    name: "CouponCheckList",
    meta: {
      title: "优惠券核销",
      foot: false
    }
  },
  {
    path: "/coupon/independent_share/:id",
    component: CouponIndependent,
    name: "CouponIndependent",
    meta: {
      title: "优惠券详情",
      foot: true
    }
  },
  {
    path: "/coupon/coupon_info",
    component: CouponInfo,
    name: "couponInfo",
    meta: {
      title: "详情",
      foot: true
    }
  },
  {
    path: "/coupon/share/:order_id",
    component: CouponShare,
    name: "couponShare",
    meta: {
      title: "分享优惠券",
      foot: true
    }
  },
  {
    path: "/coupon/get_coupon_from/:coupon_id",
    component: get_coupon_from,
    name: "get_coupon_from",
    meta: {
      title: "领取优惠券",
      foot: true
    }
  },
  {
    path: "/coupon/get_coupon/:order_id",
    component: getCoupon,
    name: "getCoupon",
    meta: {
      title: "领取优惠券",
      foot: true
    }
  },
  {
    path: "/coupon/coupon_v2_detail",
    component: coupon_v2_detail,
    name: "coupon_v2_detail",
    meta: {
      title: "优惠券详情",
      foot: true
    }
  },
  // plug
  // {
  //   path: '/member/marketing',
  //   component: Marketing,
  //   name: 'marketing',
  //   meta: {
  //     title: '营销工具',
  //     foot: true
  //   }
  // },
  // {
  //   path: '/member/messageSettings',
  //   component: MessageSettings,
  //   name: 'messageSettings',
  //   meta: {
  //     title: '消息提醒设置',
  //     foot: true
  //   }
  // },
  // Other
  {
    path: "/search",
    component: Search,
    name: "search",
    meta: {
      title: "搜索",
      foot: true
    }
  },
  {
    path: "/act_search",
    component: ActSearch,
    name: "act_search",
    meta: {
      title: "商品搜索",
      foot: true
    }
  },
  {
    path: "/selfPickupPoint/search",
    component: Search,
    name: "selfPickSearch",
    meta: {
      title: "搜索",
      foot: true
    }
  },
  {
    path: "/searchall",
    component: SearchAll,
    name: "searchAll",
    meta: {
      title: "全部商品",
      foot: true
    }
  },
  {
    path: "/login",
    component: Login,
    name: "login",
    meta: {
      title: "登录",
      foot: true
    }
  },
  {
    path: "/register",
    component: Register,
    name: "register",
    meta: {
      title: "注册",
      foot: true
    }
  },
  {
    path: "/haifen_register",
    component: haifenRegister,
    name: "haifenRegister",
    meta: {
      title: "注册",
      foot: true
    }
  },
  {
    path: "/registerAgreement",
    component: RegisterAgreement,
    name: "registerAgreement",
    meta: {
      title: "协议",
      foot: true
    }
  },

  {
    path: "/findpwd",
    component: Findpwd,
    name: "findpwd",
    meta: {
      title: "忘记密码",
      foot: true
    }
  },
  {
    path: "/register_guide",
    component: RegisterGuide,
    name: "RegisterGuide",
    meta: {
      title: "下载APP",
      foot: true
    }
  },
  {
    path: "/category",
    component: Category,
    name: "category",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/selfPickupPoint/category",
    component: Category,
    name: "selfPickCategory", //自提点关联的供应商的商品和平台商品（包含聚合供应链商品）其他供应商商品不显示
    meta: { title: "分类", foot: false }
  },
  {
    path: "/category_child/:id",
    component: CategoryChild,
    name: "category_child",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/catelist/:id/:type?",
    component: Catelist,
    name: "catelist",
    meta: {
      title: "分类列表",
      foot: false
    }
  },
  {
    path: "/brand",
    component: Brand,
    name: "brand",
    meta: {
      title: "品牌",
      foot: false
    }
  },
  {
    path: "/brandgoods/:id",
    component: BrandGoods,
    name: "brandgoods",
    meta: {
      title: "品牌商品",
      foot: true
    }
  },
  {
    path: "/cart",
    component: Cart,
    name: "cart",
    meta: {
      title: "购物车",
      foot: false
    }
  },
  {
    path: "/cart_share",
    component: CartShare,
    name: "CartShare",
    meta: {
      title: "购物车分享",
      foot: true
    }
  },
  {
    path: "/cart/settlement",
    component: Settlement,
    name: "settlement",
    meta: {
      title: "结算",
      foot: true
    }
  },
  ///grabGroup/:id(id为商品id)
  { path: "/grabGroup/:id", component: Goods, name: "grab_group", meta: { title: "抢团活动详情", foot: true } },
  {
    path: "/goods/:id/:coid?",
    component: Goods,
    name: "goods",
    meta: {
      title: "商品详情",
      is_single_share: true,
      foot: true
    }
  },
  {
    // 新零售商品
    path: "/newRetail/good/:id/:mode",
    component: Goods,
    name: "newRetailSalesGood",
    meta: { title: "商品详情", foot: true }
  },
  {
    path: "/comment/:id",
    component: GoodsComment,
    name: "GoodsComment",
    meta: {
      title: "商品评论",
      foot: true
    }
  },
  {
    path: "/groupWork/goods/:id",
    component: Goods,
    name: "groupWorkGood", //0.1元拼团
    meta: {
      title: "拼团活动详情",
      foot: true
    }
  },
  {
    path: "/packageGoods/:id",
    component: PackageGoods,
    name: "packageGoods",
    meta: {
      title: "商品套餐页",
      foot: true
    }
  },
  {
    path: "/goods/:id/:tag/:store_id",
    component: GoodsO2O,
    name: "goodsO2O",
    meta: {
      title: "商品详情",
      is_single_share: true,
      foot: true
    }
  },
  // 扫码柜子商品
  {
    path: "/goods/:id/:mark",
    component: CupGoods,
    name: "CupGoods",
    meta: {
      title: "商品详情",
      is_single_share: true,
      foot: true
    }
  },
  // {path: '/goodsorder/:tag/:goodsId/:optionsId/:total/:cart_ids', component: GoodsOrder,name: 'goodsorder',meta: {  title: '填写订单', foot:true }},
  {
    path: "/orderDiyForm/:id",
    component: GoodsOrderDiyForm,
    name: "GoodsOrderDiyForm",
    meta: {
      title: "填写资料",
      foot: true
    }
  },
  {
    path: "/goodsorder",
    component: GoodsOrder,
    name: "goodsorder",
    meta: {
      title: "填写订单",
      foot: true
    }
  },
  {
    path: "/goods/goodstabs/:id/:goods",
    component: Goodstabs,
    name: "goodstab",
    meta: {
      title: "商品详情内容",
      is_single_share: true,
      foot: true
    }
  },
  // {path:'/addons/yun_shop',redirect:'/'}

  // sign
  {
    path: "/member/sign",
    component: Sign,
    name: "sign",
    meta: {
      title: "签到",
      foot: true
    }
  },
  {
    path: "/member/signrules",
    component: Signrules,
    name: "signrules",
    meta: {
      title: "规则说明",
      foot: true
    }
  },
  {
    path: "/member/signrecord",
    component: Signrecord,
    name: "signrecord",
    meta: {
      title: "签到记录",
      foot: true
    }
  },
  // 排行榜 old
  // {
  //   path: "/ranking/index",
  //   component: RankingIndex,
  //   name: "rankingIndex",
  //   meta: {
  //     title: "排行榜",
  //     foot: true
  //   }
  // },
  // {
  //   path: "/ranking/list/first/:action/:key",
  //   component: RankingListFirst,
  //   name: "rankingListFirst",
  //   meta: {
  //     title: "排行榜列表",
  //     foot: true
  //   }
  // },
  // {
  //   path: "/ranking/list/second/:action",
  //   component: RankingListSecond,
  //   name: "rankingListSecond",
  //   meta: {
  //     title: "排行榜列表",
  //     foot: true
  //   }
  // },

  //排行榜 new
  { path: "/Rankings", component: RankingIndex, name: "rankingIndex", meta: { title: "排行榜", foot: true } },

  // service
  // 手机充值 ServiceOrderList
  {
    path: "/service",
    component: Service,
    name: "service",
    meta: {
      title: "我的服务",
      foot: true
    }
  },
  {
    path: "/serviceOrderList/:status",
    component: ServiceOrderList,
    name: "serviceOrderList",
    meta: {
      title: "服务订单列表",
      foot: true
    }
  },

  {
    path: "/phoneRecharge",
    component: PhoneRecharge,
    name: "phoneRecharge",
    meta: {
      title: "手机充值",
      foot: true
    }
  },
  {
    path: "/mobileBinding",
    component: MobileBinding,
    name: "mobileBinding",
    meta: {
      title: "手机绑定列表",
      foot: true
    }
  },
  {
    path: "/rechargePay",
    component: RechargePay,
    name: "rechargePay",
    meta: {
      title: "充值支付",
      foot: true
    }
  },
  {
    path: "/orderDetailsPaied",
    component: OrderDetailsPaied,
    name: "orderDetailsPaied",
    meta: {
      title: "已支付",
      foot: true
    }
  },
  {
    path: "/orderDetailsNoPay",
    component: OrderDetailsNoPay,
    name: "orderDetailsNoPay",
    meta: {
      title: "未支付",
      foot: true
    }
  },
  {
    path: "/rechargeRecord",
    component: RechargeRecord,
    name: "rechargeRecord",
    meta: {
      title: "手机充值记录",
      foot: true
    }
  },
  {
    path: "/flowRechargeRecord",
    component: FlowRechargeRecord,
    name: "flowRechargeRecord",
    meta: {
      title: "流量充值记录",
      foot: true
    }
  },
  {
    path: "/rechargeDetail/:orderId",
    component: RechargeDetail,
    name: "rechargeDetail",
    meta: {
      title: "记录详情",
      foot: true
    }
  },
  {
    path: "/flowRechargeDetail/:orderId",
    component: FlowRechargeDetail,
    name: "flowRechargeDetail",
    meta: {
      title: "流量记录详情",
      foot: true
    }
  },

  // 油卡充值
  {
    path: "/addCard/:tag",
    component: AddCard,
    name: "addCard",
    meta: {
      title: "新增油卡",
      foot: true
    }
  },
  {
    path: "/cardServer",
    component: CardServer,
    name: "cardServer",
    meta: {
      title: "油卡服务",
      foot: true
    }
  },
  {
    path: "/oilNoPay",
    component: OilNoPay,
    name: "oilNoPay",
    meta: {
      title: "油卡支付",
      foot: true
    }
  },
  {
    path: "/oilDetailsPaied",
    component: OilDetailsPaied,
    name: "oilDetailsPaied",
    meta: {
      title: "油卡支付",
      foot: true
    }
  },
  {
    path: "/oilRecharge/:tag",
    component: OilRecharge,
    name: "oilRecharge",
    meta: {
      title: "油卡支付",
      foot: true
    }
  },
  {
    path: "/oilRechargePay/:para",
    component: OilRechargePay,
    name: "oilRechargePay",
    meta: {
      title: "油卡支付",
      foot: true
    }
  },

  // Ticket机票
  {
    path: "/ticket",
    component: Ticket,
    name: "ticket",
    meta: {
      title: "国内机票",
      foot: true
    }
  },
  {
    path: "/ticket/city",
    component: City,
    name: "city",
    meta: {
      title: "城市",
      foot: true
    }
  },
  {
    path: "/ticketOrder",
    component: TicketOrder,
    name: "ticketOrder",
    meta: {
      title: "机票订单",
      foot: true
    }
  },
  {
    path: "/searchResults",
    component: SearchResults,
    name: "searchResults",
    meta: {
      title: "搜索航班结果",
      foot: true
    }
  },
  {
    path: "/flightPrice/:id",
    component: FlightPrice,
    name: "flightPrice",
    meta: {
      title: "航班价格",
      foot: true
    }
  },
  {
    path: "/newAddPassenger",
    component: NewAddPassenger,
    name: "newAddPassenger",
    meta: {
      title: "新增乘机人",
      foot: true
    }
  },
  {
    path: "/modifyContacts",
    component: ModifyContacts,
    name: "modifyContacts",
    meta: {
      title: "修改联系人",
      foot: true
    }
  },

  {
    path: "/addOrder/:id/:parentId",
    component: AddOrder,
    name: "addOrder",
    meta: {
      title: "添加订单",
      foot: true
    }
  },
  {
    path: "/refundApplication",
    component: RefundApplication,
    name: "refundApplication",
    meta: {
      title: "退票申请",
      foot: true
    }
  },
  {
    path: "/ticketOrderDetail",
    component: TicketOrderDetail,
    name: "ticketOrderDetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/changeAgreement",
    component: ChangeAgreement,
    name: "changeAgreement",
    meta: {
      title: "改退协议",
      foot: true
    }
  },
  {
    path: "/ticket_pay/:para",
    component: Ticket_pay,
    name: "ticket_pay",
    meta: {
      title: "机票下单",
      foot: true
    }
  },

  // game
  {
    path: "/gameSearch",
    component: GameSearch,
    name: "gameSearch",
    meta: {
      title: "游戏搜索",
      foot: true
    }
  },
  {
    path: "/gameIsPay",
    component: GameIsPay,
    name: "gameIsPay",
    meta: {
      title: "游戏已支付",
      foot: true
    }
  },
  {
    path: "/gameNoPay",
    component: GameNoPay,
    name: "gameNoPay",
    meta: {
      title: "游戏未支付",
      foot: true
    }
  },
  {
    path: "/gameFlingRecharge",
    component: GameFlingRecharge,
    name: "gameFlingRecharge",
    meta: {
      title: "游戏直冲充值",
      foot: true
    }
  },
  {
    path: "/gamePasswordRecharge",
    component: GamePasswordRecharge,
    name: "gamePasswordRecharge",
    meta: {
      title: "游戏卡密充值",
      foot: true
    }
  },

  // newService
  {
    path: "/lifeService",
    component: LifeService,
    name: "lifeService",
    meta: {
      title: "生活缴费",
      foot: true
    }
  },
  {
    path: "/lifeService/telephone",
    component: Telephone,
    name: "telephone",
    meta: {
      title: "话费充值",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/lifeService/flow",
    component: Flow,
    name: "flow",
    meta: {
      title: "流量",
      foot: true,
      notKeepAlive: true
    }
  },
  // lifePayment
  {
    path: "/electricity",
    component: Electricity,
    name: "electricity",
    meta: {
      title: "电费",
      foot: true
    }
  },
  {
    path: "/electricityPay/:para",
    component: ElectricityPay,
    name: "electricityPay",
    meta: {
      title: "电费支付",
      foot: true
    }
  },
  {
    path: "/waterFee",
    component: WaterFee,
    name: "waterFee",
    meta: {
      title: "水费",
      foot: true
    }
  },
  {
    path: "/waterFeePay/:para",
    component: WaterFeePay,
    name: "waterFeePay",
    meta: {
      title: "水费支付",
      foot: true
    }
  },
  {
    path: "/fixedTelephone",
    component: FixedTelephone,
    name: "fixedTelephone",
    meta: {
      title: "固话",
      foot: true
    }
  },
  {
    path: "/fixedTelephonePay/:para",
    component: FixedTelephonePay,
    name: "fixedTelephonePay",
    meta: {
      title: "固话支付",
      foot: true
    }
  },

  {
    path: "/broadband",
    component: Broadband,
    name: "broadband",
    meta: {
      title: "宽带",
      foot: true
    }
  },
  {
    path: "/broadbandPay/:para",
    component: BroadbandPay,
    name: "broadbandPay",
    meta: {
      title: "宽带支付",
      foot: true
    }
  },

  {
    path: "/gasCosts",
    component: GasCosts,
    name: "gasCosts",
    meta: {
      title: "燃气费",
      foot: true
    }
  },

  {
    path: "/lifePayNoPay",
    component: LifePayNoPay,
    name: "lifePayNoPay",
    meta: {
      title: "未支付",
      foot: true
    }
  },
  {
    path: "/lifePayIsPaied",
    component: LifePayIsPaied,
    name: "lifePayIsPaied",
    meta: {
      title: "已支付",
      foot: true
    }
  },
  {
    path: "/lifePayIndex",
    component: LifePayIndex,
    name: "lifePayIndex",
    meta: {
      title: "生活缴费",
      foot: true
    }
  },
  {
    path: "/paymentRecord",
    component: PaymentRecord,
    name: "paymentRecord",
    meta: {
      title: "缴费记录",
      foot: true
    }
  },

  // 交通罚款
  {
    path: "/trafficIndex",
    component: TrafficIndex,
    name: "trafficIndex",
    meta: {
      title: "交通罚款",
      foot: true
    }
  },
  {
    path: "/trafficConfirmOrder",
    component: TrafficConfirmOrder,
    name: "trafficConfirmOrder",
    meta: {
      title: "交通罚款下单",
      foot: true
    }
  },
  {
    path: "/trafficCity",
    component: TrafficCity,
    name: "trafficCity",
    meta: {
      title: "选择城市",
      foot: true
    }
  },
  {
    path: "/trafficRecord",
    component: TrafficRecord,
    name: "trafficRecord",
    meta: {
      title: "罚款记录",
      foot: true
    }
  },
  {
    path: "/trafficOrderNoPay",
    component: TrafficOrderNoPay,
    name: "trafficOrderNoPay",
    meta: {
      title: "缴费未支付",
      foot: true
    }
  },
  {
    path: "/trafficOrderlsPaied",
    component: TrafficOrderlsPaied,
    name: "trafficOrderlsPaied",
    meta: {
      title: "缴费支付中",
      foot: true
    }
  },
  // Train ticket 火车票
  {
    path: "/trainTicket",
    component: TrainTicket,
    name: "trainTicket",
    meta: {
      title: "火车票",
      foot: true
    }
  },
  {
    path: "/trainTicketOrder",
    component: TrainTicketOrder,
    name: "trainTicketOrder",
    meta: {
      title: "我的订单",
      foot: true
    }
  },
  {
    path: "/trainCity",
    component: TrainCity,
    name: "trainCity",
    meta: {
      title: "城市",
      foot: true
    }
  },
  {
    path: "/trainSearchResults",
    component: TrainSearchResults,
    name: "trainSearchResults",
    meta: {
      title: "搜索结果",
      foot: true
    }
  },
  {
    path: "/trainFlightPrice/:id",
    component: TrainFlightPrice,
    name: "trainFlightPrice",
    meta: {
      title: "班次列表",
      foot: true
    }
  },
  {
    path: "/trainAddOrder/:id/:parentId",
    component: TrainAddOrder,
    name: "trainAddOrder",
    meta: {
      title: "确认订单",
      foot: true
    }
  },
  {
    path: "/trainOrderDetail",
    component: TrainOrderDetail,
    name: "trainOrderDetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/trainRefundApplication",
    component: TrainRefundApplication,
    name: "trainRefundApplication",
    meta: {
      title: "退票申请",
      foot: true
    }
  },
  {
    path: "/policy",
    component: Policy,
    name: "policy",
    meta: {
      title: "我的保单",
      foot: true
    }
  },
  {
    path: "/train_pay/:para",
    component: TrainPay,
    name: "train_pay",
    meta: {
      title: "火车票支付",
      foot: true
    }
  },
  //代理商分红
  {
    path: "/AgentBonus",
    component: AgentBonus,
    name: "AgentBonus",
    meta: {
      title: "代理商分红",
      foot: true
    }
  },
  {
    path: "/GroupOrder",
    component: GroupOrder,
    name: "GroupOrder",
    meta: {
      title: "团队订单",
      foot: true
    }
  },
  {
    path: "/AgentCustomer",
    component: AgentCustomer,
    name: "AgentCustomer",
    meta: {
      title: "我的客户",
      foot: true
    }
  },

  // rentCenter
  {
    path: "/rentIndex",
    component: RentIndex,
    name: "rentIndex",
    meta: {
      title: "首页",
      foot: true
    }
  },
  {
    path: "/goodsDetail/:id",
    component: GoodsDetail,
    name: "goodsDetail",
    meta: {
      title: "商品详情",
      foot: true
    }
  },
  // { path: '/confirmOrder/:goodsId/:optionsId/:total/:rentDate/:rentDay', component: ConfirmOrder, name: 'confirmOrder', meta: { title: '确认下单', foot: true } },
  {
    path: "/confirmOrder",
    component: ConfirmOrder,
    name: "confirmOrder",
    meta: {
      title: "确认下单",
      foot: true
    }
  },
  {
    path: "/rentOrderPay",
    component: RentOrderPay,
    name: "rentOrderPay",
    meta: {
      title: "订单支付",
      foot: true
    }
  },

  {
    path: "/rentCenter",
    component: RentCenter,
    name: "rentCenter",
    meta: {
      title: "租赁中心",
      foot: true
    }
  },
  {
    path: "/rentMyOrder/:status",
    component: RentMyOrder,
    name: "rentMyOrder",
    meta: {
      title: "我的租借",
      foot: true
    }
  },
  {
    path: "/rentCharge",
    component: RentCharge,
    name: "rentCharge",
    meta: {
      title: "押金充值",
      foot: true
    }
  },
  {
    path: "/rentDeposit",
    component: RentDeposit,
    name: "rentDeposit",
    meta: {
      title: "押金提现",
      foot: true
    }
  },
  {
    path: "/rentDepositDetail",
    component: RentDepositDetail,
    name: "rentDepositDetail",
    meta: {
      title: "押金明细",
      foot: true
    }
  },
  {
    path: "/rentReturnGoods/:id",
    component: RentReturnGoods,
    name: "rentReturnGoods",
    meta: {
      title: "归还商品",
      foot: true
    }
  },

  {
    path: "/toBePay/:id",
    component: ToBePay,
    name: "toBePay",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/toBeSend/:id",
    component: ToBeSend,
    name: "toBeSend",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/toBetakeGoods/:id",
    component: ToBetakeGoods,
    name: "toBetakeGoods",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/toBeReturneding/:id",
    component: ToBeReturneding,
    name: "toBeReturneding",
    meta: {
      title: "订单详情",
      foot: true
    }
  },

  {
    path: "/toBeClose/:id",
    component: ToBeClose,
    name: "toBeClose",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/toBeComplete/:id",
    component: ToBeComplete,
    name: "toBeComplete",
    meta: {
      title: "订单详情",
      foot: true
    }
  },

  {
    path: "/toBeReturned/:id",
    component: ToBeReturned,
    name: "toBeReturned",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/overdueReturn",
    component: OverdueReturn,
    name: "overdueReturn",
    meta: {
      title: "逾期未归还",
      foot: true
    }
  },
  {
    path: "/hasTransferred",
    component: HasTransferred,
    name: "hasTransferred",
    meta: {
      title: "已转赠",
      foot: true
    }
  },
  {
    path: "/hasBeenReturned",
    component: HasBeenReturned,
    name: "hasBeenReturned",
    meta: {
      title: "已归还",
      foot: true
    }
  },
  {
    path: "/transferRecord",
    component: TransferRecord,
    name: "transferRecord",
    meta: {
      title: "转赠记录",
      foot: true
    }
  },
  {
    path: "/rentGuide",
    component: RentGuide,
    name: "rentGuide",
    meta: {
      title: "租赁指南",
      foot: true
    }
  },
  {
    path: "/rentAfterSalas",
    component: RentAfterSalas,
    name: "rentAfterSalas",
    meta: {
      title: "售后列表（待退款）",
      foot: true
    }
  },
  {
    path: "/returnRecord",
    component: ReturnRecord,
    name: "returnRecord",
    meta: {
      title: "归还记录",
      foot: true
    }
  },

  // 招商中心
  {
    path: "/member/enterprise/index",
    component: EnterpriseIndex,
    name: "enterprise_index",
    meta: {
      title: "招商",
      foot: true
    }
  },
  {
    path: "/member/enterprise/apply",
    component: EnterpriseApply,
    name: "enterprise_apply",
    meta: {
      title: "招商",
      foot: true
    }
  },
  {
    path: "/member/enterprise/supplier",
    component: EnterpriseSupplier,
    name: "enterprise_supplier",
    meta: {
      title: "我的供应商",
      foot: true
    }
  },
  {
    path: "/member/enterprise/supplierInfo/:id",
    component: EnterpriseSupplierInfo,
    name: "enterprise_supplier_info",
    meta: {
      title: "供应商详情",
      foot: true
    }
  },
  {
    path: "/member/enterprise/center/apply",
    component: EnterpriseCenterApply,
    name: "enterprose_center_apply",
    meta: {
      title: "招商中心",
      foot: true
    }
  },
  {
    path: "/member/enterprise/center/supplier",
    component: EnterpriseCenterSupplier,
    name: "enterprise_center_supplier",
    meta: {
      title: "我的供应商",
      foot: true
    }
  },
  // 招商-我的门店
  {
    path: "/member/enterprise/store/:type",
    component: EnterpriseStore,
    name: "enterprise_store",
    meta: {
      title: "招商-我的门店",
      foot: true
    }
  },
  {
    path: "/others/integral_shop",
    component: integral_shop,
    name: "integral_shop",
    meta: {
      title: "",
      foot: true
    }
  },

  // 订单全返
  {
    path: "/member/income/singleReturn",
    component: SingleReturnCenter,
    name: "single_return_center",
    meta: {
      title: "订单返现",
      foot: true
    }
  },
  {
    path: "/member/income/singleReturnListInfo/:id",
    component: SingleReturnListInfo,
    name: "single_return_list_info",
    meta: {
      title: "返现详情",
      foot: true
    }
  },

  // 团队等级全返
  {
    path: "/member/income/teamLevelReturn",
    component: TeamLevelReturnCenter,
    name: "teamlevel_return_center",
    meta: {
      title: "团队返现",
      foot: true
    }
  },
  {
    path: "/member/income/teamLevelReturnListInfo/:id",
    component: TeamLevelReturnListInfo,
    name: "teamlevel_return_list_info",
    meta: {
      title: "返现详情",
      foot: true
    }
  },

  // 满额全返
  {
    path: "/member/income/fullReturn",
    component: FullReturnCenter,
    name: "full_return_center",
    meta: {
      title: "满额返现",
      foot: true
    }
  },
  {
    path: "/member/income/fullReturnListInfo/:id",
    component: FullReturnListInfo,
    name: "full_return_list_info",
    meta: {
      title: "返现详情",
      foot: true
    }
  },

  // 股东分红
  {
    path: "/member/income/shareholderDividend",
    component: ShareholderDividend,
    name: "shareholder_dividend",
    meta: {
      title: "股东分红",
      foot: true
    }
  },
  // 股东奖励
  {
    path: "/member/income/ShareholderReward",
    component: ShareholderReward,
    name: "ShareholderReward",
    meta: {
      title: "股东奖励",
      foot: true
    }
  },

  // 分销商全返
  {
    path: "/member/income/level_return",
    component: LevelReturn,
    name: "level_return",
    meta: {
      title: "分销商全返",
      foot: true
    }
  },

  {
    path: "/love_trading",
    component: Love_trading,
    name: "love_trading",
    meta: {
      title: "交易中心",
      foot: true
    }
  },
  {
    path: "/love_trading_sell",
    component: Love_trading_sell,
    name: "love_trading_sell",
    meta: {
      title: "爱心值出售",
      foot: true
    }
    // },
    // //visit 邀请码
    // {
    //   path: '/visit',
    //   component: Visit,
    //   name: 'visit',
    //   meta: {
    //     title: '邀请码',
    //     foot: true
    //   }
  },
  {
    path: "/transformLoveV",
    component: Love_trading_sell,
    name: "transformLoveV",
    meta: {
      title: "转化爱心值",
      foot: true
    }
  },

  // 收银台
  {
    path: "/cashier",
    component: cashier,
    name: "cashier",
    meta: {
      title: "收银台",
      foot: true
    }
  },
  {
    path: "/cashier_pay/:store_id",
    component: cashier_pay,
    name: "cashier_pay",
    meta: {
      title: "收银台",
      foot: true
    }
  },
  {
    path: "/cashier_qr",
    component: cashier_qr,
    name: "cashier_qr",
    meta: {
      title: "二维码",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/cashier_withdrawals",
    component: cashier_withdrawals,
    name: "cashier_withdrawals",
    meta: {
      title: "提现",
      foot: true
    }
  },
  {
    path: "/cashier_stat",
    component: cashier_stat,
    name: "cashier_stat",
    meta: {
      title: "统计结算",
      foot: true
    }
  },
  {
    path: "/show_balances/:pay_sn/:pay_type",
    component: show_balances,
    name: "showBalances",
    meta: {
      title: "支付奖励",
      foot: true
    }
  },
  {
    path: "/cashier_income/",
    component: cashier_income,
    name: "cashierIncome",
    meta: {
      title: "收入明细",
      foot: true
    }
  },
  {
    path: "/distribution_stat",
    component: cashier_stat,
    name: "distribution_stat",
    meta: {
      title: "统计结算",
      foot: true
    }
  },
  {
    path: "/o2o/home",
    component: o2oHome,
    name: "o2oHome",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/o2o/store/:store_id",
    component: o2oStore,
    name: "o2oStore",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/o2o/store_v2/:store_id",
    component: o2oStore_v2,
    name: "o2oStore_v2",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/o2o/location",
    component: o2oLocation,
    name: "o2oLocation",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/o2o/location/location",
    component: o2oLocation_loc,
    name: "o2oLocation_loc",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/o2o/location/city",
    component: o2oCity,
    name: "o2oCity",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/o2o/search/:city/:point",
    component: o2oSearch,
    name: "o2oSearch",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/o2o/o2oSearchMultiple/:city/:point",
    component: o2oSearchMultiple,
    name: "o2oSearchMultiple",
    meta: {
      title: "搜索",
      foot: true
    }
  },
  {
    path: "/o2o/category/:id/:name?",
    component: o2oCategory,
    name: "o2oCategory",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/o2o/storeApply",
    component: StoreApply,
    name: "storeApply",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/o2o/storeWithdrawals",
    component: StoreWithdrawals,
    name: "storeWithdrawals",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/o2o/store_manage",
    component: StoreManage,
    name: "storeManage",
    meta: {
      title: "门店中心",
      foot: true
    }
  },
  {
    path: "/o2o/cloud_horn",
    component: cloudHorn,
    name: "cloudHorn",
    meta: {
      title: "云喇叭绑定",
      foot: true
    }
  },
  {
    path: "/o2oGroup_activitylist/:store_id",
    component: o2oGroupActivitylist,
    name: "o2oGroupActivitylist",
    meta: {
      title: "门店拼团",
      foot: false
    }
  },
  {
    path: "/openGroupList/:id/:store_id",
    component: openGroupList,
    name: "openGroupList",
    meta: {
      title: "开团列表",
      foot: false
    }
  },
  {
    path: "/openGroupDetail/:id",
    component: openGroupDetail,
    name: "openGroupDetail",
    meta: {
      title: "开团详情",
      foot: false
    }
  },
  {
    path: "/groupDataStatistics/:id",
    component: groupDataStatistics,
    name: "groupDataStatistics",
    meta: {
      title: "数据统计",
      foot: false
    }
  },
  {
    path: "/createGroup/:store_id/:id?",
    component: createGroup,
    name: "createGroup",
    meta: {
      title: "创建活动",
      foot: false
    }
  },
  {
    path: "/o2o/zkz_device",
    component: zkzDevice,
    name: "zkzDevice",
    meta: {
      title: "zkc设备绑定",
      foot: true
    }
  },
  {
    path: "/o2o/qr_code/:store_id",
    component: qrCode,
    name: "qrCode",
    meta: {
      title: "门店二维码",
      foot: true
    }
  },
  {
    path: "/o2o/collectionCode",
    component: collectionCode,
    name: "collectionCode",
    meta: {
      title: "收款二维码",
      foot: true
    }
  },
  {
    path: "/o2o/grouplist",
    component: o2oGrouplist,
    name: "o2oGrouplist",
    meta: {
      title: "门店拼团",
      foot: false
    }
  },
  // {
  //   path: "/o2o/privacy",
  //   component: privacy,
  //   name: "privacy",
  //   meta: {
  //     title: "隐私",
  //     foot: true
  //   }
  // },
  {
    path: "/store/search/:store_id",
    component: StoreSearch,
    name: "StoreSearch",
    meta: {
      title: "商品搜索",
      foot: true
    }
  },

  {
    path: "/conference/conferenceList",
    component: conferenceList,
    name: "conferenceList",
    meta: {
      title: "活动列表",
      foot: true
    }
  },
  {
    path: "/conference/activity/:id",
    component: activity,
    name: "activity",
    meta: {
      title: "活动",
      foot: true
    }
  },
  {
    path: "/conference/my_activity_info/:id",
    component: MyActivityInfo,
    name: "myActivityInfo",
    meta: {
      title: "活动信息",
      foot: true
    }
  },
  {
    path: "/conference/sign/:id",
    component: conferenceSign,
    name: "conferenceSign",
    meta: {
      title: "活动签到",
      foot: true
    }
  },
  {
    path: "/activity/task/list/:id",
    component: ActivityTaskList,
    name: "activityTaskList",
    meta: {
      title: "活动任务",
      foot: true
    }
  },

  {
    path: "/clockin",
    component: ClockPunch,
    name: "ClockPunch",
    meta: {
      title: "早起打卡",
      foot: true
    }
  },
  {
    path: "/clockin/clockinrule",
    component: ClockPunchRule,
    name: "ClockPunchRule",
    meta: {
      title: "挑战规则",
      foot: true
    }
  },
  {
    path: "/clockin/clockinrecord",
    component: ClockPunchRecord,
    name: "ClockPunchRecord",
    meta: {
      title: "我的战绩",
      foot: true
    }
  },
  {
    path: "/member/myrelationsearch",
    component: MyRelationshipSearch,
    name: "MyRelationshipSearch",
    meta: {
      title: "我的关系",
      foot: true
    }
  },
  {
    path: "/rechargeCode",
    component: RechargeCode,
    name: "rechargeCode",
    meta: {
      title: "充值码",
      foot: true
    }
  },
  {
    path: "/rechargeCodeByQrCode/:qrCode",
    component: RechargeCode,
    name: "rechargeCodeByQrCode",
    meta: {
      title: "充值码",
      foot: true
    }
  },
  {
    path: "/o2o/home/homeseller/:store_id",
    component: HomeSeller,
    name: "HomeSeller",
    meta: {
      title: "商家",
      foot: true
    }
  },
  // {
  //   path: '/o2o/home/homeseller/detail/:store_id',
  //   component: HomeSellerDetail,
  //   name: 'HomeSellerDetail',
  //   meta: {
  //     title: '商家详情',
  //     foot: true
  //   }
  // },
  // {
  //   path: "/o2o/home/homeseller/address/:store_id",
  //   component: HomeSellerAddress,
  //   name: "HomeSellerAddress",
  //   meta: {
  //     title: "门店地址",
  //     foot: true
  //   }
  // },

  // 代付
  {
    path: "/member/payanother/:order_id",
    component: PayAnother,
    name: "PayAnother",
    meta: {
      title: "代付",
      foot: true
    }
  },

  // 代付详情
  {
    path: "/member/payanotherdetail",
    component: PayAnotherDetail,
    name: "PayAnotherDetail",
    meta: {
      title: "代付详情",
      foot: true
    }
  },

  // 保税真实信息添加
  {
    path: "/member/address/myinfo",
    component: MyInfo,
    name: "myinfo",
    meta: {
      title: "我的信息",
      foot: true
    }
  },

    // 保税真实信息添加-益生海外
  {
    path: "/member/address/myinfo_overseas",
    component: MyInfoOverseas,
    name: "myinfo_overseas",
    meta: {
      title: "实名认证信息",
      foot: true
    }
  },

  // 课程中心
  {
    path: "/member/courseindex",
    component: CourseIndex,
    name: "CourseIndex",
    meta: {
      title: "课程",
      foot: false
    }
  },

  // 课程搜索
  {
    path: "/member/coursesearch/:goods_type",
    component: CourseSearch,
    name: "CourseSearch",
    meta: {
      title: "精选推荐课程",
      foot: true
    }
  },

  // 课程管理

  {
    path: "/member/coursemanage",
    component: CourseManage,
    name: "CourseManage",
    meta: {
      title: "我的课程",
      foot: true
    }
  },

  // 课程详情
  {
    path: "/member/coursedetail/:id",
    component: CourseDetail,
    name: "CourseDetail",
    meta: {
      title: "课程详情",
      foot: true
    }
  },

  // 课程-我的打赏

  {
    path: "/member/coursereward",
    component: CourseReward,
    name: "CourseReward",
    meta: {
      title: "我的打赏",
      foot: true
    }
  },

  // 课程-我的课程

  {
    path: "/member/mycourse",
    component: CourseMy,
    name: "CourseMy",
    meta: {
      title: "我的课程",
      foot: true
    }
  },

  // 课程-观看历史

  {
    path: "/member/coursehistory",
    component: CourseHistory,
    name: "CourseHistory",
    meta: {
      title: "观看历史",
      foot: true
    }
  },

  // 课程-升级会员

  {
    path: "/member/courselevel/:id/:goods",
    component: CourseMemberUpdate,
    name: "CourseMemberUpdate",
    meta: {
      title: "升级会员",
      foot: true
    }
  },

  // 推广申请

  {
    path: "/member/extension_apply",
    component: ExtensionApply,
    name: "ExtensionApply",
    meta: {
      title: "推广申请",
      foot: true
    }
  },
  // 会员等级列表

  {
    path: "/member/membergradelist",
    component: MemberGradeList,
    name: "MemberGradeList",
    meta: {
      title: "会员等级",
      foot: true
    }
  },

  {
    path: "/member/rightGood/:level_id",
    component: RightGood,
    name: "RightGood",
    meta: {
      title: "权益商品",
      foot: true
    }
  },
  {
    path: "/member/policyManage",
    component: policyManage,
    name: "policyManage",
    meta: {
      title: "保单管理",
      foot: true
    }
  },
  // {
  //   path: '/member/policyAdd',
  //   component: policyAdd,
  //   name: 'policyAdd',
  //   meta: {
  //     title: '保单添加',
  //     foot: true
  //   }
  // },

  // 会员等级详情

  {
    path: "/member/membergradedetail/:id",
    component: MemberGradeListDetail,
    name: "MemberGradeListDetail",
    meta: {
      title: "会员等级",
      foot: true
    }
  },

  // 待退还

  {
    path: "/member/return/:id",
    component: OrderReturn,
    name: "OrderReturn",
    meta: {
      title: "退还商品",
      foot: true
    }
  },

  // 待退还中

  {
    path: "/member/returncheck/:id",
    component: OrderReturnCheck,
    name: "OrderReturnCheck",
    meta: {
      title: "退还商品",
      foot: true
    }
  },

  // 待确定

  {
    path: "/member/returnsure/:id",
    component: OrderReturnSure,
    name: "OrderReturnSure",
    meta: {
      title: "退还商品",
      foot: true
    }
  },

  // 租赁归还售后详情

  {
    path: "/member/returnafterdetail/:id",
    component: OrderReturnAftersalesDetail,
    name: "OrderReturnAftersalesDetail",
    meta: {
      title: "售后详情",
      foot: true
    }
  },

  // 会员退款迁移

  {
    path: "/member/refundsmigration",
    component: MemberRefundsMigration,
    name: "MemberRefundsMigration",
    meta: {
      title: "退款迁移",
      foot: true
    }
  },

  // 商品详情品牌

  {
    path: "/member/goodsbrand/:id",
    component: GoodsBrand,
    name: "GoodsBrand",
    meta: {
      title: "品牌详情",
      foot: true
    }
  },

  // 柜子商品中转页

  {
    path: "/member/cuptransfer/:mark",
    component: CupboardTransfer,
    name: "CupboardTransfer",
    meta: {
      title: "智能柜",
      foot: true
    }
  },

  // 柜子商品操作员页面

  {
    path: "/member/cupoperator/:id/:name/:mark",
    component: CupboardOperator,
    name: "CupboardOperator",
    meta: {
      title: "智能柜",
      foot: true
    }
  },

  // 柜子商品操作员页面--投放

  {
    path: "/member/cupdelivery/:id/:name/:mark",
    component: CupboardDelivery,
    name: "CupboardDelivery",
    meta: {
      title: "投放",
      foot: true
    }
  },

  // 柜子商品操作员页面--清空

  {
    path: "/member/cupempty/:id/:name/:mark",
    component: CupboardEmpty,
    name: "CupboardEmpty",
    meta: {
      title: "清空",
      foot: true
    }
  },

  // 区域选择页面

  {
    path: "/zone_search",
    component: ZoneChoose,
    name: "ZoneChoose",
    meta: {
      title: "区域选择",
      foot: true
    }
  },

  // 文章列表

  {
    path: "/article_list",
    component: ArticleList,
    name: "ArticleList",
    meta: {
      title: "文章列表",
      foot: true
    }
  },

  // 开户信息
  {
    path: "/member/accoutinfo",
    component: AccoutInfo,
    name: "AccoutInfo",
    meta: {
      title: "开户信息",
      foot: true
    }
  },

  // SupplierCenter 供应商管理中心

  {
    path: "/supplier_center/:uid?",
    component: SupplierCenter,
    name: "SupplierCenter",
    meta: {
      title: "供应商管理",
      foot: true
    }
  },
  {
    path: "/commodity_management/:store_id/:store",
    component: CommodityManagement,
    name: "CommodityManagement",
    meta: {
      title: "商品管理",
      foot: true
    }
  },
  {
    path: "/commodity_editor/:store_id/:goods_id/:store",
    component: CommodityEditor,
    name: "CommodityEditor",
    meta: {
      title: "商品编辑",
      foot: true
    }
  },
  {
    path: "/commodity_release/:store_id/:goods_id?/:store",
    component: CommodityRelease,
    name: "CommodityRelease",
    meta: {
      title: "商品发布",
      foot: true
    }
  },
  {
    path: "/commodity_coupon",
    component: CommodityCoupon,
    name: "CommodityCoupon",
    meta: {
      title: "优惠券管理",
      foot: true
    }
  },
  {
    path: "/commodityCoupon_edit",
    component: CommodityCouponEdit,
    name: "CommodityCouponEdit",
    meta: {
      title: "优惠券编辑",
      foot: true
    }
  },
  {
    path: "/CommodityCoupon_give",
    component: CommodityCouponGive,
    name: "CommodityCouponGive",
    meta: {
      title: "优惠券发放",
      foot: true
    }
  },
  // 商品分类
  {
    path: "/goods_classify/:store_id",
    component: GoodsClassify,
    name: "GoodsClassify",
    meta: {
      title: "商品分类",
      foot: true
    }
  },
  {
    path: "/add_classify/:store_id/:classify_id/:level",
    component: AddClassify,
    name: "AddClassify",
    meta: {
      title: "添加分类",
      foot: true
    }
  },
  {
    path: "/first_edit/:store_id/:classify_id/:level",
    component: FirstEdit,
    name: "FirstEdit",
    meta: {
      title: "一级分类",
      foot: true
    }
  },

  // 供应商--信息管理

  {
    path: "/supplier_info_manage/:member_id",
    component: SupInfoManage,
    name: "SupInfoManage",
    meta: {
      title: "信息管理",
      foot: true
    }
  },

  // 转账
  {
    path: "/transfer_account/:id",
    component: TransferAccount,
    name: "TransferAccount",
    meta: {
      title: "汇款支付",
      foot: true
    }
  },

  // 排队奖励记录
  {
    path: "/reward_record",
    component: QueueRecord,
    name: "QueueRecord",
    meta: {
      title: "奖励记录",
      foot: true
    }
  },
  // 冻结币
  {
    path: "/frozen_coin",
    component: FrozenCoin,
    name: "FrozenCoin",
    meta: {
      title: "冻结币",
      foot: true
    }
  },
  {
    path: "/recharge_coin",
    component: RechargeCoin,
    name: "RechargeCoin",
    meta: {
      title: "充值",
      foot: true
    }
  },
  {
    path: "/look_details_coin",
    component: LookDetailsCoin,
    name: "LookDetailsCoin",
    meta: {
      title: "查看明细",
      foot: true
    }
  },
  {
    path: "/put_forward_coin",
    component: PutForwardCoin,
    name: "PutForwardCoin",
    meta: {
      title: "提现",
      foot: true
    }
  },

  // 登录中转页面

  {
    path: "/login_validate",
    component: LoginValidate,
    name: "LoginValidate",
    meta: {
      title: "登录",
      foot: true
    }
  },

  // 音频页
  {
    path: "/voiceList",
    component: VoiceList,
    name: "VoiceList",
    meta: { title: " ", foot: true }
  },
  {
    path: "/voiceDetail/:article_id",
    component: VoiceDetail,
    name: "VoiceDetail",
    meta: { title: " ", foot: true }
  },

  // 供应商店铺页面
  {
    path: "/supplier_shop/:id",
    component: SupplierShop,
    name: "SupplierShop",
    meta: { title: "供应商店铺", foot: false }
  },
  {
    path: "/supplier_shop2/:id",
    component: SupplierShop2,
    name: "SupplierShop2",
    meta: { title: "供应商店铺", foot: true }
  },

  // 供应商店铺信息页面

  {
    path: "/supplier_info/:id",
    component: SupplierInfo,
    name: "SupplierInfo",
    meta: { title: "供应商店铺", foot: true }
  },
  // 供应商搜索

  {
    path: "/supplier_goods/:sid/:cid?/:is_hot?",
    component: SupplierSearch,
    name: "SupplierSearch",
    meta: { title: "搜索", foot: true }
  },

  // 共享链
  {
    path: "/extension/reward_queue",
    component: RewardQueue,
    name: "RewardQueue",
    meta: { title: "", foot: true }
  },
  {
    path: "/extension/reward_detail",
    component: RewardDetail,
    name: "RewardDetail",
    meta: { title: "奖励统计", foot: true }
  },
  {
    path: "/extension/reward_process",
    component: RewardProcess,
    name: "RewardProcess",
    meta: { title: "", foot: true }
  },

  // mryt
  {
    path: "/extension/mryt",
    component: MRYT,
    name: "MRYT",
    meta: { title: "", foot: true }
  },
  {
    path: "/extension/sale_commission",
    component: SaleCommission,
    name: "SaleCommission",
    meta: { title: "", foot: true }
  },
  {
    path: "/extension/award_record",
    component: AwardRecord,
    name: "AwardRecord",
    meta: { title: "奖励记录", foot: true }
  },
  {
    path: "/extension/award_detail",
    component: AwardDetail,
    name: "AwardDetail",
    meta: { title: "分红详情", foot: true }
  },
  // 手动分红
  {
    path: "/profit",
    component: Profit,
    name: "profit",
    meta: { title: "", foot: true }
  },

  // 连锁店
  {
    path: "/chain_shop_index",
    component: ChainShopIndex,
    name: "ChainShopIndex",
    meta: { title: "连锁店首页", foot: true }
  },
  {
    path: "/chain_shop_info/:id",
    component: ChainShopInfo,
    name: "ChainShopInfo",
    meta: { title: "门店信息", foot: true }
  },

  // 武昌医院--会务活动
  {
    path: "/meeting_index",
    component: MeetingIndex,
    name: "MeetingIndex",
    meta: { title: "报名记录", foot: true }
  },
  {
    path: "/meeting_index_detail/:id/:member_id",
    component: MeetingIndexDetail,
    name: "MeetingIndexDetail",
    meta: { title: "活动报名信息", foot: true }
  },
  {
    path: "/meeting_extend_list/:id/:member_id",
    component: MeetingExtendList,
    name: "MeetingExtendList",
    meta: { title: "推广报名列表", foot: true }
  },
  {
    path: "/meeting_extend_detail/:id",
    component: MeetingExtendDetail,
    name: "MeetingExtendDetail",
    meta: { title: "推广报名详情", foot: true }
  },

  // 入驻商品
  {
    path: "/enter_shop",
    component: EnterShop,
    name: "EnterShop",
    meta: { title: "入驻商品", foot: true }
  },
  {
    path: "/enter_protocol",
    component: EnterProtocol,
    name: "EnterProtocol",
    meta: { title: "入驻协议", foot: true }
  },
  {
    path: "/ApplyMerchant",
    component: ApplyMerchant,
    name: "ApplyMerchant",
    meta: { title: "申请商家", foot: true }
  },
  {
    path: "/submit_succeed",
    component: SubmitSucceed,
    name: "SubmitSucceed",
    meta: { title: "提交成功", foot: true }
  },
  {
    path: "/truck_list/:order_id",
    component: TruckList,
    name: "TruckList",
    meta: { title: "虚拟卡密", foot: true }
  },

  // 区间消费返点
  {
    path: "/extension/consumer_return_point",
    component: consumerReturnPoint,
    name: "consumerReturnPoint",
    meta: { title: "区间消费返点", foot: true }
  },
  {
    path: "/wft_balance_recharge/:status/:url",
    component: Alipay,
    name: "wft_balance_recharge",
    meta: { title: "支付宝", foot: true }
  },
  // 爱心值充值
  {
    path: "/love_recharge",
    component: LoveRecharge,
    name: "LoveRecharge",
    meta: { title: "爱心值充值", foot: true }
  },
  {
    path: "/love_alipay/:status/:pay_id",
    component: Alipay,
    name: "love_alipay2",
    meta: { title: "支付宝", foot: true }
  }, // 支付宝爱心值充值
  // 专区商品
  {
    path: "/extension_goods",
    component: ExtensionGoods,
    name: "ExtensionGoods",
    meta: { title: "专区商品", foot: true }
  },
  {
    path: "/salesManagement",
    component: salesManagement,
    name: "salesManagement",
    meta: { title: "团队销量管理", foot: true }
  },
  // 398团队数据统计
  {
    path: "/team_data_count",
    component: TeamDataCount,
    name: "TeamDataCount",
    meta: { title: "团队数据统计", foot: true }
  },
  // 易宝支付 AggregateEntRegEdit
  {
    path: "/aggregate_ind_reg",
    component: AggregateIndReg,
    name: "AggregateIndReg",
    meta: { title: "个人注册", foot: true }
  },
  {
    path: "/aggregate_ind_reg_edit",
    component: AggregateIndRegEdit,
    name: "AggregateIndRegEdit",
    meta: { title: "重新申请个人注册", foot: true }
  },
  {
    path: "/aggregate_me_reg",
    component: AggregateMeReg,
    name: "AggregateMeReg",
    meta: { title: "个体工商户注册", foot: true }
  },
  {
    path: "/aggregate_me_reg_edit",
    component: AggregateMeRegEdit,
    name: "AggregateMeRegEdit",
    meta: { title: "重新申请个体工商户注册", foot: true }
  },
  {
    path: "/aggregate_ent_reg",
    component: AggregateEntReg,
    name: "AggregateEntReg",
    meta: { title: "企业注册 ", foot: true }
  },
  {
    path: "/aggregate_ent_reg_edit",
    component: AggregateEntRegEdit,
    name: "AggregateEntRegEdit",
    meta: { title: "重新申请企业注册 ", foot: true }
  },
  {
    path: "/aggregate_bank_card",
    component: AggregateBankCardSet,
    name: "AggregateBankCardSet",
    meta: { title: "结算银行卡修改 ", foot: true }
  },
  {
    path: "/aggregate_audit_part",
    component: AggregateAuditPart,
    name: "AggregateAuditPart",
    meta: { title: "入网信息", foot: true }
  },
  {
    path: "/company_edit",
    component: CompanyEdit,
    name: "CompanyEdit",
    meta: { title: "企业注册 ", foot: true }
  },
  {
    path: "/individual_edit",
    component: IndividualEdit,
    name: "IndividualEdit",
    meta: { title: "个体工商户注册", foot: true }
  },
  {
    path: "/show_apply",
    component: ShowApply,
    name: "ShowApply",
    meta: { title: "入网信息", foot: true }
  },
  // 邀请页面
  {
    path: "/input_visit",
    component: InputVisit,
    name: "InputVisit",
    meta: { title: "邀请码", foot: true }
  },
  {
    path: "/inviter",
    component: Inviter,
    name: "Inviter",
    meta: { title: "邀请码", foot: true }
  },

  // 消费积分-爱心值
  {
    path: "/member/Integral_love",
    component: Integral_love,
    name: "Integral_love",
    meta: { title: "消费积分-爱心值", foot: true }
  },
  {
    path: "/member/Integral_invest",
    component: Integral_invest,
    name: "Integral_invest",
    meta: { title: "", foot: true }
  },
  {
    path: "/member/Integral_change/:type?",
    component: Integral_change,
    name: "Integral_change",
    meta: { title: "", foot: true }
  },
  {
    path: "/member/Integral_love_detail",
    component: Integral_love_detail,
    name: "Integral_love_detail",
    meta: { title: "查看明细", foot: true }
  },
  {
    path: "/member/Integral_love_transfer",
    component: Integral_love_transfer,
    name: "Integral_love_transfer",
    meta: { title: "转让", foot: true }
  },
  {
    path: "/member/Integral_love_cash",
    component: Integral_love_cash,
    name: "Integral_love_cash",
    meta: { title: "提现", foot: true }
  },

  // 398一卡通
  {
    path: "/o2o/card_index",
    component: CardIndex,
    name: "CardIndex",
    meta: { title: "一卡通", foot: true }
  },
  {
    path: "/o2o/card_open_member",
    component: CardOpenMembership,
    name: "CardOpenMembership",
    meta: { title: "一卡通", foot: true }
  },
  {
    path: "/o2o/choose_member_time/:goods_id/:level_id",
    component: CardChooseMembership,
    name: "CardChooseMembership",
    meta: { title: "一卡通", foot: true }
  },
  {
    path: "/o2o/card_right",
    component: CardRight,
    name: "CardRight",
    meta: { title: "一卡通", foot: true }
  },
  {
    path: "/o2o/new_card",
    component: NewCard,
    name: "NewCard",
    meta: { title: "开通会员", foot: true }
  },
  {
    path: "/o2o/newcard_list/:level_id",
    component: NewCardList,
    name: "NewCardList",
    meta: { title: "开通会员", foot: true }
  },

  // 门店优惠券
  {
    path: "/o2o/cupcon/:id",
    component: StoreCoupon,
    name: "StoreCoupon",
    meta: { title: "门店优惠券", foot: true }
  },

  // 门店优惠券
  {
    path: "/hotel/cupcon/:id",
    component: hotelCoupon,
    name: "hotelCoupon",
    meta: { title: "酒店优惠券", foot: true }
  },
  //发票中心
  {
    path: "/invoiceCenter",
    component: invoiceCenter,
    name: "invoiceCenter",
    meta: { title: "发票中心", foot: true }
  },
  //发票编辑或者新建
  {
    path: "/invoiceDetails/:id",
    component: invoiceDetails,
    name: "invoiceDetails",
    meta: { title: "发票详情", foot: true }
  },
  //发票详情
  {
    path: "/invoiceOperation/:type",
    component: invoiceOperation,
    name: "invoiceOperation",
    meta: { title: "编辑发票", foot: true }
  },
   // 发票详情
  {
    path: "/invoice/invoice/:order_id",
    component: Invoice,
    name: "Invoice",
    meta: { title: "发票详情", foot: true }
  },
   // 订单列表--申请发票按钮--跳转申请发票页面
 {
  path: "/invoice/apply_invoice/:order_id",
  component: ApplyInvoice,
  name: "ApplyInvoice",
  meta: { title: "申请发票", foot: true }
},
  // 供应商提现
  {
    path: "/member/supplier_withdrawals/:supplier/:member_id",
    component: Balance_withdrawals,
    name: "supplier_withdrawals",
    meta: { title: "提现", foot: true }
  },
  //酒店供应链路由
  {
    path: "/hotel_supply/search",
    component: HotelSupplySearch,
    name: "HotelSupplySearch",
    meta: { title: "酒店搜索", foot: true }
  },
  //酒店供应首页
  {
    path: "/hotel_supply/HotelSupplyIndex",
    component: HotelSupplyIndex,
    name: "HotelSupplyIndex",
    meta: { title: "酒店", foot: true }
  },
  //酒店供应酒店主页
  {
    path: "/hotel_supply/home_page/:id",
    component: HotelSupplyHome,
    name: "HotelSupplyHome",
    meta: { title: "酒店主页", foot: true }
  },
  //酒店供应酒店主页
  {
    path: "/hotel_supply/hotelSupplyGoods/:hotel_id/:id",
    component: hotelSupplyGoods,
    name: "hotelSupplyGoods",
    meta: { title: "酒店房型详情", foot: true }
  },
  //酒店供应酒店下单页
  {
    path: "/hotel_supply/HotelSupplyGoodsOrder/:hotel_id/:sid/:date_price/:start/:end",
    component: HotelSupplyGoodsOrder,
    name: "HotelSupplyGoodsOrder",
    meta: { title: "酒店", foot: true }
  },
  //酒店供应酒店下单页
  {
    path: "/hotel_supply/hotel_order/:id",
    component: hotelOrder,
    name: "hotelOrder",
    meta: { title: "酒店详情", foot: true }
  },
  // 酒店路由
  {
    path: "/hotel/index",
    component: HotelIndex,
    name: "HotelIndex",
    meta: { title: "酒店", foot: false }
  },
  {
    path: "/hotel/search",
    component: HotelSearch,
    name: "HotelSearch",
    meta: { title: "酒店搜索", foot: true }
  },
  {
    path: "/hotel/home_page/:id",
    component: HotelHome,
    name: "HotelHome",
    meta: { title: "", foot: true }
  },
  {
    path: "/hotel/choose_room/:id",
    component: HotelChooseRoom,
    name: "HotelChooseRoom",
    meta: { title: "查看房型", foot: true }
  },
  // { path: '/hotel/goods',component: HotelGood,name: 'HotelGood',meta: {title: '商品详情',foot: true}},
  {
    path: "/hotel/goods_order",
    component: HotelGoodsOrder,
    name: "HotelGoodsOrder",
    meta: { title: "酒店", foot: true }
  },
  {
    path: "/hotel/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "HotelOrderDetail",
    meta: { title: "订单", foot: true }
  },
  {
    path: "/hotel/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "netCarDetail",
    meta: { title: "订单", foot: true }
  },
  {
    path: "/deliveryStation/deliveryDetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "deliveryStationOrderDetail",
    meta: { title: "订单", foot: true }
  },
  {
    path: "/deliveryStation/DeliveryReplenishDetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "DeliveryReplenishDetail",
    meta: { title: "订单", foot: true }
  },
  {
    path: "/serviceStation/serviceReplenishDetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "serviceReplenishDetail",
    meta: { title: "订单", foot: true }
  },
  {
    path: "/group/groupDetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "groupDetail",
    meta: { title: "订单", foot: true }
  },
  {
    path: "/hotel/manage",
    component: HotelManage,
    name: "HotelManage",
    meta: { title: "酒店管理", foot: true }
  },
  {
    path: "/hotel/apply",
    component: StoreApply,
    name: "hotelApply",
    meta: { title: "申请", foot: true }
  },
  {
    path: "/hotel/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "HotelCenterOrderDetail",
    meta: { title: "订单", foot: true }
  },
  // 租凭订单详情
  {
    path: "/lease_toy/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "LeaseToyOrderDetail",
    meta: { title: "订单", foot: true }
  },
  //拍卖
  {
    path: "/auctioneer/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "auctioneerOrderDetail",
    meta: { title: "订单", foot: true }
  },
  {
    path: "/auction/orderdetail/:order_id/:orderType",
    component: Goodsinfo,
    name: "auctionOrderDetail",
    meta: { title: "订单", foot: true }
  },
  // { path: '/hotel/location/:tag',component: o2oLocation_loc,name: 'hotel_location',meta: {title: '',foot: true}},
  // { path: '/hotel/city/:tag',component: o2oCity,name: 'hotelCity',meta: {title: '',foot: true}},
  // { path: '/hotel/location/:tag',component: o2oLocation,name: 'hotelLocation',meta: {title: '',foot: false}},

  // 酒店收银台
  {
    path: "/hotel/cashier_pay/:hotel_id",
    component: cashier_pay,
    name: "HotelCashierPay",
    meta: { title: "收银台", foot: true }
  },

  {
    path: "/hotel/cashier",
    component: HotelManage,
    name: "HotelCashier",
    meta: { title: "收银台", foot: true }
  },

  // 营业额
  {
    path: "/extension/performance",
    component: Performance,
    name: "Performance",
    meta: { title: "营业额", foot: true }
  },

  // 合伙人团队
  {
    path: "/extension/partnership_team",
    component: PartnershipTeam,
    name: "PartnershipTeam",
    meta: { title: " ", foot: true }
  },
  {
    path: "/extension/management_record",
    component: ManagementRecord,
    name: "ManagementRecord",
    meta: { title: " ", foot: true }
  },
  {
    path: "/extension/task_list",
    component: TaskList,
    name: "TaskList",
    meta: { title: "任务中心", foot: true }
  },

  // 消费红包
  {
    path: "/extension/consume_packet",
    component: ConsumePacket,
    name: "ConsumePacket",
    meta: { title: "消费红包", foot: true }
  },
  {
    path: "/extension/consume_packet_success",
    component: ConsumePacketSuccess,
    name: "ConsumePacketSuccess",
    meta: { title: " ", foot: true }
  },
  {
    path: "/member/team_distribution",
    component: TeamDistribution,
    name: "TeamDistribution",
    meta: { title: "团队分销商统计", foot: true }
  },

  // 团队管理奖
  {
    path: "/extension/team_manage_reward",
    component: TeamManageReward,
    name: "team_manage_reward",
    meta: { title: "团队管理奖", foot: true }
  },

  // 挂单
  {
    path: "/entry_orders/coupon_exchange",
    component: EntryExchange,
    name: "EntryExchange",
    meta: { title: "积分兑换", foot: true }
  },
  {
    path: "/entry_orders/entry_record",
    component: CouponExrecord,
    name: "CouponExrecord",
    meta: { title: "获得记录", foot: true }
  },
  {
    path: "/entry_orders/entry_volume",
    component: EntryVolume,
    name: "EntryVolume",
    meta: { title: "商品零售", foot: true }
  },
  {
    path: "/entry_orders/money_detail",
    component: MoneyDetail,
    name: "MoneyDetail",
    meta: { title: "提成明细", foot: true }
  },
  {
    path: "/entry_orders/my_volume",
    component: MyVolume,
    name: "MyVolume",
    meta: { title: "我的零售", foot: true }
  },
  {
    path: "/entry_orders/volume_detail",
    component: VolumeDetail,
    name: "VolumeDetail",
    meta: { title: "批发券明细", foot: true }
  },
  {
    path: "/entry_orders/wholesale_volume",
    component: WholesaleVolume,
    name: "WholesaleVolume",
    meta: { title: "我的批发券", foot: true }
  },
  {
    path: "/entry_orders/home",
    component: paddingOrder_Home,
    name: "paddingOrder_Home",
    meta: { title: "批发区首页", foot: true }
  },

  {
    path: "/others/material_center",
    component: materialCenter,
    name: "materialCenter",
    meta: { title: "素材中心", foot: false }
  },
  {
    path: "/others/material_search",
    component: materialSearch,
    name: "materialSearch",
    meta: { title: "素材搜索", foot: true }
  },
  {
    path: "/member/redEnvelope/:aid",
    component: redEnvelope,
    name: "redEnvelope",
    meta: { title: "口令红包", foot: false }
  },
  {
    path: "/member/redEnvelopeRecord/:tag/:aid",
    component: redEnvelopeRecord,
    name: "redEnvelopeRecord",
    meta: { title: "口令红包", foot: true }
  },
  //虚拟币
  {
    path: "/others/address_manage",
    component: addressManage,
    name: "addressManage",
    meta: { title: "提出地址管理", foot: true }
  },
  {
    path: "/others/address_add",
    component: addressAdd,
    name: "addressAdd",
    meta: { title: "新增提出地址", foot: true }
  },
  {
    path: "/others/revise_address/:id",
    component: reviseAddress,
    name: "reviseAddress",
    meta: { title: "修改提出地址", foot: true }
  },
  {
    path: "/others/hand_withdraw",
    component: handWithdraw,
    name: "handWithdraw",
    meta: { title: "手动提现", foot: true }
  },

  {
    path: "/extension/dealer_award",
    component: DealerAward,
    name: "DealerAward",
    meta: { title: "经销商奖励", foot: true }
  },

  {
    path: "/extension/dealer_detail",
    component: DriverDetail,
    name: "DriverDetail",
    meta: { title: "奖励详情", foot: true }
  },

  {
    path: "/extension/PeerAward",
    component: DealerPeerAward,
    name: "DealerPeerAward",
    meta: { title: "经销商平级奖", foot: true }
  },
  {
    path: "/extension/peerAwardes_withdraw",
    component: peerAwardes_withdraw,
    name: "peerAwardes_withdraw",
    meta: { title: "经销商平级奖", foot: true }
  },
  {
    path: "/WeightedDividend",
    component: WeightedDividend,
    name: "WeightedDividend",
    meta: { title: "经销商分红", foot: true }
  },
  //酒店二维码 cashier_qr
  {
    path: "/cashier_qr/:id/:tag",
    component: cashier_qr,
    name: "hotel_cashier_qr",
    meta: {
      title: "二维码",
      foot: true,
      notKeepAlive: true
    }
  },
  // 门店余额收款码
  {
    path: "/cashier_qr/:id/:tag",
    component: cashier_qr,
    name: "homesellerCode",
    meta: {
      title: "我的二维码",
      foot: true,
      notKeepAlive: true
    }
  },
  // 统计结算 cashier_stat
  {
    path: "/cashier_stat/:hotel_id/:tag",
    component: cashier_stat,
    name: "hotel_cashier_stat",
    meta: {
      title: "统计结算",
      foot: true
    }
  },
  {
    path: "/member/orderdetail/:order_id",
    component: Goodsinfo,
    name: "HotelCashierOrderDetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  //服务站
  {
    path: "/member/serviceStation",
    component: ServiceStation,
    name: "serviceStation",
    meta: {
      title: "服务站",
      foot: true
    }
  },
  //提成明细
  {
    path: "/commissionList/:orderType",
    component: CommissionList,
    name: "CommissionList",
    meta: {
      title: "提成明细",
      foot: true
    }
  },
  {
    path: "/member/distribution_orders",
    component: DistributionOrders,
    name: "DistributionOrders",
    meta: {
      title: "",
      foot: true
    }
  },
  //微社区
  {
    path: "/microHome",
    component: MicroHome,
    name: "MicroHome",
    redirect: "/microHome/microIndex",
    meta: {
      title: "微社区首页入口",
      foot: false
    },
    children: [
      {
        path: "microIndex",
        component: MicroIndex,
        name: "MicroIndex",
        meta: {
          title: "首页",
          foot: true
        }
      },
      {
        path: "microAttention",
        component: microAttention,
        name: "microAttention",
        meta: {
          title: "关注",
          foot: true
        }
      },
      {
        path: "/microRelease",
        component: MicroRelease,
        name: "microRelease",
        meta: {
          title: "微社区发布",
          foot: true,
          notKeepAlive: true
        }
      }
    ]
  },
  {
    path: "/microFanlist",
    component: microFanlist,
    name: "microFanlist",
    meta: {
      title: "关注和粉丝",
      foot: true
    }
  },
  // {
  //   path: "/microIndex",
  //   component: MicroIndex,
  //   name: "microIndex",
  //   meta: {
  //     title: "微社区首页",
  //     foot: true
  //   }
  // },
  {
    path: "/microsearchindex",
    component: Microsearchindex,
    name: "microSearchIndex",
    meta: {
      title: "微社区搜索",
      foot: true
    }
  },
  {
    path: "/microclassification",
    component: Microclassification,
    name: "microClassification",
    meta: {
      title: "微社区分类搜索",
      foot: true
    }
  },
  {
    path: "/microcommentdetails/:stickId",
    component: Microcommentdetails,
    name: "microCommentDetails",
    meta: {
      title: "微帖详情",
      foot: true
    }
  },
  {
    path: "/microhomepage",
    component: microhomepage,
    name: "microhomepage",
    meta: {
      title: "个人主页",
      foot: true
    }
  },
  {
    path: "/microEdit",
    component: MicroEdit,
    name: "microEdit",
    meta: {
      title: "微社区发布编辑",
      foot: true
    }
  },
  //历史拼团
  {
    path: "/history_group",
    component: historyGroup,
    name: "historyGroup",
    meta: {
      title: "历史成团记录",
      foot: true
    }
  },
  //拼团
  {
    path: "/group_detail/:id/:store_id?",
    component: GroupDetail,
    name: "GroupDetail",
    meta: {
      title: "拼团详情",
      foot: true
    }
  },
  {
    path: "/group_list",
    component: GroupList,
    name: "GroupList",
    meta: {
      title: "拼团列表",
      foot: true
    }
  },
  {
    path: "/zhpGroup/list",
    component: GroupList,
    name: "zhpGroupList",
    meta: {
      title: "拼团列表",
      foot: true
    }
  },
  {
    path: "/zhpFinance",
    component: zhpFinance,
    name: "zhpFinance",
    meta: {
      title: "财务统计",
      foot: true
    }
  },
  {
    path: "/groups/:id/:store_id?",
    component: Goods,
    name: "GroupGoods",
    meta: {
      title: "拼团活动详情", //商品活动详情页
      is_single_share: true,
      foot: true
    }
  },
  {
    path: "/zhpGroups/:id",
    component: Goods,
    name: "zhpGroup",
    meta: {
      title: "拼团活动详情", //拼团活动详情页（珍惠拼插件）
      foot: true
    }
  },
  {
    path: "/mygroups",
    component: MyGroups,
    name: "MyGroups",
    meta: {
      title: "我的拼团", //我的拼团
      foot: true
    }
  },
  {
    path: "/zhp/mygroups/:status?",
    component: MyGroups,
    name: "zhpMyGroups",
    meta: {
      title: "我的珍惠拼", //珍惠拼拼团抽奖
      foot: true
    }
  },
  {
    path: "/group/contribution",
    component: groupContribution,
    name: "groupContribution",
    meta: {
      title: "", //拼团贡献值
      foot: true
    }
  },
  {
    path: "/group/contribution/details/:id",
    component: groupContributionDetails,
    name: "groupContributionDetails",
    meta: {
      title: "", //拼团贡献值
      foot: true
    }
  },
  {
    path: "/group/contribution/log/:id",
    component: groupContributionDetailslog,
    name: "groupContributionDetailslog",
    meta: {
      title: "", //拼团贡献值
      foot: true
    }
  },
  {
    path: "/group/groupcblog",
    component: groupcblog,
    name: "groupcblog",
    meta: {
      title: "", //贡献值
      foot: true
    }
  },
  {
    path: "/group/pastLog",
    component: pastLog,
    name: "pastLog",
    meta: {
      title: "", //拼团贡献值
      foot: true
    }
  },
  {
    path: "/group/redeem/:id",
    component: groupRedeem,
    name: "groupRedeem",
    meta: {
      title: "兑换", //兑换
      foot: true
    }
  },
  {
    path: "/zhp/groupDetail/:id",
    component: zhpgroupDetail,
    name: "zhpgroupDetail",
    meta: {
      title: "参团详情", //兑换
      foot: true
    }
  },
  {
    path: "/zhp/redeemLog/:id",
    component: redeemLog,
    name: "redeemLog",
    meta: {
      title: "兑换明细", //兑换
      foot: true
    }
  },
  //拼购列表
  {
    path: "/groupBuyList",
    component: GroupBuyList,
    name: "GroupBuyList",
    meta: {
      title: "拼购列表",
      foot: false
    }
  },
  {
    path: "/myGroupBuy",
    component: myGroupBuy,
    name: "myGroupBuy",
    meta: {
      title: "我的拼购",
      foot: true
    }
  },
  {
    path: "/groupBuy/:aid/:id",
    component: groupBuy,
    name: "groupBuy",
    meta: {
      title: "拼购活动详情", //商品详情页
      foot: true
    }
  },
  {
    path: "/groupBuyDetail/:id",
    component: groupBuyDetail,
    name: "groupBuyDetail",
    meta: {
      title: "拼购详情",
      foot: false
    }
  },
  // {
  //   path: '/groupBuyGoodslist',
  //   component: groupBuyGoodslist,
  //   name: 'groupBuyGoodslist',
  //   meta: {
  //     title: '拼购商品列表',
  //     foot: true
  //   }
  // },

  //语音商品，已改为goods/：id
  {
    path: "/voice_good/:id",
    component: VoiceGood,
    name: "VoiceGood",
    meta: { title: "详情", foot: true }
  },
  {
    path: "/my_voices",
    component: MyVoices,
    name: "MyVoices",
    meta: { title: "我的语音", foot: true }
  },

  {
    path: "/lottery",
    component: Lottery,
    name: "Lottery",
    meta: { title: "幸运大抽奖", foot: true }
  },
  {
    path: "/Lottery_record",
    component: LotteryRecord,
    name: "LotteryRecord",
    meta: { title: "中奖列表", foot: true }
  },
  {
    path: "/extension/custom_queue",
    component: CustomQueue,
    name: "CustomQueue",
    meta: {
      title: "",
      foot: true
    }
  },

  //会务活动
  {
    path: "/MyActivity",
    component: MyActivity,
    name: "MyActivity",
    meta: {
      title: "我的活动",
      foot: true
    }
  },
  {
    path: "/videoAgreement",
    component: videoAgreement,
    name: "videoAgreement",
    meta: {
      title: "用户协议",
      foot: true
    }
  },
  {
    path: "/Mylove",
    component: Mylove,
    name: "Mylove",
    meta: {
      title: "我的关注",
      foot: true
    }
  },
  {
    path: "/myVideo/:id?",
    component: myVideo,
    name: "myVideo",
    meta: {
      title: "个人主页",
      foot: true
    }
  },
  {
    path: "/videoList",
    component: VideoList,
    name: "VideoList",
    meta: {
      title: "小视频",
      foot: false
    }
  },
  {
    path: "/Registration",
    component: Registration,
    name: "Registration",
    meta: {
      title: "报名情况",
      foot: true
    }
  },
  {
    path: "/videoDetail",
    component: VideoDetail,
    name: "VideoDetail",
    meta: {
      title: "小视频",
      foot: true
    }
  },
  {
    path: "/RegistrationDetail",
    component: RegistrationDetail,
    name: "RegistrationDetail",
    meta: {
      title: "报名详情",
      foot: true
    }
  },
  {
    path: "/releaseVideo",
    component: releaseVideo,
    name: "releaseVideo",
    meta: {
      title: "发布视频",
      foot: true
    }
  },
  {
    path: "/Myshaky",
    component: Myshaky,
    name: "Myshaky",
    meta: {
      title: "我的报名",
      foot: true
    }
  },
  {
    path: "/addVideoGood",
    component: addVideoGood,
    name: "addVideoGood",
    meta: {
      title: "添加商品",
      foot: true
    }
  },
  {
    path: "/lecturerDetail",
    component: lecturerDetail,
    name: "lecturerDetail",
    meta: {
      title: "讲师详情",
      foot: true
    }
  },
  {
    path: "/enroll",
    component: enroll,
    name: "enroll",
    meta: {
      title: "立即报名",
      foot: true
    }
  },
  {
    path: "/activityHome",
    component: activityHome,
    name: "activityHome",
    meta: {
      title: "首页",
      foot: false
    }
  },
  {
    path: "/enrollEnter/:id",
    component: enrollEnter,
    name: "enrollEnter",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/searchResult",
    component: searchResult,
    name: "searchResult",
    meta: {
      title: "搜索结果",
      foot: true
    }
  },
  {
    path: "/signIn/:id",
    component: signIn,
    name: "signIn",
    meta: {
      title: "签到",
      foot: false
    }
  },
  {
    path: "/Sort/:id?",
    component: Sort,
    name: "Sort",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/VideoReward",
    component: VideoReward,
    name: "VideoReward",
    meta: {
      title: "奖励记录",
      foot: true
    }
  },
  {
    path: "/TeamPerformanceAward",
    component: TeamPerformanceAward,
    name: "TeamPerformanceAward",
    meta: {
      title: "",
      foot: true
    }
  },
  // 宠物医院调查表
  {
    path: "/others/survey",
    component: survey,
    name: "survey",
    meta: { title: "调查表", foot: true }
  },
  // 分销管理奖励
  {
    path: "/member/income/distributionHome",
    component: DistributionHome,
    name: "DistributionHome",
    meta: {
      title: "分销管理奖励",
      foot: true
    }
  },
  // 分销奖励
  {
    path: "/member/income/distributionDetail",
    component: DistributionDetail,
    name: "DistributionDetail",
    meta: {
      title: "奖励详情",
      foot: true
    }
  },
  //龙存管
  {
    path: "/myWallet",
    component: myWallet,
    name: "myWallet",
    meta: {
      title: "我的钱包",
      foot: true
    }
  },
  {
    path: "/changePwd",
    component: changePwd,
    name: "changePwd",
    meta: {
      title: "修改交易密码",
      foot: true
    }
  },
  {
    path: "/companyLogon",
    component: companyLogon,
    name: "companyLogon",
    meta: {
      title: "企业注册",
      foot: true
    }
  },
  {
    path: "/personLogon",
    component: personLogon,
    name: "personLogon",
    meta: {
      title: "个人注册",
      foot: true
    }
  },
  {
    path: "/walletDetail",
    component: walletDetail,
    name: "walletDetail",
    meta: {
      title: "电子钱包明细",
      foot: true
    }
  },
  {
    path: "/dragonWithdraw",
    component: dragonWithdraw,
    name: "dragonWithdraw",
    meta: {
      title: "提现",
      foot: true
    }
  },
  {
    path: "/chooseStatus",
    component: chooseStatus,
    name: "chooseStatus",
    meta: {
      title: "选择注册角色",
      foot: true
    }
  },
  {
    path: "/personModify",
    component: personModify,
    name: "personModify",
    meta: {
      title: "个人注册信息修改",
      foot: true
    }
  },
  {
    path: "/companyModify",
    component: companyModify,
    name: "companyModify",
    meta: {
      title: "企业注册信息修改",
      foot: true
    }
  },
  {
    path: "/checking",
    component: checking,
    name: "checking",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/dragonDeposit",
    component: dragonDeposit,
    name: "dragonDeposit",
    meta: {
      title: "入金",
      foot: true
    }
  },
  {
    path: "/myBank",
    component: myBank,
    name: "myBank",
    meta: {
      title: "我的银行卡",
      foot: true
    }
  },
  {
    path: "/failApply",
    component: failApply,
    name: "failApply",
    meta: {
      title: "审核失败-重新提交",
      foot: true
    }
  },
  {
    path: "/infoChange",
    component: infoChange,
    name: "infoChange",
    meta: {
      title: "用户信息变更记录",
      foot: true
    }
  },
  // 柯怡 管理奖
  {
    path: "/member/manageAward",
    component: ManageAward,
    name: "ManageAward",
    meta: {
      title: "管理奖",
      foot: true
    }
  },
  // 柯怡 排序共享奖
  {
    path: "/member/shareAward_sort",
    component: ShareAward,
    name: "shareAward_sort",
    meta: {
      title: "排序共享奖",
      foot: true
    }
  },
  // 柯怡 直推共享奖
  {
    path: "/member/shareAward_directly",
    component: ShareAward,
    name: "shareAward_directly",
    meta: {
      title: "直推共享奖",
      foot: true
    }
  },
  // 自提点申请
  {
    path: "/member/selfCarryApply",
    component: SelfCarryApply,
    name: "SelfCarryApply",
    meta: {
      title: "申请",
      foot: true
    }
  },
  // 自提点列表
  {
    path: "/selfCarry_info",
    component: SelfCarry_info,
    name: "SelfCarry_info",
    meta: {
      title: "",
      foot: true
    }
  },
  // 自提点奖励
  {
    path: "/member/selfCarry_reward",
    component: selfCarry_reward,
    name: "selfCarry_reward",
    meta: {
      title: "奖励",
      foot: true
    }
  },
  // 平级奖
  {
    path: "/member/peersAward",
    component: PeersAward,
    name: "peersAward",
    meta: {
      title: "平级奖",
      foot: true
    }
  },
  {
    path: "/picture_album",
    component: pictureAlbum,
    name: "pictureAlbum",
    meta: {
      title: "画册",
      is_single_share: true,
      foot: true
    }
  },
  // 广告中心
  {
    path: "/member/admarketHome",
    component: admarketHome,
    name: "admarketHome",
    meta: {
      title: "广告中心",
      foot: true
    }
  },
  // 广告中心-我的设备
  {
    path: "/member/myDevice",
    component: MyDevice,
    name: "MyDevice",
    meta: {
      title: "我的设备",
      foot: true
    }
  },
  // 广告中心-广告管理
  {
    path: "/member/DeviceManger",
    component: DeviceManger,
    name: "DeviceManger",
    meta: {
      title: "广告管理",
      foot: true
    }
  },
  // 广告中心-广告主申请
  {
    path: "/member/adApply",
    component: ADApply,
    name: "ADApply",
    meta: {
      title: "广告主申请",
      foot: true
    }
  },
  // 广告中心-我的设备=>设备详情
  {
    path: "/member/deviceDetail/:sn",
    component: DeviceDetail,
    name: "DeviceDetail",
    meta: {
      title: "设备详情",
      foot: true
    }
  },
  // 广告中心-我的设备=>设备详情=>店长提成
  {
    path: "/member/managerCommission",
    component: managerCommission,
    name: "managerCommission",
    meta: {
      title: "设备详情",
      foot: true
    }
  },
  {
    path: "/advertiser",
    component: advertiser,
    name: "advertiser",
    meta: {
      title: "广告主",
      foot: true
    }
  },
  {
    path: "/addAdvertising",
    component: addAdvertising,
    name: "addAdvertising",
    meta: {
      title: "添加广告",
      foot: true
    }
  },
  {
    path: "/editAdvertising/:id",
    component: addAdvertising,
    name: "editAdvertising",
    meta: {
      title: "编辑广告",
      foot: true
    }
  },
  {
    path: "/advertisingFee",
    component: advertisingFee,
    name: "advertisingFee",
    meta: {
      title: "广告费记录",
      foot: true
    }
  },
  {
    path: "/placedAdvertising",
    component: placedAdvertising,
    name: "placedAdvertising",
    meta: {
      title: "投放的广告",
      foot: true
    }
  },
  // 奖金池
  {
    path: "/others/revenus_bonus",
    component: revenus_bonus,
    name: "revenus_bonus",
    meta: {
      title: "收益奖",
      foot: true
    }
  },

  {
    path: "/recommend_reward",
    component: recommend_reward,
    name: "recommend_reward",
    meta: { title: "直荐奖", foot: true }
  },
  {
    path: "/share_reward",
    component: share_reward,
    name: "share_reward",
    meta: { title: "分享奖", foot: true }
  },
  // 电子合同
  {
    path: "/signBusiness",
    component: signIndex,
    name: "signBusiness",
    meta: { title: "个人中心", foot: false }
  },
  {
    path: "/signIndex",
    component: signBusiness,
    name: "signIndex",
    // 多企业
    meta: { title: "合同中心", foot: false }
  },
  {
    path: "/signPerson",
    component: signPerson,
    name: "signPerson",
    meta: { title: "合同中心", foot: false }
  },
  // {
  //   path: "/signGuide/:show",
  //   component: signGuide,
  //   name: "signGuide",
  //   meta: { title: "", foot: true }
  // },
  {
    path: "/personBank",
    component: personBank,
    name: "personBank",
    meta: { title: "个人认证", foot: true }
  },
  {
    path: "/identifyResult/:show",
    component: identifyResult,
    name: "identifyResult",
    meta: { title: "认证结果", foot: true }
  },
  {
    path: "/faceResult",
    component: faceResult,
    name: "faceResult",
    meta: { title: "认证结果", foot: true }
  },
  {
    path: "/signCompany",
    component: signCompany,
    name: "signCompany",
    meta: { title: "企业认证", foot: true }
  },
  {
    path: "/contractBills",
    component: contractBills,
    name: "contractBills",
    meta: { title: "合同账单", foot: true }
  },
  {
    path: "/staffManagement",
    component: staffManagement,
    name: "staffManagement",
    meta: { title: "员工管理", foot: true }
  },
  {
    path: "/addStaff",
    component: addStaff,
    name: "addStaff",
    meta: { title: "添加员工", foot: true }
  },
  {
    path: "/contractList",
    component: contractList,
    name: "contractList",
    meta: { title: "合同列表", foot: true }
  },
  {
    path: "/companyContractList", //公司合同
    component: companyContractList,
    name: "companyContractList",
    meta: { title: "合同列表", foot: true }
  },
  {
    path: "/signMission/:id",
    component: signMission,
    name: "signMission",
    meta: { title: "任务信息", foot: true }
  },
  {
    path: "/signPage/:id",
    component: signPage,
    name: "signPage",
    meta: { title: "签署页", foot: true }
  },
  //电子合同新增的优化页面
  {
    path: "/signSeeTemplate",
    component: signSeeTemplate,
    name: "signSeeTemplate",
    meta: { title: "预览模版", foot: true }
  },
  {
    path: "/launchSign/:template_id?/:id?",
    component: launchSign,
    name: "launchSign",
    meta: { title: "发起签署", foot: true }
  },
  {
    path: "/contractFilling",
    component: contractFilling,
    name: "contractFilling",
    meta: { title: "发起签署", foot: true }
  },

  // 电子合同插件
  {
    path: "/signIndexPlu",
    component: signIndexPlu,
    name: "signIndexPlu",
    meta: { title: "个人中心", foot: false }
  },
  {
    path: "/personBankPlu",
    component: personBankPlu,
    name: "personBankPlu",
    meta: { title: "个人认证", foot: true }
  },
  {
    path: "/identifyResultPlu/:show",
    component: identifyResultPlu,
    name: "identifyResultPlu",
    meta: { title: "认证结果", foot: true }
  },
  {
    path: "/signCompanyPlu",
    component: signCompanyPlu,
    name: "signCompanyPlu",
    meta: { title: "企业认证", foot: true }
  },
  {
    path: "/contractListPlu",
    component: contractListPlu,
    name: "contractListPlu",
    meta: { title: "合同列表", foot: true }
  },
  {
    path: "/signMissionPlu/:id",
    component: signMissionPlu,
    name: "signMissionPlu",
    meta: { title: "任务信息", foot: true }
  },
  {
    path: "/signPagePlu/:id",
    component: signPagePlu,
    name: "signPagePlu",
    meta: { title: "签署页", foot: true }
  },

  //契约锁
  {
    path: "/signContractLock",
    component: signContractLock,
    name: "signContractLock",
    meta: { title: "个人中心", foot: false }
  },
  {
    path: "/personBankLock",
    component: personBankLock,
    name: "personBankLock",
    meta: { title: "个人认证", foot: true }
  },
  {
    path: "/identifyResultLock/:show",
    component: identifyResultLock,
    name: "identifyResultLock",
    meta: { title: "认证结果", foot: true }
  },
  {
    path: "/signCompanyLock",
    component: signCompanyLock,
    name: "signCompanyLock",
    meta: { title: "企业认证", foot: true }
  },
  {
    path: "/contractBillsLock",
    component: contractBillsLock,
    name: "contractBillsLock",
    meta: { title: "合同账单", foot: true }
  },
  {
    path: "/staffManagementLock",
    component: staffManagementLock,
    name: "staffManagementLock",
    meta: { title: "员工管理", foot: true }
  },
  {
    path: "/addStaffLock",
    component: addStaffLock,
    name: "addStaffLock",
    meta: { title: "添加员工", foot: true }
  },
  {
    path: "/contractListLock",
    component: contractListLock,
    name: "contractListLock",
    meta: { title: "合同列表", foot: true }
  },
  {
    path: "/signMissionLock/:id",
    component: signMissionLock,
    name: "signMissionLock",
    meta: { title: "任务信息", foot: true }
  },
  {
    path: "/signPageLock/:id",
    component: signPageLock,
    name: "signPageLock",
    meta: { title: "签署页", foot: true }
  },

  //客服
  // {
  //   path: '/chatIndex/:groupId/:employeeId',
  //   component: chatIndex,
  //   name: 'chatIndex',
  //   meta: { title: '会话', foot: true }
  // },
  // {
  //   path: '/employeeChat/:user_id?',
  //   component: employeeChat,
  //   name: 'employeeChat',
  //   meta: { title: '客户会话', foot: true }
  // },
  {
    path: "/personalProfile",
    component: PersonalProfile,
    name: "personalProfile",
    meta: {
      title: "客服简介",
      foot: true
    }
  },
  {
    path: "/chatWindow",
    component: chatWindow,
    name: "chatWindow",
    meta: { title: "客户会话", foot: true, notKeepAlive: true }
  },
  {
    path: "/chatList",
    component: chatList,
    name: "chatList",
    meta: { title: "会话", foot: false }
  },

  // 知识库
  {
    path: "/knowledge/home",
    component: knowledgeIndex,
    name: "knowledgeIndex",
    meta: { title: "知识库", foot: false }
  },
  {
    path: "/knowledge/knowledge_whole",
    component: knowledgeWhole,
    name: "knowledgeWhole",
    meta: { title: "全部知识库", foot: false }
  },
  {
    path: "/knowledge/knowledge_list",
    component: knowledgeList,
    name: "knowledgeList",
    meta: { title: "知识库目录", foot: false }
  },
  {
    path: "/knowledge/knowledge_search",
    component: knowledgeSearch,
    name: "knowledgeSearch",
    meta: { title: "知识库搜索", foot: true }
  },
  {
    path: "/knowledge/knowledge_detail/:articleId?",
    component: knowledgeDetail,
    name: "knowledgeDetail",
    meta: { title: "知识库详情", foot: false }
  },

  // 奖金池
  {
    path: "/others/bonus",
    component: Bonus,
    name: "Bonus",
    meta: {
      title: "奖金池",
      foot: true
    }
  },
  {
    path: "/appointment/index",
    component: Appointment,
    name: "Appointment",
    meta: {
      title: "预约首页",
      foot: true
    }
  },
  {
    path: "/show_appointment/:worker_id",
    component: showAppointment,
    name: "showAppointment",
    meta: {
      title: "可预约时间",
      foot: true
    }
  },
  {
    path: "/appointment_search",
    component: AppointmentSearch,
    name: "AppointmentSearch",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/project_details/:project_id",
    component: ProjectDetails,
    name: "ProjectDetails",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/project_list",
    component: ProjectList,
    name: "ProjectList",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/technician_details/:worker_id",
    component: TechnicianDetails,
    name: "TechnicianDetails",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/technician_time/:worker_id",
    component: TechnicianTime,
    name: "TechnicianTime",
    meta: {
      title: "添加工作时间",
      foot: true
    }
  },
  {
    path: "/hot_technician",
    component: HotTechnician,
    name: "HotTechnician",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/appointment_mine",
    component: AppointmentMine,
    name: "AppointmentMine",
    meta: {
      title: "我的",
      foot: true
    }
  },
  {
    path: "/technician_work",
    component: TechnicianWork,
    name: "TechnicianWork",
    meta: {
      title: "工作时间",
      foot: true
    }
  },
  {
    path: "/appointment_project",
    component: AppointmentProject,
    name: "AppointmentProject",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/add_technician/:store_id",
    component: AddTechnician,
    name: "AddTechnician",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/stores_technician",
    component: StoresTechnician,
    name: "StoresTechnician",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/client_appointment",
    component: ClientAppointment,
    name: "ClientAppointment",
    meta: {
      title: "我的预约",
      foot: true
    }
  },
  {
    path: "/client_evaluate/:service_id",
    component: ClientEvaluate,
    name: "ClientEvaluate",
    meta: {
      title: "评价",
      foot: true
    }
  },
  {
    path: "/client_verification/:service_id",
    component: ClientVerification,
    name: "ClientVerification",
    meta: {
      title: "核销",
      foot: true
    }
  },
  {
    path: "/make_appointment/:id",
    component: MakeAppointment,
    name: "MakeAppointment",
    meta: {
      title: "预约",
      foot: true
    }
  },
  {
    path: "/client_project",
    component: ClientProject,
    name: "ClientProject",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/AppointmentExtends",
    component: AppointmentExtends,
    name: "AppointmentExtends",
    meta: {
      title: "门店预约",
      foot: true
    }
  },
  {
    // path: "/others/advertisingPage",
    path: "/share_page_detail",
    component: advertisingPage,
    name: "advertisingPage"
    // meta: {
    //   title: "宣传单",
    //   foot: true
    // }
  },

  // 分销队列
  {
    path: "/distribution/index",
    component: DistributionIndex,
    name: "DistributionIndex",
    meta: {
      title: "分销队列活动",
      foot: true
    }
  },
  {
    path: "/distribution/search",
    component: DistributionSearch,
    name: "DistributionSearch",
    meta: {
      title: "活动列表",
      foot: true
    }
  },
  {
    path: "/distribution/statistics",
    component: DistributionStatistics,
    name: "DistributionStatistics",
    meta: {
      title: "分销队列",
      foot: true
    }
  },
  {
    path: "/distribution/detail/:id",
    component: DistributionActivityDetail,
    name: "DistributionActivityDetail",
    meta: {
      title: "活动详情",
      foot: true
    }
  },
  {
    path: "/distribution/commission_detail/:tag",
    component: DistributionCommissionDetail,
    name: "DistributionCommissionDetail",
    meta: {
      title: "佣金详情",
      foot: true
    }
  },
  {
    path: "/distribution/participant/:id",
    component: DistributionParticipant,
    name: "DistributionParticipant",
    meta: {
      title: "参与人",
      foot: true
    }
  },
  {
    path: "/distribution/goods/:id/:activity_id",
    component: Goods,
    name: "DistributionGoods",
    meta: {
      title: "商品详情",
      is_single_share: true,
      foot: true
    }
  },

  {
    path: "/auctioneer",
    component: auctioneer,
    name: "auctioneer",
    meta: {
      title: "拍卖官管理",
      foot: true
    }
  },
  {
    path: "/introduceNear/:store_id",
    component: introduceNear,
    name: "introduceNear",
    meta: {
      title: "门店附近推荐商品",
      foot: true
    }
  },
  {
    path: "/auctionCollect",
    component: auctionCollect,
    name: "auctionCollect",
    meta: {
      title: "我的收藏",
      foot: true
    }
  },
  {
    path: "/nearSearch/:store_id",
    component: nearSearch,
    name: "nearSearch",
    meta: {
      title: "推荐商品搜索结果",
      foot: true
    }
  },
  {
    path: "/myAuction/:id",
    component: myAuction,
    name: "myAuction",
    meta: {
      title: "我的拍卖",
      foot: true
    }
  },
  {
    path: "/myIndex",
    component: myIndex,
    name: "myIndex",
    meta: {
      title: "我的",
      foot: true
    }
  },
  {
    path: "/myMoney",
    component: myMoney,
    name: "myMoney",
    meta: {
      title: "我的收入",
      foot: true
    }
  },
  {
    path: "/passwordChange",
    component: passwordChange,
    name: "passwordChange",
    meta: {
      title: "店铺密码设置",
      foot: true
    }
  },
  {
    path: "/setPassword",
    component: setPassword,
    name: "setPassword",
    meta: {
      title: "密码设置",
      foot: true
    }
  },
  {
    path: "/shopShare",
    component: shopShare,
    name: "shopShare",
    meta: {
      title: "店铺分享海报",
      foot: true
    }
  },
  {
    path: "/goodManage",
    component: goodManage,
    name: "goodManage",
    meta: {
      title: "拍品管理",
      foot: true
    }
  },
  {
    path: "/addNear/:id",
    component: addNear,
    name: "addNear",
    meta: {
      title: "添加推荐商品",
      foot: true
    }
  },
  {
    path: "/publishFirst",
    component: publishFirst,
    name: "publishFirst",
    meta: {
      title: "发布商品",
      foot: true
    }
  },
  {
    path: "/publishSecond",
    component: publishSecond,
    name: "publishSecond",
    meta: {
      title: "发布商品",
      foot: true
    }
  },
  {
    path: "/auctionIndex",
    component: auctionIndex,
    name: "auctionIndex",
    meta: {
      title: "首页",
      foot: true
    }
  },
  {
    path: "/auctionMore",
    component: auctionMore,
    name: "auctionMore",
    meta: {
      title: "推荐拍品",
      foot: true
    }
  },
  {
    path: "/auctionVip",
    component: auctionVip,
    name: "auctionVip",
    meta: {
      title: "贵宾厅",
      foot: true
    }
  },
  {
    path: "/auctionSearch",
    component: auctionSearch,
    name: "auctionSearch",
    meta: {
      title: "搜索结果",
      foot: true
    }
  },
  {
    path: "/auctionApply",
    component: auctionApply,
    name: "auctionApply",
    meta: {
      title: "拍卖申请",
      foot: true
    }
  },
  {
    path: "/auctionRecord/:goods_id",
    component: auctionRecord,
    name: "auctionRecord",
    meta: {
      title: "竞拍记录",
      foot: true
    }
  },
  {
    path: "/auctionGood/:goods_id/:id?",
    component: auctionGood,
    name: "auctionGood",
    meta: {
      title: "拍卖详情",
      foot: true
    }
  },
  {
    path: "/auctioneerShop/:id",
    component: auctioneerShop,
    name: "auctioneerShop",
    meta: {
      title: "拍卖官店铺",
      foot: true
    }
  },
  {
    path: "/auctioneerShopSearch/:id",
    component: auctioneerShopSearch,
    name: "auctioneerShopSearch",
    meta: {
      title: "全部拍品",
      foot: true
    }
  },
  {
    path: "/auctionLove",
    component: auctionLove,
    name: "auctionLove",
    meta: {
      title: "保证金",
      foot: true
    }
  },
  {
    path: "/auctionLoveDetail",
    component: auctionLoveDetail,
    name: "auctionLoveDetail",
    meta: {
      title: "保证金明细",
      foot: true
    }
  },
  {
    path: "/auctionLoveCash",
    component: auctionLoveCash,
    name: "auctionLoveCash",
    meta: {
      title: "保证金提现",
      foot: true
    }
  },
  {
    path: "/auctionRecharge",
    component: auctionRecharge,
    name: "auctionRecharge",
    meta: {
      title: "保证金充值",
      foot: true
    }
  },
  // {
  //   path: "/auctiongoodsorder",
  //   component: auctiongoodsorder,
  //   name: "auctiongoodsorder",
  //   meta: {
  //     title: "拍卖填写订单",
  //     foot: true
  //   }
  // },
  {
    path: "/qrCoupon",
    component: qrCoupon,
    name: "qrCoupon",
    meta: {
      title: "优惠券二维码",
      foot: true
    }
  },

  {
    path: "/easyRefuel",
    component: easyRefuel,
    name: "easyRefuel",
    meta: {
      title: "加油",
      foot: false
    }
  },
  {
    path: "/easyRefuel/search/:city/:point",
    component: easySearch,
    name: "easySearch",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/chooseBank/:order_pay_id/:status?",
    component: chooseBank,
    name: "chooseBank",
    meta: {
      title: "银行卡列表",
      foot: true
    }
  },
  {
    path: "/addBankFirst/:order_pay_id/:status?",
    component: addBankFirst,
    name: "addBankFirst",
    meta: {
      title: "添加银行卡",
      foot: true
    }
  },
  {
    path: "/addBankSecond/:order_pay_id/:status?",
    component: addBankSecond,
    name: "addBankSecond",
    meta: {
      title: "填写银行卡信息",
      foot: true
    }
  },
  {
    path: "/bindBank/:card_id/:order_pay_id/:status?",
    component: bindBank,
    name: "bindBank",
    meta: {
      title: "绑定银行卡",
      foot: true
    }
  },
  {
    path: "/memberchooseBank",
    component: memberchooseBank,
    name: "memberchooseBank",
    meta: {
      title: "银行卡列表",
      foot: true
    }
  },
  {
    path: "/memberaddBankFirst",
    component: memberaddBankFirst,
    name: "memberaddBankFirst",
    meta: {
      title: "添加银行卡",
      foot: true
    }
  },
  {
    path: "/memberaddBankSecond",
    component: memberaddBankSecond,
    name: "memberaddBankSecond",
    meta: {
      title: "添加银行卡",
      foot: true
    }
  },
  {
    path: "/memberbindBank/:card_id",
    component: memberbindBank,
    name: "memberbindBank",
    meta: {
      title: "绑定银行卡",
      foot: true
    }
  },
  {
    path: "/memberRemoveBank/:card_id",
    component: memberRemoveBank,
    name: "memberRemoveBank",
    meta: {
      title: "解绑银行卡",
      foot: true
    }
  },
  {
    path: "/quickIndex",
    component: quickIndex,
    name: "quickIndex",
    meta: {
      title: "汇聚支付",
      foot: true
    }
  },
  {
    path: "/extendRecord",
    component: extendRecord,
    name: "extendRecord",
    meta: {
      title: "推广记录",
      foot: true
    }
  },
  {
    path: "/extendHelper",
    component: extendHelper,
    name: "extendHelper",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/extendExplain",
    component: extendExplain,
    name: "extendExplain",
    meta: {
      title: "使用说明",
      foot: true
    }
  },
  // 推广助手
  {
    path: "/popular_assistant/:id",
    component: popularAssistant,
    name: "popularAssistant",
    meta: {
      title: "推广助手",
      foot: true
    }
  },
  //能量舱
  {
    path: "/powerCabin",
    component: powerCabin,
    name: "powerCabin",
    meta: {
      title: "能量舱",
      foot: true
    }
  },
  // {
  //   path: '/powerResult',
  //   component: powerResult,
  //   name: 'powerResult',
  //   meta: {
  //     title: '检测结果',
  //     foot: true
  //   }
  // },
  // {
  //   path: '/powerCheck',
  //   component: powerCheck,
  //   name: 'powerCheck',
  //   meta: {
  //     title: '检测记录',
  //     foot: true
  //   }
  // },
  {
    path: "/powerStore",
    component: powerStore,
    name: "powerStore",
    meta: {
      title: "店铺信息",
      foot: true
    }
  },
  {
    path: "/powerSell",
    component: powerSell,
    name: "powerSell",
    meta: {
      title: "能量舱经销商",
      foot: true
    }
  },
  {
    path: "/powerMember",
    component: powerMember,
    name: "powerMember",
    meta: {
      title: "会员信息",
      foot: true
    }
  },
  {
    path: "/powerEquipment",
    component: powerEquipment,
    name: "powerEquipment",
    meta: {
      title: "我的设备",
      foot: true
    }
  },
  {
    path: "/powerDetail",
    component: powerDetail,
    name: "powerDetail",
    meta: {
      title: "会员详情",
      foot: true
    }
  },
  {
    path: "/bindEquipment",
    component: bindEquipment,
    name: "bindEquipment",
    meta: {
      title: "绑定设备",
      foot: true
    }
  },
  {
    path: "/powerNotes/:id",
    component: powerNotes,
    name: "powerNotes",
    meta: {
      title: "经销商核销记录",
      foot: true
    }
  },
  {
    path: "/powerAddMeb/:dealer_uid",
    component: powerAddMeb,
    name: "powerAddMeb",
    meta: {
      title: "会员资料填写",
      foot: true
    }
  },
  {
    path: "/cardDetail/:id",
    component: cardDetail,
    name: "cardDetail",
    meta: {
      title: "查看详情",
      foot: true
    }
  },
  {
    path: "/member/subsidyManage",
    component: subsidyManage,
    name: "subsidyManage",
    meta: {
      title: "津贴管理",
      foot: true
    }
  },
  {
    path: "/teamSell",
    component: teamSell,
    name: "teamSell",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/powerCancellation/:card_type",
    component: powerCancellation,
    name: "powerCancellation",
    meta: {
      title: "核销记录",
      foot: true
    }
  },
  {
    path: "/teamActive",
    component: teamActive,
    name: "teamActive",
    meta: {
      title: "活跃值",
      foot: true
    }
  },
  {
    path: "/Cancellation/:id",
    component: Cancellation,
    name: "Cancellation",
    meta: {
      title: "核销",
      foot: true
    }
  },
  {
    path: "/teamLimit",
    component: teamLimit,
    name: "teamLimit",
    meta: {
      title: "激活权限",
      foot: true
    }
  },
  {
    path: "/addFamily/:id",
    component: addFamily,
    name: "addFamily",
    meta: {
      title: "家庭成员",
      foot: true
    }
  },
  {
    path: "/activeRecord",
    component: activeRecord,
    name: "activeRecord",
    meta: {
      title: "活跃值记录",
      foot: true
    }
  },
  {
    path: "/memberCard",
    component: memberCard,
    name: "memberCard",
    meta: {
      title: "会员卡",
      foot: true
    }
  },
  {
    path: "/teamCommission/:id",
    component: teamCommission,
    name: "teamCommission",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/storeShareholder",
    component: storeShareholder,
    name: "storeShareholder",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/cloudIndex",
    component: cloudIndex,
    name: "cloudIndex",
    meta: {
      title: "会员中心",
      foot: false
    }
  },
  {
    path: "/pickUpArea",
    component: pickUpArea,
    name: "pickUpArea",
    meta: {
      title: "云仓",
      foot: false
    }
  },
  {
    path: "/pickUp/:id",
    component: pickUp,
    name: "pickUp",
    meta: {
      title: "云仓",
      foot: false
    }
  },
  {
    path: "/cloudOrder",
    component: cloudOrder,
    name: "cloudOrder",
    meta: {
      title: "下单",
      foot: true
    }
  },
  {
    path: "/cloudOrderList",
    component: cloudOrderList,
    name: "cloudOrderList",
    meta: {
      title: "提货订单",
      foot: true
    }
  },
  {
    path: "/cloudOrderDetail",
    component: cloudOrderDetail,
    name: "cloudOrderDetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/cloudRecord",
    component: cloudRecord,
    name: "cloudRecord",
    meta: {
      title: "解冻记录",
      foot: true
    }
  },
  {
    path: "/cloudRelease",
    component: cloudRelease,
    name: "cloudRelease",
    meta: {
      title: "云仓释放",
      foot: true
    }
  },
  {
    path: "/cloudReleaseLog/:id/:active",
    component: cloudReleaseLog,
    name: "cloudReleaseLog",
    meta: {
      title: "查看详情",
      foot: true
    }
  },
  {
    path: "/balanceDetail",
    component: balanceDetail,
    name: "balanceDetail",
    meta: {
      title: "余额明细",
      foot: true
    }
  },
  {
    path: "/wechatCard",
    component: wechatCard,
    name: "wechatCard",
    meta: {
      title: "领取会员卡",
      foot: false
    }
  },
  {
    path: "/oil_station",
    component: oilStation,
    name: "oilStation",
    meta: {
      title: "全国油站",
      foot: true
    }
  },
  {
    path: "/salesTable",
    component: salesTable,
    name: "salesTable",
    meta: {
      title: "销售报表",
      foot: false
    }
  },
  {
    path: "/predictIncome",
    component: predictIncome,
    name: "predictIncome",
    meta: {
      title: "预估收益",
      foot: true
    }
  },
  {
    path: "/managementIndex/:id",
    component: managementIndex,
    name: "managementIndex",
    meta: {
      title: "厂家店铺",
      foot: true
    }
  },

  // 门店消费卡
  {
    path: "/o2o/store_consume_index",
    component: storeConsumeIndex,
    name: "storeConsumeIndex",
    meta: {
      title: "门店消费卡",
      foot: true
    }
  },
  {
    path: "/o2o/store_consume_store/:id",
    component: storeConsumeStore,
    name: "storeConsumeStore",
    meta: {
      title: "门店消费卡门店",
      foot: true
    }
  },
  {
    path: "/o2o/store_consume_show/:id",
    component: storeConsumeShow,
    name: "storeConsumeShow",
    meta: {
      title: "门店消费卡核销码",
      foot: true
    }
  },
  {
    path: "/o2o/store_consume_use/:id/:card_id",
    component: storeConsumeUse,
    name: "storeConsumeUse",
    meta: {
      title: "门店消费卡核销",
      foot: true
    }
  },
  {
    path: "/o2o/store_consume_income",
    component: storeConsumeIncome,
    name: "storeConsumeIncome",
    meta: {
      title: "门店消费卡收入明细",
      foot: true
    }
  },
  {
    path: "/o2oCard/couponLog",
    component: couponLog,
    name: "couponLog",
    meta: {
      title: "使用记录",
      foot: true
    }
  },

  {
    path: "/member/pick_up_card/:plugin?",
    component: pickUpCardIndex,
    name: "pickUpCardIndex",
    meta: {
      title: "旅游激活卡",
      foot: true
    }
  },
  {
    path: "/proclamation/:id",
    component: proclamation,
    name: "proclamation",
    meta: {
      title: "厂家公告",
      foot: true
    }
  },
  {
    path: "/member/pick_up_card_reimburse/:order_id/:type/:plugin?",
    component: pickUpCardReimburse,
    name: "pickUpCardReimburse",
    meta: {
      title: "保证金退款",
      foot: true
    }
  },
  {
    path: "/managementLis",
    component: managementLis,
    name: "managementLis",
    meta: {
      title: "厂家列表",
      foot: true
    }
  },
  {
    path: "/managementGoods/:id/:kid",
    component: Goods,
    name: "managementGoods",
    meta: {
      title: "商品详情",
      foot: true
    }
  },
  {
    path: "/member/pick_up_card_order_list",
    component: pickUpCardOrderList,
    name: "pickUpCardOrderList",
    meta: {
      title: "提货卡订单",
      foot: true
    }
  },
  {
    path: "/member/pick_up_card_order_list/one",
    component: pickUpCardOrderList,
    name: "pickUpCardOrderListOne",
    meta: {
      title: "提货卡订单",
      foot: true
    }
  },
  {
    path: "/member/pick_up_card_my",
    component: pickUpCardMy,
    name: "pickUpCardMy",
    meta: {
      title: "我的卡",
      foot: true
    }
  },
  {
    path: "/member/pick_up_card_my_det",
    component: pickUpCardMyDet,
    name: "pickUpCardMyDet",
    meta: {
      title: "我的卡",
      foot: true
    }
  },
  {
    path: "/tokerIndex/:city/:point",
    component: tokerIndex,
    name: "tokerIndex",
    meta: {
      title: "拓客卡列表",
      foot: true
    }
  },
  {
    path: "/video_question",
    component: videoQuestion,
    name: "videoQuestion",
    meta: {
      title: "首页",
      foot: false
    }
  },
  {
    path: "/answer",
    component: mvideoAnswer,
    name: "mvideoAnswer",
    meta: {
      title: "聚合页",
      foot: true
    }
  },
  {
    path: "/apply",
    component: videoApply,
    name: "videoApply",
    meta: {
      title: "申请推广员",
      foot: true
    }
  },
  {
    path: "/watch/:id",
    component: videoWhtch,
    name: "videoWhtch",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/videoRecord",
    component: videoRecord,
    name: "videoRecord",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/videoRecordList/:id",
    component: videoRecordList,
    name: "videoRecordList",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/cpsIndex",
    component: cpsIndex,
    name: "cpsIndex",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/rightsInterests",
    component: rightsInterests,
    name: "rightsInterests",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/circleIndex",
    component: circleIndex,
    name: "circleIndex",
    meta: {
      title: "圈子首页",
      foot: true
    }
  },
  {
    path: "/circleSearch",
    component: circleSearch,
    name: "circleSearch",
    meta: {
      title: "圈子搜索",
      foot: true
    }
  },
  // {
  //   path: "/circlePay",
  //   component: circlePay,
  //   name: "circlePay",
  //   meta: {
  //     title: "支付订单",
  //     foot: true
  //   }
  // },
  {
    path: "/circlePayRecords",
    component: circlePayRecords,
    name: "circlePayRecords",
    meta: {
      title: "付费记录",
      foot: true
    }
  },
  {
    path: "/circleIssue",
    component: circleIssue,
    name: "circleIssue",
    meta: {
      title: "发布",
      foot: true
    }
  },
  {
    path: "/circleMySet",
    component: circleMySet,
    name: "circleMySet",
    meta: {
      title: "我的设置",
      foot: true
    }
  },
  {
    path: "/circleMyAttention",
    component: circleMyAttention,
    name: "circleMyAttention",
    meta: {
      title: "我的关注",
      foot: true
    }
  },
  {
    path: "/circleMyCircle",
    component: circleMyCircle,
    name: "circleMyCircle",
    meta: {
      title: "我的圈子",
      foot: true
    }
  },
  {
    path: "/circleDetails",
    component: circleDetails,
    name: "circleDetails",
    meta: {
      title: "圈子详情",
      foot: true
    }
  },
  {
    path: "/circleMyRelease",
    component: circleMyRelease,
    name: "circleMyRelease",
    meta: {
      title: "我的发布",
      foot: true
    }
  },
  {
    path: "/circleIntroduce",
    component: circleIntroduce,
    name: "circleIntroduce",
    meta: {
      title: "圈子简介",
      foot: true
    }
  },
  {
    path: "/circleExtend",
    component: circleExtend,
    name: "circleExtend",
    meta: {
      title: "圈子推广中心",
      foot: true
    }
  },
  {
    path: "/circleSetting",
    component: circleSetting,
    name: "circleSetting",
    meta: {
      title: "圈子设置",
      foot: true
    }
  },
  {
    path: "/circleChecklist",
    component: circleChecklist,
    name: "circleChecklist",
    meta: {
      title: "审核列表",
      foot: true
    }
  },
  {
    path: "/circleMember",
    component: circleMember,
    name: "circleMember",
    meta: {
      title: "成员管理",
      foot: true
    }
  },
  {
    path: "/circleSelect",
    component: circleSelect,
    name: "circleSelect",
    meta: {
      title: "发布",
      foot: true
    }
  },
  {
    path: "/circlereleaseVideo",
    component: circlereleaseVideo,
    name: "circlereleaseVideo",
    meta: {
      title: "发布视频",
      foot: true
    }
  },
  {
    path: "/circleTopic",
    component: circleTopic,
    name: "circleTopic",
    meta: {
      title: "发布帖子",
      foot: true
    }
  },
  {
    path: "/circleVideogood",
    component: circleVideogood,
    name: "circleVideogood",
    meta: {
      title: "选择商品",
      foot: true
    }
  },
  {
    path: "/topicDetails",
    component: topicDetails,
    name: "topicDetails",
    meta: {
      title: "帖子详情",
      foot: true
    }
  },
  {
    path: "/circleVideodetail",
    component: circleVideodetail,
    name: "circleVideodetail",
    meta: {
      title: "视频",
      foot: false
    }
  },
  {
    path: "/circleEdit",
    component: circleEdit,
    name: "circleEdit",
    meta: {
      title: "编辑资料",
      foot: true
    }
  },
  {
    path: "/shopRanking",
    component: shopRanking,
    name: "shopRanking",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/shopRankingList/:id",
    component: shopRankingList,
    name: "shopRankingList",
    meta: {
      title: "",
      foot: false
    }
  },
  {
    path: "/stock", //* 云库存
    component: CloudStock,
    name: "StockIndex", //* MP：stock/index
    redirect: "/stock/index",
    meta: {
      title: "云库存",
      foot: false
    },
    children: [
      {
        path: "/stock/index",
        component: CloudStockRelatedLink,
        name: "StockRelatedLinks", //* MP：stock/index
        meta: {
          title: "云库存",
          foot: false
        }
      },
      {
        path: "promotion_center", //* fullpath：/stock/promotion_center
        component: CloudStockPromotionCenter,
        name: "StockPromotionCenter", //* MP：stock/promotion_center
        meta: {
          title: "推广中心",
          foot: false
        }
      }
    ]
  },
  {
    path: "/stock/guide/:target?", //* 云库存 聚合
    component: CloudStockGoodsGuide,
    name: "StockGuide", //* MP：stock/guide
    meta: {
      title: "聚合",
      foot: false
    }
  },
  {
    path: "/stock/my", //* 云库存 我的库存
    component: ClousStockMyInventory,
    name: "StockMy", //* MP：stock/my
    meta: {
      title: "我的库存",
      foot: false
    }
  },
  {
    path: "/stock/details", //* 云库存 库存明细
    component: ClousStockDetails,
    name: "StockDetails", //* MP：stock/details
    meta: {
      title: "库存明细",
      foot: false
    }
  },
  {
    path: "/agency/dividend", //* 云库存 销售员分红
    component: r => require(["../views/others/stock/extension_dividend"], r),
    name: "agencyDividend", //* MP：stock/details
    meta: {
      title: "销售员分红",
      foot: true
    }
  },
  {
    path: "/cpsDetail/:id",
    component: cpsDetail,
    name: "cpsDetail",
    meta: {
      title: "详情",
      foot: true
    }
  },
  {
    path: "/cpsList/:id/:title",
    component: cpsList,
    name: "cpsList",
    meta: {
      title: "列表"
    }
  },
  {
    path: "/member/upgrade_code", //* 会员 -> 升级码
    component: MemberUpgradeCode,
    name: "MemberUpgradeCode", //* MP：/member/upgrade_code/index
    meta: {
      title: "升级码"
    }
  },
  {
    path: "/member/upgrade_code/group_details", //* 会员 -> 升级码 -> 升级码组详情
    component: MemberUpgradeCodeGroupDetails,
    name: "MemberUpgradeCodeGroupDetails", //* MP：/member/upgrade_code/group_details
    meta: {
      title: "升级码",
      is_single_share: true
    }
  },
  {
    path: "/member/upgrade_code/used_log", //* 会员 -> 升级码 -> 使用记录
    component: MemberUpgradeCodeUsedLog,
    name: "MemberUpgradeCodeUsedLog", //* MP：/member/upgrade_code/used_log
    meta: {
      title: "使用记录",
      foot: false
    }
  },
  {
    path: "/member/upgrade_code/upgrade_result", //* 会员 -> 升级码 -> 升级结果
    component: MemberUpgradeResult,
    name: "MemberUpgradeResult", //* MP：/member/upgrade_code/upgrade_result
    meta: {
      title: "升级结果",
      foot: false
    }
  },
  {
    path: "/cpsCard",
    component: cpsCard,
    name: "cpsCard",
    meta: {
      title: "卡券",
      foot: false
    }
  },
  {
    path: "/cpsPwd/:order_id",
    component: cpsPwd,
    name: "cpsPwd",
    meta: {
      title: "卡密",
      foot: false
    }
  },
  {
    path: "/cpsExtension/:tab?/:child?",
    component: cpsExtension,
    name: "cpsExtension",
    meta: {
      title: "",
      foot: false
    }
  },
  // 下级足迹
  {
    path: "/footprintMember",
    component: footprintMember,
    name: "footprintMember",
    meta: {
      title: "下级足迹",
      foot: true
    }
  },
  {
    path: "/footprintMemberDetail/:id",
    component: footprintMemberDetail,
    name: "footprintMemberDetail",
    meta: {
      title: "下级足迹",
      foot: true
    }
  },
  {
    path: "/memberTokerCard",
    component: memberTokerCard,
    name: "memberTokerCard",
    meta: {
      title: "拓客卡",
      foot: true
    }
  },
  {
    path: "/tokerSetMeal/:id",
    component: tokerSetMeal,
    name: "tokerSetMeal",
    meta: {
      title: "拓客卡",
      foot: true
    }
  },
  {
    path: "/tokerCode/:id/:name",
    component: tokerCode,
    name: "tokerCode",
    meta: {
      title: "拓客卡",
      foot: true
    }
  },
  {
    path: "/tokerMerchant/:id",
    component: tokerMerchant,
    name: "tokerMerchant",
    meta: {
      title: "拓客卡",
      foot: true
    }
  },
  {
    path: "/leagueExtends",
    component: leagueExtends,
    name: "leagueExtends",
    meta: {
      title: "电商联盟"
    }
  },
  {
    path: "/leagueStoreIndex",
    component: LeagueStoreIndex,
    name: "leagueStoreIndex",
    meta: {
      title: "店商联盟"
    }
  },
  {
    path: "/liveAuthorization",
    component: liveAuthorization,
    name: "liveAuthorization",
    meta: {
      title: "直播授权码",
      foot: true
    }
  },
  {
    path: "/liveAuthorization_detail",
    component: liveAuthorization_detail,
    name: "liveAuthorization_detail",
    meta: {
      title: "直播授权码",
      foot: true
    }
  },
  {
    path: "/leagueOperatingCenter",
    component: LeagueOperatingCenter,
    name: "leagueOperatingCenter",
    meta: {
      title: "店商联盟",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/leagueOperatingStore",
    component: LeagueOperatingStore,
    name: "leagueOperatingStore",
    meta: {
      title: "店商联盟",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/leagueServiceCenter",
    component: LeagueServiceCenter,
    name: "leagueServiceCenter",
    meta: {
      title: "店商联盟",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/leagueTaskCenter",
    component: LeagueTaskCenter,
    name: "leagueTaskCenter",
    meta: {
      title: "店商联盟",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/leagueTaskProgress",
    component: LeagueTaskProgress,
    name: "leagueTaskProgress",
    meta: {
      title: "店商联盟",
      foot: true,
      notKeepAlive: true
    }
  },
  {
    path: "/liveAuthorization_collection/:id",
    component: liveAuthorization_collection,
    name: "liveAuthorization_collection",
    meta: {
      title: "直播授权码",
      foot: true
    }
  },
  {
    path: "/liveAuthorization_scanCode",
    component: liveAuthorization_scanCode,
    name: "liveAuthorization_scanCode",
    meta: {
      title: "直播授权码",
      foot: false
    }
  },
  {
    path: "/liveAuthorization_extension",
    component: liveAuthorization_extension,
    name: "liveAuthorization_extension",
    meta: {
      title: "直播授权码",
      foot: true
    }
  },
  {
    path: "/liveAuthorization_pay/:id",
    component: liveAuthorization_pay,
    name: "liveAuthorization_pay",
    meta: {
      title: "支付",
      foot: true
    }
  },
  {
    path: "/periodicalIndex",
    component: periodicalIndex,
    name: "periodicalIndex",
    meta: {
      title: "期刊杂志",
      foot: true
    }
  },
  {
    path: "/periodicalDetail/:id",
    component: periodicalDetail,
    name: "periodicalDetail",
    meta: {
      title: "期刊杂志",
      foot: false
    }
  },
  {
    path: "/periodicalWatch/:id/:ind",
    component: periodicalWatch,
    name: "periodicalWatch",
    meta: {
      title: "期刊杂志",
      foot: true
    }
  },
  {
    path: "/flightInformation",
    component: flightInformation,
    name: "flightInformation",
    meta: {
      title: "航班信息收集",
      foot: true
    }
  },
  {
    path: "/flightInformationDetailList",
    component: flightInformationDetailList,
    name: "flightInformationDetailList",
    meta: {
      title: "航班信息收集记录",
      foot: true
    }
  },
  {
    path: "/flightInformationDetail/:id/:form_id",
    component: flightInformationDetail,
    name: "flightInformationDetail",
    meta: {
      title: "航班信息收集记录",
      foot: true
    }
  },
  {
    path: "/questionnaireIndex",
    component: questionnaireIndex,
    name: "questionnaireIndex",
    meta: {
      title: "首页",
      foot: false
    }
  },
  {
    path: "/questionsSearch",
    component: questionsSearch,
    name: "questionsSearch",
    meta: {
      title: "搜索",
      foot: false
    }
  },
  {
    path: "/questions/:id/:tag?",
    component: questions,
    name: "questions",
    meta: {
      title: "",
      foot: true
    }
  },
  {
    path: "/surveyResult/:id/:score/:allNum/:rewardPoint",
    component: surveyResult,
    name: "surveyResult",
    meta: {
      title: "调查结果",
      foot: true
    }
  },
  {
    path: "/questioHistory",
    component: questioHistory,
    name: "questioHistory",
    meta: {
      title: "历史记录",
      foot: true
    }
  },
  {
    path: "/history_details/:id/:questionnaire_id",
    component: history_details,
    name: "history_details",
    meta: {
      title: "问卷详情",
      foot: true
    }
  },
  {
    path: "/turnaroundTimeIndex",
    component: turnaroundTimeIndex,
    name: "turnaroundTimeIndex",
    meta: {
      title: "排队计时",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/turnaroundTimeActual",
    component: turnaroundTimeActual,
    name: "turnaroundTimeActual",
    meta: {
      title: "实时成绩",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/turnaroundTimeActualSP",
    component: turnaroundTimeActualSP,
    name: "turnaroundTimeActualSP",
    meta: {
      title: "实时成绩",
      foot: true,
      isPC: true
    }
  },
  {
    path: "/turnaroundTimeRank",
    component: turnaroundTimeRank,
    name: "turnaroundTimeRank",
    meta: {
      title: "车场计时",
      foot: true,
      isPC: true
    }
  },
  //更新下载
  {
    path: "/downloadUpdate",
    component: DownloadUpdate,
    name: "downloadUpdate",
    meta: {
      title: "更新下载",
      foot: true
    }
  },
  //* 定金阶梯团
  ...DepositGroupRoutes,
  //* 新媒体广告
  ...NewMediaAdRoutes,
  {
    path: "/merchantsCommissioner",
    component: MerchantsCommissioner,
    name: "MerchantsCommissioner",
    meta: {
      title: "招商专员",
      foot: true
    }
  },

  // 门店奖励
  {
    path: "/member/extendStoreRewards",
    component: ExtendStoreRewards,
    name: "extendStoreRewards",
    meta: {
      title: "门店奖励",
      foot: true
    }
  },
  {
    path: "/member/commissionSummary",
    component: CommissionSummary,
    name: "commissionSummary",
    meta: {
      title: "提成概括",
      foot: true
    }
  },
  {
    path: "/member/storeOrder",
    component: StoreOrder,
    name: "storeOrder",
    meta: {
      title: "订单概括",
      foot: true
    }
  },
  {
    path: "/member/cashierOrder",
    component: CashierOrder,
    name: "cashierOrder",
    meta: {
      title: "订单概括",
      foot: true
    }
  },
  {
    path: "/scancodeAccount/:id",
    component: scancodeAccount,
    name: "scancodeAccount",
    meta: {
      title: "扫码支付",
      foot: true
    }
  },

  // 多门店核销
  {
    path: "/StoreVerification",
    component: StoreVerification,
    name: "StoreVerification",
    meta: {
      title: "多门店核销",
      foot: false
    }
  },
  {
    path: "/WriteOffRecord/:project_title?",
    component: WriteOffRecord,
    name: "WriteOffRecord",
    meta: {
      title: "使用记录",
      foot: false
    }
  },
  {
    path: "/StoreRecords",
    component: StoreRecords,
    name: "StoreRecords",
    meta: {
      title: "门店记录",
      foot: true
    }
  },
  {
    path: "/VerificationRecord",
    component: VerificationRecord,
    name: "VerificationRecord",
    meta: {
      title: "核销员记录",
      foot: true
    }
  },
  {
    path: "/BusinessVerification/:id",
    component: BusinessVerification,
    name: "BusinessVerification",
    meta: {
      title: "核销",
      foot: true
    }
  },
  {
    path: "/WriteOff",
    component: WriteOff,
    name: "WriteOff",
    meta: {
      title: "核销",
      foot: true
    }
  },
  {
    path: "/MyProject",
    component: MyProject,
    name: "MyProject",
    meta: {
      title: "我的项目",
      foot: false
    }
  },
  {
    path: "/VerificationProjectDetails/:id",
    component: VerificationProjectDetails,
    name: "VerificationProjectDetails",
    meta: {
      title: "项目详情",
      foot: false
    }
  },
  {
    path: "/VerificationProjectList",
    component: VerificationProjectList,
    name: "VerificationProjectList",
    meta: {
      title: "项目列表",
      foot: false
    }
  },
  {
    path: "/MoreStores/:id?/:project_id?/:name?",
    component: MoreStores,
    name: "MoreStores",
    meta: {
      title: "适用门店",
      foot: true
    }
  },
  {
    path: "/SearchProject",
    component: SearchProject,
    name: "SearchProject",
    meta: {
      title: "项目列表",
      foot: true
    }
  },
  {
    path: "/CategoryProjectList/:id",
    component: CategoryProjectList,
    name: "CategoryProjectList",
    meta: {
      title: "项目列表",
      foot: false
    }
  },

  {
    path: "/YeePay",
    component: YeePay,
    name: "YeePay",
    meta: {
      title: "易宝代付签约",
      foot: true
    }
  },

  {
    path: "/HighLight",
    component: HighLight,
    name: "HighLight",
    meta: {
      title: "高灯代发薪"
    }
  },
  {
    path: "/FreeRecord",
    component: FreeRecord,
    name: "FreeRecord",
    meta: {
      title: "免单记录",
      foot: true
    }
  },

  // 聚合cps订单
  {
    path: "/cpsOrderList",
    component: cpsOrderList,
    name: "cpsOrderList",
    meta: {
      title: "我的订单"
    }
  },
  {
    path: "/cpsCouponList",
    component: cpsOrderList,
    name: "cpsCouponList",
    meta: {
      title: "卡券订单",
      foot: true
    }
  },
  {
    path: "/FreeDetails",
    component: FreeDetails,
    name: "FreeDetails",
    meta: {
      title: "查看详情",
      foot: true
    }
  },
  {
    path: "/FreeLottery",
    component: FreeLottery,
    name: "FreeLottery",
    meta: {
      title: "抽奖"
    }
  },
  {
    path: "/interestsGive",
    component: InterestsGive,
    name: "interestsGive",
    meta: {
      title: ""
    }
  },
  {
    path: "/authorizationQuery",
    component: authorizationQuery,
    name: "authorizationQuery",
    meta: {
      title: "授权查询",
      foot: false
    }
  },
  {
    path: "/starStore",
    component: starStore,
    name: "starStore",
    meta: {
      title: "星级门店",
      foot: false
    }
  },
  //分销收入奖励
  {
    path: "/drm-incomeReward",
    component: ()=>import("../views/member/income/distribution/record.vue"),
    name: "drm-incomeReward",
    meta: { title: "分销收入奖励", foot: true }
  },
  //转换消费积分
  {
    path: "/to-integral",
    component: ()=>import("../views/love/love-integral"),
    name: "love-integral",
    meta: { title: "转换消费积分", foot: true }
  },
]
  .concat(BlockChain)
  .map(route => {
    route.path = rootPath + route.path;
    return route;
  });
// 404 页
routes.push({
  path: "*",
  component: NotFound,
  name: "notfound",
  meta: {
    title: "404",
    foot: true
  }
});

export default routes;
