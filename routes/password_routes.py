from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json
import bcrypt
from models.user import User
import uuid

# This file contains the routes for password management functionality in a Flask application.
def password_op(app):

    
    def load_users():
        try:
            with open('usersDB.json', 'r') as file:
                return json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save_users(users):
        with open('usersDB.json', 'w') as file:
            json.dump(users, file, indent=4)
   


    @app.route('/forget', methods=['GET', 'POST'])
    def forget_password():
        if request.method == 'POST':
            try:
                data = request.get_json(force=True)  
            except:
                return jsonify({"success": False, "error": "Invalid JSON data"}), 400

            email = data.get('email', '').strip().lower()
            security_answer = data.get('security_question', '').strip().lower()

            users = load_users()
            user = next(
                (u for u in users if u['email'].lower() == email 
                and u['security_question'].lower() == security_answer),
                None
            )

            if user:
                session['reset_email'] = email
                return jsonify({"success": True, "redirect": url_for('reset_password')})
            else:
                return jsonify({"success": False, "error": "Invalid email or security answer"})

        return render_template('forget_password.html')



  

    @app.route('/reset', methods=['GET', 'POST'])
    def reset_password():
        if 'reset_email' not in session:
            return redirect(url_for('forget_password'))

        if request.method == 'POST':
            new_password = request.form.get('new_password', '').strip()
            confirm_password = request.form.get('confirm_password', '').strip()

            if not new_password or not confirm_password:
                error = "All fields are required"
            elif new_password != confirm_password:
                error = "Passwords do not match"
            elif len(new_password) < 6 or not any(char.isdigit() for char in new_password) or not any(char.isalpha() for char in new_password) or not any(char in '~`@#$%^*+=<>?/\\|' for char in new_password):
                return jsonify({'error': 'Password must be at least 6 characters,  at least one  uppercase, one lowercase, one digit, and one special character.'}), 400

            else:
                users = load_users()
                for user in users:
                    if user['email'].lower() == session['reset_email'].lower():
                        hashed_password = bcrypt.hashpw(
                            new_password.encode('utf-8'),
                            bcrypt.gensalt()
                        ).decode('utf-8')
                        user['password'] = hashed_password
                        break
                save_users(users)
                session.pop('reset_email', None)

                if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                    return jsonify({"success": True, "redirect": url_for('login')})
                return redirect(url_for('login'))

            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return jsonify({"success": False, "error": error})
            return render_template('reset_password.html', error=error)

        return render_template('reset_password.html')
