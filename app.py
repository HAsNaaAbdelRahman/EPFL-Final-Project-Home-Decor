from flask import Flask , redirect , render_template , request
from routes.home_routes import home_route
app = Flask(__name__)


home_route(app)

if __name__ == "__main__":
    app.run(debug="True")

