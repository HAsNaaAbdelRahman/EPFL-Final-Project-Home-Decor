from flask import Flask , redirect , render_template


app = Flask(__name__)
@app.route('/')
def home():
    return render_template("home_decor.html")
