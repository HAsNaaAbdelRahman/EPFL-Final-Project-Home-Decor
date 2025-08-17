from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from routes.validation import email_validation , validateFullName , validateAddress
import json
import bcrypt
from models.user import User
import uuid

def account_routes(app):
    
    def load_users():
        try:
            with open('usersDB.json', 'r') as file:
                return json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save_users(users):
        with open('usersDB.json', 'w') as file:
            json.dump(users, file, indent=4)

    # Context processor to inject the current user into templates        
    @app.context_processor
    def inject_user():
        users_list = load_users()
        user_id = session.get('user_id')
        current_user = None

        if user_id:
            current_user = next((u for u in users_list if u['id'] == user_id), None)

        return dict(current_user=current_user)
    # Route for the login page
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'GET':
            return render_template('login.html')
        
        try:
            if request.is_json:
                data = request.get_json()
            else:
                data = request.form
            
            email = data.get('email', '').strip()
            password = data.get('password', '')
            
            print(f"Login attempt - Email: {email}")
            
            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400
         

            email_valid = email_validation(email)
            if not email_valid[0]:
                    return render_template('login.html', error=email_valid[1])

            email = email_valid[1]

            
            users = load_users()
            user = next((u for u in users if u['email'] == email), None)
            
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                session.permanent = False  
                session['user_id'] = user['id']

                print(f"Login successful for user: {user['email']}") 
                return jsonify({
                    'success': True,
                    'user': {
                        'id': user['id'],
                        'name': user['name'],
                        'email': user['email'],
                        'address': user['address'],
                        'phone': user['phone']
                    }
                })
            else:
                return jsonify({'error': 'Invalid email or password'}), 401
                
        except Exception as e:
            app.logger.error(f"Error in login route: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500

# Route for the signup page
    @app.route('/signup', methods=['GET', 'POST'])
    def signup():
        if request.method == 'POST':

            data = request.get_json() if request.is_json else request.form
            print("Received signup data:", data)

            name = data.get('fullname')
            email = data.get('email')
            password = data.get('password')
            address = data.get('address')
            phone = data.get('phone')
            security_question = data.get('security_question')

            # Validation
            if not all([name, email, password, address, phone, security_question]):
                return jsonify({'error': 'All fields are required'}), 400
            if not validateFullName(name):
                return jsonify({'error': 'Invalid full name'}), 400
            if not validateAddress(address):
                return jsonify({'error': 'Invalid address'}), 400
            if len(phone) != 11:
                return jsonify({'error': 'Phone number must be 11 digits'}), 400
            if len(password) < 6:
                return jsonify({'error': 'Password must be at least 6 characters'}), 400

            email_valid = email_validation(email)
            print("Email validation result:", email_validation(email))

            if not email_valid[0]:
                return jsonify({'error': email_valid[1]}), 400
            email = email_valid[1]

            users = load_users()
            if any(u['email'] == email for u in users):
                return jsonify({'error': 'Email already exists'}), 400

            new_user = User(name, email, password, address, phone, security_question)
            hashed_password = new_user.hash_password()
            new_user.format_data(hashed_password)


            users.append(new_user.__dict__)
            save_users(users)

            return jsonify({
                'id': new_user.id,
                'name': new_user.name,
                'email': new_user.email,
                'phone': new_user.phone,
                'message': 'Registration successful'
            }), 201

        return render_template('signup.html')

    # Route for the profile page
    
    @app.route('/profile' , methods=['GET'])
    def profile():
        try:
            user_id = session.get('user_id')
            if not user_id:
                return redirect(url_for('login'))

            users_list = load_users()
            current_user = next((user for user in users_list if user['id'] == user_id), None)
                
            if current_user:
                return render_template('profile.html', user=current_user)
            else:
                return render_template('profile.html', error='User not found')

        except Exception as e:
            app.logger.error(f"Error in profile route: {str(e)}")
            return render_template('profile.html', error='An error occurred'), 500

    @app.route('/logout')
    def logout():
        session.pop('user_id', None)    
        session.clear() 
        return redirect(url_for('home'))
