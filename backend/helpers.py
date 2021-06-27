import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import smtplib


def send_email(subject, message_html, message_plain, dest_addr):
    # Variables setup
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = "myrecipes.supp@gmail.com"
    message["To"] = dest_addr

    message.attach(MIMEText(message_plain, "plain"))
    message.attach(MIMEText(message_html, "html"))

    ctxt = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctxt) as server:
            server.login("myrecipes.supp@gmail.com", "#%ep773^KpScAduTj^SM6U*Gnw")
            server.sendmail("myrecipes.supp@gmail.com", dest_addr, message.as_string())
    except:
        return 1
    return 0

