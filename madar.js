import makeCard from './make-card.js'; 
let saveSearchInput = [];
let searchInput = document.getElementById("search-input");
let allproduct = [];

let currentIndex = 0;      
const itemsPerPage = 5;
let currentProductsArray = []; 
const currentPage = window.location.pathname;

document.querySelectorAll('.nav-item-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (currentPage.includes(linkHref)) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});


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

let filterInput = [];
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
    setTimeout(()=>{
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

let currentLoc = '';
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

async function loadCards(categoryName) {
    let url = categoryName === "" 
        ? 'https://dummyjson.com/products?limit=95' 
        : `https://dummyjson.com/products/category/${categoryName}?limit=95`;
        
    try {
        let response = await fetch(url);
        let data = await response.json();
         currentIndex = 0; 
       const portfolio = document.getElementById('portfolio');
        if (portfolio) {
            portfolio.innerHTML = ""; 
        }

        currentProductsArray = data.products.filter(p => p.id <= 99);
        
        renderChunk();
    } catch (error) {
        console.error("خطأ:", error);
    }
}

function cleanDiscountCards() {
    document.querySelectorAll('.discount-card').forEach(card => card.remove());
}

export function renderChunk() {
    const portfolio = document.getElementById('portfolio');
    let loadMoreBtn = document.getElementById('load-more-btn');

    let endIndex = currentIndex + itemsPerPage;
    
    if (endIndex > currentProductsArray.length) {
        endIndex = currentProductsArray.length;
    }

    for (let i = currentIndex; i < endIndex; i++) {
        let product = currentProductsArray[i];
        let productCard = new makeCard(            product.id, 
            product.title, 
            product.price, 
            product.thumbnail,          
            product.description, 
            product.rating,
            product.category);
        productCard.randerCard(portfolio);
    }
    
    currentIndex = endIndex; 
    if (loadMoreBtn) {
        loadMoreBtn.style.display = (currentIndex < currentProductsArray.length) ? "inline-block" : "none";
    }
}

let loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', renderChunk);
}
const categoryFilter = document.querySelectorAll('.cat-btn');
categoryFilter.forEach(btn => {
    btn.addEventListener('click', function(e) {
        categoryFilter.forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        let selectedCategory = e.target.dataset.cat;
        if (selectedCategory === "view all") {
            selectedCategory = "";
        }
        loadCards(selectedCategory);
    });
});

function scrollToTop(duration = 1000) {
    const start = window.scrollY;
    const startTime = performance.now();
    function animate(currentTime) {
        let passedTime = currentTime - startTime;
        const progress = Math.min(passedTime / duration, 1); 
        const ease = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, start * (1 - ease));
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate); 
}

let backToTop = document.querySelector('.scroll-up');
backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    scrollToTop(1000);
});
window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
        this.setTimeout(function() {
        backToTop.style.opacity = '1';
        backToTop.style.pointerEvents = 'auto';
         backToTop.style.display = 'block';

        } , 500);
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.pointerEvents = 'none';
    }
});
let emptyCart = document.querySelector('.empty-cart');
if (emptyCart) emptyCart.style.display = 'none';

loadCards('');
