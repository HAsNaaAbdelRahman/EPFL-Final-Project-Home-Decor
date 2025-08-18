# EPFL-Final-Project

# Home Decor 
Home Decor is a simple and user-friendly online furniture store that allows users to explore a collection of stylish home decor items. The main goal of this project is to provide a clean and responsive interface

##  Key Features  

- **User Authentication**  
  Users can **sign up, log in, and log out**. Passwords are stored securely using **bcrypt hashing**.  

- **Password Hashing**  
  All user passwords are encrypted with **bcrypt** before being saved, ensuring strong security.  

- **JSON File Storage**  
  Instead of a database, all data (users, carts, and orders) is managed using **JSON files** for persistence.  

- **Shopping Cart Protection**  
  A user **must be signed up and logged in** before they can add products to the cart.  

- **Profile Management**  
  Each user has a profile page to view personal data, saved orders, and cart history.  

- **Order System**  
  Users can checkout, place orders, and view past order history.  



## Prerequisites 
To run this project, you need to install the following Python modules:  

- `Flask` → Web framework for building the application.  
- `bcrypt` → Secure password hashing.  
- `json` → Reading and writing data to JSON files.  
- `jinja2` → Templating engine for rendering HTML pages.  
- `email-validator` → Validating user email addresses.  

### Install dependencies:  

```bash
pip install flask bcrypt email-validator
```

- [x] It is available on GitHub.  
- [x] It uses the **Flask web framework**.  
- [x] It uses at least one module from the Python Standard Library other than `random`.  
  - **Module name:** `json`, `uuid`, `os`, `datetime`, `re`  
- [x] It contains at least one class written by me with properties and methods.  
  - **File name:** `models/user.py`  
  - **Line number(s):** Line 3 (class `User`)  
  - **Two properties:** `self.name`, `self.email`  
  - **Two methods:** `hash_password()`, `format_data()`  
  - **Usage example:** In `routes/account_routes.py` (around line 150).  
- [x] It makes use of JavaScript in the front end and uses **localStorage**.  
- [x] It uses **modern JavaScript** (`let`, `const`).  
- [x] It makes use of reading and writing to the same file (`usersDB.json`, `productDB.json`).  
- [x] It contains **conditional statements**.  
  - **File name:** `routes/account_routes.py`  
  - **Line number(s):** ~60 (`if not email or not password:`)  
- [x] It contains **loops**.  
  - **File name:** `routes/cart.py`  
  - **Line number(s):** ~40 (`for product_id, quantity in user['cart'].items():`)  
- [x] It lets the user enter a value in a text box.  
- [x] It processes user input in the backend (validates email, password, etc.).  
- [x] It handles wrong input gracefully without crashing.  
- [x] It is styled using **custom CSS**.  
- [x] Code is clean, commented, and without unused/experimental parts.  
- [x] No `print()` or `console.log()` for user feedback.  
- [x] All requirements are completed and pushed to GitHub.

## How to Run the Project

1. Clone the repository from GitHub.
2. Install the required dependencies using pip:
```bash
pip install Flask 
```
```bash
pip install Flask bcrypt
```
# Run the Flask application:
```bash
python route_app.py
```

4. Open your web browser and navigate to http://127.0.0.1:5000/ to access the application.


## Project Structure
# route_app.py: The main Flask application file.

# models/user.py: init class for user

# usersDB.json: JSON file used for storing user data.

# ProductDB.json: JSON file used for storing product data.

# templates/: Contains HTML templates for the front end.

# static/: Contains CSS and JavaScript files for styling and front-end functionality.


```bash
my_flask_app/
├── route_app.py              # Main Flask application file
├── models/
│   ├── user.py               # User model handling authentication & data storage
├── routes/                   # Contains route handlers
│   ├── account_routes.py     # Authentication-related routes
│   ├── cart_routes.py        # Cart management routes
│   ├── checkout_routes.py    # Checkout management routes
│   ├── home_routes.py        # Home page & general routes
│   ├── password_routes.py    # Password reset & update routes
│   ├── products_routes.py    # Product-related routes
│   ├── validation_routes.py  # Input validation routes
├── DB/                       # Folder for storing JSON data
│   ├── products.json         # Stores product data
├── templates/                # HTML templates for the frontend
├── static/                   # Contains CSS, JS, and images
│   ├── css/                  # Main stylesheet
│   ├── js/                   # Frontend JavaScript logic
│   └── images/               # Images used in the project
├── usersDB.json              # Stores user data
```
