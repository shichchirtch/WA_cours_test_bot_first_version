from flask import Flask, render_template, url_for,  request, redirect, jsonify

app = Flask(__name__)

# Данные о пиццах
pizzas = [
    {"id": 1, "name": "Маргарита", "image": "margherita.png", "description": "Томатный соус, моцарелла, базилик."},
    {"id": 2, "name": "Пепперони", "image": "pepperoni.png", "description": "Томатный соус, моцарелла, пепперони."},
    {"id": 3, "name": "Четыре сыра", "image": "four_cheese.png", "description": "Моцарелла, пармезан, горгонзола, эмменталь."},
    {"id": 4, "name": "Гавайская", "image": "hawaiian.png", "description": "Томатный соус, моцарелла, ананасы, ветчина."},
]

cart = []  # Корзина


@app.route("/")
def index():
    return render_template("index.html", pizzas=pizzas)


@app.route("/pizza/<int:pizza_id>")
def pizza_detail(pizza_id):
    pizza = next((p for p in pizzas if p["id"] == pizza_id), None)
    if pizza:
        return render_template("pizza.html", pizza=pizza)
    return "Пицца не найдена", 404

@app.route("/cart", methods=["GET", "POST"])
def cart_page():
    print('We are here')
    print('request.method = ', request.method)
    print('request.headers =', request.headers)

    if request.method == "POST":
        data = request.get_json()
        address = data.get("address")
        phone = data.get("phone")
        payment = data.get("payment")

        if not address or not phone:
            return jsonify({"success": False, "error": "Заполните все поля!"}), 400

        print(f"Заказ оформлен! Адрес: {address}, Телефон: {phone}, Оплата: {payment}")

        cart.clear()
        return jsonify({"success": True})

    print(cart, type(cart))
    # 🔥 Подсчет итоговой суммы в Python
    total_price = sum(item["quantity"] * 15 for item in cart)

    return render_template("cart.html", cart=cart, total_price=total_price)
    # return render_template("cart.html", cart=cart)


@app.route("/add-to-cart", methods=["POST"])
def add_to_cart():
    print('\nfunc add-to-cart')
    data = request.get_json()
    pizza_id = data.get("pizza_id")
    quantity = data.get("quantity")
    print('data =', data)

    if not pizza_id or quantity is None:
        return jsonify(success=False, error="Некорректные данные"), 400

    pizza = next((p for p in pizzas if p["id"] == int(pizza_id)), None)
    if pizza:
        existing_pizza = next((item for item in cart if item["pizza_id"] == pizza_id), None)
        if existing_pizza:
            existing_pizza["quantity"] += quantity  # Увеличиваем количество, если пицца уже в корзине
        else:
            cart.append({"pizza_id": pizza_id, "name": pizza["name"], "quantity": quantity})

        return jsonify(success=True)

    return jsonify(success=False, error="Пицца не найдена"), 404

@app.route("/reset-cart", methods=["POST"])
def reset_cart():
    """Очищает корзину и перенаправляет пользователя на главную страницу."""
    cart.clear()
    return jsonify(success=True)
