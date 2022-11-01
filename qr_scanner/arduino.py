from pyzbar.pyzbar import decode
import cv2
import serial
import time



arduino = serial.Serial(port='COM6', baudrate=115200, timeout=1)


cap = cv2.VideoCapture(0)

def write_read(x):
    arduino.write(bytes(x, 'utf-8'))
    time.sleep(0.05)
    data = arduino.readline()
    return data


def get_qr_data(input_frame):
    try:
        return decode(input_frame)
    except:
        return []

while True:
    _, frame = cap.read()
    qr_obj = get_qr_data(frame)
    try:
        data = qr_obj[0].data
        angle = qr_obj[0].orientation
        print(data)
        print(angle)
    except IndexError:
        pass
        cv2.imshow("DD", frame)

    if qr_obj == get_qr_data(frame):
        arduino.write(b'O')

    if cv2.waitKey(1) & 0xFF == ord('q'):

        break


cap.release()
cv2.destroyAllWindows()
