package mcg.maze.utils;

import java.util.Arrays;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import mcg.maze.Maze;

public class TiledExporter {

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
    tileset.put("columns", 27);
    tileset.put("firstgid", 1);

    tileset.put("imageheight", 1280);
    tileset.put("imagewidth", 1728);
    tileset.put("margin", 0);
    tileset.put("name", "Maze");
    tileset.put("spacing", 0);
    tileset.put("tilecount", 540);
    tileset.put("tileheight", 64);
    tileset.put("tilewidth", 64);

    // For awhile, let's maintain the Kenney top-down shooter
    // tileset as the only option. Thanks @KenneyNL!
    // This file must be somehow available to the game engine
    // using this Tiled map
    tileset.put("image", "tilesheet_complete.png");

    JSONArray layers = new JSONArray();
    layers.add(mazeLayer);
    
    JSONArray tilesets = new JSONArray();
    tilesets.add(tileset);

    map.put("layers", layers);
    map.put("tilesets", tilesets);

    System.out.print(map);
    return "";
  }

  @SuppressWarnings("unchecked")
  private static JSONArray toTileArray(Maze maze) {

    JSONArray tiles = new JSONArray();
    
    tiles.addAll(Arrays.asList( 109, 114, 141, 142, 112, 114, 
                                139, 114, 139, 111, 113, 114, 
                                139, 111, 137, 109, 114, 141, 
                                136, 112, 114, 138, 116, 220, 
                                109, 113, 112, 113, 248, 247, 
                                136, 114, 115, 142, 111, 137  ));

    return tiles;
  }
}
