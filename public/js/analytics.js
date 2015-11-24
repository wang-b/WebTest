/*!
 * 统计功能相关接口API，基于Piwik。
 * @see http://developer.piwik.org/api-reference/tracking-javascript
 * @author wangb
 * @date 2015-11-23 13:54:36
 * @version 0.1
 */
;(function(){
    /**
     * 自定义参数域
     * @type {{PAGE: string, VISIT: string}}
     */
    var VarScope = {
        PAGE: 'page',
        VISIT: 'visit',
        EVENT: 'event'
    };

    /**
     * 说明: 所有API基于window.PiwikTracker对象，该对象是加载Piwik功能时自动构建。
     * @constructor
     */
    function MeAnalytics(){}

    /**
     * 返回统计跟踪器
     * @returns {*}
     */
    MeAnalytics.prototype.getTracker = function(){
        return window.PiwikTracker || window.piwikTracker;
    };

    /**
     * 设置常规统计属性
     * @param uid 用户id
     * @param pid 作品id
     * @param puid 作品所属用户（作者）
     * @param scope 参数域，默认‘visit’
     */
    MeAnalytics.prototype.setCommonData = function() {
        var args = arguments || [];
        var uid  = args.length > 0 ? args[0] : null;
        var pid  = args.length > 1 ? args[1] : null;
        var puid  = args.length > 2 ? args[2] : null;
        var scope  = args.length > 3 ? (args[3] || VarScope.VISIT) : VarScope.VISIT;
        if (uid) {
            this.getTracker().setCustomVariable(1, 'uid', uid, scope);
        }
        if (pid) {
            this.getTracker().setCustomVariable(2, 'pid', pid, scope);
        }
        if (puid) {
            this.getTracker().setCustomVariable(3, 'puid', puid, scope);
        }
    };

    /**
     * 设置目标统计相关参数
     * @param act 目标名称
     * @param type 目标类型
     * @param scope 参数域，默认‘visit’
     */
    MeAnalytics.prototype.setGoalData = function(){
        var args = arguments || [];
        var act = args.length > 0 ? args[0] : null;
        var type = args.length > 1 ? args[1] : null;
        var scope = args.length > 2 ? (args[2] || VarScope.VISIT) : VarScope.VISIT;
        if (act) {
            this.getTracker().setCustomVariable(4, 'act', act, scope);
        }
        if (type) {
            this.getTracker().setCustomVariable(5, 'type', type, scope);
        }
    };

    /**
     * 手动触发一次产品统计
     * @param uid 用户标识
     * @param pid 作品id
     * @param puid 作品所属用户标识
     */
    MeAnalytics.prototype.trackPageView = function(){
        var args = arguments || [];
        var uid  = args.length > 0 ? args[0] : null;
        var pid  = args.length > 1 ? args[1] : null;
        var puid  = args.length > 2 ? args[2] : null;
        this.setCommonData(uid, pid, puid, VarScope.PAGE);
        this.getTracker().trackPageView();  //手动触发一次页面统计
    };

    /**
     * 手动触发一次
     * @param idGoal 目标id, 必需
     * @param act 目标行为
     * @param type 目标行为类型
     * @param uid 用户id
     * @param pid 作品id
     * @param puid 作品所属作者id
     */
    MeAnalytics.prototype.trackGoal = function(){
        var args = arguments || [];
        if (args.length < 1) {
            return;
        }
        var idGoal = args[0];
        var act = args.length > 1 ? args[1] : null;
        var type = args.length > 2 ? args[2] : null;
        var uid = args.length > 3 ? args[3] : null;
        var pid = args.length > 4 ? args[4] : null;
        var puid = args.length > 5 ? args[5] : null;
        this.setCommonData(uid, pid, puid, VarScope.VISIT);
        this.setGoalData(act, type, VarScope.VISIT);
        this.getTracker().trackGoal(idGoal);
    };

    window.MeAnalytics = MeAnalytics;

})();
