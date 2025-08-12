from flask import Flask, redirect, render_template, request, session, jsonify, flash
from models.user import User
import os
import json
import bcrypt

def password_op(app):
    userDb_file = 'usersDB.json'

    def load_users():
        if os.path.exists(userDb_file):
            with open(userDb_file, 'r') as file:
                return json.load(file)
        return []

    def save_users(user_list):
        with open(userDb_file, 'w') as file:
            json.dump(user_list, file, indent=4)

    @app.route('/forget', methods=['GET', 'POST'])
    def forget_password():
        if request.method == 'POST':
            email = request.form.get("email")
            userdb = load_users()

            for user in userdb:
                if user['email'] == email:
                    session['reset_email'] = email
                    return render_template('reset_password.html', email=email)

            return render_template('forget_password.html', error="Email not found")

        return render_template('forget_password.html')

    @app.route('/reset', methods=['POST'])
    def reset_password():
        new_password = request.form.get("new_password")
        confirm_password = request.form.get("confirm_password")

        if new_password != confirm_password:
            return render_template('reset_password.html', error="Passwords do not match")

        try:
            email = session.get('reset_email')

            if not email:
                flash('Session expired. Please try again.', 'error')
                return redirect('/forget')

            users = load_users()

            for user in users:
                if user['email'] == email:
                    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
                    user['password'] = hashed_password.decode('utf-8')
                    break

            save_users(users)

            session.pop('reset_email', None)

            flash('Password has been reset successfully!', 'success')
            return redirect('/login')

        except json.JSONDecodeError:
            flash('Error reading user database. Please contact support.', 'error')
        except IOError:
            flash('Error accessing user database. Please try again later.', 'error')
        except Exception as e:
            flash(f'An unexpected error occurred: {str(e)}', 'error')

        return redirect('/forget')
