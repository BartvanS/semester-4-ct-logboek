void setup() {
  size(400, 400);
  stroke(255);
  background(0, 0, 255);
}
int lastX = 0;
int lastY = 0;
void draw() {
}
int strokes[] = {0, 122, 255};
int count = 0;
void mousePressed() {
  count++;
  if (lastX == 0 || lastY == 0) {
    lastX = mouseX;
    lastY = mouseY;
  }
  if (count >= 3) {
    count = 0;
  }
  stroke(strokes[count]);
  line(lastX, lastY, mouseX, mouseY);
  lastX = mouseX;
  lastY = mouseY;
}

void keyPressed() {
  background(0, 0, 255);
  lastX = 0;
  lastY = 0;
}
