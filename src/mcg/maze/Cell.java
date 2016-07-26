package mcg.maze;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import mcg.maze.utils.Constants;
import mcg.maze.utils.Util;

public class Cell {
    int x;
    int y;

    int region = 0;

    private Maze maze;
    
    private boolean wallNorth = false;
    private boolean wallSouth = false;
    private boolean wallEast  = false;
    private boolean wallWest  = false;

    public static final int NO_WALLS = 0;
    public static final int NORTH    = 1;
    public static final int SOUTH    = 2;
    public static final int EAST     = 4;
    public static final int WEST     = 8;
    
    public static final int HORIZONTAL_PASSAGE = NORTH + SOUTH;
    public static final int VERTICAL_PASSAGE   = EAST + WEST;

    public static final int NORTH_DEAD_END = NORTH + EAST + WEST;
    public static final int SOUTH_DEAD_END = SOUTH + EAST + WEST;
    public static final int EAST_DEAD_END  = NORTH + SOUTH + EAST;
    public static final int WEST_DEAD_END  = NORTH + SOUTH + WEST;
    
    public Cell(int x, int y, Maze maze) {
      this.x = x;
      this.y = y;
      this.maze = maze;
      
      int walls = 0;

      if (x == 0)
        walls += WEST;
      if (y == 0)
        walls += NORTH;
      if (x == maze.sizeX - 1)
        walls += EAST;
      if (y == maze.sizeY - 1)
        walls += SOUTH;

      setWalls(walls);
    }
    
    public boolean hasNorthWall() {
      return wallNorth;
    }

    public boolean hasSouthWall() {
      return wallSouth;
    }
  
    public boolean hasEastWall() {
      return wallEast;
    }
  
    public boolean hasWestWall() {
      return wallWest;
    }
  
    public String toString() {
      return "(" + x + "," + y + ") Region: " + getRegionName() + " Borders: " + this.whichWalls();
    }
    
    public String getRegionName() {
      String[] regNames = {" ", "A", "B"};
      return regNames[region+1];
    }

    public String getRegionPic() {
      String[] pics = null;
      if(Constants.USE_COLORS == 1) {
        String RESET = (char)27 + "[0m";
        String RED = (char)27 + "[31m";
        String BLUE = (char)27 + "[34m";
      
        String[] colored_pics = {RESET + Util.getAscii(32), RED + Util.getAscii(176) + RESET, BLUE + Util.getAscii(177) + RESET};
        pics = colored_pics;
      } else {
        String[] uncolored_pics = {" ", " ", " "};
        pics = uncolored_pics;
      }
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
      return this.y < maze.sizeY - 1;
    }
    public boolean hasEastNeighbor() {
      return this.x < maze.sizeX - 1;
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
      return maze.getCell(this.x, this.y-1);
    }
    public Cell getSouthNeighbor() {
      return maze.getCell(this.x, this.y+1);
    }
    public Cell getEastNeighbor() {
      return maze.getCell(this.x+1, this.y);
    }
    public Cell getWestNeighbor() {
      return maze.getCell(this.x-1, this.y);
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
      if(wallSouth && (y < maze.sizeY-1) && isInDifferentRegion(getNeighbor(SOUTH))) borderWalls += SOUTH;
      if(wallEast &&  (x < maze.sizeX-1) && isInDifferentRegion(getNeighbor(EAST)))  borderWalls += EAST;
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
