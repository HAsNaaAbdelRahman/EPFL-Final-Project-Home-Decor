from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json
import bcrypt
from models.user import User
import uuid

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
            email = request.form['email']
            security_answer = request.form['security_question']
            
            users = load_users()
            user = next((u for u in users if u['email'] == email and u['security_question'].lower() == security_answer.lower()), None)
            
            if user:
                session['reset_email'] = email
                return redirect(url_for('reset_password'))
            else:
                return render_template('forget_password.html', error="Invalid email or security answer")
        
        return render_template('forget_password.html')

    @app.route('/reset', methods=['GET', 'POST'])
    def reset_password():
        if 'reset_email' not in session:
            return redirect(url_for('forget_password'))
        
        if request.method == 'POST':
            new_password = request.form['new_password']
            confirm_password = request.form['confirm_password']
            
            if new_password != confirm_password:
                return render_template('reset_password.html', error="Passwords do not match")
            
            users = load_users()
            for user in users:
                if user['email'] == session['reset_email']:
                    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                    user['password'] = hashed_password
                    break
            
            save_users(users)
            session.pop('reset_email', None)
            return redirect(url_for('login'))
        
        return render_template('reset_password.html')


