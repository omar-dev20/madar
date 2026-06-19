let saveSearchInput = [];
let searchInput = document.getElementById("search-input");
let allproduct = [];
let filterInput = [];

async function getData() {
    try {
        let response = await fetch("https://dummyjson.com/products?limit=95");
        let data = await response.json();
        allproduct = data.products; 
        console.log("تم تحميل منتجات البحث بنجاح");
    } catch (error) {
        console.error("خطأ في جلب بيانات البحث:", error);
    }
}
getData();

searchInput.addEventListener("input", function() {
    let searchValue = searchInput.value.toLowerCase();
    filterInput = allproduct.filter(function(product) {
        return product.title.toLowerCase().includes(searchValue);
    });
    displayProducts(filterInput);
});

function displayProducts(products) {
    let productContainer = document.getElementById("product-container");
    productContainer.innerHTML = "";
    
    if (searchInput.value === "") {
        productContainer.style.display = "none";
        return;
    }
    
    productContainer.style.display = "block";
    
    products.forEach(function(product) {
        let productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.style.display = "flex";
        productElement.style.alignItems = "center";
        productElement.style.padding = "10px";
        
        let title = document.createElement("span");
        title.textContent = product.title;
        productElement.appendChild(title);
        productContainer.appendChild(productElement);
        
        productElement.addEventListener('click', function() {
            searchInput.value = productElement.textContent.trim();
            let saveProduct = {
                title: productElement.textContent.trim(),
                img: product.thumbnail,
                price: product.price,
                id: product.id,
                descriptian: product.description,
                stars: Math.round(product.rating),
                category: product.category
            }
            saveSearchInput.push(saveProduct);
            localStorage.setItem('all-cards', JSON.stringify(saveSearchInput));
            localStorage.setItem('last-id', String(product.id));
            location.href = 'product-detial.html';
        });
    });

    if (products.length === 0) {
        productContainer.innerHTML = "<p style='padding:10px;'>No products found.</p>";
    }
}

document.addEventListener("click", function(event) {
    let productContainer = document.getElementById("product-container");
    setTimeout(() => {
        if (!document.querySelector(".search").contains(event.target)) {
            productContainer.style.display = "none";
        }
    }, 500);
});

searchInput.addEventListener("click", function() {
    let productContainer = document.getElementById("product-container");
    if (searchInput.value.trim() !== "") {
        productContainer.style.display = "block";
    }
});

let burgerMenu = document.getElementById("burger-menu");
let sacHeader = document.querySelector(".sac-header");

burgerMenu.addEventListener('click', function() {
    burgerMenu.classList.toggle('active');
    if (burgerMenu.classList.contains('active')) {
        burgerMenu.classList.remove('fa-bars');
        burgerMenu.classList.add('fa-xmark');
        sacHeader.classList.add('show');
    } else {
        burgerMenu.classList.remove('fa-xmark');
        burgerMenu.classList.add('fa-bars');
        sacHeader.classList.remove('show');
    }
});