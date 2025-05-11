const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const searchBar = document.getElementById("search-bar");

/*this function is used to handle the search input and display suggestions */
  async function fetchSuggestions() {
    const input = document.getElementById('searchInput');
    const list = document.getElementById('suggestionsList');
    const query = input.value.trim();

    if (!query) {
      list.classList.add('hidden');
      return;
    }

    const res = await fetch(`/services/:id?q=${encodeURIComponent(query)}`);
    const { services } = await res.json();

    list.innerHTML = '';
    if (services.length === 0) {
      list.classList.add('hidden');
      return;
    }

    services.forEach(service => {
      const li = document.createElement('li');
      li.className = 'px-4 py-2 hover:bg-blue-100 cursor-pointer';
      li.textContent = service.name;
      li.onclick = () => {
        input.value = service.name;
        list.classList.add('hidden');
        // Bạn có thể gọi searchService() ở đây nếu cần
      };
      list.appendChild(li);
    });

    list.classList.remove('hidden');
  }

  function hideSuggestionsDelayed() {
    setTimeout(() => {
      document.getElementById('suggestionsList').classList.add('hidden');
    }, 150); // để tránh mất dropdown khi click
  }
/*this function is used to handle the search input and display suggestions */


menuBtn.addEventListener('click', (e) => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    menuBtnIcon.setAttribute(
      "class",
      isOpen ? "ri-close-line" : "ri-menu-3-line"
    );
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".header form", {
  ...scrollRevealOption,
    delay: 500,
});