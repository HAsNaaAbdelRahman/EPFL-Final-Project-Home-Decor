from flask import Flask, render_template, request, redirect, url_for, session, jsonify
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
            
            users = load_users()
            user = next((u for u in users if u['email'] == email), None)
            
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                session['user_id'] = user['id']
                print(f"Login successful for user: {user['email']}") 
                return jsonify({
                    'success': True,
                    'user': {
                        'id': user['id'],
                        'name': user['name'],
                        'email': user['email']
                    }
                })
            else:
                print("Login failed - Invalid credentials") 
                return jsonify({'error': 'Invalid email or password'}), 401
                
        except Exception as e:
            print(f"Server error: {str(e)}")  
            return jsonify({'error': 'Internal server error'}), 500


    @app.route('/signup', methods=['GET', 'POST'])
    def signup():
        if request.method == 'POST':
            if request.is_json:
                data = request.get_json()
                name = data.get('fullname')
                email = data.get('email')
                password = data.get('password')
                address = data.get('address')
                phone = data.get('phone')
                security_question = data.get('security_question')
            else:
                name = request.form.get('fullname')
                email = request.form.get('email')
                password = request.form.get('password')
                address = request.form.get('address')
                phone = request.form.get('phone')
                security_question = request.form.get('security_question')
            
            users = load_users()
            if any(u['email'] == email for u in users):
                if request.is_json:
                    return jsonify({'error': 'Email already exists'}), 400
                else:
                    return render_template('signup.html', error="Email already exists")
            
            new_user = User(name, email, password, address, phone, security_question)
            hashed_password = new_user.hash_password()
            new_user.format_data(hashed_password)
            
            if request.is_json:
                return jsonify({
                    'id': new_user.id,
                    'name': new_user.name,
                    'email': new_user.email,
                    'phone': new_user.phone,
                    'message': 'Registration successful'
                }), 201
            else:
                return redirect(url_for('login'))
        
        return render_template('signup.html')
    
    @app.route('/profile' , methods = ['POST' , 'GET'])
    def profile():
        return render_template('profile.html')

    @app.route('/logout' , methods=['POST' , 'GET'])
    def logout():
        session.clear()
        if request.is_json:
            return jsonify({'message': 'Logged out successfully'})
        else:
            return redirect(url_for('home'))