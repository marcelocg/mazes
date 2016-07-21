package mcg.maze.utils;

public enum Tileset {

  TARMAC_BRICK (0), //1 
  TARMAC_WOOD  (1), //55
  MARBLE_GLASS (2), //109
  TARMAC_GLASS (3); //163
  
  private int id;
  
  Tileset(int id) {
    this.id = id;
  }
  public int id() { return id; }
  
}
