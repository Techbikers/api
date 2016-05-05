def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'userId': user.id,
        'firstName': user.first_name,
        'lastName': user.last_name
    }