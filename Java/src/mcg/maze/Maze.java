package mcg.maze;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

public class Maze {

  int sizeX;
  int sizeY;

  static int NORTH = 1;
  static int SOUTH = 2;
  static int EAST = 4;
  static int WEST = 8;

  static int NO_REGION = 0;
  static int A = 1;
  static int B = 2;

  private ArrayList<Cell> grid;

  Set<Cell> set = new HashSet<Cell>();

  public Maze() {
    this(4, 4);
  }

  public Maze(int sizeX, int sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.grid = generateGrid();
    
    this.generateMaze();
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

  public void print() {
    System.out.println(this);
  }
  
  private void clearRegionMarks(List<Cell> region) {
    for (Cell cell : region) {
      cell.setRegion(NO_REGION);
    }
  }
  
  private void split(List<Cell> region) {
    if (region.size() <= 4) return;
    
    clearRegionMarks(region);
    
    Cell seedA = getRandomUnsplitCell(region);
    seedA.setRegion(A);

    Cell seedB = getRandomUnsplitCell(region);
    seedB.setRegion(B);

    set.add(seedA);
    set.add(seedB);

    while (region.stream().filter(c -> !c.isInRegion()).count() > 0) {
      Cell currentCell = set.toArray(new Cell[0])[ThreadLocalRandom.current().nextInt(0, set.size())];
      set.remove(currentCell);
      
      Collection<Cell> neighbors = currentCell.getNeighborhood().stream()
                                                                .filter(c -> !c.isInRegion())
                                                                .collect(Collectors.toList());
      
      for (Cell n : neighbors) {
        n.setRegion(currentCell.getRegion());
      }
      
      set.addAll(neighbors);
    }
    
    buildBorder(region);
    
    split(region.stream().filter(c -> c.getRegion() == A).collect(Collectors.toList()));
    split(region.stream().filter(c -> c.getRegion() == B).collect(Collectors.toList()));
  }

  private void buildBorder(List<Cell> region) {
    List<Cell> border = new ArrayList<Cell>(); 
 
    region.stream()
      //1. Choose one subregion (A or B) from the region passed as argument
      .filter(c -> c.getRegion() == A)
      //2. For each cell in this subregion, 
      .forEach(c -> c.getNeighborhood().stream()
                      // 2.1 For each of it's neighbors that also belongs to the region
                      // but is on a different subregion
                      .filter(n -> region.contains(n) && n.getRegion() == B)
                      .forEach(n -> { 
                                      // 2.2.1 put a wall between them
                                      buildWall(c, n);
                                      // 2.2.2 add the cell to a border collection
                                      border.add(c);
                                    })
               );
    
    //3. Choose one random cell from the frontier collection
    Cell cell = getRandomCell(border);
    
    //4. Choose one of the cell's walls
    List<Integer> walls = cell.getNeighborWallsList();
    int wall = walls.get(ThreadLocalRandom.current().nextInt(0, walls.size()));
    
    //5. Remove the wall
    cell.setWalls(cell.getWalls() - wall);
  }
  
  private Cell getCell(int x, int y) {
    return grid.stream().filter(c -> c.x == x && c.y == y).findFirst().get();
  }

  private void buildWall(Cell cell, Cell neighbor) {  
    int border = 0;
    
    border += (neighbor.x == (cell.x + 1) ? EAST  : 0); 
    border += (neighbor.x == (cell.x - 1) ? WEST  : 0); 
    border += (neighbor.y == (cell.y + 1) ? SOUTH : 0); 
    border += (neighbor.x == (cell.y - 1) ? NORTH : 0);
    
    cell.setWalls(cell.getWalls() + border);
  }
  
  
  private Cell getRandomCell(List<Cell> cells) {
    return cells.get(ThreadLocalRandom.current().nextInt(cells.size()));
  }

  
  private Cell getRandomUnsplitCell(List<Cell> region) {
    List<Cell> unsplitCells = region.stream().filter(c -> !c.isInRegion()).collect(Collectors.toList());
    return getRandomCell(unsplitCells);
  }

  public String toString() {
    String string = "";

    for (int x = 0;  x < sizeX; x++) {
      string += "+---";
    }
    string += "+\n";

    for (int y = 0; y < sizeY; y++) {
      string += "|";
      String bottom = "+";

      for (int x = 0;  x < sizeX; x++) {
        Cell cell = this.getCell(x, y);

        string += "   ";
        string += cell.wallEast ? "|" : " ";

        bottom += cell.wallSouth ? "---" : "   ";
        bottom += "+";
      }

      string += "\n" + bottom + "\n";
    }

    return string;
  }
  
  protected class Cell {
    int x;
    int y;

    int region = 0;

    boolean wallNorth = false;
    boolean wallSouth = false;
    boolean wallEast  = false;
    boolean wallWest  = false;

    public Cell(int x, int y) {
      this.x = x;
      this.y = y;

      int walls = 0;

      if (x == 0)
        walls += WEST;
      if (y == 0)
        walls += NORTH;
      if (x == sizeX - 1)
        walls += EAST;
      if (y == sizeY - 1)
        walls += SOUTH;

      setWalls(walls);
    }
    
    public String toString() {
      return "X: " + x + " Y: " + y + " Borders: " + this.whichWalls();
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
    
    public String whichWalls() {
      String walls;

      walls = (wallNorth ? "North" : "") + (wallSouth ? "South" : "") + (wallEast ? "East" : "") + (wallWest ? "West" : "");

      return walls;
    }

    public void setWalls(int borders) {
      wallNorth = (borders & NORTH) > 0;
      wallSouth = (borders & SOUTH) > 0;
      wallEast  = (borders & EAST)  > 0;
      wallWest  = (borders & WEST)  > 0;
    }
    
    public int getWalls() {
      return (wallNorth ? NORTH : 0) + (wallSouth ? SOUTH : 0) + (wallEast ? EAST : 0) + (wallWest ? WEST : 0);
    }

    public int getNeighborWalls() {
      return (wallNorth && (y > 0) ? NORTH : 0) + (wallSouth && (y < sizeY-1) ? SOUTH : 0) + (wallEast && (x < sizeX-1) ? EAST : 0) + (wallWest && (x > 0) ? WEST : 0);
    }

    public List<Integer> getNeighborWallsList() {
      int walls = getNeighborWalls();
      List<Integer> borders = Arrays.asList(NORTH, SOUTH, EAST, WEST);
      
      return borders.stream()
                   .filter(w -> (walls & w) > 0)
                   .collect(Collectors.toList());
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
    maze.print();
  }
}
