import React, { useState } from 'react';
import { Icons } from '../components/Icons';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const menuItems = [
      { id: 'general', label: 'General' },
      { id: 'satisfaction', label: 'Satisfaction Survey' },
      { id: 'domain', label: 'Custom Domain' },
      { id: 'security', label: 'Security' },
      { id: 'delete', label: 'Delete' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
             
             {/* Sidebar */}
             <div className="w-full md:w-64 flex-shrink-0">
                 <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <Icons.Settings className="text-white w-5 h-5" />
                     </div>
                     <span className="font-bold text-gray-900">My Project</span>
                     <Icons.ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                 </div>
                 
                 <h2 className="text-xl font-bold text-gray-900 mb-6">Chatbot Settings</h2>
                 
                 <div className="space-y-1">
                     {menuItems.map((item) => (
                         <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === item.id 
                                ? 'bg-gray-100 text-gray-900 font-semibold' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                         >
                            {item.label}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Content */}
             <div className="flex-1">
                 {activeTab === 'satisfaction' && (
                     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 animate-in fade-in duration-300">
                         <div className="flex flex-col lg:flex-row gap-12">
                             
                             {/* Config Area */}
                             <div className="flex-1">
                                 <h3 className="text-lg font-bold text-gray-900 mb-2">Satisfaction Survey</h3>
                                 <p className="text-gray-500 text-sm mb-6">
                                     Display a survey at the end of each chat to gather user feedback on their experience with the chatbot.
                                 </p>

                                 <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-6">
                                     <p className="text-orange-800 text-sm mb-3">
                                         This feature is not available on your current plan. You must upgrade to enable it.
                                     </p>
                                     <button className="px-4 py-2 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
                                         Upgrade
                                     </button>
                                 </div>
                             </div>

                             {/* Preview Area */}
                             <div className="w-full lg:w-[400px] border border-gray-200 rounded-lg p-6 bg-white">
                                 <h4 className="text-sm font-bold text-gray-900 mb-4">Preview</h4>
                                 
                                 <div className="space-y-6">
                                     <div className="text-center">
                                         <p className="text-sm text-gray-900 mb-3">How would you rate your chat experience?</p>
                                         <div className="flex justify-center gap-2 mb-1">
                                             {[1, 2, 3, 4, 5].map((rating) => (
                                                 <button key={rating} className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium">
                                                     {rating}
                                                 </button>
                                             ))}
                                         </div>
                                         <div className="flex justify-between px-2 text-[10px] text-gray-400">
                                             <span>Terrible</span>
                                             <span>Excellent</span>
                                         </div>
                                     </div>

                                     <div className="border-t border-gray-100 pt-6">
                                          <p className="text-sm text-gray-900 mb-3 text-center">What went wrong? <span className="text-red-500">*</span></p>
                                          <div className="flex flex-wrap gap-2 justify-center">
                                              {['Bot didn\'t understand', 'Issue not resolved', 'Unhelpful or unsatisfactory response', 'Long response time', 'Technical issues', 'Other'].map((reason) => (
                                                  <span key={reason} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                                      {reason}
                                                  </span>
                                              ))}
                                          </div>
                                     </div>

                                     <div className="border-t border-gray-100 pt-6 text-center">
                                          <p className="text-sm text-gray-900 mb-3">Were your queries fully answered? <span className="text-red-500">*</span></p>
                                          <div className="flex justify-center gap-2">
                                              {['Yes', 'No', 'Somewhat'].map((opt) => (
                                                  <button key={opt} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">
                                                      {opt}
                                                  </button>
                                              ))}
                                          </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}

                 {activeTab !== 'satisfaction' && (
                     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex items-center justify-center">
                         <p className="text-gray-400">Settings panel for {activeTab}...</p>
                     </div>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;