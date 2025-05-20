async function loadTaskers(sortType) {
      try {
        const response = await fetch(`/api/taskers?sort=${sortType}`);
        const data = await response.json();

        const list = document.getElementById('tasker-list');
        list.innerHTML = ''; // Xóa danh sách cũ

        data.forEach(tasker => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${tasker.user_id}</strong> - 
                          Rate: ${tasker.hourly_rate} - 
                          Tasks Done: ${tasker.task_count || 'N/A'} - 
                          Rating: ${tasker.average_rating || 'N/A'}`;
          list.appendChild(li);
        });
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
      }
    }

    // Gọi mặc định khi trang load
window.onload = () => loadTaskers('default');

document.querySelectorAll('.task-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.task-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});
