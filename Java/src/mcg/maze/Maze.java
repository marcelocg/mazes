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

  //0-None, 1-Partial Mazes only, 2-Mazes and text
  static int DEBUGLEVEL = 1;
  static int THRESHOLD = 4;
  
  static int NORTH = 1;
  static int SOUTH = 2;
  static int EAST = 4;
  static int WEST = 8;

  static int NO_REGION = -1;
  static int A = 0;
  static int B = 1;

  private ArrayList<Cell> grid;

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
    split(grid);
    clearRegionMarks();
  }

  public void print() {
    System.out.println(this);
  }
  
  private void clearRegionMarks() {
    for (Cell cell : grid) {
      cell.setRegion(NO_REGION);
    }
  }
  
  private void split(List<Cell> region) {
    if (region.size() <= THRESHOLD) return;
    
    clearRegionMarks();
    
    if(DEBUGLEVEL  > 1) System.out.println("Iniciando Split");
    if(DEBUGLEVEL == 1) print();
    
    
    Cell seedA = getRandomUnsplitCell(region);
    seedA.setRegion(A);

    Cell seedB = getRandomUnsplitCell(region);
    seedB.setRegion(B);

    Set<Cell> set = new HashSet<Cell>();
    set.add(seedA);
    set.add(seedB);

    long unsplitCellsCount = region.size(); 
    
    while (unsplitCellsCount > 0) {
      Cell currentCell = set.toArray(new Cell[0])[ThreadLocalRandom.current().nextInt(0, set.size())];
      set.remove(currentCell);
      
      Collection<Cell> neighbors = currentCell.getNeighborhood().stream()
                                                                .filter(c -> !c.isInRegion() && region.contains(c))
                                                                .collect(Collectors.toList());
      
      for (Cell n : neighbors) {
        n.setRegion(currentCell.getRegion());
      }
      
      set.addAll(neighbors);
      unsplitCellsCount = region.stream().filter(c -> !c.isInRegion()).count();
    }
    
    if(DEBUGLEVEL  > 1) System.out.println("Split concluido.");
    if(DEBUGLEVEL == 1) print();
    if(DEBUGLEVEL  > 1) System.out.println("Vou construir a fronteira entre as regioes...");
    
    buildBorder(region);

    if(DEBUGLEVEL  > 1) System.out.println("Fronteira construida e uma parede retirada.");
    if(DEBUGLEVEL == 1) print();
    
    List<Cell> subRegionA = region.stream().filter(c -> c.getRegion() == A).collect(Collectors.toList()); 
    List<Cell> subRegionB = region.stream().filter(c -> c.getRegion() == B).collect(Collectors.toList());
    
    if(DEBUGLEVEL  > 1) System.out.println("Invocando o split da regiao A.");
    
    split(subRegionA);
    
    if(DEBUGLEVEL  > 1) System.out.println("Invocando o split da regiao B.");

    split(subRegionB);
  }

  private void buildBorder(List<Cell> region) {
    Set<Cell> border = new HashSet<Cell>(); 

    //1. Choose one subregion (A or B) from the region passed as argument
    List<Cell> subRegionA = region.stream()
                                  .filter(c -> c.getRegion() == A)
                                  .collect(Collectors.toList());
    
    //2. For each cell in this subregion, 
    for (Cell c : subRegionA) {
      // 2.1 For each of it's neighbors that also belongs to the region
      // but is on a different subregion
      List<Cell> neighborhood = c.getNeighborhood().stream()
                                 .filter(n -> region.contains(n) && n.getRegion() == B)
                                 .collect(Collectors.toList());
      for (Cell n : neighborhood) {
        // 2.2.1 put a wall between them
        buildWall(c, n);
        // 2.2.2 add the cell to a border collection
        border.add(c);
      }
    }
    
    //3. Choose one random cell from the frontier collection
    Cell cell = getRandomCell(Arrays.asList(border.toArray(new Cell[0])));

    //4. Remove one of the cell's walls
    cell.removeOneInternalWall();
  }
  
  private Cell getCell(int x, int y) {
    return grid.stream().filter(c -> c.x == x && c.y == y).findFirst().get();
  }

  private void buildWall(Cell cell, Cell neighbor) {  
    int border = 0;
    int borderNeighbor = 0;
    
    border += (neighbor.x == (cell.x + 1) ? EAST  : 0); 
    border += (neighbor.x == (cell.x - 1) ? WEST  : 0); 
    border += (neighbor.y == (cell.y + 1) ? SOUTH : 0); 
    border += (neighbor.y == (cell.y - 1) ? NORTH : 0);

    borderNeighbor += (cell.x == (neighbor.x + 1) ? EAST  : 0); 
    borderNeighbor += (cell.x == (neighbor.x - 1) ? WEST  : 0); 
    borderNeighbor += (cell.y == (neighbor.y + 1) ? SOUTH : 0); 
    borderNeighbor += (cell.y == (neighbor.y - 1) ? NORTH : 0);
    
    cell.setWalls(cell.getAllWalls() + border);
    neighbor.setWalls(neighbor.getAllWalls() + borderNeighbor);
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
//      string += "+---";
      string += "----";
    }
