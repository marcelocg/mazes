package mcg.maze;

import java.awt.AWTException;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

public class Maze {

  int sizeX;
  int sizeY;

  //0-None, 1-Partial Mazes only, 2-Mazes and text
  static int DEBUGLEVEL = 1;
  static int THRESHOLD = 16;
  
  static int NORTH = 1;
  static int SOUTH = 2;
  static int EAST = 4;
  static int WEST = 8;

  static int NO_REGION = -1;
  static int A = 0;
  static int B = 1;
  static int printNum = 0;
  
  private ArrayList<Cell> grid;

  public static final char[] EXTENDED = { 0x00C7, 0x00FC, 0x00E9, 0x00E2,
      0x00E4, 0x00E0, 0x00E5, 0x00E7, 0x00EA, 0x00EB, 0x00E8, 0x00EF,
      0x00EE, 0x00EC, 0x00C4, 0x00C5, 0x00C9, 0x00E6, 0x00C6, 0x00F4,
      0x00F6, 0x00F2, 0x00FB, 0x00F9, 0x00FF, 0x00D6, 0x00DC, 0x00A2,
      0x00A3, 0x00A5, 0x20A7, 0x0192, 0x00E1, 0x00ED, 0x00F3, 0x00FA,
      0x00F1, 0x00D1, 0x00AA, 0x00BA, 0x00BF, 0x2310, 0x00AC, 0x00BD,
      0x00BC, 0x00A1, 0x00AB, 0x00BB, 0x2591, 0x2592, 0x2593, 0x2502,
      0x2524, 0x2561, 0x2562, 0x2556, 0x2555, 0x2563, 0x2551, 0x2557,
      0x255D, 0x255C, 0x255B, 0x2510, 0x2514, 0x2534, 0x252C, 0x251C,
      0x2500, 0x253C, 0x255E, 0x255F, 0x255A, 0x2554, 0x2569, 0x2566,
      0x2560, 0x2550, 0x256C, 0x2567, 0x2568, 0x2564, 0x2565, 0x2559,
      0x2558, 0x2552, 0x2553, 0x256B, 0x256A, 0x2518, 0x250C, 0x2588,
      0x2584, 0x258C, 0x2590, 0x2580, 0x03B1, 0x00DF, 0x0393, 0x03C0,
      0x03A3, 0x03C3, 0x00B5, 0x03C4, 0x03A6, 0x0398, 0x03A9, 0x03B4,
      0x221E, 0x03C6, 0x03B5, 0x2229, 0x2261, 0x00B1, 0x2265, 0x2264,
      0x2320, 0x2321, 0x00F7, 0x2248, 0x00B0, 0x2219, 0x00B7, 0x221A,
      0x207F, 0x00B2, 0x25A0, 0x00A0 };

public static final char getAscii(int code) {
  if (code >= 0x80 && code <= 0xFF) {
      return EXTENDED[code - 0x7F];
  }
  return (char) code;
}

public static final void printChar(int code) {
  System.out.printf("%c%n", getAscii(code));
}


  public Maze() throws IOException {
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
    Rectangle screen = new Rectangle(0,30,595,640);
    try {
      Robot robot = new Robot();
      BufferedImage img = robot.createScreenCapture(screen);
      File f = new File(String.format("/home/marcelo/mazes/screenshots/m%04d.png", printNum++));
      ImageIO.write(img, "png", f);
    } catch (AWTException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
  
  private void clearRegionMarks() {
    for (Cell cell : grid) {
      cell.setRegion(NO_REGION);
    }
  }
  
  private void split(List<Cell> region) {
    if (region.size() <= THRESHOLD) return;
    
    clearRegionMarks();
    
    if(DEBUGLEVEL >  1) System.out.println("Iniciando Split");
    if(DEBUGLEVEL >= 1) { print(); pause(); }
    
    
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
    
    if(DEBUGLEVEL >  1) System.out.println("Split concluido.");
    if(DEBUGLEVEL >= 1) { print(); pause(); }
    if(DEBUGLEVEL >  1) System.out.println("Vou construir a fronteira entre as regioes...");
    
    buildBorder(region);

    if(DEBUGLEVEL >  1) System.out.println("Fronteira construida e uma parede retirada.");
    if(DEBUGLEVEL >= 1) { print(); pause(); }
    
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

        string += " "+ cell.getRegionPic() +" ";
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

    public String getRegionPic() {
      String RESET = (char)27 + "[0m";
      String RED = (char)27 + "[31m";
      String BLUE = (char)27 + "[34m";
      
      String[] pics = {RESET + getAscii(32), RED + getAscii(176) + RESET, BLUE + getAscii(177) + RESET};
      return pics[region+1];
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

  private void pause() {
//    try {
//      System.in.read(new byte[2]);
//    } catch (IOException e) {
//    }
  }

  public static void main(String[] args) {
    Maze maze = new Maze(24,24);
    maze.print();
  }
}
