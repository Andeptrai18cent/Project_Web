const connection = require('../config/database');

class Revenue {
    constructor(payment_id, task_id, tasker_id, tasker_earning, company_revenue) {
        this.payment_id = payment_id;
        this.task_id = task_id;
        this.tasker_id = tasker_id;
        this.tasker_earning = tasker_earning;
        this.company_revenue = company_revenue;
    }

    static async createRevenue(revenueData) {
        try {
            const { data, error } = await connection
                .from('Revenue')
                .insert(revenueData)
                .select();
            if (error) throw error;
            return data[0];
        } catch (err) {
            console.error("Error creating revenue:", err);
            throw err;
        }
    }

    // THAY ĐỔI: Lấy dữ liệu trực tiếp từ bảng Revenue
    static async getAllRevenues(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        try {
            // Đếm tổng số records
            const { count, error: countError } = await connection
                .from('Revenue')
                .select('*', { count: 'exact' });
            
            if (countError) {
                console.error("Error counting revenues:", countError);
                return { revenues: [], total: 0 };
            }

            // Lấy dữ liệu revenue với join các bảng liên quan (BỎ created_at)
            const { data, error } = await connection
                .from('Revenue')
                .select(`
                    revenue_id,
                    payment_id,
                    task_id,
                    tasker_id,
                    tasker_earning,
                    company_revenue,
                    Tasks (
                        task_id,
                        description,
                        location,
                        work_start_at,
                        work_end_at,
                        Services (
                            name
                        ),
                        Users (
                            name,
                            username
                        )
                    ),
                    Taskers (
                        tasker_id,
                        hourly_rate,
                        Users (
                            name,
                            username
                        )
                    ),
                    Payment (
                        payment_id,
                        payment_date
                    )
                `)
                .range(offset, offset + limit - 1)
                .order('revenue_id', { ascending: false });

            if (error) {
                console.error("Error fetching revenues:", error);
                return { revenues: [], total: 0 };
            }

            // Format dữ liệu để khớp với view
            const formattedRevenues = data.map(revenue => {
                let workHours = 0;
                let workMinutes = 0;
                let totalMinutes = 0;
                
                if (revenue.Tasks?.work_start_at && revenue.Tasks?.work_end_at) {
                    const startTime = new Date(revenue.Tasks.work_start_at);
                    const endTime = new Date(revenue.Tasks.work_end_at);
                    const diffInMs = endTime - startTime;
                    
                    // Tính tổng số phút
                    totalMinutes = Math.round(diffInMs / (1000 * 60));
                    
                    // Chia thành giờ và phút
                    workHours = Math.floor(totalMinutes / 60);
                    workMinutes = totalMinutes % 60;
                    
                    // Để tính lương - giờ thập phân
                    const diffInHours = totalMinutes / 60;
                }

                return {
                    revenue_id: revenue.revenue_id,
                    task_id: revenue.task_id,
                    service_name: revenue.Tasks?.Services?.name || 'Unknown',
                    client_name: revenue.Tasks?.Users?.name || 'Unknown',
                    tasker_name: revenue.Taskers?.Users?.name || 'Unknown',
                    tasker_id: revenue.tasker_id,
                    location: revenue.Tasks?.location || 'Unknown',
                    work_start_at: revenue.Tasks?.work_start_at,
                    work_end_at: revenue.Tasks?.work_end_at,
                    work_hours: workHours, // Số giờ nguyên
                    work_minutes: workMinutes, // Số phút lẻ
                    total_minutes: totalMinutes, // Tổng số phút
                    work_duration_formatted: `${workHours.toString().padStart(2, '0')}:${workMinutes.toString().padStart(2, '0')}`, // Format hh:mm
                    hourly_rate: revenue.Taskers?.hourly_rate || 0,
                    tasker_earning: revenue.tasker_earning,
                    company_revenue: revenue.company_revenue,
                    total_revenue: revenue.tasker_earning + revenue.company_revenue,
                    payment_date: revenue.Payment?.payment_date
                };
            });
            
            return { revenues: formattedRevenues, total: count };
        } catch (error) {
            console.error("Exception in getAllRevenues:", error);
            return { revenues: [], total: 0 };
        }
    }

