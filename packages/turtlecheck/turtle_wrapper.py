import __turtle__ as turtle
import threading

forward = turtle.forward
fd = turtle.fd
backward = turtle.backward
bk = turtle.bk
back = turtle.back
right = turtle.right
rt = turtle.rt
left = turtle.left
lt = turtle.lt
goto = turtle.goto
setpos = turtle.setpos
setposition = turtle.setposition
setx = turtle.setx
sety = turtle.sety
setheading = turtle.setheading
seth = turtle.seth
home = turtle.home
circle = turtle.circle
dot = turtle.dot
stamp = turtle.stamp
clearstamp = turtle.clearstamp
clearstamps = turtle.clearstamps
undo = turtle.undo
# speed = turtle.speed
position = turtle.position
pos = turtle.pos
towards = turtle.towards
xcor = turtle.xcor
ycor = turtle.ycor
heading = turtle.heading
distance = turtle.distance
degrees = turtle.degrees
radians = turtle.radians
pendown = turtle.pendown
pd = turtle.pd
down = turtle.down
penup = turtle.penup
pu = turtle.pu
up = turtle.up
pensize = turtle.pensize
width = turtle.width
pen = turtle.pen
isdown = turtle.isdown
color = turtle.color
pencolor = turtle.pencolor
fillcolor = turtle.fillcolor
filling = turtle.filling
begin_fill = turtle.begin_fill
end_fill = turtle.end_fill
reset = turtle.reset
clear = turtle.clear
write = turtle.write
showturtle = turtle.showturtle
st = turtle.st
hideturtle = turtle.hideturtle
ht = turtle.ht
isvisible = turtle.isvisible
shape = turtle.shape
resizemode = turtle.resizemode
shapesize = turtle.shapesize
turtlesize = turtle.turtlesize
shearfactor = turtle.shearfactor
settiltangle = turtle.settiltangle
tiltangle = turtle.tiltangle
tilt = turtle.tilt
shapetransform = turtle.shapetransform
get_shapepoly = turtle.get_shapepoly
onclick = turtle.onclick
onrelease = turtle.onrelease
ondrag = turtle.ondrag
begin_poly = turtle.begin_poly
end_poly = turtle.end_poly
get_poly = turtle.get_poly
clone = turtle.clone
getturtle = turtle.getturtle
getpen = turtle.getpen
getscreen = turtle.getscreen
setundobuffer = turtle.setundobuffer
undobufferentries = turtle.undobufferentries
bgcolor = turtle.bgcolor
bgpic = turtle.bgpic
clearscreen = turtle.clearscreen
resetscreen = turtle.resetscreen
screensize = turtle.screensize
setworldcoordinates = turtle.setworldcoordinates
delay = turtle.delay
# tracer = turtle.tracer
# update = turtle.update
listen = turtle.listen
onkey = turtle.onkey
onkeyrelease = turtle.onkeyrelease
onkeypress = turtle.onkeypress
# onclick = turtle.onclick
onscreenclick = turtle.onscreenclick
ontimer = turtle.ontimer
mainloop = turtle.mainloop
# done = turtle.done
mode = turtle.mode
colormode = turtle.colormode
# getcanvas = turtle.getcanvas
getshapes = turtle.getshapes
register_shape = turtle.register_shape
addshape = turtle.addshape
turtles = turtle.turtles
window_height = turtle.window_height
window_width = turtle.window_width
textinput = turtle.textinput
numinput = turtle.numinput
bye = turtle.bye
# exitonclick = turtle.exitonclick
setup = turtle.setup
title = turtle.title

turtle.tracer(0, 0)
turtle.speed(0)

def _save_image(path: str):
    turtle.getcanvas().postscript(file=path)

def done():
    turtle.update()
    _save_image("turtle.eps")
    # turtle.done()
