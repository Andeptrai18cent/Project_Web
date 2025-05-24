document.addEventListener('DOMContentLoaded', () => {
  initSearchFunctionality();
});
let categoryController = null;
function initSearchFunctionality() {
  // Tìm input tìm kiếm
  const searchInput = document.querySelector('.search-input');
  const searchSuggestions = document.querySelector('.search-suggestions');

  if (!searchSuggestions && searchInput) {
    // Tạo phần tử gợi ý
    searchSuggestions = document.createElement('div');
    searchSuggestions.id = 'search-suggestions';
    searchSuggestions.className = 'search-suggestions';
    
    // Thêm vào sau ô tìm kiếm
    const searchBarWrapper = document.querySelector('.search-bar-wrapper');
    if (searchBarWrapper) {
      searchBarWrapper.appendChild(searchSuggestions);
    } else {
      searchInput.parentNode.appendChild(searchSuggestions);
    }
   // Thêm CSS cho search suggestions
  }

  // if(!searchInput || !searchSuggestions || !searchSuggestionSection) {
  //   console
  // }

  function showSearchUI() {
    document.body.classList.add('search-active');
    searchSuggestions.classList.add('active');
    if(categoryController) {
      categoryController.disableCards();
    }
    disableOtherInteractions();
  }

  function hideSearchUI() {
    document.body.classList.remove('search-active');
    searchSuggestions.classList.remove('active');

    if(categoryController) {
      categoryController.enableCards();
    }
    enableOtherInteractions();
  }

  function disableOtherInteractions() {
    // disable product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.style.pointerEvents = 'none';
      card.style.opacity = '0.5';
    });
  }

  function enableOtherInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.style.pointerEvents = 'auto';
      card.style.opacity = '1';
    });
  }

  // Nếu không tìm thấy phần tử input hoặc suggestions, thoát
  if (!searchInput || !searchSuggestions) {
    console.error("Search elements not found!");
    return;
  }
 
  console.log("Search functionality initialized.");
  
  // Hiển thị dropdown gợi ý khi focus vào ô tìm kiếm
  searchInput.addEventListener('focus', function() {
    searchSuggestions.classList.add('active');
    console.log("Search input focused");
  });
  
  // Ẩn dropdown khi click ra ngoài
  document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !searchSuggestions.contains(event.target)) {
      searchSuggestions.classList.remove('active');
    }
  });
  
  // Xử lý tìm kiếm với AJAX
  searchInput.addEventListener('input', debounce(function() {
    const query = this.value.trim();
    
    if (query.length < 2) {
      searchSuggestions.innerHTML = '';
      hideSearchUI();
      return;
    }
    
    console.log("Searching for:", query);
    showSearchUI();
    searchSuggestions.innerHTML = '<div class="suggestion-item">Đang tìm kiếm...</div>';
    fetch(`/suggest?q=${encodeURIComponent(query)}`)
      .then(response => {
        // Ghi log loại nội dung
      const contentType = response.headers.get('content-type');
      console.log("Response content type:", contentType);
      
      // Kiểm tra response trước
      return response.text().then(text => {
        console.log("Raw response:", text);
        
        // Thử parse JSON nếu có thể
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("JSON parse error:", e);
          throw new Error('Không thể parse JSON từ server');
        }
      });
    })
    .then(data => {
      console.log("Search results (parsed):", data);
      // Kiểm tra dữ liệu trước khi sử dụng
      if (data && (data.services || data.categories)) {
        updateSuggestions(data);
      } else {
        searchSuggestions.innerHTML = '<div class="suggestion-item">Không có dữ liệu hợp lệ</div>';
      }
    })
    .catch(error => {
      console.error('Error fetching suggestions:', error);
      searchSuggestions.innerHTML = '<div class="suggestion-item">Lỗi khi tìm kiếm</div>';
    });
}, 300));
  
  
  function updateSuggestions(data) {
    // Cập nhật dropdown với dữ liệu từ server
    if (!data || 
        (!data.categories || data.categories.length === 0) && 
        (!data.services || data.services.length === 0)) {
      searchSuggestions.innerHTML = '<div class="suggestion-item">Không tìm thấy kết quả</div>';
      return;
    }
    
    let html = '';

    // Hiển thị dịch vụ
    if (data.services && data.services.length > 0) {
      data.services.forEach(service => {
        html += `
          <div class="suggestion-service">
            <a href="/service/:id/${service.service_id}" class="suggestion-item">
              ${service.name}
            </a>
          </div>
        `;
      });
    }
    searchSuggestions.innerHTML = html;
    }
}