//    string += "+\n";
    string += " \n";

    for (int y = 0; y < sizeY; y++) {
      string += "|";
//      String bottom = "+";
      String bottom = " ";

      for (int x = 0;  x < sizeX; x++) {
        Cell cell = this.getCell(x, y);

        string += " "+ cell.getRegionName() +" ";
        string += cell.wallEast ? "|" : " ";

        bottom += cell.wallSouth ? "---" : "   ";
//        bottom += "+";
        bottom += " ";
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
      return "(" + x + "," + y + ") Region: " + getRegionName() + " Borders: " + this.whichWalls();
    }
    
    public String getRegionName() {
      String[] regNames = {" ", "A", "B"};
      return regNames[region+1];
    }
    
    public boolean isInRegion() {
      return this.region >= 0;
    }
    
    private boolean isInDifferentRegion(Cell cell) {
      return cell.isInRegion() && cell.region != this.region;
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

      walls = (wallNorth ? "N" : "") + (wallSouth ? "S" : "") + (wallEast ? "E" : "") + (wallWest ? "W" : "");

      return walls;
    }

    public void setWalls(int borders) {
      wallNorth = (borders & NORTH) > 0;
      wallSouth = (borders & SOUTH) > 0;
      wallEast  = (borders & EAST)  > 0;
      wallWest  = (borders & WEST)  > 0;
    }
    
    public int getAllWalls() {
      return (wallNorth ? NORTH : 0) + (wallSouth ? SOUTH : 0) + (wallEast ? EAST : 0) + (wallWest ? WEST : 0);
    }

    public int getBorderWalls() {
      int borderWalls = 0;
      
      if(wallNorth && (y > 0)       && isInDifferentRegion(getNeighbor(NORTH))) borderWalls += NORTH;
      if(wallSouth && (y < sizeY-1) && isInDifferentRegion(getNeighbor(SOUTH))) borderWalls += SOUTH;
      if(wallEast &&  (x < sizeX-1) && isInDifferentRegion(getNeighbor(EAST)))  borderWalls += EAST;
      if(wallWest &&  (x > 0)       && isInDifferentRegion(getNeighbor(WEST)))  borderWalls += WEST;
          
      return borderWalls;
    }

    public List<Integer> getNeighborWallsList() {
      int walls = getBorderWalls();
      List<Integer> borders = Arrays.asList(NORTH, SOUTH, EAST, WEST);
      
      return borders.stream()
                   .filter(b -> (walls & b) > 0) // select the walls that are set
                   .collect(Collectors.toList());
    }

    public Cell getNeighbor(int direction) {
      if (direction == NORTH) return this.getNorthNeighbor();
      else if (direction == SOUTH) return this.getSouthNeighbor();
      else if (direction == WEST) return this.getWestNeighbor();
      else return this.getEastNeighbor();
    }
    
    public void removeOneInternalWall() {
      List<Integer> walls = this.getNeighborWallsList();
      int wall = 0;
      
      if (walls.size() > 1)
        wall = walls.get(ThreadLocalRandom.current().nextInt(0, walls.size()));
      else
        wall = walls.get(0);
      
      
      this.setWalls(this.getAllWalls() - wall);
      
      int neighborWall = 0;
      if (wall == NORTH) neighborWall = SOUTH;
      if (wall == SOUTH) neighborWall = NORTH;
      if (wall == WEST) neighborWall = EAST;
      if (wall == EAST) neighborWall = WEST;

      Cell neighbor = this.getNeighbor(wall);
      neighbor.setWalls(neighbor.getAllWalls() - neighborWall);
      
    }

    public void setRegion(int region) {
      this.region = region;
    }

    public int getRegion() {
      return this.region;
    }

  }

  public static void main(String[] args) {
    Maze maze = new Maze(30,30);
    maze.print();
  }
}
