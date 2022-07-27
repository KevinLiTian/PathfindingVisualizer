# Pathfinding Visualizer

This is a visualization tool for common **Pathfinding Algorithms**, built using HTML, CSS (Sass) and JavaScript

- Visit [HERE](https://kevinlitian.github.io/PathfindingVisualizer/)

## Inspiration

The idea of path finding is to obtain the shortest route between two points. The first time knowing this idea is during my University's software course, where I built a [Mapper](https://github.com/KevinLiTian/Mapper) similar to Google Maps. In the Mapper application, an important feature was navigation, which requires pathfinding by using intersections as nodes and streets as edges

Moreover, I am a League of Legends player, and I got to know that when I'm clicking on the map or on the mini-map, the routes my champion take are also based on Pathfinding Algorithms, maybe even the same ones I used in the Mapper application! I became interested in Pathfinding Algorithms since then

## Pathfinding Algorithms

|         Algorithm          |                                 Description                                 | Guarantee Shortest Path | Support Weighted Path |
| :------------------------: | :-------------------------------------------------------------------------: | :---------------------: | :-------------------: |
|  Depth-First Search (DFS)  |         Exhausts each one direction before trying another direction         |           NO            |          NO           |
| Breadth-First Search (BFS) |                 Follow multiple directions at the same time                 |           YES           |          NO           |
|  Greedy Best-First Search  | At any time, choose the state that is closest to the goal as the next state |           NO            |          YES          |
|    Dijkstra's Algorithm    |                 Follow multiple directions at the same time                 |           YES           |          YES          |
|       A\* Algorithm        |              Search mainly in the direction of the destination              |  YES (Good Heuristic)   |          YES          |

## Contact ME

Feel free to contact me through my emails kevintian.li@mail.utoronto.ca or kevin.li20021106@gmail.com if you have any questions
