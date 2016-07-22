package mcg.maze.utils;

public enum Tileset {

  NW_WALL_SE_CORNER   ( 1),
  NE_WALL_SW_CORNER   ( 2),
  NS_WALL             ( 3),
  N_WALL_SW_SE_CORNER ( 4),
  S_WALL_NW_NE_CORNER ( 5),
  NSE_WALL            ( 6),
  SEW_WALL            ( 7),
  NW_WALL             ( 8),
  NE_WALL             ( 9),
  
  SW_WALL_NE_CORNER   (10),
  SE_WALL_NW_CORNER   (11),
  EW_WALL             (12),
  W_WALL_NE_SE_CORNER (13),
  E_WALL_NW_SW_CORNER (14),
  NEW_WALL            (15),
  NSW_WALL            (16),
  SW_WALL             (17),
  SE_WALL             (18),
  
  SE_CORNER           (19),
  SW_CORNER           (20),
  SW_SE_CORNER        (21),
  NW_NE_CORNER        (22),
  W_WALL              (23),
  E_WALL              (24),
  FLOOR               (25),
  NW_NE_SW_SE_CORNER  (26),
//UNUSED              (27),
  NE_CORNER           (28),
  NW_CORNER           (29),
  NE_SE_CORNER        (30),
  NW_SW_CORNER        (31),
  N_WALL              (32),
  S_WALL              (33),
  NSEW_WALL           (34),
//UNUSED              (35),
//UNUSED              (36),
  
  NW_NE_SW_CORNER     (37),
  NW_NE_SE_CORNER     (38),
  W_WALL_NE_CORNER    (39),
  E_WALL_NW_CORNER    (40),
  N_WALL_SW_CORNER    (41),
  N_WALL_SE_CORNER    (42),
  NE_SW_CORNER        (43),
//UNUSED              (44),
//UNUSED              (45),
  
  NW_SE_SW_CORNER     (46),
  NE_SE_SW_CORNER     (47),
  W_WALL_SE_CORNER    (48),
  E_WALL_SW_CORNER    (49),
  S_WALL_NW_CORNER    (50),
  S_WALL_NE_CORNER    (51),
  NW_SE_CORNER        (52);
//UNUSED              (53),
//UNUSED              (54),
    
  private int id;

  public static final Integer SIZE = 54;
  
  //PATTERNS
  public static final Integer TARMAC_BRICK = 0; 
  public static final Integer TARMAC_WOOD  = 1;
  public static final Integer MARBLE_GLASS = 2;
  public static final Integer TARMAC_GLASS = 3; //163
  
  Tileset(int id) {
    this.id = id;
  }
  public int id() { return id; }
  
}
