var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
  x: 160,
  y: 160,

  //snakeの移動ベクトル
  dx: grid,
  dy: 0,

  //snakeの体がどの位置を通ったのかを保存する配列
  cells: [],

  //snakeの体の長さ。リンゴを食べると１増える。
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

var handler = null;

//minからmaxまでランダムな値を返す
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//ゲームのメイン関数
function loop(){
  handler = requestAnimationFrame(loop);

  //loop関数は１秒間に60回呼ばれるのは速すぎるため
  //1秒間に10回のみ移動するようにする(60/10 = 6)
  if(++count < 6){
    return;
  }

  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //(dx, dy)方向に進む
  snake.x += snake.dx;
  snake.y += snake.dy;

//壁に衝突した場合、ゲームが一時停止
if (collision()) {
  pause();
}

//snakeの次の位置をcellsの一番前に追加
snake.cells.unshift({x: snake.x, y: snake.y});

//cellsの長さがsnakeの長さより長くなった場合、一番古いcellを取り出す
if (snake.cells.length > snake.maxCells){
  snake.cells.pop();
}

//リンゴの描写
ctx.fillStyle = 'red';
ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

//snakeの体を1セルずつ描写
ctx.fillStyle = 'green';
snake.cells.forEach(function(cell, index){

  //snakeの体を描写
  ctx.fillRect(cell.x, cell.y, grid-1, grid-1);

  //snakeがリンゴを食べた場合
  if (cell.x === apple.x && cell.y === apple.y){
    snake.maxCells++;

    //キャンバスの大きさは400×400で、1つのセルの大きさは16×16のため、
    //25 (=400/16)のグリッドが存在し、その中のランダムな位置に次のリンゴが出現する
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
  }

  //snakeが自身の体と衝突していないかチェックする
  for (var i = index + 1; i < snake.cells.length; i++){
    //衝突を発見したためゲームを一時停止
    if(cell.x === snake.cells[i].x && cell.y === snake.cells[i].y){
      pause();
    }
  }
});
}

function collision(){
  if(snake.x < 0 || snake.x >= canvas.width){
    return true;
  }

  if(snake.y < 0 || snake.y >= canvas.height){
    return true;
  }
  return false;
}

function pause(){
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#cccccc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("REPLAY", canvas.width/2 - 50, canvas.height/2 - 30);
  ctx.font = "20px Arial";
  ctx.fillText("click anywhere", canvas.width/2 - 50, canvas.heigth/2);
  ctx.restore();
  cancelAnimationFrame(handler);
  document.addEventListener('click', replay);
}

function replay() {
  document.removeEventListener('click', replay);
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;

  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
  handler = requestAnimationFrame(loop);
}

//矢印キーで向きを変更するイベントの登録
//既に同じ方向を向いている場合は、影響がない
document.addEventListener('keydown', function(e){
  //左矢印キー
  if(e.which === 37 && snake.dx === 0){
    snake.dx = -grid;
    snake.dy = 0;
  }
  //上矢印キー
  else if(e.which === 38 && snake.dy === O){
    snake.dy = -grid;
    snake.dx = 0;
  }
  //右矢印キー
  else if (e.which === 39 && snake.dx === 0){
    snake.dx = grid;
    snake.dy = 0;
  }
  //下矢印キー
  else if(e.which === 40 && snake.dy === 0){
    snake.dy = grid;
    snake.dx = 0;
  }
});

//ゲームスタート
handler = requestAnimationFrame(loop);

