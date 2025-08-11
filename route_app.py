from flask import Flask , redirect , render_template
from routes.home import home_page


app = Flask(__name__)
home_page(app)

if __name__ == "__main__":
    app.run(debug=True)

