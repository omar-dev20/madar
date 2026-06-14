import makeCard from './make-card.js';
import DiscountCard from './discount.js';

class ProductDetail {
    constructor(id, title, price, oldPrice, rating, desc, thumbnail, description, category) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.oldPrice = oldPrice;
        this.rating = rating;
        this.desc = desc;
        this.thumbnail = thumbnail;
        this.description = description;
        this.category = category;
    }
    randerDetail(productDetail) {
        let img = document.getElementById('main-product-img');
        if (img) {
            img.src = this.thumbnail;
            img.alt = this.title;
        }
        let productTitle = document.getElementById('product-title');
        if (productTitle) productTitle.textContent = this.title;
        let description = document.getElementById('product-description');
        if (description) description.textContent = this.description;
        let rating = document.getElementById('rating-value');
        if (rating) rating.textContent = this.rating;
        
        let discountBadge = document.getElementById('discount-badge');
        if (this.desc && parseInt(this.desc) > 0) {
            if (discountBadge) {
                discountBadge.textContent = this.desc;
                discountBadge.style.display = 'block';
            }
        } else {
            if (discountBadge) discountBadge.style.display = 'none';
        }
        
        let productOldPrice = document.getElementById('original-price');
        if (this.oldPrice && this.oldPrice > 0) {
            if (productOldPrice) {
                productOldPrice.textContent = `${this.oldPrice} Eg`;
            }
        } else {
            if (productOldPrice) productOldPrice.style.display = 'none';
        }

        let productPrice = document.getElementById('discounted-price');
        if (productPrice) productPrice.textContent = `${this.price} Eg`;
    }
}

async function getProduct() {
    let getLastId = localStorage.getItem('last-id') || '';
    if (!getLastId) return;

    try {
let response = await fetch(`https://dummyjson.com/products/${getLastId}`);
let get = await response.json();

let allCards = JSON.parse(localStorage.getItem('all-cards')) || [];

let savedCard = allCards.find(
    card => String(card.id) === String(getLastId)
);

let basePrice = savedCard?.price
    ? Math.round(savedCard.price)
    : Math.round(get.price);

let baseOldPrice =
    savedCard &&
    savedCard.oldPrice
        ? Math.round(savedCard.oldPrice)
        : 0;

let discountText =
    savedCard &&
    savedCard.descount
        ? savedCard.descount
        : "";

let detailInstance = new ProductDetail(
    get.id,
    get.title,
    basePrice,
    baseOldPrice,
    get.rating,
    discountText,
    get.thumbnail,
    get.description,
    get.category
);

        let container = document.querySelector('.product-details-container');
        if (container) detailInstance.randerDetail(container);

        let orderNumEl = document.querySelector('.numper-order-sale');
        let orderNumData = JSON.parse(localStorage.getItem('num-of-product')) || [];
        let currentProductOrder = orderNumData.find(item => item.title === get.title);
        if (orderNumEl) orderNumEl.textContent = currentProductOrder ? currentProductOrder.num : "1";

        let productPrice = document.getElementById('discounted-price');
        let productOldPrice = document.getElementById('original-price');
        let currentQty = orderNumEl ? (Number(orderNumEl.textContent) || 1) : 1;

        if (productPrice) productPrice.textContent = `${basePrice * currentQty} Eg`;
        if (productOldPrice && baseOldPrice > 0) productOldPrice.textContent = `${baseOldPrice * currentQty} Eg`;

        function updateProductTotals(newQty) {
            let storageNums = JSON.parse(localStorage.getItem('num-of-product')) || [];
            let numIndex = storageNums.findIndex(item => item.title === get.title);
            if (numIndex !== -1) storageNums[numIndex].num = String(newQty);
            else storageNums.push({ num: String(newQty), title: get.title });
            localStorage.setItem('num-of-product', JSON.stringify(storageNums));

            let totalProducts = JSON.parse(localStorage.getItem('total-proudct')) || [];
            let totalIndex = totalProducts.findIndex(item => item.title === get.title);
            let calcTotalPrice = `${(basePrice * newQty).toFixed(2)} EGP`;
            if (totalIndex !== -1) totalProducts[totalIndex].price = calcTotalPrice;
            else totalProducts.push({ title: get.title, price: calcTotalPrice });
            localStorage.setItem('total-proudct', JSON.stringify(totalProducts));

            let orderCart = JSON.parse(localStorage.getItem('order')) || [];
            let cartIndex = orderCart.findIndex(item => String(item.id) === String(get.id));
            if (cartIndex !== -1) {
                orderCart[cartIndex].price = `${basePrice * newQty} Eg`;
                orderCart[cartIndex].parc = `${baseOldPrice * newQty} Eg`;
                localStorage.setItem('order', JSON.stringify(orderCart));
            }
        }

        let minus = document.querySelector('.fa-minus');
        if (minus) {
            let newMinus = minus.cloneNode(true);
            minus.parentNode.replaceChild(newMinus, minus);
            newMinus.addEventListener('click', function() {
                let num = Number(orderNumEl.textContent) || 1;
                if (num > 1) {
                    let newNum = num - 1;
                    orderNumEl.textContent = newNum;
                    if (productPrice) productPrice.textContent = `${basePrice * newNum} Eg`;
                    if (productOldPrice && baseOldPrice > 0) productOldPrice.textContent = `${baseOldPrice * newNum} Eg`;
                    updateProductTotals(newNum);
                }
            });
        }

        let plus = document.querySelector('.fa-plus');
        if (plus) {
            let newPlus = plus.cloneNode(true);
            plus.parentNode.replaceChild(newPlus, plus);
            newPlus.addEventListener('click', function() {
                let num = Number(orderNumEl.textContent) || 1;
                let newNum = num + 1;
                orderNumEl.textContent = newNum;
                if (productPrice) productPrice.textContent = `${basePrice * newNum} Eg`;
                if (productOldPrice && baseOldPrice > 0) productOldPrice.textContent = `${baseOldPrice * newNum} Eg`;
                updateProductTotals(newNum);
            });
        }

        let btnBuy = document.querySelector('.btn-buy');
        if (btnBuy) {
            btnBuy.addEventListener('click', function() {
              
                let saleOrder = {
                    id: get.id,
                    title: get.title,
                    img: get.thumbnail,
                    qty: orderNumEl ? orderNumEl.textContent : "1",
                    totalPrice: productPrice ? productPrice.textContent.trim() : `${basePrice} Eg`
                };
                localStorage.setItem('current-sale', JSON.stringify(saleOrder));
                        let createLoder = document.createElement('div');
        createLoder.classList.add('loader');
        let span = document.createElement('span');
        span.textContent = 'check out';
        createLoder.appendChild(span);
        document.body.appendChild(createLoder);
        setTimeout(() => {
            document.body.removeChild(createLoder);
        }, 3000);
            setTimeout(() => {
                window.location.href = 'sale-product.html';
            }, 3000);
            });
        }

        if (get.category) await loadSimilarProducts(get.category, get.id);
    } catch (error) {
        console.error(error);
    }
}

