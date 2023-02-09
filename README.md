# How I  Located the closest Hidden Areas to a random point 🧠🤯 

![task](https://user-images.githubusercontent.com/59293857/217959014-66b20c4d-a63a-4a9b-8540-daabced427a0.png)

The center of a rectangle is the point that is equidistant from all four corners of the rectangle. 
In this case, the rectangle is represented by two points (x1, y1) and (x2, y2). 
To calculate the center of the rectangle, you find the midpoint between x1 and x2 and the midpoint between y1 and y2:

```
const centerX = (x1 + x2) / 2;
const centerY = (y1 + y2) / 2;
```


The distance between two points (x1, y1) and (x2, y2) can be calculated using the Pythagorean theorem. 
The theorem states that the distance between two points in a two-dimensional plane is given by the square root of the sum of the squares of the differences of the x-coordinates and the y-coordinates of the points:

javascript
```
const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
```

So in the case of the locatePoint function, we use the formula above to calculate the distance between the point and the center of each shape. By finding the shape with the minimum distance, we determine the closest shape to the point.



