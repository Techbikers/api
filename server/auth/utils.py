import urllib
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend

def get_auth0_public_key(cert_url):
    """
    Using the URL for a public certificate, create the RSA certificate object
    and return the public key
    """

    cert_file = urllib.urlopen(cert_url)
    cert_obj = load_pem_x509_certificate(cert_file.read(), default_backend())

    return cert_obj.public_key()
