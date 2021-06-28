import ssl
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import smtplib


def send_email(subject, message_html, message_plain, dest_addr, banner_image_path):
    # Variables setup
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = "myrecipes.supp@gmail.com"
    message["To"] = dest_addr


    if banner_image_path is not None:
        message_html = f'<center><br><img src="{banner_image_path}", style="max-width: 80%; height: auto;"><br></center>\n' + message_html

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
            server.login("myrecipes.supp@gmail.com", "#%ep773^KpScAduTj^SM6U*Gnw")
            server.sendmail("myrecipes.supp@gmail.com", dest_addr, message.as_string())
    except:
        return 1
    return 0

