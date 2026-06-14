let saveAdd=[];
let cartIdsCollection = JSON.parse(localStorage.getItem('cart-id')) || [];

class makeCard {
    constructor(id, title, price, img, desc, stars, category) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
        this.desc = desc;
        this.stars = stars;
        this.category = category;
    }

    genrateStars(rating) {
        const starsNum = Math.round(rating);
        const starsContainer = document.createElement('div');
        starsContainer.classList.add('rating-stars');
        
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-star');
        
        for (let i = 0; i < starsNum; i++) {
            let starCopy = icon.cloneNode(true);
            starsContainer.appendChild(starCopy);
        }
        return starsContainer;
    }

    randerCard(portfolio) {
        let portfolioCard = document.createElement('div');
        portfolioCard.classList.add('card','all-card');
        portfolioCard.dataset.category = this.category;
        
        let portfolioElement = document.getElementById('portfolio');
        portfolioElement.dataset.category = this.category;
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

        let priceContainer = document.createElement('div');
        priceContainer.classList.add('price-section');
        let currentPrice = document.createElement('span');
        currentPrice.classList.add('current-price');
        currentPrice.textContent = `${Math.round(this.price)} Eg`;
        
        priceContainer.appendChild(currentPrice);

        let addToCart = document.createElement('button');
        addToCart.classList.add('add-to-cart');
        addToCart.textContent = 'add to cart';
        addToCart.dataset.id = this.id;

        let shopingCarCount = document.getElementById('shoping-car-count'); 
        let orderNum = localStorage.getItem('num-of-order') || 0;
        shopingCarCount.textContent = orderNum;

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
            portfolioCard.style.cssText = `opacity:1; transform: translateY(0px);`;
        }, 100);

        portfolioCard.addEventListener('click', (e) => {
            let addCard = JSON.parse(localStorage.getItem('add-card')) || [];
            let addToCarts = {
                title: title.textContent.trim(),
                add: addToCart.textContent.trim(), 
            };
            let isExist = addCard.findIndex(p => String(p.title) === String(addToCarts.title));

            if (isExist === -1) {
                let maxNum = 1000;
                if (addCard.length < maxNum) {
                    addCard.push(addToCarts);
                } else {
                    addCard.shift(); 
                    addCard.push(addToCarts); 
                }
            } else {
                addCard[isExist] = addToCarts;
            }
            localStorage.setItem('add-card', JSON.stringify(addCard));
                
            if (e.target.classList.contains('add-to-cart')) return;
            let cleanPrice = Number(String(currentPrice.textContent.trim()).replace(/[^0-9.]/g, '')) || 1;
                        let saveCards = {
                id: this.id,
                img: img.src,
                title: title.textContent.trim(),
                price: cleanPrice,
                descriptian: desc.textContent.trim(),
                stars: starsContainer.children.length,
                category: this.category,
            };

            let cardStortge = JSON.parse(localStorage.getItem('all-cards')) || [];
            let cardIndex = cardStortge.findIndex(c => c.id === saveCards.id);
            if (cardIndex === -1) {
                let maxNum = 1000;
                if (cardStortge.length >= maxNum) {
                    cardStortge.shift(); 
                }
                cardStortge.push(saveCards);
            } else {
                cardStortge[cardIndex] = saveCards;
            }
            localStorage.setItem('all-cards', JSON.stringify(cardStortge));
            localStorage.setItem('last-id', String(this.id));
            location.href ='product-detial.html';
        });
    }
}

const shopingCarCount = document.getElementById('shoping-car-count');
if (shopingCarCount) {
    shopingCarCount.textContent = localStorage.getItem('num-of-order') || 0;
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        e.preventDefault();
        const addToCartBtn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
        let id = addToCartBtn.dataset.id || localStorage.getItem('last-id');
        if (!id) return;
        let saveCard = { id: String(id) };
        const isDetailPage = document.getElementById('main-product-img') !== null;
        
        if (isDetailPage) {
            const img = document.getElementById('main-product-img');
            const title = document.getElementById('product-title');
            const currentPrice = document.getElementById('discounted-price');
            const desc = document.getElementById('product-description');
            const ratingVal = document.getElementById('rating-value');

            saveCard.img = img ? img.src : '';
            saveCard.title = title ? title.textContent.trim() : '';
            saveCard.price = currentPrice ? currentPrice.textContent.trim() : '';
            saveCard.descriptian = desc ? desc.textContent.trim() : '';
            saveCard.stars = ratingVal ? Math.round(parseFloat(ratingVal.textContent)) : 5;
            saveCard.category = ""; 
        } else {
            const portfolioCard = addToCartBtn.closest('.card');
            if (!portfolioCard) return;

            const img = portfolioCard.querySelector('img');
            const title = portfolioCard.querySelector('h3');
            const currentPrice = portfolioCard.querySelector('.current-price');
            const desc = portfolioCard.querySelector('.descriptian');
            const starsContainer = portfolioCard.querySelector('.rating-stars');

            saveCard.img = img ? img.src : '';
            saveCard.title = title ? title.textContent.trim() : '';
            saveCard.price = currentPrice ? currentPrice.textContent.trim() : '';
            saveCard.descriptian = desc ? desc.textContent.trim() : '';
            saveCard.stars = starsContainer ? starsContainer.children.length : 0;
            saveCard.category = portfolioCard.dataset.category || '';
            
            portfolioCard.classList.add('in-cart');
        }

        if (!cartIdsCollection.includes(String(id))) {
            cartIdsCollection.push(String(id));
        }
        let uneq = new Set(cartIdsCollection);
        if (shopingCarCount) shopingCarCount.textContent = uneq.size;
        
        let cartIcon = document.querySelector('.fa-shopping-cart');
        if (cartIcon) {
            cartIcon.classList.add('animate-wiggle');
            setTimeout(() => cartIcon.classList.remove('animate-wiggle'), 500);
        }
        addToCartBtn.innerHTML = 'Added! ✓';
        addToCartBtn.style.backgroundColor = 'var(--accent)';
        addToCartBtn.style.pointerEvents = 'none';

        if (shopingCarCount) {
            shopingCarCount.classList.add('animate-slide-num');
            setTimeout(() => shopingCarCount.classList.remove('animate-slide-num'), 500);
        }

        let storatge = JSON.parse(localStorage.getItem('order')) || [];
        let cardIndex = storatge.findIndex(c => String(c.id) === String(saveCard.id));
        if (cardIndex !== -1) {
            storatge.splice(cardIndex, 1);
        }
        storatge.unshift(saveCard);
        if (storatge.length > 2000) storatge.pop();

        localStorage.setItem('num-of-order', uneq.size);
        localStorage.setItem('order', JSON.stringify(storatge));
        localStorage.setItem('cart-id', JSON.stringify([...uneq]));
    }
});

export default makeCard;