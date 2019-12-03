# 💣mines_sweeping

用vue简单实现了一个扫雷游戏（仿造google游戏做的ui）

##### 主要功能

- 初始化游戏画板 ： 根据游戏难度，控制格子和扫雷的数量，根据初始化数据，生成一个二维数组，

  每个元素为一个对象（用于维护每个格子的状态）

- 随机生成扫雷💣，Math.random() 随机生成扫雷坐标，修改对应格子的状态。

  ```
  let randomRowCoordinate = Math.floor(Math.random() * this.ROW);
  let randomColumnCoordinate = Math.floor(Math.random() * this.COLUMN);
  ```

- 计算周围的扫雷数量

- **左键点开格子**

  这个是游戏的核心功能。大致的逻辑就是，如果点开一个格子周围没有扫雷，打开周围的格子，如果周围的格子里还有空白格（不是空白格就显示周围扫雷数量），继续打开周围的格子（这个过程是递归的）。

- 右键标记扫雷

  右键标记扫雷，显示🚩，扫雷剩余数量 -1





