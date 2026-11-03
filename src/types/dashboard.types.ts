export interface DashboardWelcomeStats {
  activeResidences: number;
  newLeads: number;
  operationalCities: number;
  activeTeam: number;
}

export interface DashboardKpiItem {
  value: number;
  total?: number;
  subtitle?: string;
  sparkline: string;
}

export interface DashboardKpis {
  activeResidences: {
    active: number;
    total: number;
    sparkline: string;
  };
  newLeads: {
    count: number;
    totalLeads: number;
    sparkline: string;
  };
  upcomingVisits: {
    upcoming: number;
    total: number;
    sparkline: string;
  };
  resolutionRate: {
    rate: number;
    resolved: number;
    total: number;
    sparkline: string;
  };
}

export interface MonthlyTrendItem {
  month: string;
  key: string;
  enquiries: number;
  bookedVisits: number;
  total: number;
}

export interface TenantTypeDistributionItem {
  label: string;
  tenantType: "boys" | "girls" | "co-ed" | "inactive";
  count: number;
  total: number;
  percentage: number;
  tone: string;
}

export interface RecentCustomerActivityItem {
  id: string;
  customerName: string;
  contactNumber: string;
  activityType: "Visit Request" | "Enquiry";
  location: string;
  status: "new" | "read" | "complete";
  createdAt: string;
}

export interface DashboardData {
  welcome: DashboardWelcomeStats;
  kpis: DashboardKpis;
  monthlyTrend: MonthlyTrendItem[];
  tenantDistribution: TenantTypeDistributionItem[];
  recentActivity: RecentCustomerActivityItem[];
}

