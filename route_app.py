from flask import Flask , redirect , render_template
from routes.home import home_page
from routes.account_routes import account_routes
from routes.password import password_op
from flask_session import Session



app = Flask(__name__)

app.secret_key = "supersecretkey"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)



home_page(app)
account_routes(app)
password_op(app)

if __name__ == "__main__":
    app.run(debug=True)


