import cv2
from pyzbar import pyzbar
 
vid = cv2.VideoCapture(0)
detector = cv2.QRCodeDetector()
 
 
def catch_qr_occurence(frame):
    barcodes = pyzbar.decode(frame)[0]
    print(barcodes)
    print(barcodes.data)
    data_keys = ['student_id', 'student_lectures','student_firstname','student_lastname','absences']
    student_data = dict()
    for index,val in enumerate(data_keys):
        if val in barcodes.data:
            student_data[val] = barcodes.data.split(" ")[index]
    return student_data
 
while True:
    ret, frame = vid.read()
    data, bbox, straight_qrcode = detector.detectAndDecode(frame)
    stud_data = None
    if len(data) > 0:
        stud_data = catch_qr_occurence(frame)
    
    if stud_data is not None:
        print(f"Student found: ${stud_data}")
        # to-do: send to db
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break