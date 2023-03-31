from turtle import *

color('', 'red')

def handle_click(x, y):
    goto(x, y)
    begin_fill()
    circle(10)
    end_fill()

onscreenclick(handle_click)

done()
