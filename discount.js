import makeCard from './make-card.js';
let currentIndex = 0;      
const itemsPerPage = 6;
let currentProductsArray = [];
class DiscountCard extends makeCard {
    
    constructor(id, title, price, parcent, img, desc, stars, category) {
        super(id, title, price, img, desc, stars, category);
        this.parcent = parcent; 
    }

    randerCard(portfolioElement) {
        if (!this.parcent || Math.round(this.parcent) <= 0) {
            return; 
        }
        if (!portfolioElement) return;

        let portfolioCard = document.createElement('div');
        portfolioCard.classList.add('card', 'all-card', 'discount-card');
        portfolioCard.dataset.category = this.category;
        let discountBadge = document.createElement('span');
        discountBadge.classList.add('discount-badge');
        discountBadge.textContent = `${Math.round(this.parcent)}%`;  
        portfolioCard.appendChild(discountBadge);
        
        let img = document.createElement('img');
        img.src = this.img;
        img.alt = this.title;
        
        let title = document.createElement('h3');
        title.textContent = this.title;
        
        let desc = document.createElement('p');
        desc.classList.add('descriptian');
        desc.textContent = this.desc;

        let starsTarget = document.createElement('div');
        starsTarget.classList.add('rating-box');
        
        let starsContainer = this.genrateStars(this.stars); 
        starsTarget.appendChild(starsContainer);
        let orgenalPrice = Math.round((this.price / (1 - (this.parcent / 100))));

        let priceContainer = document.createElement('div');
        priceContainer.classList.add('price-section');
        
        let currentPrice = document.createElement('span');
        currentPrice.classList.add('current-price');
        currentPrice.textContent = `${Math.round(this.price)} Eg`;
        let oldPrice = document.createElement('span');
        oldPrice.classList.add('old-price');
        oldPrice.textContent = `${orgenalPrice} Eg`;
        
        priceContainer.appendChild(currentPrice);
        priceContainer.appendChild(oldPrice); 

        let addToCart = document.createElement('button');
        addToCart.classList.add('add-to-cart');
        addToCart.textContent = 'add to cart';
        addToCart.dataset.id = this.id;
addToCart.addEventListener('click', (e) => {
    e.stopPropagation(); 
    let cleanPrice = Math.round(this.price); 
    let cleanOldPrice = Math.round((this.price / (1 - (this.parcent / 100))));
    let productToCart = {
        id: this.id,
        img: this.img,
        title: this.title,
        price: cleanPrice,     
        oldPrice: cleanOldPrice, 
        descount: `${Math.round(this.parcent)}%`,
        descriptian: this.desc,
        stars: this.stars,
        category: this.category
    };
    let currentOrder = JSON.parse(localStorage.getItem('order')) || [];
    let orderExist = currentOrder.findIndex(item => String(item.id) === String(productToCart.id));

    if (orderExist === -1) {
        currentOrder.push(productToCart);
        localStorage.setItem('order', JSON.stringify(currentOrder));
    }
    let cartIdsCollection = JSON.parse(localStorage.getItem('cart-id')) || [];
    if (!cartIdsCollection.includes(String(this.id))) {
        cartIdsCollection.push(String(this.id));
        localStorage.setItem('cart-id', JSON.stringify(cartIdsCollection));
    }
    let numOfOrder = localStorage.getItem('num-of-order') || 0;
    numOfOrder = Number(numOfOrder) + 1;
    localStorage.setItem('num-of-order', numOfOrder);

    if (shopingCarCount) {
        shopingCarCount.textContent = numOfOrder;
    }
    addToCart.textContent = 'Added! ✓'; 
    addToCart.style.backgroundColor = 'var(--accent)'; 
    addToCart.style.pointerEvents = 'none';
    portfolioCard.classList.add('in-cart');
});
        let shopingCarCount = document.getElementById('shoping-car-count'); 
        let orderNum = localStorage.getItem('num-of-order') || 0;
        if (shopingCarCount) shopingCarCount.textContent = orderNum;

        let cartIdsCollection = JSON.parse(localStorage.getItem('cart-id')) || [];
        if (cartIdsCollection.includes(String(this.id))) {
            addToCart.textContent = 'Added! ✓'; 
            addToCart.style.backgroundColor = 'var(--accent)'; 
            addToCart.style.pointerEvents = 'none';
            portfolioCard.classList.add('in-cart');
        }       

        portfolioCard.appendChild(img);
        portfolioCard.appendChild(title);
        portfolioCard.appendChild(desc);
        portfolioCard.appendChild(starsTarget);
        portfolioCard.appendChild(priceContainer);
        portfolioCard.appendChild(addToCart);
        portfolioCard.style.cssText = `opacity:0; transform: translateY(-100px); transition:0.5s;`;
        portfolioElement.appendChild(portfolioCard);
        
        setTimeout(() => {
            portfolioCard.style.opacity = '1';
            portfolioCard.style.transform = 'translateY(0px)';
        }, 100);

        portfolioCard.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) return;
            
            let cleanPrice = Number(String(currentPrice.textContent.trim()).replace(/[^0-9.]/g, '')) || 1;
            let cleanOldPrice = Number(String(oldPrice.textContent.trim()).replace(/[^0-9.]/g, '')) || 1;
            
            let saveCards = {
                id: this.id,
                img: img.src,
                title: title.textContent.trim(),
                price: cleanPrice,
                oldPrice: cleanOldPrice, 
                descount: discountBadge.textContent.trim(),
                descriptian: desc.textContent.trim(),
                stars: starsContainer.children.length,
                category: this.category,
            };

            let cardStortge = JSON.parse(localStorage.getItem('all-cards')) || [];
            let cardIndex = cardStortge.findIndex(c => c.id === saveCards.id);
            if (cardIndex === -1) {
                if (cardStortge.length >= 1000) cardStortge.shift(); 
                cardStortge.push(saveCards);
            } else {
                cardStortge[cardIndex] = saveCards;
            }
            localStorage.setItem('all-cards', JSON.stringify(cardStortge));
            localStorage.setItem('last-id', String(this.id));
            localStorage.setItem('from-discounts', '1');
            location.href ='product-detial.html';
        });
    }
}

async function loadDiscountCards() {
    try {
        let response = await fetch('https://dummyjson.com/products?limit=80&skip=99');
        let data = await response.json();
        currentProductsArray = data.products.filter(p => p.id > 99);
        
        renderChunk();
    } catch (error) {
        console.error("خطأ:", error);
    }
}

function renderChunk() {
    const portfolio = document.getElementById('portfolio-discount');
    let loadMoreBtn = document.getElementById('load-more-btn');
    if (!portfolio) return;
    
    let endIndex = currentIndex + itemsPerPage;
    if (endIndex > currentProductsArray.length) {
        endIndex = currentProductsArray.length;
    }
    
    for (let i = currentIndex; i < endIndex; i++) {
        let product = currentProductsArray[i];
        
        let productCard = new DiscountCard(
            product.id, 
            product.title, 
            product.price, 
            product.discountPercentage,
            product.thumbnail,          
            product.description, 
            product.rating,
            product.category
        );
        productCard.randerCard(portfolio);
    }
    
    currentIndex = endIndex;
    if (loadMoreBtn) {
        if (currentIndex < currentProductsArray.length) {
            loadMoreBtn.style.display = "inline-block";
        } else {
            loadMoreBtn.style.display = "none";
        }
    }
}

let loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', renderChunk);
}

document.addEventListener('DOMContentLoaded', () => {
    loadDiscountCards();
});

export default DiscountCard;