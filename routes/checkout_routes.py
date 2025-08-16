from flask import render_template, request, session, jsonify
from datetime import datetime
import json

def checkout(app):
    def generate_order_id():
        return f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    @app.route('/checkout', methods=['GET'])
    def checkout_page():
        return render_template('checkout.html')

    @app.route('/save_order', methods=['POST'])
    def place_order():
        if not session.get('user_id'):
            return jsonify({"error": "You need to be logged in"}), 403

        user_id = session.get('user_id')
        order_data = request.json
        order_data['order_date'] = datetime.now().isoformat()
        order_data['order_id'] = generate_order_id()

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if str(user['id']) == str(user_id):
                    if 'orders' not in user:
                        user['orders'] = []
                    user['orders'].append(order_data)
                    user['cart'] = {}
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            return jsonify({"success": True, "message": "Order placed successfully"})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)})

    @app.route('/get_orders', methods=['GET'])
    def get_orders():
        if not session.get('user_id'):
            return jsonify({"success": False, "error": "User not logged in"}), 403

        user_id = session.get('user_id')

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            user = next((user for user in users_list if user['id'] == user_id), None)

            if user:
                return jsonify({"success": True, "orders": user.get('orders', [])})
            else:
                return jsonify({"success": False, "error": "User not found"}), 404

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
            return jsonify({"success": False, "error": str(e)}), 500