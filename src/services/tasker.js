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

const create_New_Tasker = async(req, res) => {
  const {user_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET)
  const {data} = await connection.from("ServiceGroup").select().eq('group_id', req.body.service_group_id)
  if (data)
  {
      var existedTasker = await connection.from("Taskers").select("user_id").eq("user_id", user_id)
      if (existedTasker.data.length)
          return res.status(402).send("Tài khoản đã đăng ký trở thành Tasker, vui lòng dùng tài khoản khác")
      const {error} = await connection.from("Taskers").insert({user_id: user_id, bio: "New tasker", hourly_rate: data[0].hourly_wage, actual_income: 0, service_group_id: req.body.service_group_id})
      if (error)
      {
          console.log(error)
          return res.status(401).send("Không tạo được tasker mới")
      }
      res.send("Tạo tasker mới thành công")
  }
  else             
      return res.status(404).send("Nhóm dịch vụ không tồn tại")
}

const get_Tasker_By_Tasker_ID = async (req, res) => {
  try {
    // Verify token
    const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET)

    if (!tasker_id) {
      return res.status(400).json({ message: 'Token không hợp lệ: tasker_id không tìm thấy' });
    }

    // Fetch tasker details
    const { data: tasker, error } = await connection
      .from('Taskers')
      .select('*')
      .eq('tasker_id', tasker_id)
      .single();

    if (error || !tasker) {
      return res.status(404).json({ message: 'Không tìm được Tasker', error });
    }

    return res.status(200).json(tasker);
  } catch (err) {
    return res.status(403).json({ message: 'Token lỗi hoặc hết hạn', error: err.message });
  }
};

const update_Tasker_Info = async (req, res) => {
  const {tasker_id} = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET)
  const { bio, hourly_rate, service_group_id } = req.body;

  try {
    // Validate tasker existence
    const { data: existingTasker, error: findError } = await connection
      .from('Taskers')
      .select('*')
      .eq('tasker_id', tasker_id)
      .single();

    if (findError || !existingTasker) {
      return res.status(404).json({ message: 'Tasker not found', error: findError });
    }

    // Prepare update payload
    const updateData = {
      ...(bio !== undefined && { bio }),
      ...(hourly_rate !== undefined && { hourly_rate }),
      ...(service_group_id !== undefined && { service_group_id }),
    };

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const { error: updateError } = await connection
      .from('Taskers')
      .update(updateData)
      .eq('tasker_id', tasker_id);

    if (updateError) {
      return res.status(500).json({ message: 'Failed to update Tasker', error: updateError });
    }

    return res.status(200).json({
      message: 'Tasker updated successfully',
      tasker_id,
      updated_fields: updateData,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
module.exports = {
    get_Tasker_by_Service_group_id,
    get_Taskers_By_TaskCount,
    get_Taskers_With_Ratings,
    create_New_Tasker,
    get_Tasker_By_Tasker_ID,
    update_Tasker_Info
}