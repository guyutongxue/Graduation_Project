from turtle import *

def draw_sierpinski(length, depth):
    if depth == 0:
        for i in range(0, 3):
            fd(length)
            left(120)
    else:
        draw_sierpinski(length / 2, depth - 1)
        fd(length / 2)
        draw_sierpinski(length / 2, depth - 1)
        bk(length / 2)
        left(60)
        fd(length / 2)
        right(60)
        draw_sierpinski(length / 2, depth - 1)
        left(60)
        bk(length / 2)
        right(60)

bgcolor("yellow")
penup()
goto(-200, -175)
pendown()
draw_sierpinski(400, 6)
done()
