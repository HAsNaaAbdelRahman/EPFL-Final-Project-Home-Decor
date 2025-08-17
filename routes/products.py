from flask import Flask, jsonify, request ,render_template ,session
import json
import os



def product(app):
    @app.route('/products')
    def products_page():
        return render_template('products.html')  
    def get_products_data():
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(current_dir, '..', 'DB', 'productDB.json')
            
            with open(db_path, 'r') as file:
                products = json.load(file)
                
            return [{
                'id': product['id'],
                'name': product['name'],
                'type': product['type'],
                'price': float(product['price'].replace('$', '').replace(',', '')),
                'image': product['image']
            } for product in products]
            
        except Exception as e:
            print(f"Error loading products: {str(e)}")
            return None

    @app.route('/get_products', methods=['GET'])
    def get_products():
        category = request.args.get('type', 'all').lower()
        products = get_products_data()
        
        if products is None:
            return jsonify({"error": "Failed to load products"}), 500
            
        if category != 'all':
            products = [p for p in products if p['type'].lower() == category]
            
        return jsonify(products)
    @app.route('/add_to_cart', methods=['POST'])
    def add_to_cart():
        if not session.get('user_id'):
            return jsonify({"success": False, "error": "You need to be logged in"}), 403

        user_id = session.get('user_id')
        product_id = str(request.json.get('product_id'))
        quantity = int(request.json.get('quantity', 1))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if user['id'] == user_id:
                    if 'cart' not in user:
                        user['cart'] = {}
                    if product_id in user['cart']:
                        user['cart'][product_id] += quantity
                    else:
                        user['cart'][product_id] = quantity
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            return jsonify({"success": True, "message": "Product added to cart!"})

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500



