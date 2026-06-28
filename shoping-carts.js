let productPrice = [];
let currentIndex = 0;
const itemsPerPage = 6;
let globalCartItems = [];
let simpleProduct = [];
let total;

class ShopingCarts {

  constructor(id, img, title, price, descriptian, stars, category, oldPrice, descount) {
    this.id = id;
    this.img = img;
    this.title = title;
    this.price = price;
    this.descriptian = descriptian;
    this.stars = stars;
    this.category = category;
    this.oldPrice = oldPrice;
    this.descount = descount;
  }

  randerShoping(shopingCarts) {
    let shopingCart = document.createElement('div');
    shopingCart.classList.add('shoping-cart-item', 'all-card');
    shopingCart.dataset.id = this.id;
    
    let shopingTitle = document.createElement('h2');
    shopingTitle.classList.add('shoping-cart-title');
    shopingTitle.textContent = 'Shoping Cart';
    shopingTitle.dataset.category = this.category;

    let shopingImg = document.createElement('img');
    shopingImg.src = this.img;
    shopingImg.alt = this.title;

    let shopingName = document.createElement('h3');
    shopingName.classList.add('shoping-cart-name');
    shopingName.textContent = this.title;

    let shopingStars = document.createElement('div');
    shopingStars.classList.add('rating-stars');
    for (let i = 0; i < this.stars; i++) {
        let starCopy = document.createElement('i');
        starCopy.classList.add('fas', 'fa-star');
        shopingStars.appendChild(starCopy);
    }

    let descriptian = document.createElement('p');
    descriptian.classList.add('descriptian');
    descriptian.textContent = this.descriptian;

    let cleanPrice = Number(String(this.price).replace(/[^0-9.]/g, '')) || 1;

    let currentProductNum = 1;
    try {
        let storedNums = JSON.parse(localStorage.getItem('num-of-product')) || [];
        if (Array.isArray(storedNums)) {
            let foundItem = storedNums.find(item => item.title === this.title);
            if (foundItem) {
                currentProductNum = Number(foundItem.num) || 1;
            }
        }
    } catch (e) {
        currentProductNum = 1;
    }

    let totalPriceForUnits = cleanPrice * currentProductNum;
    productPrice.push(cleanPrice);
    localStorage.setItem('product-price', JSON.stringify(productPrice));
    
    let priceContainer = document.createElement('div');
    priceContainer.classList.add('price-section');

    let shopingPrice = document.createElement('span');
    shopingPrice.classList.add('current-price');
    shopingPrice.textContent = ` ${totalPriceForUnits} EGP`;
    priceContainer.appendChild(shopingPrice);

    if (this.oldPrice) {
        let cleanOldPrice = Number(String(this.oldPrice).replace(/[^0-9.]/g, '')) || 0;

        if (this.descount) {
            let badgeValue = Number(String(this.descount).replace(/[^0-9.]/g, '')) || 0;
            if (badgeValue > 0) {
                let cartDiscountBadge = document.createElement('span');
                cartDiscountBadge.classList.add('discount-badge');
                cartDiscountBadge.textContent = ` ${badgeValue}%`;
               shopingCart.appendChild(cartDiscountBadge);
            }
        }
    }
    
    let numOfOrder = document.createElement('div');
    numOfOrder.classList.add('order-num');  

    let plus = document.createElement('i');
    plus.classList.add('fas', 'fa-plus');
    numOfOrder.appendChild(plus);

    let numOrder = document.createElement('span');
    numOrder.textContent = currentProductNum;
    numOrder.classList.add('numper-order');
    numOfOrder.appendChild(numOrder);

    let minus = document.createElement('i');
    minus.classList.add('fas', 'fa-minus');
    numOfOrder.appendChild(minus);
    shopingCart.appendChild(shopingTitle); 
    shopingCart.appendChild(shopingImg);     
    shopingCart.appendChild(shopingName);     
    shopingCart.appendChild(descriptian);    
    shopingCart.appendChild(shopingStars);  
    shopingCart.appendChild(priceContainer);
    shopingCart.appendChild(numOfOrder);   
    
    shopingCart.style.cssText = `opacity:0; transform: translateY(-100px); transition:0.5s;`;
    shopingCarts.appendChild(shopingCart);

    setTimeout(() => {
        shopingCart.style.cssText = `opacity:1; transform: translateY(0px);`;
    }, 500);

    minus.addEventListener('click', () => {
        let num = Number(numOrder.textContent);
        if (num > 0) {
            let newNum = num - 1;
            numOrder.textContent = newNum;
            let storageData = [];
            try {
                storageData = JSON.parse(localStorage.getItem('num-of-product'));
                if (!Array.isArray(storageData)) storageData = [];
            } catch (e) {
                storageData = [];
            }
            let itemIndex = storageData.findIndex(item => item.title === this.title);
            if (itemIndex !== -1) {
                storageData[itemIndex].num = String(newNum);
            } else {
                storageData.push({ num: String(newNum), title: this.title });
            }
            localStorage.setItem('num-of-product', JSON.stringify(storageData));
            shopingPrice.textContent = ` ${cleanPrice * newNum} EGP`;
            
            if (this.oldPrice) {
                let cleanOldPrice = Number(String(this.oldPrice).replace(/[^0-9.]/g, '')) || 0;
                let foundOldPrice = shopingCart.querySelector('.old-price');
                if (foundOldPrice) {
                    foundOldPrice.textContent = ` ${cleanOldPrice * newNum} EGP`;
                }
            }
            
            updateOrderSummary();
        }
        
        if (numOrder.textContent === '0') {
            let overlay = document.querySelector('.overlay');
            if(overlay) overlay.style.display = 'block';
            let garbage = document.querySelector('.garpadge');
            if(garbage) {
                garbage.appendChild(shopingImg);
                shopingImg.style.cssText = 'transform:scale(0.7); margin:auto;margin-top:100px;';
            }
            let ufo = document.querySelector('#ufo');
            if(ufo) ufo.style.cssText = 'animation: fade-in 2s infinite ease-in-out;';
            setTimeout(() => {
                if(ufo) ufo.style.cssText = 'animation: none;';
            }, 2000);
            let spotLight = document.querySelector('.spot-light');
            setTimeout(() => {
               if(spotLight) {
                   spotLight.style.display = 'block';
                   spotLight.style.animation = 'fade 2s infinite ease-in-out';
               }
            }, 2000);
            setTimeout(() => {
                let garbageElement = document.querySelector('.garpadge');
                if(garbageElement) garbageElement.style.animation = 'goToTop 2s infinite ease-in-out';
            }, 2000);
            setTimeout(()=>{
                if(spotLight) spotLight.style.display = 'none';
                if(garbage) garbage.style.display = 'none';
                if(ufo) ufo.style.animation = 'goToLeft 1s infinite ease-in-out ';
            }, 4000);
            setTimeout(() => {
                if(ufo) ufo.style.display = 'none';
                if(overlay) overlay.style.display = 'none';
                shopingCart.style.display = 'none';
                
                let theCart = JSON.parse(localStorage.getItem('order')) || [];
                let index = theCart.findIndex(c => String(c.id) === String(this.id));
                
                let TheCartId = JSON.parse(localStorage.getItem('cart-id')) || [];
                let cartIndex = TheCartId.findIndex(c => String(c) === String(this.id));
                
                if (index !== -1) {
                    theCart.splice(index, 1);
                    localStorage.setItem('order', JSON.stringify(theCart));
                }
                
                if (cartIndex !== -1) {
                    TheCartId.splice(cartIndex, 1);
                    localStorage.setItem('cart-id', JSON.stringify(TheCartId));
                }
                let numOrderData = localStorage.getItem('num-of-order') || 1;
                numOrderData = Number(numOrderData) - 1;
                localStorage.setItem('num-of-order', numOrderData);
                location.reload();
            }, 5000);
        }
    });

    plus.addEventListener('click', () => {
        let num = Number(numOrder.textContent);
        let newNum = num + 1;
        numOrder.textContent = newNum;
        
        let storageData = [];
        try {
            storageData = JSON.parse(localStorage.getItem('num-of-product'));
            if (!Array.isArray(storageData)) storageData = [];
        } catch (e) {
            storageData = [];
        }
        let itemIndex = storageData.findIndex(item => item.title === this.title);
        if (itemIndex !== -1) {
            storageData[itemIndex].num = String(newNum);
        } else {
            storageData.push({ num: String(newNum), title: this.title });
        }
        localStorage.setItem('num-of-product', JSON.stringify(storageData));
        
        shopingPrice.textContent = ` ${cleanPrice * newNum} EGP`;
        
        if (this.oldPrice) {
            let cleanOldPrice = Number(String(this.oldPrice).replace(/[^0-9.]/g, '')) || 0;
            let foundOldPrice = shopingCart.querySelector('.old-price');
            if (foundOldPrice) {
                foundOldPrice.textContent = ` ${cleanOldPrice * newNum} EGP`;
            }
        }
        
        updateOrderSummary();
    });

    shopingCart.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-plus') || e.target.classList.contains('fa-minus') || e.target.closest('.order-num')) {
            return; 
        }
        
