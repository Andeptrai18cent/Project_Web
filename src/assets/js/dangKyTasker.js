const service_selector = document.querySelector("#service")
const wage_slider = document.querySelector("#wage")
const service_groups = new Map()
const output = document.querySelector("output")
const min_wage_tag = document.querySelector("#min_wage")
const max_wage_tag = document.querySelector("#max_wage")

window.onload = async function() {
  const response = await fetch("http://localhost:8080/get_all_service_group", {
        method: "GET",
  });
  const result = await response.json()
  var first_group_id = null
  for (group of result)
  {
    service_groups.set(group.group_id, group)
    if (!first_group_id)
      first_group_id = group.group_id
  }
  const first_group = service_groups.get(first_group_id) 
  wage_slider.min = first_group.min_hourly_wage
  wage_slider.max = first_group.max_hourly_wage
  min_wage_tag.innerHTML = first_group.min_hourly_wage
  max_wage_tag.innerHTML = first_group.max_hourly_wage
  output.innerHTML = wage_slider.value + ' đồng'
  //OK
  const form = document.querySelector('form');
  form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Ngăn reload trang

        // Lấy dữ liệu từ form
        const location = document.getElementById('location').value;
        const service_group_id = document.getElementById('service').value;
        const wage = document.getElementById('wage').value;

        const data = {
            location,
            service_group_id,
            wage
        };

        try {
            const response = await fetch('http://localhost:8080/addNewTasker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.status = 200) {
                alert('Đăng ký trở thành Tasker thành công!');
                window.location.href = "http://localhost:8080/";
            } else {
                alert('Có lỗi xảy ra khi gửi đăng ký!');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Không thể kết nối đến máy chủ.');
        }
    });
};

wage_slider.addEventListener("input", () => {
    output.innerHTML = wage_slider.value + ' đồng'
})

service_selector.addEventListener('change', (e) => {
    const group = service_groups.get(Number(e.target.value)) 
    wage_slider.min = group.min_hourly_wage
    wage_slider.max = group.max_hourly_wage
    console.log(group.max_hourly_wage + " " + group.min_hourly_wage)
    min_wage_tag.innerHTML = group.min_hourly_wage
    max_wage_tag.innerHTML = group.max_hourly_wage
    output.innerHTML = wage_slider.value + ' đồng'
})  