import bcrypt
from email_validator import validate_email, EmailNotValidError 

# Function to validate email format
def email_validation(email):
    try:
        email_info = validate_email(email, check_deliverability=False)
        return [True, email_info.normalized]
    except EmailNotValidError as e:
        return [False, str(e)]

# Function to validate Password format
def check_password(password , hased_password):
    user_bytes = password.encode('utf-8')
    saved_password = hased_password.encode('utf-8')
    return bcrypt.checkpw(password , saved_password)
# Function to validate name format
def validateFullName(name):
    if name.strip() == '':
        return False
    if len(name) < 7:
        return False
    if any(char in name for char in '@#$%^&*()_+={}[]|\\;:\'",<>?`~'):
        return False
    return True
# Function to validate address format
def validateAddress(address):
    if address.strip() == '':
        return False
    if len(address) < 3:
        return False
    if any(char in address for char in '@#$%^&*()_+={}[]|\\;:\'",<>?`~'):
        return False
    
    return True