        let saveCard = {
            id: this.id,
            img: this.img,
            title: this.title,
            price: cleanPrice, 
            oldPrice: this.oldPrice,
            descount: this.descount,
            descriptian: this.descriptian,
            stars: this.stars,
            category: this.category
        };
        let savedCards = JSON.parse(localStorage.getItem('all-cards')) || [];
        let isExist = savedCards.findIndex(p => String(p.id) === String(saveCard.id));

        if (isExist !== -1) {
            savedCards.splice(isExist, 1);
        }
        savedCards.unshift(saveCard);
        
        let maxNum = 1000;
        if (savedCards.length > maxNum) {
            savedCards.pop(); 
        }
        
        localStorage.setItem('all-cards', JSON.stringify(savedCards));
        localStorage.setItem('last-id', String(this.id));
        window.location.href = 'product-detial.html';
    });
  }
}

function loadShopingCarts() {
    const loadStorage = JSON.parse(localStorage.getItem('order')) || [];
    if (loadStorage.length === 0) {
        return;
    }
    globalCartItems = loadStorage.map(item => new ShopingCarts(
        item.id, 
        item.img, 
        item.title, 
        item.price, 
        item.descriptian, 
        item.stars, 
        item.category,
        item.oldPrice,
        item.descount
    ));
    renderChunk();
}

