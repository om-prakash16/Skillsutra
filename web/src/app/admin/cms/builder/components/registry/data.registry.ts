import { 
  LayoutGrid, Columns, Star, BarChart, PieChart, Database, TableProperties, Network, LineChart as LineChartIcon
} from "lucide-react";
import { ComponentDefinition } from "./types";

export const DataRegistry: ComponentDefinition[] = [
  // --- Data Display ---
  { id: 'data_table', type: 'data_table', displayName: 'Data Table', label: 'Data Table', category: 'Data Display', icon: LayoutGrid, defaultProps: { columns: ['Name', 'Role'], data: [{Name: 'John', Role: 'Admin'}] } },
  { id: 'advanced_table', type: 'advanced_table', displayName: 'Advanced Table', label: 'Advanced Table', category: 'Advanced Data', icon: TableProperties, defaultProps: {} },
  { id: 'kanban', type: 'kanban', displayName: 'Kanban Board', label: 'Kanban Board', category: 'Data Display', icon: Columns, defaultProps: { columns: ['To Do', 'In Progress', 'Done'] } },
  { id: 'pivot_table', type: 'pivot_table', displayName: 'Pivot Table', label: 'Pivot Table', category: 'Advanced Data', icon: LayoutGrid, defaultProps: {} },
  { id: 'tree_grid', type: 'tree_grid', displayName: 'Tree Grid', label: 'Tree Grid', category: 'Advanced Data', icon: Network, defaultProps: {} },
  { id: 'kpi_card', type: 'kpi_card', displayName: 'KPI Card', label: 'KPI Card', category: 'Data Display', icon: Star, defaultProps: { title: 'Total Sales', value: '$24,000', trend: '+12%' } },

  // --- Charts ---
  { id: 'chart_line', type: 'chart_line', displayName: 'Line Chart', label: 'Line Chart', category: 'Charts', icon: BarChart, defaultProps: { title: 'Revenue' } },
  { id: 'chart_bar', type: 'chart_bar', displayName: 'Bar Chart', label: 'Bar Chart', category: 'Charts', icon: BarChart, defaultProps: { title: 'Traffic' } },
  { id: 'chart_pie', type: 'chart_pie', displayName: 'Pie Chart', label: 'Pie Chart', category: 'Charts', icon: PieChart, defaultProps: { title: 'Market Share' } },
  { id: 'chart_waterfall', type: 'chart_waterfall', displayName: 'Waterfall Chart', label: 'Waterfall Chart', category: 'Advanced Charts', icon: BarChart, defaultProps: {} },
  { id: 'chart_candlestick', type: 'chart_candlestick', displayName: 'Candlestick Chart', label: 'Candlestick Chart', category: 'Advanced Charts', icon: LineChartIcon, defaultProps: {} },

  // --- CMS ---
  { id: 'collection_list', type: 'collection_list', displayName: 'Collection List', label: 'Collection List', category: 'CMS', icon: Database, supportsChildren: true, defaultProps: { collection: 'posts', limit: 5 } },
  { id: 'dynamic_grid', type: 'dynamic_grid', displayName: 'Dynamic Grid', label: 'Dynamic Grid', category: 'CMS', icon: LayoutGrid, supportsChildren: true, defaultProps: { collection: 'products' } },
];
