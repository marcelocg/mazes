package mcg.maze.utils;

import java.io.FileWriter;
import java.io.IOException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import mcg.maze.Cell;
import mcg.maze.Maze;

public class TiledExporter {

  private static final int NO_CORNERS       = 0;
  private static final int NORTHEAST_CORNER = 1;
  private static final int SOUTHEAST_CORNER = 2;
  private static final int SOUTHWEST_CORNER = 4;
  private static final int NORTHWEST_CORNER = 8;
  private static final int ALL_CORNERS      = 15;

  @SuppressWarnings("unchecked")
  public static String toJSON(Maze maze) {
    JSONObject map = new JSONObject();

    map.put("height", maze.getHeight());
    map.put("width", maze.getWidth());

    map.put("nextobjectid", 1);
    map.put("orientation", "orthogonal");
    map.put("renderorder", "right-down");
    map.put("tileheight", 64);
    map.put("tilewidth", 64);
    map.put("version", 1);

    JSONObject mazeLayer = new JSONObject();
    mazeLayer.put("height", maze.getHeight());
    mazeLayer.put("width", maze.getWidth());
    mazeLayer.put("name", "MazeLayer");
    mazeLayer.put("opacity", 1);
    mazeLayer.put("type", "tilelayer");
    mazeLayer.put("visible", true);
    mazeLayer.put("x", 0);
    mazeLayer.put("y", 0);

    mazeLayer.put("data", toTileArray(maze));

    JSONObject tileset = new JSONObject();
    tileset.put("columns", 9);
    tileset.put("firstgid", 1);

    tileset.put("imageheight", 1536);
    tileset.put("imagewidth", 576);
    tileset.put("margin", 0);
    tileset.put("name", "Maze");
    tileset.put("spacing", 0);
    tileset.put("tilecount", 216);
    tileset.put("tileheight", 64);
    tileset.put("tilewidth", 64);

    // For awhile, let's maintain the Kenney top-down shooter
    // tileset as the only option. Thanks @KenneyNL!
    // This file must be somehow available to the game engine
    // using this Tiled map
    tileset.put("image", "assets/walls_tilesheet.png");

    JSONArray layers = new JSONArray();
    layers.add(mazeLayer);

    JSONArray tilesets = new JSONArray();
    tilesets.add(tileset);

    map.put("layers", layers);
    map.put("tilesets", tilesets);

    try (FileWriter file = new FileWriter("/home/ubuntu/Projetos/dubbers/mapa" + System.currentTimeMillis() + ".json")) {
      file.write(map.toJSONString());
    } catch (IOException e) {
      System.out.printf("Could not save the map file. Error: %s.", e.getMessage());
      System.out.printf("Here is the content I was trying to save: \n%s", map);
    }
    return map.toJSONString();
  }

  @SuppressWarnings("unchecked")
  private static JSONArray toTileArray(Maze maze) {

    JSONArray tiles = new JSONArray();

    for (int y = 0; y < maze.getHeight(); y++) {
      for (int x = 0; x < maze.getHeight(); x++) {
        Cell cell = maze.getCell(x, y);
        //TODO Implement the offset to a choosen tile pattern
        tiles.add(cell2Tile(cell));
      }
    }

    return tiles;
  }

  private static Integer cell2Tile(Cell cell) {

    int walls = cell.getAllWalls();
    Tileset tile = Tileset.FLOOR;

    // This is the dumbest possible logic
    // Change this to a bitwise logic using attributes for each tile in Tileset
    // Something like CORNERS=[0101] and WALLS=[0010] and then filter the
    // possible tiles based on the attributes until only one tile passes the
    // filter
    if (walls == Cell.NO_WALLS) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.FLOOR;

      else if (getCellCorners(cell) == ALL_CORNERS)
        tile = Tileset.NW_NE_SW_SE_CORNER;

      else if (getCellCorners(cell) == NORTHEAST_CORNER)
        tile = Tileset.NE_CORNER;

      else if (getCellCorners(cell) == NORTHWEST_CORNER)
        tile = Tileset.NW_CORNER;

      else if (getCellCorners(cell) == SOUTHEAST_CORNER)
        tile = Tileset.SE_CORNER;

      else if (getCellCorners(cell) == SOUTHWEST_CORNER)
        tile = Tileset.SW_CORNER;

      else if (getCellCorners(cell) == ALL_CORNERS - NORTHEAST_CORNER)
        tile = Tileset.NW_SE_SW_CORNER;

      else if (getCellCorners(cell) == ALL_CORNERS - NORTHWEST_CORNER)
        tile = Tileset.NE_SE_SW_CORNER;

      else if (getCellCorners(cell) == ALL_CORNERS - SOUTHEAST_CORNER)
        tile = Tileset.NW_NE_SW_CORNER;

      else if (getCellCorners(cell) == ALL_CORNERS - SOUTHWEST_CORNER)
        tile = Tileset.NW_NE_SE_CORNER;

      else if (getCellCorners(cell) == NORTHWEST_CORNER + SOUTHEAST_CORNER)
        tile = Tileset.NW_SE_CORNER;

      else if (getCellCorners(cell) == NORTHEAST_CORNER + SOUTHWEST_CORNER)
        tile = Tileset.NE_SW_CORNER;

      else if (getCellCorners(cell) == NORTHWEST_CORNER + NORTHEAST_CORNER)
        tile = Tileset.NW_NE_CORNER;

      else if (getCellCorners(cell) == NORTHEAST_CORNER + SOUTHEAST_CORNER)
        tile = Tileset.NE_SE_CORNER;

      else if (getCellCorners(cell) == SOUTHWEST_CORNER + SOUTHEAST_CORNER)
        tile = Tileset.SW_SE_CORNER;

      else if (getCellCorners(cell) == NORTHWEST_CORNER + SOUTHWEST_CORNER)
        tile = Tileset.NW_SW_CORNER;

    } 
    
