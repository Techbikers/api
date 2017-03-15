# Get the email address from the Auth0 payload and
# return this to identify the user by
def get_auth0_username_handler(payload):
    username = payload.get('email')
    return username
