document.addEventListener("DOMContentLoaded", function() {
    function loadContent(url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById("content").innerHTML = data;
                initializeCharts();
            });
    }

    function initializeCharts() {
        if (document.getElementById('salesChart')) {
            var ctxSales = document.getElementById('salesChart').getContext('2d');
            var salesChart = new Chart(ctxSales, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [{
                        label: 'Total Sales',
                        data: [500, 1000, 750, 1500, 1200, 1700],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        if (document.getElementById('ordersChart')) {
            var ctxOrders = document.getElementById('ordersChart').getContext('2d');
            var ordersChart = new Chart(ctxOrders, {
                type: 'bar',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [{
                        label: 'Total Orders',
                        data: [10, 20, 15, 25, 22, 27],
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        if (document.getElementById('inventoryChart')) {
            var ctxInventory = document.getElementById('inventoryChart').getContext('2d');
            var inventoryChart = new Chart(ctxInventory, {
                type: 'pie',
                data: {
                    labels: ['Oak Tree', 'Pine Tree', 'Maple Tree'],
                    datasets: [{
                        label: 'Inventory Levels',
                        data: [20, 15, 10],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });
        }
    }

    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            loadContent(event.target.href);
        });
    });

    // Load default content
    loadContent("overview.html");
});