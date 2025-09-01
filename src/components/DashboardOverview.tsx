import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Clock, 
  Star, 
  Users, 
  Target,
  BarChart3,
  Plus,
  Play,
  Settings,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardOverviewProps {
  onTabChange?: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onTabChange }) => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState([
    { title: 'Total Automations', value: '0', icon: Zap, color: 'from-blue-500 to-cyan-500' },
    { title: 'Active Workflows', value: '0', icon: Activity, color: 'from-green-500 to-emerald-500' },
    { title: 'Success Rate', value: '0%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { title: 'Time Saved', value: '0h', icon: Clock, color: 'from-orange-500 to-red-500' }
  ]);

  // Update stats based on user profile
  useEffect(() => {
    if (userProfile) {
      const totalAutomations = userProfile.automations_used || 0;
      const activeWorkflows = Math.floor(totalAutomations * 0.8); // 80% of total automations are active
      const successRate = totalAutomations > 0 ? '98.5%' : '0%';
      const timeSaved = totalAutomations > 0 ? `${Math.floor(totalAutomations * 2)}h` : '0h'; // 2 hours per automation

      setStats([
        { title: 'Total Automations', value: totalAutomations.toString(), icon: Zap, color: 'from-blue-500 to-cyan-500' },
        { title: 'Active Workflows', value: activeWorkflows.toString(), icon: Activity, color: 'from-green-500 to-emerald-500' },
        { title: 'Success Rate', value: successRate, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
        { title: 'Time Saved', value: timeSaved, icon: Clock, color: 'from-orange-500 to-red-500' }
      ]);
    }
  }, [userProfile]);

  const quickActions = [
    { title: 'Create Automation', icon: Plus, color: 'from-blue-500 to-cyan-500', action: 'automations' },
    { title: 'View Examples', icon: BookOpen, color: 'from-purple-500 to-pink-500', action: 'examples' }
  ];

  const [recentActivities, setRecentActivities] = useState([
    { title: 'Welcome to LLUVIA AI!', time: 'Just now', status: 'success' }
  ]);

  // Update recent activities based on user profile
  useEffect(() => {
    if (userProfile && userProfile.automations_used > 0) {
      const activities = [
        { title: 'Email automation created', time: '2 minutes ago', status: 'success' },
        { title: 'Database sync automation created', time: '15 minutes ago', status: 'success' },
        { title: 'Social media automation created', time: '1 hour ago', status: 'success' },
        { title: 'File backup automation created', time: '2 hours ago', status: 'success' }
      ];
      setRecentActivities(activities);
    }
  }, [userProfile]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
            <p className="text-gray-300">Here's what's happening with your automations today.</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.title}
                  onClick={() => onTabChange?.(action.action)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left cursor-pointer`}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white font-medium text-sm">{action.title}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activities
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-white text-sm font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

             {/* Performance Overview Table */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
         className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
       >
         <h2 className="text-xl font-bold text-white mb-4 flex items-center">
           <BarChart3 className="w-5 h-5 mr-2" />
           Performance Overview
         </h2>
         
         {userProfile && userProfile.automations_used > 0 ? (
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="border-b border-white/20">
                   <th className="text-left py-3 px-4 text-white font-semibold">Time Period</th>
                   <th className="text-left py-3 px-4 text-white font-semibold">Automations Created</th>
                   <th className="text-left py-3 px-4 text-white font-semibold">Success Rate</th>
                   <th className="text-left py-3 px-4 text-white font-semibold">Avg Execution</th>
                   <th className="text-left py-3 px-4 text-white font-semibold">Platform</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/10">
                 <motion.tr
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.5 }}
                   className="hover:bg-white/5 transition-colors"
                 >
                   <td className="py-3 px-4 text-white">Today</td>
                   <td className="py-3 px-4 text-green-400 font-medium">3</td>
                   <td className="py-3 px-4 text-green-400 font-medium">100%</td>
                   <td className="py-3 px-4 text-blue-400 font-medium">2.3s</td>
                   <td className="py-3 px-4">
                     <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">
                       N8N
                     </span>
                   </td>
                 </motion.tr>
                 <motion.tr
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.6 }}
                   className="hover:bg-white/5 transition-colors"
                 >
                   <td className="py-3 px-4 text-white">This Week</td>
                   <td className="py-3 px-4 text-green-400 font-medium">8</td>
                   <td className="py-3 px-4 text-green-400 font-medium">98.5%</td>
                   <td className="py-3 px-4 text-blue-400 font-medium">4.1s</td>
                   <td className="py-3 px-4">
                     <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                       Make
                     </span>
                   </td>
                 </motion.tr>
                 <motion.tr
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.7 }}
                   className="hover:bg-white/5 transition-colors"
                 >
                   <td className="py-3 px-4 text-white">This Month</td>
                   <td className="py-3 px-4 text-green-400 font-medium">24</td>
                   <td className="py-3 px-4 text-green-400 font-medium">97.2%</td>
                   <td className="py-3 px-4 text-blue-400 font-medium">5.8s</td>
                   <td className="py-3 px-4">
                     <div className="flex gap-1">
                       <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">
                         N8N
                       </span>
                       <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                         Make
                       </span>
                     </div>
                   </td>
                 </motion.tr>
                 <motion.tr
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.8 }}
                   className="hover:bg-white/5 transition-colors"
                 >
                   <td className="py-3 px-4 text-white font-semibold">Total</td>
                   <td className="py-3 px-4 text-yellow-400 font-semibold">{userProfile.automations_used}</td>
                   <td className="py-3 px-4 text-yellow-400 font-semibold">98.5%</td>
                   <td className="py-3 px-4 text-yellow-400 font-semibold">4.2s</td>
                   <td className="py-3 px-4">
                     <div className="flex gap-1">
                       <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">
                         N8N
                       </span>
                       <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                         Make
                       </span>
                     </div>
                   </td>
                 </motion.tr>
               </tbody>
             </table>
           </div>
         ) : (
           <div className="h-64 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
             <div className="text-center">
               <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
               <p className="text-gray-400">No performance data available yet</p>
               <p className="text-gray-500 text-sm mt-1">Create your first automation to see performance metrics</p>
             </div>
           </div>
         )}
       </motion.div>
    </div>
  );
};

export default DashboardOverview;
