import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Crown, Zap, AlertCircle, CheckCircle, ArrowUpRight, Sparkles, Star } from 'lucide-react';
import PlanUpgrade from './PlanUpgrade';

interface PlanInfo {
  currentPlan: 'free' | 'basic' | 'pro';
  automationsLimit: number;
  automationsUsed: number;
  automationsRemaining: number;
  aiMessagesLimit: number;
  aiMessagesUsed: number;
  aiMessagesRemaining: number;
  isPro: boolean;
  isBasic: boolean;
  subscriptionStatus?: string;
}

const PlanStatus: React.FC = () => {
  const { userProfile, getPlanInfo } = useAuth();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadPlanInfo();
  }, [userProfile]);

  const loadPlanInfo = async () => {
    try {
      setLoading(true);
      const info = await getPlanInfo();
      setPlanInfo(info);
    } catch (error) {
      console.error('Error loading plan info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPro = () => {
    setShowUpgradeModal(true);
  };


  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-purple-300/30 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-purple-300/30 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-purple-300/30 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!planInfo) {
    return null;
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'text-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30';
      case 'basic':
        return 'text-blue-400 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 border-blue-400/30';
      default:
        return 'text-purple-300 bg-gradient-to-r from-purple-400/20 to-pink-400/20 border-purple-400/30';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Crown className="w-5 h-5" />;
      case 'basic':
        return <Zap className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (percentage >= 75) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-green-500 to-emerald-500';
  };

  return (
    <>
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl border ${getPlanColor(planInfo.currentPlan)} shadow-lg`}>
              {getPlanIcon(planInfo.currentPlan)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {planInfo.currentPlan === 'free' ? 'Free Plan' : 
                 planInfo.currentPlan === 'basic' ? 'Basic Plan' : 'Pro Plan'}
                {planInfo.currentPlan === 'pro' && <Star className="w-5 h-5 text-yellow-400" />}
                {planInfo.currentPlan === 'basic' && <Star className="w-5 h-5 text-blue-400" />}
              </h3>
              <p className="text-sm text-purple-200">
                {planInfo.subscriptionStatus && `Status: ${planInfo.subscriptionStatus}`}
              </p>
            </div>
          </div>
          {planInfo.currentPlan === 'free' && (
            <button
              onClick={handleUpgradeToPro}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade Plan</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
          {planInfo.currentPlan === 'basic' && (
            <button
              onClick={handleUpgradeToPro}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Pro</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Automation Usage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Automation Usage</span>
            <span className="text-sm text-purple-200 font-medium">
              {planInfo.automationsUsed} / {planInfo.automationsLimit}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 shadow-inner">
            <div
              className={`h-3 rounded-full ${getUsageColor(getUsagePercentage(planInfo.automationsUsed, planInfo.automationsLimit))} shadow-lg transition-all duration-500`}
              style={{ width: `${getUsagePercentage(planInfo.automationsUsed, planInfo.automationsLimit)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-purple-200">
              {planInfo.automationsRemaining} automations remaining
            </span>
            {planInfo.automationsRemaining <= 2 && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs font-medium">Limit approaching</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Messages Usage (Pro plan only) */}
        {planInfo.aiMessagesLimit > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">AI Messages Usage</span>
              <span className="text-sm text-purple-200 font-medium">
                {planInfo.aiMessagesUsed} / {planInfo.aiMessagesLimit}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 shadow-inner">
              <div
                className={`h-3 rounded-full ${getUsageColor(getUsagePercentage(planInfo.aiMessagesUsed, planInfo.aiMessagesLimit))} shadow-lg transition-all duration-500`}
                style={{ width: `${getUsagePercentage(planInfo.aiMessagesUsed, planInfo.aiMessagesLimit)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-purple-200">
                {planInfo.aiMessagesRemaining} messages remaining
              </span>
              {planInfo.aiMessagesRemaining <= 100 && (
                <div className="flex items-center space-x-1 text-yellow-400">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">Limit approaching</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Plan Features */}
        <div className="border-t border-white/20 pt-6">
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Plan Features
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-purple-100">
                {planInfo.automationsLimit} automation credits
              </span>
            </div>
            {planInfo.aiMessagesLimit > 0 && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-purple-100">
                  {planInfo.aiMessagesLimit} AI message credits
                </span>
              </div>
            )}
            {planInfo.currentPlan === 'free' && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-purple-100">
                  Monthly reset
                </span>
              </div>
            )}
            {planInfo.currentPlan !== 'free' && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-purple-100">
                  Unlimited automation history
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
    {/* Plan Upgrade Modal */}
    {showUpgradeModal && (
      <PlanUpgrade 
        onClose={() => {
          setShowUpgradeModal(false);
          // Reload plan info after upgrade
          loadPlanInfo();
        }} 
      />
    )}
    </>
  );
};

export default PlanStatus;
