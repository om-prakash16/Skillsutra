import { 
  Activity, ArrowUpRight, BarChart3, CreditCard, DollarSign, 
  Users, HardDrive, Cpu, Network
} from "lucide-react";
import { ComponentDefinition } from "./types";

export const DashboardRegistry: ComponentDefinition[] = [
  { id: 'dashboard_stats', type: 'dashboard_stats', displayName: 'Statistics Cards', label: 'Statistics Cards', category: 'Dashboard', icon: Activity, defaultProps: {} },
  { id: 'dashboard_revenue', type: 'dashboard_revenue', displayName: 'Revenue Card', label: 'Revenue Card', category: 'Dashboard', icon: DollarSign, defaultProps: {} },
  { id: 'dashboard_users', type: 'dashboard_users', displayName: 'Users Card', label: 'Users Card', category: 'Dashboard', icon: Users, defaultProps: {} },
  { id: 'dashboard_activity', type: 'dashboard_activity', displayName: 'Activity Timeline', label: 'Activity Timeline', category: 'Dashboard', icon: BarChart3, defaultProps: {} },
  { id: 'dashboard_storage', type: 'dashboard_storage', displayName: 'Storage Widget', label: 'Storage Widget', category: 'Dashboard', icon: HardDrive, defaultProps: {} },
  { id: 'dashboard_cpu', type: 'dashboard_cpu', displayName: 'CPU Widget', label: 'CPU Widget', category: 'Dashboard', icon: Cpu, defaultProps: {} },
  { id: 'dashboard_network', type: 'dashboard_network', displayName: 'Network Widget', label: 'Network Widget', category: 'Dashboard', icon: Network, defaultProps: {} },
];
