import os
import qrcode

img = qrcode.make("test")

img.save("qr.png", "PNG")
