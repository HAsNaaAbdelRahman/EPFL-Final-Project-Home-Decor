from flask import Flask , redirect , render_template,request

def home_page(app):


    @app.route('/')
    def home():
        return render_template("home_decor.html")
    