    else if (walls == Cell.HORIZONTAL_PASSAGE) 
      tile = Tileset.NS_WALL;

    else if (walls == Cell.VERTICAL_PASSAGE)
      tile = Tileset.EW_WALL;

    else if (walls == Cell.NORTH_DEAD_END)
      tile = Tileset.NEW_WALL;

    else if (walls == Cell.SOUTH_DEAD_END)
      tile = Tileset.SEW_WALL;

    else if (walls == Cell.EAST_DEAD_END)
      tile = Tileset.NSE_WALL;

    else if (walls == Cell.WEST_DEAD_END)
      tile = Tileset.NSW_WALL;

    else if (walls == Cell.NORTH) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.N_WALL;

      else if (getCellCorners(cell) == SOUTHEAST_CORNER)
        tile = Tileset.N_WALL_SE_CORNER;

      else if (getCellCorners(cell) == SOUTHWEST_CORNER)
        tile = Tileset.N_WALL_SW_CORNER;

      else if (getCellCorners(cell) == SOUTHEAST_CORNER + SOUTHWEST_CORNER)
        tile = Tileset.N_WALL_SW_SE_CORNER;

    } else if (walls == Cell.SOUTH) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.S_WALL;

      else if (getCellCorners(cell) == NORTHEAST_CORNER)
        tile = Tileset.S_WALL_NE_CORNER;

      else if (getCellCorners(cell) == NORTHWEST_CORNER)
        tile = Tileset.S_WALL_NW_CORNER;

      else if (getCellCorners(cell) == NORTHEAST_CORNER + NORTHWEST_CORNER)
        tile = Tileset.S_WALL_NW_NE_CORNER;

    } else if (walls == Cell.EAST) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.E_WALL;

      else if (getCellCorners(cell) == NORTHWEST_CORNER)
        tile = Tileset.E_WALL_NW_CORNER;

      else if (getCellCorners(cell) == SOUTHWEST_CORNER)
        tile = Tileset.E_WALL_SW_CORNER;

      else if (getCellCorners(cell) == NORTHWEST_CORNER + SOUTHWEST_CORNER)
        tile = Tileset.E_WALL_NW_SW_CORNER;

    } else if (walls == Cell.WEST) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.W_WALL;

      else if (getCellCorners(cell) == NORTHEAST_CORNER)
        tile = Tileset.W_WALL_NE_CORNER;

      else if (getCellCorners(cell) == SOUTHEAST_CORNER)
        tile = Tileset.W_WALL_SE_CORNER;

      else if (getCellCorners(cell) == NORTHEAST_CORNER + SOUTHEAST_CORNER)
        tile = Tileset.W_WALL_NE_SE_CORNER;

    } else if (walls == Cell.NORTH + Cell.WEST) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.NW_WALL;

      else if (getCellCorners(cell) == SOUTHEAST_CORNER)
        tile = Tileset.NW_WALL_SE_CORNER;

    } else if (walls == Cell.NORTH + Cell.EAST) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.NE_WALL;

      else if (getCellCorners(cell) == SOUTHWEST_CORNER)
        tile = Tileset.NE_WALL_SW_CORNER;

    } else if (walls == Cell.SOUTH + Cell.EAST) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.SE_WALL;

      else if (getCellCorners(cell) == NORTHWEST_CORNER)
        tile = Tileset.SE_WALL_NW_CORNER;

    } else if (walls == Cell.SOUTH + Cell.WEST) {

      if (getCellCorners(cell) == NO_CORNERS)
        tile = Tileset.SW_WALL;

      else if (getCellCorners(cell) == NORTHEAST_CORNER)
        tile = Tileset.SW_WALL_NE_CORNER;

    }

    return tile.id();
  }

  private static boolean hasNortheastCorner(Cell cell) {
    return (!cell.hasNorthWall() && !cell.hasEastWall()
        && ((cell.hasEastNeighbor() && cell.getEastNeighbor().hasNorthWall())
            || (cell.hasNorthNeighbor() && cell.getNorthNeighbor().hasEastWall())));
  }

  private static boolean hasNorthwestCorner(Cell cell) {
    return (!cell.hasNorthWall() && !cell.hasWestWall()
        && ((cell.hasWestNeighbor() && cell.getWestNeighbor().hasNorthWall())
            || (cell.hasNorthNeighbor() && cell.getNorthNeighbor().hasWestWall())));
  }

  private static boolean hasSoutheastCorner(Cell cell) {
    return (!cell.hasSouthWall() && !cell.hasEastWall()
        && ((cell.hasEastNeighbor() && cell.getEastNeighbor().hasSouthWall())
            || (cell.hasSouthNeighbor() && cell.getSouthNeighbor().hasEastWall())));
  }

  private static boolean hasSouthwestCorner(Cell cell) {
    return (!cell.hasSouthWall() && !cell.hasWestWall()
        && ((cell.hasWestNeighbor() && cell.getWestNeighbor().hasSouthWall())
            || (cell.hasSouthNeighbor() && cell.getSouthNeighbor().hasWestWall())));
  }

  private static int getCellCorners(Cell cell) {
    int corners = 0;
    if (hasNortheastCorner(cell)) {
      corners += NORTHEAST_CORNER;
    }
    if (hasNorthwestCorner(cell)) {
      corners += NORTHWEST_CORNER;
    }
    if (hasSoutheastCorner(cell)) {
      corners += SOUTHEAST_CORNER;
    }
    if (hasSouthwestCorner(cell)) {
      corners += SOUTHWEST_CORNER;
    }
    return corners;
  }

}
