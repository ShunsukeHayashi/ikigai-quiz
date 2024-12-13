import qrcode

# URL to encode
url = "https://ikigai-quiz.onrender.com/"

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Create an image of the QR code
img = qr.make_image(fill_color="black", back_color="white")
img.save("ikigai_quiz_qr.png")

print("QR Code generated and saved as 'ikigai_quiz_qr.png'")
