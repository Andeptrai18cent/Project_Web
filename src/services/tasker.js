const connection = require('../config/database')
const jwt = require('jsonwebtoken');
const Tasker = require('../models/tasker');

const get_Tasker_by_Service_group_id = async (service_group_id) => {
    const {data, error} = await connection.from("Taskers").select().eq("service_group_id", service_group_id)
    if (error)
        return error
    return data[0]
}

const get_Taskers_By_TaskCount = async (limit = 10, page = 0) => {
    try {
      // Calculate offset for pagination
      const offset = page * limit;
      
      // Using Supabase PostgreSQL functions to get taskers with task counts
      const { data, error } = await connection
        .from('Taskers')
        .select(`
          tasker_id,
          user_id,
          bio,
          hourly_rate,
          actual_income,
          service_group_id,
          Tasks(count)
        `)
        .order('count', { ascending: false, referencedTable: 'Tasks' })
        .limit(limit)
        .range(offset, offset + limit - 1);
  
      if (error) {
        return {message: 'Error fetching taskers by task count:', error}
      }
  
      return data;
    } catch (error) {
        return {message: 'Error in getTaskersByTaskCount:', error}
    }
}

const get_Taskers_With_Ratings = async (
  limit = 10, 
  page = 0, 
  sortBy = 'average_rating', 
  ascending = false
) => {
  // Get taskers with nested tasks and reviews
  const offset = page * limit;

  const { data, error } = await connection
    .from('Taskers')
    .select(`
      tasker_id,
      user_id,
      bio,
      hourly_rate,
      actual_income,
      service_group_id,
      Tasks!inner (
        task_id,
        Review!inner (
          rating
        )
      )
    `)
    .limit(limit)
    .range(offset, offset + limit - 1);
  //return JSON.stringify(data)
  // Calculate average rating for each tasker
  const taskersWithRatings = data.map(tasker => {
    const ratings = tasker.Tasks.flatMap(task => 
      task.Review ? [task.Review[0].rating] : []
    );

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
    return {
      // tasker properties...
      tasker_id: tasker.tasker_id,
      user_id: tasker.user_id,
      bio: tasker.bio,
      hourly_rate: tasker.hourly_rate,
      actual_income: tasker.actual_income,
      service_group_id: tasker.service_group_id,
      average_rating: Number(averageRating.toFixed(1)),
    };
  });
  console.log(taskersWithRatings)
  // Sort the results
  taskersWithRatings.sort((a, b) => {
    return ascending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
  });

  return taskersWithRatings;
};
module.exports = {
    get_Tasker_by_Service_group_id,
    get_Taskers_By_TaskCount,
    get_Taskers_With_Ratings
}