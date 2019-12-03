<template>
  <div class="mine_sweeping">
    <div class="nav" :style="{width:WIDTH+'px'}">
      <div id="setting">
        <select v-model="selected">
          <option value="low">低难度</option>
          <option value="middle">中等难度</option>
          <option value="high">高难度</option>
        </select>
      </div>
      <div class="mines">
        <span>🚩</span>
        {{remainings}}
      </div>
      <div class="time">
        <span>⏱</span>
        {{seconds}}
      </div>
    </div>
    <div
      class="map"
      @click.left="leftClick"
      @click.right.prevent="rightClick"
      :style="{width:getWidth()+'px',height:getHeight()+'px'}"
    >
      <ul v-for="(column,ci) in cells" :key="ci">
        <li
          v-for="(row, ri) in column"
          :key="ri"
          :id="getID(ci,ri)"
          :style="{width: size+'px',height: size+'px',background: getColor(ci,ri),color: setColor(ci,ri,'font'),'line-height': size+'px'}"
        >
          {{getNum(ci,ri)}}
          <span v-if="showFlag(ci,ri)" :id="getID(ci,ri)">🚩</span>
          <div class="mineWraper" v-if="seen(ci,ri)">
            <div
              class="mine"
              :style="{background:setColor(ci,ri,'mine'),width:20+'px',height:20+'px'}"
            ></div>
            <span v-if="show(ci,ri) ">❌</span>
          </div>
        </li>
      </ul>
      <div v-if="gameOver" class="again">
        <div class="image"></div>
        <div class="tryAgain" @click.left="tryAgain" name ='try'>
          <span >▶</span>
          <p >再试一次吧</p>
        </div>
      </div>
      <div  v-if="isSuccess()" class="success">
        <div class="info">
          <p>挑战成功</p>
          <span>用时 : {{seconds}}</span>
        </div>
        <div class="tryAgain" @click.left="tryAgain" name='try'>
          <span>▶</span>
          <p>再玩一次吧</p>
        </div>
      </div>
      <div v-if="gameOver" :style="{width: getWidth()+'px',height: getHeight()+'px'}" class="shade"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MineSweeping",
  data() {
    return {
      gameOver: false,
      gameStart: false,
      ROW: 14,
      COLUMN: 18,
      MINE_COUNT: 40,
      size: 40,
      selected: "middle",
      seconds: '00:00',
      cells: "",
      mineCoordinate: "",
      remainings: 40,
      current: "",
      times:'',
      openedCells:0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 初始化游戏
     */
    init() {
      clearInterval(this.times)

      // 生成游戏画板
      this.createBoard();

      // 埋雷
      this.setMines();

      // 计算每个格子周围的扫雷数量
      this.calculateSurroundingMines();

      // 重置属性
      this.reset()

    },
    timing () {
      let time = 0
      this.times = setInterval(() => {
        time++
        let mins = ( parseInt(time / 60) > 9) ? parseInt(time / 60) : ( '0' + parseInt(time / 60))
        let seconds = (time % 60 > 9) ? time % 60 : ('0' + time % 60)
        this.seconds = mins + ':' + seconds
      }, 1000);
    },
    reset(){
      this.remainings = this.MINE_COUNT;
      this.openedCells = 0
      this.seconds = '00:00'
      this.gameOver = false
      this.gameStart = false
    },
    createBoard() {
      let options = {
        num: 0,
        isOpened: false,
        isMine: false,
        isFlaged: false
      };

      let board = new Array(this.COLUMN).fill(0).map(el => {
        console.log(el);
        return new Array(this.ROW).fill(0);
      });

      for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
          board[i][j] = { ...options };
        }
      }

      this.cells = board;
    },
    isSuccess(){

      if(this.openedCells === (this.ROW*this.COLUMN - this.MINE_COUNT)){

        clearInterval(this.times)
        return true

      } else {
        return false
      }

    },
    tryAgain(e) {
      console.log(e.target.name)
      this.gameOver = false;
      this.init();

    },
    showFlag(ci, ri) {
      let el = this.cells[ci][ri]    

      if(el.isMine && el.isOpened){
        return false
      } else {
        return el.isFlaged
      }

    },
    show(ci, ri) {
      return this.cells[ci][ri].isFlaged;
    },
    seen(ci, ri) {
      return this.cells[ci][ri].isMine && this.cells[ci][ri].isOpened ;
    },
    getID(ci, ri) {
      return `${ci}-${ri}`;
    },
    getWidth() {
      return this.size * this.COLUMN;
    },
    getHeight() {
      return this.size * this.ROW;
    },
    /**
     * 切换cell的背景色
     */
    getColor(ci, ri) {
      let cellCss = [
        "rgb(170,215,81)",
        "rgb(162,209,73)",
        "rgb(229,194,159)",
        "rgb(215,184,153)"
      ];
      
      if (this.cells[ci][ri].isOpened) {
        return (ci + ri) % 2 === 0 ? cellCss[2] : cellCss[3];
      } else {
        return (ci + ri) % 2 === 0 ? cellCss[0] : cellCss[1];
      }
    },
    getNum(ci, ri) {
      return this.cells[ci][ri].isOpened && this.cells[ci][ri].num > 0 ? 
        this.cells[ci][ri].num
        : 
        null;
    },
    setColor(ci, ri, type) {
      let num = this.cells[ci][ri].num;
      let colors = [
        "rgb(25,118,210)",
        "rgb(56,142,60)",
        "rgb(211,47,47)",
        "rgb(211,47,47)",
        "rgb(169,57,230)",
        "rgb(245,130,37)",
        "rgb(154,79,5)",
        "rgb(0,0,254)",
        "rgb(129,0,127)"
      ];

      if (type === "font") {
        return colors[num - 1];
      } else {
        let idx = (ci + ri) % 9;
        return colors[idx];
      }

    },
    /**
     * 随机生成n个地雷
     */
    setMines() {
      let board = this.cells;
      let coordinates = [];

      for (var i = 0; i < this.MINE_COUNT; i++) {

        let randomRowCoordinate = Math.floor(Math.random() * this.ROW);
        let randomColumnCoordinate = Math.floor(Math.random() * this.COLUMN);
        let coordinate = randomColumnCoordinate + "-" + randomRowCoordinate;

        if (coordinates.includes(coordinate)) {
          i--;
          continue;
        } else {
          coordinates.push(coordinate);
          board[randomColumnCoordinate][randomRowCoordinate].isMine = true;
        }

      }
      this.mineCoordinate = coordinates;
    },
    /**
     * 计算每隔格子周围的扫雷数量，遇到一个扫雷，扫雷周围数字+1
     */
    calculateSurroundingMines() {
      var board = this.cells;
      var count = 0;
      for (var column = 0; column < board.length; column++) {
        for (var row = 0; row < board[column].length; row++) {
          // 如果遇到了所有的扫雷，就不用再遍历了
          if (count <= this.MINE_COUNT && board[column][row].isMine) {
            // 读取扫雷周围cells
            let neighbors = this.getNeighbors(column, row);
            for (var i = 0; i < neighbors.length; i++) {
              let item = neighbors[i];
              let c = item[0];
              let r = item[1];
              if (!board[c][r].isMine) {
                board[c][r].num++;
              }
            }
          }
        }
      }
    },

    /**
     * 返回周围cell的坐标
     * @param {number} column 纵坐标
     * @param {number} row 横坐标
     */
    getNeighbors(column, row) {
      let board = this.cells;
      const neighbors = [];

      // 处理边界情况
      board[column - 1] &&
        board[column - 1][row - 1] &&
        neighbors.push([column - 1, row - 1]);
      board[column - 1] &&
        board[column - 1][row] &&
        neighbors.push([column - 1, row]);
      board[column - 1] &&
        board[column - 1][row + 1] &&
        neighbors.push([column - 1, row + 1]);
      board[column] &&
        board[column][row + 1] &&
        neighbors.push([column, row + 1]);
      board[column] &&
        board[column][row - 1] &&
        neighbors.push([column, row - 1]);
      board[column + 1] &&
        board[column + 1][row - 1] &&
        neighbors.push([column + 1, row - 1]);
      board[column + 1] &&
        board[column + 1][row] &&
        neighbors.push([column + 1, row]);
      board[column + 1] &&
        board[column + 1][row + 1] &&
        neighbors.push([column + 1, row + 1]);
      return neighbors;

    },
    leftClick(e, column, row) {

      let board = this.cells;
      if (e.target) {
        if(!e.target.id) return   
        column = Number(e.target.id.split("-")[0]);
        row = Number(e.target.id.split("-")[1]);
      }


      if(!this.gameStart) {
        this.gameStart = true
        this.timing()
      } 

      //递归条件，打开的就不用再打开，否则死循环
      if (!this.gameOver && !board[column][row].isFlaged && !board[column][row].isOpened) {
        if (
          board[column][row].num === 0 &&
          !board[column][row].isOpened &&
          !board[column][row].isMine
        ) {
          board[column][row].isOpened = true;
          this.openedCells++
          this.isSuccess()

          let neighbors = this.getNeighbors(column, row);
          
          for (var j = 0; j < neighbors.length; j++) {
            let item = neighbors[j];
            this.leftClick("_", item[0], item[1]);
          }

        } else if (board[column][row].isMine) {
          var count = 0, timer;

          for (let i = 0; i < this.mineCoordinate.length; i++) {
            let el = this.mineCoordinate[i];
            let ci = el.split("-")[0];
            let ri = el.split("-")[1];

            timer = setTimeout(() => {
              if (count === 0) {
                clearInterval(this.times)
                count++;
                board[column][row].isOpened = true;
              } else {
                count++;
                board[ci][ri].isOpened = true;
              }
              if (count === this.MINE_COUNT) {
                clearTimeout(timer);
                this.gameOver = true;
              }
            }, i * 100);

          }
          return;
        } else if (board[column][row].num !== 0) {
          //显示数字
          board[column][row].isOpened = true;
          this.openedCells++
          this.isSuccess()
        }
      }
    },
    /**
     * 右键标记为旗
     */
    rightClick(e) {
      
      e.preventDefault();
      
      let board = this.cells, column, row;

      if (e.target) {
        column = Number(e.target.id.split("-")[0]);
        row = Number(e.target.id.split("-")[1]);
      }

      if (this.remainings) {
        if (board[column][row].isFlaged) {
          board[column][row].isFlaged = false;
          this.remainings++;
        } else {
          board[column][row].isFlaged = true;
          this.remainings--;
        }
      }

    }
  },
  computed: {
    WIDTH() {
      return this.size * this.COLUMN;
    }
  },
  /**
   * watch难度变化，重置游戏画板
   */
  watch: {
    selected(val) {
      switch (val) {
        case "low":
          this.ROW = 8;
          this.COLUMN = 10;
          this.MINE_COUNT = 10;
          this.remainings = 10;
          this.size = 55;
          this.init();
          break;
        case "middle":
          this.ROW = 14;
          this.COLUMN = 18;
          this.MINE_COUNT = 40;
          this.remainings = 40;
          this.size = 40;
          this.init();
          break;
        case "high":
          this.ROW = 20;
          this.COLUMN = 24;
          this.MINE_COUNT = 100;
          this.remainings = 100;
          this.size = 35;
          this.init();
          break;
      }
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.mine_sweeping {
  margin-left: 400px;
  margin-top: 80px;
}
.nav {
  background-color: rgb(74, 117, 44);
  height: 75px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 30px;
  select {
    font-size: 18px;
    width: 120px;
    height: 50px;
  }
}
.map {
  position: relative;
  ul,
  li {
    list-style: none;
  }
  ul {
    float: left;
  }
  li {
    text-align: center;
    position: relative;
    font-weight: 600
  }
  .mineWraper {
    width: 100%;
    height: 100%;
    position: relative;
    .mine {
      width: 50%;
      height: 50%;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    span {
      position: absolute;
      left: 51%;
      top: 47%;
      transform: translate(-50%, -50%);
    }
  }
}
.again {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 50px;
  border-radius: 5px;
  font-size: 20px;
  background-color: rgb(74, 117, 44);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    margin-left: 15px;
    display: inline-block;
  }
  .image {
    // background-image: url("../src/mine_image.png");
    border-radius: 20px;
  }
}
.success{
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  .info{
    padding: 20px;
    width: 100%;
    background-color: #fff;
    font-size: 25px;
    border-radius: 5px;
    p{
      font-size: 30px;
      color: orangered;
      margin-top: 10px;
    }
  }
  .tryAgain{
    margin-top: 20px;
    background-color: rgb(74, 117, 44);
    height: 50px;
    border-radius: 5px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-weight: 600

  }
}
.shade {
  position: absolute;
  z-index: 1;
  background-color: rgba(32, 32, 32, 0.3);
}
</style>

