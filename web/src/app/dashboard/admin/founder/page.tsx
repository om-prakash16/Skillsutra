"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer 
} from "recharts"
import { 
    TrendingUp, 
    Users, 
    Building, 
    DollarSign, 
    Activity, 
    PieChart,
    AlertCircle
} from "lucide-react"

// Mock Data for the Board Reporting Graphs
const revenueData = [
    { name: 'Jan', mrr: 12000, churn: 400 },
    { name: 'Feb', mrr: 19000, churn: 300 },
    { name: 'Mar', mrr: 28000, churn: 800 },
    { name: 'Apr', mrr: 39000, churn: 200 },
    { name: 'May', mrr: 51000, churn: 150 },
    { name: 'Jun', mrr: 68000, churn: 400 },
]

export default function FounderCommandCenter() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Executive Command Center
                    </h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" /> Live Board Reporting metrics
                    </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center gap-2">
                    <PieChart className="w-4 h-4" /> Generate Board Report
                </button>
            </div>

            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Monthly Recurring Revenue", value: "$68,000", change: "+33%", icon: DollarSign, color: "text-green-500" },
                    { label: "Active Users (MAU)", value: "142,500", change: "+12%", icon: Users, color: "text-blue-500" },
                    { label: "Enterprise Contracts", value: "84", change: "+5", icon: Building, color: "text-indigo-500" },
                    { label: "Net Revenue Retention", value: "118%", change: "+2%", icon: TrendingUp, color: "text-purple-500" },
                ].map((kpi, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-white/50 backdrop-blur-xl border border-gray-100 p-6 rounded-2xl shadow-sm"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">{kpi.label}</p>
                                <h3 className="text-3xl font-bold text-gray-900">{kpi.value}</h3>
                            </div>
                            <div className={`p-3 bg-gray-50 rounded-lg ${kpi.color}`}>
                                <kpi.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {kpi.change} vs last month
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Graphs Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Growth Graph */}
                <div className="lg:col-span-2 bg-white/50 backdrop-blur-xl border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Revenue Trajectory (MRR)</h2>
                        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none">
                            <option>Year to Date</option>
                            <option>Last 12 Months</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} tickFormatter={(value) => `$${value/1000}k`} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`$${value}`, 'MRR']}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="mrr" 
                                    stroke="#4f46e5" 
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Platform Health Alerts */}
                <div className="bg-white/50 backdrop-blur-xl border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Customer Success Risk</h2>
                    <div className="space-y-4">
                        {[
                            { company: "Acme Corp", risk: "Critical", reason: "ATS Usage dropped 80%" },
                            { company: "Globex Inc", risk: "High", reason: "Renewal in 14 days" },
                            { company: "Initech", risk: "Medium", reason: "Zero logins in 7 days" },
                            { company: "Stark Ind.", risk: "Low", reason: "Feature Request Pending" },
                        ].map((alert, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100 cursor-pointer">
                                <div className={`p-2 rounded-lg h-fit ${alert.risk === 'Critical' ? 'bg-red-100 text-red-600' : alert.risk === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{alert.company}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">{alert.reason}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                        View Full CRM Pipeline
                    </button>
                </div>
            </div>
        </div>
    )
}
