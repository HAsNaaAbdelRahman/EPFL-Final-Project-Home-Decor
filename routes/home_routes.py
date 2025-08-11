from flask import render_template, session, redirect
import json

def home_route(app):
    @app.route('/')
    @app.route('/home')
    def home():
        with open('usersDB.json') as file:
            users_list = json.load(file)            
            if users_list:
                user = users_list[0]  
                return render_template('Home.html', user=user)  
        
            else:
                return render_template('Home.html', user=None)