    // Lấy revenue theo tasker ID từ bảng Revenue
    static async getRevenueByTaskerId(taskerId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        try {
            const { count, error: countError } = await connection
                .from('Revenue')
                .select('*', { count: 'exact', head: true })
                .eq('tasker_id', taskerId);
            
            if (countError) {
                console.error("Error counting tasker revenues:", countError);
                return { revenues: [], total: 0 };
            }

            const { data, error } = await connection
                .from('Revenue')
                .select(`
                    revenue_id,
                    task_id,
                    tasker_id,
                    tasker_earning,
                    company_revenue,
                    Tasks!inner (
                        description,
                        location,
                        work_start_at,
                        work_end_at,
                        Services!inner (name),
                        Users!inner (name, username)
                    ),
                    Taskers!inner (
                        hourly_rate,
                        Users!inner (name, username)
                    ),
                    Payment (payment_date)
                `)
                .eq('tasker_id', taskerId)
                .range(offset, offset + limit - 1)
                .order('revenue_id', { ascending: false });

            if (error) {
                console.error("Error fetching tasker revenues:", error);
                return { revenues: [], total: 0 };
            }

            // Format data cho view
            const formattedRevenues = (data || []).map(revenue => {
                let workHours = 0;
                let totalMinutes = 0;
                
                if (revenue.Tasks?.work_start_at && revenue.Tasks?.work_end_at) {
                    const startTime = new Date(revenue.Tasks.work_start_at);
                    const endTime = new Date(revenue.Tasks.work_end_at);
                    const diffInMs = endTime - startTime;
                    
                    totalMinutes = Math.round(diffInMs / (1000 * 60));
                    workHours = totalMinutes / 60;
                }

                return {
                    revenue_id: revenue.revenue_id,
                    task_id: revenue.task_id,
                    tasker_id: revenue.tasker_id,
                    service_name: revenue.Tasks?.Services?.name || 'Unknown',
                    client_name: revenue.Tasks?.Users?.name || 'Unknown',
                    tasker_name: revenue.Taskers?.Users?.name || 'Unknown',
                    location: revenue.Tasks?.location || 'Unknown',
                    work_start_at: revenue.Tasks?.work_start_at,
                    work_end_at: revenue.Tasks?.work_end_at,
                    hours_worked: workHours,
                    hourly_rate: revenue.Taskers?.hourly_rate || 0,
                    tasker_earning: revenue.tasker_earning || 0,
                    company_revenue: revenue.company_revenue || 0,
                    total_revenue: (revenue.tasker_earning || 0) + (revenue.company_revenue || 0),
                    payment_date: revenue.Payment?.payment_date
                };
            });

            return { revenues: formattedRevenues, total: count || 0 };
        } catch (error) {
            console.error("Exception in getRevenueByTaskerId:", error);
            return { revenues: [], total: 0 };
        }
    }

    // Tính tổng doanh thu theo tasker từ bảng Revenue
    static async getTotalRevenueByTasker() {
        try {
            const { data, error } = await connection
                .from('Revenue')
                .select(`
                    tasker_id,
                    tasker_earning,
                    company_revenue,
                    Tasks!inner (
                        work_start_at,
                        work_end_at
                    ),
                    Taskers!inner (
                        Users!inner (name, username)
                    )
                `)
                .order('tasker_id');

            if (error) {
                console.error("Error fetching total revenue by tasker:", error);
                return [];
            }

            // Group by tasker và tính tổng
            const groupedData = (data || []).reduce((acc, revenue) => {
                const taskerId = revenue.tasker_id;
                if (!acc[taskerId]) {
                    acc[taskerId] = {
                        tasker_id: taskerId,
                        tasker_name: revenue.Taskers?.Users?.name || 'Unknown',
                        tasker_username: revenue.Taskers?.Users?.username || 'Unknown',
                        total_earning: 0,
                        total_company_revenue: 0,
                        total_revenue: 0,
                        total_hours: 0,
                        task_count: 0
                    };
                }
                
                acc[taskerId].total_earning += revenue.tasker_earning || 0;
                acc[taskerId].total_company_revenue += revenue.company_revenue || 0;
                acc[taskerId].total_revenue += (revenue.tasker_earning || 0) + (revenue.company_revenue || 0);
                acc[taskerId].task_count += 1;
                
                // Tính giờ làm việc
                if (revenue.Tasks?.work_start_at && revenue.Tasks?.work_end_at) {
                    const startTime = new Date(revenue.Tasks.work_start_at);
                    const endTime = new Date(revenue.Tasks.work_end_at);
                    const diffInMs = endTime - startTime;
                    const workHours = diffInMs / (1000 * 60 * 60);
                    acc[taskerId].total_hours += workHours;
                }
                
                return acc;
            }, {});

            return Object.values(groupedData);
        } catch (error) {
            console.error("Exception in getTotalRevenueByTasker:", error);
            return [];
        }
    }

    // Thêm method để lấy tổng quan doanh thu
    static async getRevenueSummary() {
        try {
            const { data, error } = await connection
                .from('Revenue')
                .select('tasker_earning, company_revenue');

            if (error) {
                console.error("Error fetching revenue summary:", error);
                return {
                    total_tasker_earnings: 0,
                    total_company_revenue: 0,
                    total_revenue: 0,
                    task_count: 0
                };
            }

            const summary = data.reduce((acc, revenue) => {
                acc.total_tasker_earnings += revenue.tasker_earning || 0;
                acc.total_company_revenue += revenue.company_revenue || 0;
                acc.task_count += 1;
                return acc;
            }, {
                total_tasker_earnings: 0,
                total_company_revenue: 0,
                total_revenue: 0,
                task_count: 0
            });

            summary.total_revenue = summary.total_tasker_earnings + summary.total_company_revenue;
            return summary;
        } catch (error) {
            console.error("Exception in getRevenueSummary:", error);
            return {
                total_tasker_earnings: 0,
                total_company_revenue: 0,
                total_revenue: 0,
                task_count: 0
            };
        }
    }
}

module.exports = Revenue;