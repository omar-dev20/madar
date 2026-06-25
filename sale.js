let checkOutBtn = document.querySelector('.checkout-btn');
let allPrice = [];

if (checkOutBtn) {
    checkOutBtn.addEventListener('click', function() {
        let getProduct = JSON.parse(localStorage.getItem('total-proudct')) || [];
        if (getProduct.length === 0) {
            alert("سلتك فارغة!"); 
            return;
        }
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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

async function showPosition(position) {
    const latitude = Number(position.coords.latitude);
    const longitude = Number(position.coords.longitude);
    const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await response.json();
    
    let createlocation = document.createElement('div');
    createlocation.classList.add('detail-row');
    let locationLabel = document.createElement('span');
    locationLabel.textContent = 'Location:';
    createlocation.appendChild(locationLabel);
    let locationSpan = document.createElement('span');
    locationSpan.textContent = `${data.principalSubdivision} ,${data.city} `;
    createlocation.appendChild(locationSpan);
    let orderBox = document.querySelector('.order-details-box');
    if (orderBox) {
        orderBox.appendChild(createlocation);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let orderBox = document.querySelector('.order-details-box');
    if (!orderBox) return;

    let currentSale = JSON.parse(localStorage.getItem('current-sale'));
    let getProduct = JSON.parse(localStorage.getItem('total-proudct')) || [];

    orderBox.innerHTML = ''; 

    let orderNumRow = document.createElement('div');
    orderNumRow.classList.add('detail-row');
    let orderNumLabel = document.createElement('span');
    orderNumLabel.textContent = 'Order Number:';
    let orderNumVal = document.createElement('span');
    orderNumVal.classList.add('highlight');
    orderNumVal.textContent = '#ORD-2026-8941';
    orderNumRow.appendChild(orderNumLabel);
    orderNumRow.appendChild(orderNumVal);
    orderBox.appendChild(orderNumRow);

    let deliveryRow = document.createElement('div');
    deliveryRow.classList.add('detail-row');
    let deliveryLabel = document.createElement('span');
    deliveryLabel.textContent = 'Estimated Delivery:';
    let deliveryVal = document.createElement('span');
    deliveryVal.textContent = '2 - 3 Business Days';
    deliveryRow.appendChild(deliveryLabel);
    deliveryRow.appendChild(deliveryVal);
    orderBox.appendChild(deliveryRow);

    if (currentSale) {
        let productRow = document.createElement('div');
        productRow.classList.add('detail-row');
        let titleSpan = document.createElement('span');
        titleSpan.textContent = `${currentSale.title} (x${currentSale.qty})`;
        let priceSpan = document.createElement('span');
        priceSpan.textContent = currentSale.totalPrice;
        productRow.appendChild(titleSpan);
        productRow.appendChild(priceSpan);
        orderBox.appendChild(productRow);

        let totalRow = document.createElement('div');
        totalRow.classList.add('detail-row', 'total-row');
        totalRow.style.fontWeight = 'bold';
        totalRow.style.borderTop = '1px solid #ccc';
        totalRow.style.marginTop = '10px';
        totalRow.style.paddingTop = '10px';
        let totalLabel = document.createElement('span');
        totalLabel.textContent = 'Total:';
        let totalValue = document.createElement('span');
        totalValue.textContent = currentSale.totalPrice;
        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);
        orderBox.appendChild(totalRow);

    } else if (getProduct.length > 0) {
        let cleanPrice = 0;

        for (let i = 0; i < getProduct.length; i++) {
            let product = getProduct[i];
            let productRow = document.createElement('div');
            productRow.classList.add('detail-row');

            let nameSpan = document.createElement('span');
            nameSpan.textContent = product.title;
            productRow.appendChild(nameSpan);

            let priceSpan = document.createElement('span');
            priceSpan.textContent = product.price;
            productRow.appendChild(priceSpan);

            orderBox.appendChild(productRow);
            allPrice.push(product.price);

            cleanPrice += (Number(String(product.price).replace(/[^0-9.]/g, '')) || 0);
        }

        let totalPriceRow = document.createElement('div');
        totalPriceRow.classList.add('detail-row', 'total-row');
        totalPriceRow.style.fontWeight = 'bold';
        totalPriceRow.style.borderTop = '1px solid #ccc';
        totalPriceRow.style.marginTop = '10px';
        totalPriceRow.style.paddingTop = '10px';
        let totalLabel = document.createElement('span');
        totalLabel.textContent = 'Total Price:';
        let totalPriceSpan = document.createElement('span');
        totalPriceSpan.textContent = `${cleanPrice.toFixed(2)} EGP`;
        totalPriceRow.appendChild(totalLabel);
        totalPriceRow.appendChild(totalPriceSpan);
        orderBox.appendChild(totalPriceRow);

        getLocation();

    } else {
        let emptyNote = document.createElement('p');
        emptyNote.classList.add('empty-note');
        emptyNote.textContent = 'No active checkout found.';
        orderBox.appendChild(emptyNote);
    }
});

let btn = document.querySelector('.btn-primary');
if (btn) {
    btn.addEventListener('click', function() {
       localStorage.clear();
        window.location.href = 'index.html';
    });
}
