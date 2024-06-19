document.addEventListener('DOMContentLoaded', () => {
    const newsLinks = document.querySelectorAll('.news-link');
    newsLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        const source = this.getAttribute('data-source');
        sessionStorage.setItem('newsSource', source);
        updateHeader(source);
      });
    });
  
    const newsSource = sessionStorage.getItem('newsSource');
    updateHeader(newsSource);

    function toggleMenu() {
      var nav = document.querySelector('nav');
      nav.classList.toggle('active');
  }
  
  // Adding event listener to the menu icon
  document.getElementById('menuIcon').addEventListener('click', toggleMenu);
  });
  
  function updateHeader(source) {
    const headerContainer = document.getElementById('header-container');
    headerContainer.className = '';
  
    if (source === 'user') {
      headerContainer.classList.add('user-header');
      headerContainer.innerHTML = `
        <div class="header">
        <div class="container">
            <div class="navbar">
                <div class="logo">
                    <img src="/images/Logo.png" alt="Treevista" width="300px">
                </div>
                <nav>
                    <ul id="MenuItems">
                        <li><a href="/index.html">Home</a></li>
                        <li><a href="/products.html">Browse Trees</a></li>
                        <li><a href="/about.html">About</a></li>
                        <li><a href="/contact.html">Contact</a></li>
                        <li><a href="/users/user-profile.html">Account</a></li>
                        <li><a href="/news/news.html" class="news-link" data-source="user"> News</a></li>
                        <li><a id="auth-link"></a></li>
                    </ul>
                </nav>
                <a href="cart.html" class="cart">
                    <img src="/images/cart.png" alt="Shopping cart icon">
                </a>
                <img src="/images/menu.png" alt="" id="menuIcon" class="menu-icon" onclick="menutoggle()">
            </div>`;
    } else if (source === 'vendor') {
      headerContainer.classList.add('vendor-header');
      headerContainer.innerHTML = `
      <div class="container">
          <div class="dashboard-header">
              <h1>Vendor Dashboard</h1>
          </div>

          <!-- Navigation Bar -->
            <nav id="vendor-nav">
              <ul>
                  <li><a href="overview.html">Dashboard</a></li>
                  <li><a href="orders.html">Orders</a></li>
                  <li><a href="sales.html">Sales</a></li>
                  <li><a href="catalog.html">Catalog</a></li>
                  <li><a href="inventory.html">Inventory</a></li>
                  <li><a href="vendor-profile.html">Account</a></li>
                  <li><a href="/news/news.html" class="news-link" data-source="vendor">News</a></li>
                  <li><a href="notifications.html">Notifications</a></li>
              </ul>
          </nav>`;
    } else {
      headerContainer.innerHTML = '<p>Error: No source found for the header</p>';
    }
  }
  