function renderChunk() {
    const cartContainer = document.querySelector('.shoping-cart');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (!cartContainer) return;

    let endIndex = currentIndex + itemsPerPage;
    if (endIndex > globalCartItems.length) {
        endIndex = globalCartItems.length;
    }
    for (let i = currentIndex; i < endIndex; i++) {
        globalCartItems[i].randerShoping(cartContainer);
    }

    updateOrderSummary();
   
    currentIndex = endIndex;
    if (loadMoreBtn) {
        if (currentIndex < globalCartItems.length) {
            loadMoreBtn.style.display = "inline-block";
        } else {
            loadMoreBtn.style.display = "none";
        }
    }
}

function updateOrderSummary() {
    simpleProduct = [];
    let allProductNum = [];
    total = 0;
    const cartItemsHtml = document.querySelectorAll('.shoping-cart-item');
    
    cartItemsHtml.forEach((itemHtml) => {
        if (itemHtml.style.display === 'none') return;

        const title = itemHtml.querySelector('h3').textContent;
        const numOrderText = itemHtml.querySelector('.numper-order').textContent;
        const quantity = Number(numOrderText) || 1;
        
        const itemId = itemHtml.dataset.id;
        const originalProduct = globalCartItems.find(item => String(item.id) === String(itemId));
        if (!originalProduct) return;
        
        let cleanPrice = Number(String(originalProduct.price).replace(/[^0-9.]/g, '')) || 0;
        let itemTotalPrice = cleanPrice * quantity;
        
        allProductNum.push(itemTotalPrice);
        
        simpleProduct.push({
            title: `${title} (x${quantity})`,
            price: `${itemTotalPrice.toFixed(2)} EGP`
        });
    });

    total = allProductNum.reduce((a, b) => a + b, 0);
    localStorage.setItem('total-proudct', JSON.stringify(simpleProduct));

    let totalPrice = document.querySelector('#subtotal-price');
    if (totalPrice && total !== undefined) {
        totalPrice.textContent = `${total.toFixed(2)} EGP`;
    }
    
    const productListContainer = document.querySelector('.total-product-list');
    if (productListContainer) {
        productListContainer.innerHTML = ''; 
        for(let i = 0; i < simpleProduct.length; i++){
            let product = simpleProduct[i];
            let price = product.price;
            let productName = product.title;

            let li = document.createElement('li');
            li.classList.add('product-item');

            let productSpan = document.createElement('span');
            productSpan.classList.add('product-name');
            productSpan.textContent = productName;
            li.appendChild(productSpan);

            let priceSpan = document.createElement('span');
            priceSpan.classList.add('product-price');
            priceSpan.textContent = `${price}`;
            li.appendChild(priceSpan);

            productListContainer.appendChild(li);
        }
        if (total !== undefined) {
            let totalLi = document.createElement('li');
            totalLi.classList.add('total-row');

            let totalLabelSpan = document.createElement('span');
            totalLabelSpan.textContent = "total";
            totalLi.appendChild(totalLabelSpan);

            let totalValueSpan = document.createElement('span');
            totalValueSpan.classList.add('total-final-price');
            totalValueSpan.textContent = `${total.toFixed(2)} EGP`; 
            totalLi.appendChild(totalValueSpan);
            productListContainer.appendChild(totalLi);
        }
    }
}
let saveNum = [];

