document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const popupOverlay = document.getElementById("popupOverlay");
    const closePopupBtn = document.getElementById("closePopup");
    const cartButton = document.getElementById("cartButton");
    const cartItemsContainer = document.getElementById("cartItems");
    const totalProducts = document.getElementById("totalProducts");
    const totalPrice = document.getElementById("totalPrice");

    function openPopup() {
        loadCartItems();
        popup.style.display = "flex";
        popupOverlay.style.display = "block";
        document.body.classList.add("no-scroll");
    }

    function closePopup() {
        popup.style.display = "none";
        popupOverlay.style.display = "none";
        document.body.classList.remove("no-scroll");
    }

    if (cartButton) {
        cartButton.addEventListener("click", openPopup);
    }
    closePopupBtn.addEventListener("click", closePopup);

    function loadCartItems() {
        cartItemsContainer.innerHTML = "";
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            let cleanPrice = parseFloat(item.price.replace(/\s/g, "")); // Убираем пробелы из цены
            total += item.quantity * cleanPrice;
            count += item.quantity;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.imageUrl}" alt="${item.name}" class="popup__product-img"></td>
                <td>${item.name}</td>
                <td>
                    <button class="popup__qty-btn decrease" data-index="${index}">-</button>
                    <span class="popup__qty">${item.quantity}</span>
                    <button class="popup__qty-btn increase" data-index="${index}">+</button>
                </td>
                <td>${cleanPrice.toLocaleString()}€</td>
                <td><button class="popup__delete" data-index="${index}">&times;</button></td>
            `;
            cartItemsContainer.appendChild(row);
        });

        totalProducts.textContent = `${count}`;
        totalPrice.textContent = `${total.toLocaleString()}€`; // Приводим к нормальному виду

        document.querySelectorAll(".popup__qty-btn.increase").forEach(btn =>
            btn.addEventListener("click", increaseQuantity)
        );
        document.querySelectorAll(".popup__qty-btn.decrease").forEach(btn =>
            btn.addEventListener("click", decreaseQuantity)
        );
        document.querySelectorAll(".popup__delete").forEach(btn =>
            btn.addEventListener("click", removeItem)
        );
    }



    function increaseQuantity(event) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let index = event.target.dataset.index;
        cart[index].quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCartItems();
    }

    function decreaseQuantity(event) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let index = event.target.dataset.index;
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCartItems();
    }

    function removeItem(event) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let index = event.target.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCartItems();
    }
});
