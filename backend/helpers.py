"""
This file contains helper functions used across the backend.
"""

import hashlib
import mimetypes
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import pymysql
from PIL import Image


def send_email(subject, message_html, message_plain, dest_addr,
               banner_image_path):
    '''
    Sends an email to dest_addr with contents specified by subject,
    message_html, message_plain, banner_image_path.
    :param subject: The subject of the email
    :param message_html: The message in HTML
    :param message_plain: The message in plaintext
    :param dest_addr: The destination email address
    :param banner_image_path: The path to the image containing the banner
    :returns: 0 on success. 1 on failure.
    '''
    # Variables setup
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = "myrecipes.supp@gmail.com"
    message["To"] = dest_addr

    if banner_image_path is not None:
        message_html = f'<center><br><img src="{banner_image_path}", ' \
                       f'style="max-width: 80%; height: ' \
                       f'auto;"><br></center>\n' + message_html

    message.attach(MIMEText(message_plain, "plain"))
    message.attach(MIMEText(message_html, "html"))

    # file = open(banner_image_path, 'rb')
    # image = MIMEImage(file.read())
    # file.close()
    #
    # image.add_header('Content-ID', '<image0>')
    # message.attach(image)

    ctxt = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctxt) as server:
            server.login("myrecipes.supp@gmail.com",
                         "#%ep773^KpScAduTj^SM6U*Gnw")
            server.sendmail("myrecipes.supp@gmail.com", dest_addr,
                            message.as_string())
    except:
        return 1
    return 0


def store_image(image_file):
    '''
    Stores the image given by image_file.
    :param image_file: The image file
    :returns: file name of the image stored.
    '''
    file_name = hashlib.sha1(image_file.read()).hexdigest()
    extension = mimetypes.guess_extension(image_file.mimetype) or ''
    file_name = file_name + extension
    img = Image.open(image_file)
    out_path = f'./static/server_resources/images/{file_name}'
    img.save(out_path)
    return file_name


def get_db_conn():
    '''
    Gets a new database connection. This connection should be closed after use.
    :returns: A connection to the database.
    '''
    return pymysql.connect(host='localhost',
                           user='myrecipes',
                           password='g3iCv7sr!',
                           db='myrecipes',
                           cursorclass=pymysql.cursors.DictCursor)
