<template>
  <div>
    <b-navbar class="b-navbar" toggleable="md" type="dark" variant="secondary">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="b-navbar-nav">
          <b-navbar-brand
            class="b-navbar-brand"
            @click="clearMap"
            :class="[
              {'disabled':(isFindingPath === true)},
            ]"
          >Clear Map</b-navbar-brand>
        </b-navbar-nav>
        <span class="seperator"></span>

        <b-navbar-nav class="b-navbar-nav">
          <b-navbar-brand
            class="b-navbar-brand"
            @click="animateMaze"
            :class="[
              {'disabled':(isFindingPath === true)},
            ]"
          >Generate Maze</b-navbar-brand>
        </b-navbar-nav>
        <span class="seperator"></span>

        <b-navbar-nav class="b-navbar-nav">
          <b-navbar-brand
            class="b-navbar-brand"
            :class="[
              {'disabled':(isFindingPath === true)},
              {'active':(method === 1)},
            ]"
            @click="selectMethod(1)"
          >Dijkstra's Shortest Path</b-navbar-brand>
          <b-navbar-brand></b-navbar-brand>
          <b-navbar-brand
            class="b-navbar-brand"
            :class="[
              {'disabled':(isFindingPath === true)},
              {'active':(method === 2)},
            ]"
            @click="selectMethod(2)"
          >A* Search Algorithm</b-navbar-brand>
        </b-navbar-nav>
        <span class="seperator"></span>

        <b-navbar-nav class="b-navbar-nav">
          <b-navbar-brand
            class="b-navbar-brand"
            @click="findPath"
            :class="[
              {'disabled':(isFindingPath === true)},
            ]"
          >Find path</b-navbar-brand>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container class="b-container">
      <div class="grid">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex">
          <Node
            v-for="(node, nodeIndex) in row"
            :key="nodeIndex"
            :id="nodeIndex"
            :col="node.col"
            :row="node.row"
            :isFinish="node.isFinish"
            :isStart="node.isStart"
            :isWall="node.isWall"
            :isMazeWall="node.isMazeWall"
            :isVisited="node.isVisited"
            @handleMouseDown="handleMouseDown(node.row, node.col)"
            @handleMouseEnter="handleMouseEnter(node.row, node.col)"
            @handleMouseUp="handleMouseUp"
          ></Node>
        </div>
      </div>
      <b-row class="d-flex justify-content-center fixed-bottom">
        <b-navbar-brand class="b-navbar-brand">Made by Nam</b-navbar-brand>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Node from "./Node/Node";
import {
  dijkstra,
  getNodesInShortestPathOrder,
  animateDijkstra
} from "../algorithms/dijkstra";
import { animateMaze } from "../algorithms/maze";

const START_NODE_ROW = 8;
const START_NODE_COL = 8;
const FINISH_NODE_ROW = 8;
const FINISH_NODE_COL = 35;

export default {
  name: "PathFinding",
  components: {
    Node
  },
  data() {
    return {
      grid: [],
      mouseIsPressed: false,
      isFindingPath: false,
      method: 1,
      findingPathSpeed: 1,
      mazeGrid: [],
    };
  },
  mounted() {
    this.grid = this.getInitialGrid();
  },
  methods: {
    async findPath() {
      if (this.isFindingPath === false) {
        if (this.method === 1) {
          this.isFindingPath = true;
          await this.visualizeDijkstra();
          this.isFindingPath = false;
        } else if (this.method === 2) {
          alert("Sorry, this method is not finished yet :(");
        } else {
          alert("Please select a method");
        }
      }
    },
    selectMethod(method) {
      if (this.isFindingPath === false) {
        this.method = method;
      }
    },
    async clearMap() {
      if (this.isFindingPath === false) {
        await this.removeClass("node node-shortest-path", "node-shortest-path");
        await this.removeClass("node node-visited", "node-visited");
        this.grid = await this.getInitialGrid();
      }
    },
    removeClass(classNameFull, classNameRemove) {
      let elements = document.getElementsByClassName(classNameFull);
      while (elements.length > 0) {
        elements[0].classList.remove(classNameRemove);
      }
    },

    async visualizeDijkstra() {
      const grid = this.grid;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

      const visitedNodesInOrder = await dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = await getNodesInShortestPathOrder(finishNode);

      await animateDijkstra(
        visitedNodesInOrder,
        nodesInShortestPathOrder,
        this.findingPathSpeed
      );
    },

    async animateMaze() {
      if (this.isFindingPath === false) {
        await this.clearMap();
        this.isFindingPath = true;
        await animateMaze(this.grid);
        this.isFindingPath = false;
      }
    },

    handleMouseDown(row, col) {
      if (this.isFindingPath === false) {
        const newGrid = this.getNewGridWithWallToggled(this.grid, row, col);
        this.grid = newGrid;
        this.mouseIsPressed = true;
      }
    },
    handleMouseEnter(row, col) {
      if (this.isFindingPath === false) {
        if (!this.mouseIsPressed) return;
        const newGrid = this.getNewGridWithWallToggled(this.grid, row, col);
        this.grid = newGrid;
      }
    },
    handleMouseUp() {
      if (this.isFindingPath === false) {
        this.mouseIsPressed = false;
      }
    },
    getNewGridWithWallToggled(grid, row, col) {
      const newGrid = grid.slice();
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isWall: !node.isWall
      };
      newGrid[row][col] = newNode;
      return newGrid;
    },
    getInitialGrid() {
      const grid = [];
      for (let row = 0; row < 17; row++) {
        const currentRow = [];
        for (let col = 0; col < 43; col++) {
          currentRow.push(this.createNode(col, row));
        }
        grid.push(currentRow);
      }
      return grid;
    },
    createNode(col, row) {
      return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isMazeWall: false,
        previousNode: null
      };
    }
  }
};
</script>

<style scoped>
.grid {
  margin: 30px 0 0;
}
.b-navbar {
  height: 90px;
}
.b-navbar-nav {
  margin: 2%;
}
.b-navbar-brand {
  cursor: pointer;
  font-size: 100%;
}
.seperator {
  width: 5px;
  height: 50px;
  background-color: #2c3e50 !important;
}
.active {
  color: #ca44c4 !important;
}
.disabled {
  cursor: default;
  color: #e62510 !important;
}
</style>
