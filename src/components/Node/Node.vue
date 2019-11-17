<template>
  <div
    :id="`node-${row}-${col}`"
    class="node"
    :class="[
            {'node-start':isStart},
            {'node-finish':isFinish},
            {'node-wall':isWall && !isStart && !isFinish},
            {'node-maze-wall':isMazeWall && !isStart && !isFinish},
          ]"
    @mousedown="handleMouseDown"
    @mouseenter="handleMouseEnter"
    @mouseup="handleMouseUp"
  ></div>
</template>

<script>
export default {
  name: "Node",
  props: {
    id: Number,
    col: Number,
    row: Number,
    isFinish: Boolean,
    isStart: Boolean,
    isWall: Boolean,
    isMazeWall: Boolean,
    isVisited: Boolean
  },
  data() {
    return {};
  },
  methods: {
    handleMouseDown() {
      this.$emit("handleMouseDown");
    },
    handleMouseEnter() {
      this.$emit("handleMouseEnter");
    },
    handleMouseUp() {
      this.$emit("handleMouseUp");
    }
  }
};
</script>

<style scoped>
.node {
  width: 25px;
  height: 25px;
  outline: 1px solid #bdc3c7;
  display: inline-block;
}
.node-finish {
  background-color: #e74c3c;
}
.node-start {
  background-color: #2ecc71;
}
.node-wall {
  background-color: #2c3e50;
}
.node-maze-wall {
  animation-name: wallAnimated;
  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
@keyframes wallAnimated {
  0% {
    transform: scale(0.3);
    background-color: #2c3e50;
    border-radius: 100%;
  }

  50% {
    background-color: #2c3e50;
  }

  100% {
    transform: scale(1);
    background-color: #2c3e50;
  }
}

.node-visited {
  animation-name: visitedAnimation;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
@keyframes visitedAnimation {
  0% {
    transform: scale(0.3);
    background-color: #0b537b;
    border-radius: 100%;
  }

  50% {
    background-color: #398397;
  }

  75% {
    transform: scale(1.2);
    background-color: #5daab0;
  }

  100% {
    transform: scale(1);
    background-color: #81d1c8;
  }
}

.node-shortest-path {
  animation-name: shortestPath;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
@keyframes shortestPath {
  0% {
    transform: scale(0.6);
    background-color: #f1e20f;
  }

  50% {
    transform: scale(1.2);
    background-color: #f1e20f;
  }

  100% {
    transform: scale(1);
    background-color: #f1e20f;
  }
}
</style>
