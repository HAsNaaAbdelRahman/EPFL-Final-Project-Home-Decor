from flask import Flask , redirect , render_template
from routes.home_routes import home_page
from routes.account_routes import account_routes
from routes.password_routes import password_op
from routes.products_routes import product
from routes.cart_routes import cart
from routes.checkout_routes import checkout

app = Flask(__name__)

app.secret_key = "supersecretkey"
app.config['SESSION_PERMANENT'] = False



home_page(app)
account_routes(app)
password_op(app)
product(app)
cart(app)
checkout(app)


if __name__ == "__main__":
    app.run(debug=True)


