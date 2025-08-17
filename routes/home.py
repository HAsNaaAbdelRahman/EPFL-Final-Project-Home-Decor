from flask import Flask , redirect , render_template,request

# This file contains the routes for the home page and other static pages in a Flask application.
def home_page(app):
    


    @app.route('/')
    def home():
        
        return render_template("home_decor.html")
    
    @app.route('/about')
    def about():
        return render_template("about.html")

