# How I  Located the closest Hidden Areas to a random point 🧠🤯 



The center of a rectangle is the point that is equidistant from all four corners of the rectangle. 
In this case, the rectangle is represented by two points (x1, y1) and (x2, y2). 
To calculate the center of the rectangle, you find the midpoint between x1 and x2 and the midpoint between y1 and y2:


```javascript
const centerX = (x1 + x2) / 2;
const centerY = (y1 + y2) / 2;
```


The distance between two points (x1, y1) and (x2, y2) can be calculated using the Pythagorean theorem. 
The theorem states that the distance between two points in a two-dimensional plane is given by the square root of the sum of the squares of the differences of the x-coordinates and the y-coordinates of the points:


```javascript
const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
```

So in the case of the locatePoint function, we use the formula above to calculate the distance between the point and the center of each shape. By finding the shape with the minimum distance, we determine the closest shape to the point.



```typescript
function locatePoint(x: number, y: number, shapes: Shape[]): Shape | null {
  let closestShape: Shape | null = null;
  let closestDistance = Infinity;

  for (const shape of shapes) {
    if (x >= shape.x1 && x <= shape.x2 && y >= shape.y1 && y <= shape.y2) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distance < closestDistance) {
        closestShape = shape;
        closestDistance = distance;
      }
    }
  }

  return closestShape;
}
```
