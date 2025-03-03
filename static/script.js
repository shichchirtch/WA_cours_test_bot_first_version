document.addEventListener("DOMContentLoaded", function () {
    console.log("Скрипт загружен, начинаем выполнение...");

    // Ожидаем небольшую задержку, чтобы убедиться, что все элементы загружены
    setTimeout(() => {
        const decreaseBtn = document.querySelector("#decrease");
        const increaseBtn = document.querySelector("#increase");
        const quantitySpan = document.querySelector("#quantity");
        const priceElement = document.querySelector("#price");
        const addToCartBtn = document.querySelector("#add-to-cart");
        const confirmOrderBtn = document.querySelector("#confirm-order");


        if (!decreaseBtn || !increaseBtn || !quantitySpan || !priceElement || !addToCartBtn) {
            console.error("❌ Ошибка: Один из элементов не найден на странице!");
            return;
        }

        let pricePizzaElement = document.querySelector("#price");
        let basePrice = parseFloat(pricePizzaElement.getAttribute("data-price")); // Берём цену из HTM
        let quantity = 1;
        const BASE_URL = "https://4437-2a00-20-8-1dfb-c3-5496-c60c-67b1.ngrok-free.app";

        decreaseBtn.addEventListener("click", function () {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
                priceElement.textContent = (basePrice * quantity).toFixed(2) + "€";
            }
        });

        increaseBtn.addEventListener("click", function () {
            quantity++;
            quantitySpan.textContent = quantity;
            priceElement.textContent = (basePrice * quantity).toFixed(2) + "€"; // Округление до сотых
        });

        addToCartBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Предотвращает повторную отправку формы, если вдруг она есть

    if (addToCartBtn.disabled) return; // Если кнопка уже нажата, не выполняем код
    addToCartBtn.disabled = true;

    const pizzaId = addToCartBtn.getAttribute("data-pizza-id");
    if (!pizzaId) {
        console.error("❌ Ошибка: ID пиццы не найден!");
        alert("Ошибка: ID пиццы не найден!");
        addToCartBtn.disabled = false;
        return;
    }

    // console.log(`🍕 Добавляем пиццу (ID: ${pizzaId}, Кол-во: ${quantity}) в корзину...`);
    const pizzaName = addToCartBtn.getAttribute("data-name");
    const pizzaPrice = parseFloat(addToCartBtn.getAttribute("data-price"));

    function addToCart(pizzaName, pizzaPrice) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Загружаем корзину из localStorage
    let item = cart.find(p => p.name === pizzaName); // Ищем пиццу в корзине


    if (item) {
        item.quantity += 1; // Если уже есть, увеличиваем количество
    } else {
        cart.push({ name: pizzaName, quantity: 1, price:pizzaPrice }); // Иначе добавляем новый товар
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Сохраняем обратно в localStorage
    console.log("Корзина обновлена:", cart); // Проверяем в консоли
}
    console.log(`🍕 Добавляем пиццу (ID: ${pizzaId}, ${pizzaName}, ${pizzaPrice} €, ${quantity} шт.) в корзину...`);

    // Сохраняем в localStorage
    addToCart(pizzaName, pizzaPrice, quantity);  // [{'name': 'Маргарита', 'quantity': 1, 'price': 15}]

    alert("Добавлено в корзину! Открываю консоль...");
    fetch(`${BASE_URL}/add-to-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pizza_id: pizzaId, quantity: quantity, price:pizzaPrice })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("✅ Пицца добавлена в корзину!");
            setTimeout(() => window.location.href = "/cart", 500); // Добавляем задержку
        } else {
            console.error("❌ Ошибка сервера:", data.error);
            alert("Ошибка при добавлении в корзину!");
            addToCartBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error("❌ Ошибка сети:", error);
        alert("Ошибка сети при отправке запроса!");
        addToCartBtn.disabled = false;
    });
});


        // Подтверждение заказа
        if (confirmOrderBtn) {
            confirmOrderBtn.addEventListener("click", function () {
                fetch(`${BASE_URL}/confirm_order`, { method: "POST" })
                .then(response => {
                    if (response.ok) {
                        window.location.href = "/";  // Переход на главную
                    }
                });
            });
        }

        console.log("✅ Скрипт успешно загружен и готов к работе!");
    }, 500);  // Дадим 500мс на загрузку страницы
});