async function loadSimilarProducts(category, currentProductId) {
    const portfolio = document.getElementById('portfolio');
    if (!portfolio) return;

    try {
        let response = await fetch(
            `https://dummyjson.com/products/category/${category}?limit=5`
        );

        let data = await response.json();

  let similarProductsArray = data.products
            .filter(p => String(p.id) !== String(currentProductId))
            .slice(0, 5);

        portfolio.innerHTML = "";

        let allCards =JSON.parse(localStorage.getItem('all-cards')) || [];

similarProductsArray.forEach(product => {
    let savedCard = allCards.find(card => String(card.id) === String(product.id));
    let discountValue = 0;
    if (savedCard && savedCard.descount) {
        discountValue = parseFloat(String(savedCard.descount).replace(/[^0-9.]/g, ''));
    } else if (product.discountPercentage) {
        discountValue = Math.round(product.discountPercentage);
    }
    if (discountValue > 0 && currentProductId > 100 ) {
        new DiscountCard(
            product.id,
            product.title,
            savedCard?.price || Math.round(product.price),
            discountValue,
            product.thumbnail, 
            product.description,
            product.rating,
            product.category
        ).randerCard(portfolio);
    } else {
        new makeCard(
            product.id,
            product.title,
            product.price,
            product.thumbnail,
            product.description,
            product.rating,
            product.category
        ).randerCard(portfolio);
    }
});
 console.log(similarProductsArray.length);
  if(similarProductsArray.length > 5){
    similarProductsArray.splice(5);
  }
    } catch (error) {
        console.error(error);
    }
}

getProduct();

window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        let updateCount = document.getElementById("shoping-car-count");
        if (updateCount) {
            let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
            updateCount.textContent = currentCart.length;
        }
    }
});

window.addEventListener('pageshow', function(e) {
    if (e.persisted || (performance.getEntriesByType('navigation')[0] && performance.getEntriesByType('navigation')[0].type === 'back_forward')) {
        getProduct();
    }
});