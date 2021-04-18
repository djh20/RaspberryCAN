# This script adds a shutdown button to a Raspberry Pi.
# It should be added as a service and enabled.

# !/bin/python

import RPi.GPIO as GPIO
import os

pin = 21

GPIO.setmode(GPIO.BCM) # uses the gpio pin system
GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

try:
  GPIO.wait_for_edge(pin, GPIO.RISING) # can also be FALLING
  os.system("sudo shutdown -h now") # shutdown the pi
except:
  pass