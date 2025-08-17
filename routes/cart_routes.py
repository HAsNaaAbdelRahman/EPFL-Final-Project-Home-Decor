from flask import Flask, redirect, render_template, request, session, json, jsonify
import os
# This file contains the routes for the shopping cart functionality in a Flask application.
def cart(app):
    
    @app.route('/cart')
    def cart_page():
        return render_template('cart.html')

    @app.route('/get_cart_items', methods=['GET'])
    def get_cart_items():
        if not session.get('user_id'):
            return jsonify({"cart": [], "subtotal": 0})

        user_id = session.get('user_id')
        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            user = next((u for u in users_list if u['id'] == user_id), None)
            if not user or 'cart' not in user:
                return jsonify({"cart": [], "subtotal": 0})

            product_db_path = os.path.join(os.path.dirname(__file__), '..', 'DB', 'productDB.json')
            with open(product_db_path, 'r') as file:
                products_db = {str(p['id']): p for p in json.load(file)}

            cart_items = []
            for product_id, quantity in user['cart'].items():
                product = products_db.get(str(product_id))
                if product:
                    price = float(str(product['price']).replace('$', '').replace(',', ''))
                    cart_items.append({
                        'id': product_id,
                        'name': product['name'],
                        'price': price,
                        'quantity': quantity,
                        'thumbnail': product['image']
                    })
            subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
            return jsonify({"cart": cart_items, "subtotal": subtotal})

        except Exception as e:
            return jsonify({"cart": [], "subtotal": 0})

    @app.route('/remove_from_cart', methods=['POST'])
    def remove_from_cart():
        if not session.get('user_id'):
            return jsonify({"success": False, "error": "You need to be logged in"}), 403

        user_id = session.get('user_id')
        product_id = str(request.json.get('product_id'))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if user['id'] == user_id and 'cart' in user:
                    user['cart'].pop(product_id, None)
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            return jsonify({"success": True, "message": "Product removed from cart!"})

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    @app.route('/update_cart_quantity', methods=['POST'])
    def update_cart_quantity():
        if not session.get('user_id'):
            return jsonify({"success": False, "error": "You need to be logged in"}), 403

        user_id = session.get('user_id')
        product_id = str(request.json.get('product_id'))
        quantity = int(request.json.get('quantity', 1))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if user['id'] == user_id and 'cart' in user:
                    if quantity > 0:
                        user['cart'][product_id] = quantity
                    else:
                        user['cart'].pop(product_id, None)
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            return jsonify({"success": True, "message": "Cart updated!"})

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500