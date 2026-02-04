import base64

def encode_data(data):
    return base64.b64encode(data).decode()

def decode_data(data):
    return base64.b64decode(data.encode())
