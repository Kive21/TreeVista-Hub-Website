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
                <img src="images/Logo.png" alt="Treevista" width="300px">
              </div>
              <nav>
                <ul id="MenuItems">
                  <li><a href="index.html">Home</a></li>
                  <li><a href="/products.html">Browse Trees</a></li>
                  <li><a href="/about.html">About</a></li>
                  <li><a href="/contact.html">Contact</a></li>
                  <li><a href="/account.html">Account</a></li>
                  <li><a href="/news.html">News</a></li>
                  <li><a id="auth-link"></a></li>
                </ul>
              </nav>
              <a href="cart.html" class="cart">
                <img src="images/cart.png" alt="Shopping cart icon">
              </a>
              <img src="images/menu.png" alt="" id="menuIcon" class="menu-icon" onclick="menutoggle()">
            </div>
          </div>
        </div>`;
    } else if (source === 'vendor') {
      headerContainer.classList.add('vendor-header');
      headerContainer.innerHTML = `
      <header>
          <div class="vendor-logo">
            <img src="images/logoo2.png" alt="Tree Sapling E-commerce Logo">
          </div>
          <h1>Vendor Dashboard</h1>
        </header>
        <div class="vendor-nav">
    <nav>
      <a href="#"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
      <a href="#"><i class="fas fa-boxes"></i> Inventory</a>
      <a href="#"><i class="fas fa-shopping-cart"></i> Orders</a>
      <a href="#"><i class="fas fa-chart-line"></i> Reports</a>
      <a href="#"><i class="fas fa-cog"></i> Settings</a>
      <a href="news.html" class="news-link" data-source="vendor"><i class="fas fa-newspaper"></i> News</a>
      <a href="#"><i class="fas fa-user"></i> Account</a>
      <a href="#" id="vendor-login"><i class="fas fa-user"></i> Login</a>
    </nav>
  </div>`;
    } else {
      headerContainer.innerHTML = '<p>Error: No source found for the header</p>';
    }
  }
  