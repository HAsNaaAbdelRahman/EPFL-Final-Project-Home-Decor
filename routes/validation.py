from email_validator import validate_email , EmailNotValidError
import bcrypt

def email_validation(email):
    try:
        email_info = validate_email(email , check_deliverability=False)
        return [True , email_info.normalized]
    except EmailNotValidError as ex:
        return [False , str(ex)]

def check_password(password , hased_password):
    user_bytes = password.encode('utf-8')
    saved_password = hased_password.encode('utf-8')
    return bcrypt.checkpw(password , saved_password)
