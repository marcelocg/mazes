package mcg.maze;

import java.util.ArrayList;
import java.util.Collection;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

public class Maze {

  int sizeX;
  int sizeY;

  static int NORTH = 1;
  static int SOUTH = 2;
  static int EAST = 4;
  static int WEST = 8;

  static int A = 1;
  static int B = 2;

  private ArrayList<Cell> grid;

  ArrayList<Cell> set = new ArrayList<Cell>();

  public Maze() {
    this(3, 3);
  }

  public Maze(int sizeX, int sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.grid = generateGrid();
    generateMaze();
  }

  private ArrayList<Cell> generateGrid() {
    ArrayList<Cell> grid = new ArrayList<Cell>();

    for (int y = 0; y < sizeY; y++) {
      for (int x = 0; x < sizeX; x++) {
        Cell cell = new Cell(x, y);
        grid.add(cell);
      }
    }

    return grid;
  }

  private void generateMaze() {
    ArrayList<Cell> region = grid;
    split(region);
  }

  private void split(ArrayList<Cell> region) {
    Cell seedA = getRandomCell();
    Cell seedB = getRandomCell();

    seedA.setRegion(A);
    seedB.setRegion(B);

    set.add(seedA);
    set.add(seedB);

    Cell currentCell = set.remove(ThreadLocalRandom.current().nextInt(0, set.size()));
    Collection<Cell> neghbors = currentCell.getNeighborhood().stream()
                                 .filter(c -> !c.isInRegion())
                                 .map(c -> 
                                   {
                                     c.setRegion(currentCell.getRegion());
                                     return c;
                                   })
                                 .collect(Collectors.toList());
    set.addAll(neghbors);
  }

  private Cell getCell(int x, int y) {
    return grid.stream().filter(c -> c.x == x && c.y == y).findFirst().get();
  }

  private Cell getRandomCell() {
    int x = ThreadLocalRandom.current().nextInt(0, sizeX);
    int y = ThreadLocalRandom.current().nextInt(0, sizeY);

    return getCell(x, y);
  }

  protected class Cell {
    int x;
    int y;

    int region = 0;

    boolean borderNorth = false;
    boolean borderSouth = false;
    boolean borderEast  = false;
    boolean borderWest  = false;

    public Cell(int x, int y) {
      this.x = x;
      this.y = y;

      int borders = 0;

      if (x == 0)
        borders += WEST;
      if (y == 0)
        borders += NORTH;
      if (x == sizeX - 1)
        borders += EAST;
      if (y == sizeY - 1)
        borders += SOUTH;

      setBorders(borders);
    }

    public boolean isInRegion() {
      return this.region != 0;
    }

    public boolean hasNorthNeighbor() {
      return this.y > 0;
    }
    public boolean hasSouthNeighbor() {
      return this.y < sizeY - 1;
    }
    public boolean hasEastNeighbor() {
      return this.x < sizeX - 1;
    }
    public boolean hasWestNeighbor() {
      return this.x > 0;
    }

    public Collection<Cell> getNeighborhood() {
      Collection<Cell> neighborhood = new ArrayList<Cell>();

      if (this.hasNorthNeighbor())
        neighborhood.add(this.getNorthNeighbor());
      if (this.hasSouthNeighbor())
        neighborhood.add(this.getSouthNeighbor());
      if (this.hasEastNeighbor())
        neighborhood.add(this.getEastNeighbor());
      if (this.hasWestNeighbor())
        neighborhood.add(this.getWestNeighbor());
      
      return neighborhood;
    }

    public Cell getNorthNeighbor() {
      return getCell(this.x, this.y-1);
    }
    public Cell getSouthNeighbor() {
      return getCell(this.x, this.y+1);
    }
    public Cell getEastNeighbor() {
      return getCell(this.x+1, this.y);
    }
    public Cell getWestNeighbor() {
      return getCell(this.x-1, this.y);
    }
    
    public String whichBorders() {
      String borders;

      borders = (borderNorth ? "North" : "") + (borderSouth ? "South" : "") + (borderEast ? "East" : "") + (borderWest ? "West" : "");

      return borders;
    }

    public void setBorders(int borders) {
      borderNorth = (borders & NORTH) > 0;
      borderSouth = (borders & SOUTH) > 0;
      borderEast  = (borders & EAST)  > 0;
      borderWest  = (borders & WEST)  > 0;
    }

    public void setRegion(int region) {
      this.region = region;
    }

    public int getRegion() {
      return this.region;
    }

  }

  public static void main(String[] args) {
    Maze maze = new Maze();

    // TODO implement
    // maze.print();
  }
}