document.addEventListener('DOMContentLoaded', function() {
    loadShopingCarts();
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderChunk);
    }
    let orderNumEl = document.querySelector('.numper-order');
    let titleEl = document.querySelector('.shoping-cart-name');
    
    let num = [];
    try {
        num = JSON.parse(localStorage.getItem('num-of-product'));
        if (!Array.isArray(num)) {
            num = [];
        }
    } catch (e) {
        num = [];
    }

    if (orderNumEl && titleEl) {
        let itemIndex = num.findIndex(item => item.title === titleEl.textContent);
        if (itemIndex !== -1) {
            num[itemIndex].num = orderNumEl.textContent;
        } else {
            num.push({
                num: orderNumEl.textContent,
                title: titleEl.textContent
            });
        }
        if (orderNumEl.textContent !== '0') {
            localStorage.setItem('num-of-product', JSON.stringify(num));
        }
    }
    
    let shopingcount = document.querySelector('#shoping-car-count');
    if (shopingcount) {
        shopingcount.textContent = globalCartItems.length;
    }
    if (window.location.pathname.includes('order.html')) {
        if(globalCartItems.length === 0){
            let summaryContainer = document.querySelector('.order-summary-container');
            if(summaryContainer) summaryContainer.style.display = 'none';
                      let createNote = document.createElement('p');
            let iconNote = document.createElement('i');
            iconNote.classList.add('fa-solid', 'fa-circle-info');
            createNote.textContent = 'Your cart is empty  ';
            createNote.appendChild(iconNote);
            createNote.classList.add('empty-cart');
        let shop =  document.querySelector('.shoping-cart');
          shop.style.margin ='auto'
        shop.document.querySelector('.shoping-cart').appendChild(createNote);
        
        }
    }
});

window.addEventListener('pageshow', function(e) {
    if (typeof updateOrderSummary === 'function') {
        updateOrderSummary();
    }
});
