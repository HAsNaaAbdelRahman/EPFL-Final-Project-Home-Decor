from flask import Flask, redirect, render_template, request, session, jsonify
from models.user import User
from routes.validation import email_validation, EmailNotValidError, check_password
import os
import json


def account(app):

    userDb_file = 'usersDB.json'

    def load_users():
        if os.path.exists(userDb_file):
            with open(userDb_file, 'r') as file:
                return json.load(file)
        return []

    def save_users(user_list):
        with open(userDb_file, 'w') as file:
            json.dump(user_list, file, indent=4)

    @app.route('/signup', methods=['GET', 'POST'])
    def signup():
        if request.method == 'POST':
            name = request.form.get('fullname')
            email = request.form.get('email')
            password = request.form.get('password')
            address = request.form.get('address')
            phone = request.form.get('phone')
            security_question = request.form.get('security_question')

            if not email or not password or not name:
                return render_template('signup.html', error='Please enter email, password, and username')

            email_valid = email_validation(email)
            if not email_valid[0]:
                return render_template('signup.html', error=email_valid[1])

            email = email_valid[1]

            userdb_path = 'usersDB.json'
            if os.path.exists(userdb_path):
                with open(userdb_path, 'r') as file:
                    userdb = json.load(file)
            else:
                userdb = []

            if any(user['email'] == email for user in userdb):
                return jsonify({"error": 'Email already exists! Please use a different email.'}), 400

            new_user = User(name, email, password,address, phone,security_question)
            hashed_password = new_user.hash_password()
            new_user.format_data(hashed_password)

            session['user'] = str(new_user.id)
            return jsonify({
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "address": new_user.address,
                "phone": new_user.phone
            }), 201
        
        return render_template('signup.html')

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            email = request.form.get('email')
            password = request.form.get('password')
            users_list = []
            with open('usersDB.json') as file:
                users_list = json.load(file)

            if not email or not password:
                return render_template('login.html', error='Please enter email and password') 
            
            email_valid = email_validation(email)
            if not email_valid[0]:
                return render_template('login.html', error=email_valid[1])
                    
            email = email_valid[1]

            for user in users_list:
                if email == user["email"] and check_password(password, user["password"]):
                    session['user'] = user["id"]

                    return jsonify({
                        "id": user["id"],
                        "name": user["name"],
                        "email": user["email"],
                        "address": user["address"],
                        "phone": user["phone"]
                    })

            return render_template('login.html', error='Invalid email or password')
        else:
            if session.get('user'):
                return redirect('/home')

            return render_template('login.html')

    @app.route('/logout')
    def logout():
        session.clear()
        return redirect('/home')