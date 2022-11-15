import cv2
from pyzbar import pyzbar
import requests
import datetime
 
vid = cv2.VideoCapture(0)
detector = cv2.QRCodeDetector()

host_name = "localhost:4192/api/"
is_open = False

# Code to execute when a qr is detected from the stream
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
    qrdata, bbox, straight_qrcode = detector.detectAndDecode(frame)
    data = None
    if len(qrdata) > 0:
        data = catch_qr_occurence(frame)
    
    # QR Data
    flags = dict()
    if data is not None:
        # Save all args from qr data (e.g: b'student_id=13&student_name=George&')
        for arg in data.split("&"):
            arg_split = arg.split("=")
            if arg_split[0] in flags:
                flags[arg_split[0]] = arg_split[1]
        if 'grades' in flags.keys():
            if not is_open:
                requests.get(host_name + f"createLecture?lecture_title={flags['lecture_title']}&lecture_teacher={flags['lecture_teacher']}&lecture_students={flags['lecture_students']}&lecture_date={datetime.datetime.now()}&mode=open")
            else:
                requests.get(host_name + "concludeLecture")
            is_open = not is_open
        else:
            if is_open and 'student_id' in flags.keys():
                requests.get(host_name + f"/appendStudent?student_id={flags['student_id']}")
        if 'truncate' in flags.keys():
            requests.get(host_name + f"truncate{flags['truncate'].capitalize()}")
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break