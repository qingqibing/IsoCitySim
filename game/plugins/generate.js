
'use strict';

var game;

function Generate(gameObj) {
  console.log("* Generate Init");
  game = gameObj;
}

Generate.prototype = {
  //buildings starts here
  generateBuilding: function(floors){
    var returnArr = this.makeFilled3DArray(16, floors);
    returnArr[0][0] = 17;
    return returnArr;
  },
  //terrain starts here
  generateMap: function(map, fill){
    //generates a blank map based on dimensions
    var i = 0;
    var tiles = [];
    while (i < (map.dimensions.cols * map.dimensions.rows)){
      tiles[i] = fill;
      i++;
    }
    return tiles;
  },
  generateRect: function(width, height, fill){
    var r = 0;
    var rows = [];
    while (r < height){
      rows[r] = this.makeFilled2DArray(fill, width);
      r++;
    }
    return rows;
  },
  generateSliceRect: function(width, height, slice){
    //generates a rectangle based on the slice provided (hardcoded atm)
    var masterRows = [];
    var slices = game.tiles.slices[slice];
    //row index
    var r = 0;
    while (r < slices.length){
      masterRows[r] = [];
      masterRows[r][0] = slices[r][0];
      var i = 1;
      while (i < (width - 1)){
        masterRows[r][i] = slices[r][1];
        i++;
      }
      masterRows[r][i] = slices[r][2];
      r++;
    }
    //build out the final array
    var rectArr = [];
    rectArr[0] = masterRows[0];
    var r = 1;
    while (r < (height - 1)){
      rectArr[r] = masterRows[1];
      r++;
    }
    rectArr[r] = masterRows[2];
    return rectArr;
  },
  //misc utility functions start here
  makeFilled2DArray: function(fill, length){
    //makes a filled array: [0,0,0]
    var array = [];
    for (var i = 0; i < length; i++) {
        array[i] = fill;
    }
    return array;
  },
  makeFilled3DArray: function(fill, length){
    //makes a filled 3d array: [[0], [0]]
    //currently only makes single length arrays
    var array = [];
    for (var i = 0; i < length; i++) {
      array[i] = [fill];
    }
    return array;
  },
  mergePartial2D: function(map, tiles, partial, index){
    //will overwrite all tiles
    //takes a map, and a partial map, and merges the partial into the map
    var i = 0;
    //partial should consist of an array of arrays, one array per row
    while (i < partial.length){
      //remove items from the array
      tiles.splice(index + (map.dimensions.cols * i), partial[i].length);
      //remove items from the array
      tiles.splice.apply(tiles, [index + (map.dimensions.cols * i), 0].concat(partial[i]));
      i++;
    }
    return tiles;
  },
  mergePartial3D: function(map, tiles, partial, layer, index){
    //will overwrite all tiles
    //takes a map, and a partial map, and merges the partial into the map
    //expects 3d arrays for tiles and partial
    var l = 0;
    while (l < partial.length){
      tiles[(l + layer)] = this.mergePartial2D(map, tiles[(l + layer)], partial[l], index);
      l++;
    }
    return tiles;
  },
  //misc utility functions start here
  mergePartial2DSafe: function(map, tiles, partial, index){
    //will overwrite all tiles
    //takes a map, and a partial map, and merges the partial into the map
    var i = 0;
    //partial should consist of an array of arrays, one array per row
    //console.log(partial, index);
    while (i < partial.length){
      var j = 0;
      while (j < partial[i].length){
        if (partial[i][j] != 0){
          //there's some content here we want to merge
          tiles[index + (map.dimensions.cols * i) + j] = partial[i][j];
        }
        j++;
      }
      i++;
    }
    return tiles;
  },
  mergePartial3DSafe: function(map, tiles, partial, layer, index){
    //will overwrite all tiles
    //takes a map, and a partial map, and merges the partial into the map
    //expects 3d arrays for tiles and partial
    var l = 0;
    while (l < partial.length){
      tiles[(l + layer)] = this.mergePartial2DSafe(map, tiles[(l + layer)], [partial[l]], index);
      l++;
    }
    return tiles;
  }
};

module.exports = Generate;
