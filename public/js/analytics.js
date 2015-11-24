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
     * 页面统计服务-设置当前的用户标识
     * @param uid
     * @param scope
     */
    MeAnalytics.prototype.setUid = function(uid, scope){
        if (uid) {
            this.getTracker().setCustomVariable(1, 'uid', uid, scope || VarScope.PAGE);
        }
    };

    /**
     * 页面统计服务-设置当前的作品标识
     * @param pid
     * @param scope
     */
    MeAnalytics.prototype.setPid = function(pid, scope){
        if (pid) {
            this.getTracker().setCustomVariable(2, 'pid', pid, scope || VarScope.PAGE);
        }
    };

    /**
     * 页面统计服务-设置当前的作品所有者标识
     * @param puid
     * @param scope
     */
    MeAnalytics.prototype.setPuid = function(puid, scope){
        if (puid) {
            this.getTracker().setCustomVariable(3, 'puid', puid, scope || VarScope.PAGE);
        }
    };

    /**
     * 手动触发一次页面统计
     */
    MeAnalytics.prototype.trackPageView = function(){
        this.getTracker().trackPageView();  //手动触发一次页面统计
    };

    /**
     * 手动触发一次产品统计
     * 注: data参数只在当次统计中起作用
     * @param pid 作品id
     * @param uid 用户标识
     * @param puid 作品所属用户标识
     */
    MeAnalytics.prototype.trackProduct = function(pid, uid, puid){
        var idx1ForPage = null,
            idx2ForPage = null,
            idx3ForPage = null;
        if (uid) {
            idx1ForPage = this.getTracker().getCustomVariable(1, VarScope.PAGE);
            this.setUid(uid, VarScope.PAGE);
        }
        if (pid) {
            idx2ForPage = this.getTracker().getCustomVariable(2, VarScope.PAGE);
            this.setPid(pid, VarScope.PAGE);
        }
        if (puid) {
            idx3ForPage = this.getTracker().getCustomVariable(3, VarScope.PAGE);
            this.setPuid(puid, VarScope.PAGE);
        }

        this.getTracker().trackPageView();  //手动触发一次页面统计

        //获取此前缓存的数据
        if (uid) {
            if (idx1ForPage && idx1ForPage.length > 0) {
                this.getTracker().setCustomVariable(1, idx1ForPage[0], idx1ForPage[1], VarScope.PAGE);
            } else {
                this.getTracker().deleteCustomVariable(1, VarScope.PAGE);
            }
        }
        if (pid) {
            if (idx2ForPage && idx2ForPage.length > 0) {
                this.getTracker().setCustomVariable(2, idx2ForPage[0], idx2ForPage[1], VarScope.PAGE);
            } else {
                this.getTracker().deleteCustomVariable(2, VarScope.PAGE);
            }
        }
        if (puid) {
            if (idx3ForPage && idx3ForPage.length > 0) {
                this.getTracker().setCustomVariable(3, idx3ForPage[0], idx3ForPage[1], VarScope.PAGE);
            } else {
                this.getTracker().deleteCustomVariable(3, VarScope.PAGE);
            }
        }
    };

    window.MeAnalytics = MeAnalytics;

})();
