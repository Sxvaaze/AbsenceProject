import cv2
from pyzbar import pyzbar

"""
image = cv2.imread("chart.png")
barcodes = pyzbar.decode(image)[0]
print(barcodes.data)
"""


"""
vid = cv2.VideoCapture(0)
detector = cv2.QRCodeDetector()
counter = 0
image = cv2.imread("e.png")
data, bbox, straight_qrcode = detector.detectAndDecode(image)
print(data)

while True:
    # Λήψη ροής εικόνα κατά εικόνα
    ret, frame = vid.read()
    if not ret:
        break
    data, bbox, straight_qrcode = detector.detectAndDecode(frame)

    # Αν βρέθηκε qr στη ροή
    if len(data) > 0:
        cv2.imwrite(f"image_{counter}.jpg", frame)
        counter += 1

    # Εμφάνισε την εικόνα
    cv2.imshow('frame', frame)

    # Πατώντας το πλήκτρο 'q', μπορούμε
    # να σπάσουμε τον ατέρμονα βρόγχο
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
"""
