package mcg.maze;

import java.util.HashSet;
import java.util.concurrent.ThreadLocalRandom;

public class Maze {

   int sizeX;
   int sizeY;
   
   int NORTH = 1;
   int SOUTH = 2;
   int EAST = 4;
   int WEST = 8;
   
   private Cell[][] grid;
   
   HashSet<Cell> set = new HashSet<Cell>();
   
   public Maze() {
      this(3,3);
   }

   public Maze(int sizeX, int sizeY) {
      this.sizeX = sizeX;
      this.sizeY = sizeY;
      
      this.grid = generateGrid();
      generateMaze();
   }

   private Cell[][] generateGrid() {
      Cell[][] grid = new Cell[sizeX][sizeY];
      
      for (int y = 0; y < sizeY; y++) {
         for (int x = 0; x < sizeX; x++) {
            Cell cell = new Cell(x, y);
            grid[x][y] = cell;
         }
      }
      
      return grid;
   }
   
   private void generateMaze() {
      Cell[][] region = grid;
      split(region);
   }
   
   private void split(Cell[][] region) {
      Cell seedA = getRandomCell();
      Cell seedB = getRandomCell();
      
      set.add(seedA); set.add(seedB);
   }
   
   private Cell getCell(int x, int y) {
      return grid[x][y];
   }
   
   private Cell getRandomCell() {
      int x = ThreadLocalRandom.current().nextInt(0, sizeX);
      int y = ThreadLocalRandom.current().nextInt(0, sizeY);
      
      return grid[x][y];
   }
   
   protected class Cell {
      int x;
      int y;
      
      boolean borderNorth = false;
      boolean borderEast  = false;
      boolean borderWest  = false;
      boolean borderSouth = false;
      
      public Cell(int x, int y) {
         this.x = x;
         this.y = y;

         int borders = 0;
         
         if (x == 0) borders += WEST;
         if (y == 0) borders += NORTH;
         if (x == sizeX-1) borders += EAST;
         if (y == sizeY-1) borders += SOUTH;
         
         setBorders(borders);
      }
      
      public String whichBorders() {
         String borders;
         
         borders = (borderNorth ? "North" : "") + 
                   (borderSouth ? "South" : "") +
                   (borderEast  ? "East"  : "") +
                   (borderWest  ? "West"  : ""); 
         
         return borders;
      }
      
      public void setBorders(int borders) {
         borderNorth = (borders & NORTH) > 0;
         borderSouth = (borders & SOUTH) > 0;
         borderEast  = (borders & EAST)  > 0;
         borderWest  = (borders & WEST)  > 0;
      }

   }

   public static void main(String[] args) {
      Maze maze = new Maze();

// TODO implement
//      maze.print();
   }
}
