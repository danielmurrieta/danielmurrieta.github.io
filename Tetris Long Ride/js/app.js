document.addEventListener('DOMContentLoaded', () => {

  const GRID_WIDTH = 10
  const GRID_HEIGHT = 20
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT


  const grid = createGrid();
  let cuadricula = Array.from(grid.querySelectorAll('div'))
  const empiezaBtn = document.querySelector('.button')
  const hamburguesaBtn = document.querySelector('.toggler')
  const menu = document.querySelector('.menu')
  const span = document.getElementsByClassName('close')[0]
  const puntuacionDisplay = document.querySelector('.score-display')
  const lineasDisplay = document.querySelector('.lines-score')
  let currentIndex = 0
  let currentRotacion = 0
  const width = 10
  let puntuacion = 0
  let lineas = 0
  let tiempoId
  let nextRandom = 0
  const colores = [
    'url(imagenes/azul_block.png)',
    'url(imagenes/rosa_block.png)',
    'url(imagenes/morado_block.png)',
    'url(imagenes/peach_block.png)',
    'url(imagenes/amarillo_block.png)'
  ]


  function createGrid() {
   
    let grid = document.querySelector(".grid")
    for (let i = 0; i < GRID_SIZE; i++) {
      let gridElement = document.createElement("div")
      grid.appendChild(gridElement)
    }

  
    for (let i = 0; i < GRID_WIDTH; i++) {
      let gridElement = document.createElement("div")
      gridElement.setAttribute("class", "block3")
      grid.appendChild(gridElement)
    }

    let previousGrid = document.querySelector(".previous-grid")
    
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div")
      previousGrid.appendChild(gridElement);
    }
    return grid;
  }


 
  function control(e) {
    if (e.keyCode === 39)
      mueveDerecha()
    else if (e.keyCode === 38)
      rota()
    else if (e.keyCode === 37)
      mueveIzquierda()
    else if (e.keyCode === 40)
      mueveAbajo()
  }

  document.addEventListener('keydown', control)


  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
  ]

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
  ]

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
  ]

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
  ]

  const losTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  
  let random = Math.floor(Math.random() * losTetrominos.length)
  let current = losTetrominos[random][currentRotacion]


  let currentPosition = 4
  
  function dibuja() {
    current.forEach(index => {
      cuadricula[currentPosition + index].classList.add('block')
      cuadricula[currentPosition + index].style.backgroundImage = colores[random]
    })
  }

  function redibuja() {
    current.forEach(index => {
      cuadricula[currentPosition + index].classList.remove('block')
      cuadricula[currentPosition + index].style.backgroundImage = 'none'
    })
  }

  function mueveAbajo() {
    redibuja()
    currentPosition = currentPosition += width
    dibuja()
    congela()
  }

  empiezaBtn.addEventListener('click', () => {
    if (tiempoId) {
      clearInterval(tiempoId)
      tiempoId = null
    } else {
      dibuja()
      tiempoId = setInterval(mueveAbajo, 1000)
      nextRandom = Math.floor(Math.random() * losTetrominos.length)
      displayShape()
    }
  })

  function mueveDerecha() {
    redibuja()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => cuadricula[currentPosition + index].classList.contains('block2'))) {
      currentPosition -= 1
    }
    dibuja()
  }

  function mueveIzquierda() {
    redibuja()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1
    if (current.some(index => cuadricula[currentPosition + index].classList.contains('block2'))) {
      currentPosition += 1
    }
    dibuja()
  }

  function congela() {
    if (current.some(index => cuadricula[currentPosition + index + width].classList.contains('block3') || cuadricula[currentPosition + index + width].classList.contains('block2'))) {
 
      current.forEach(index => cuadricula[index + currentPosition].classList.add('block2'))
     
      random = nextRandom
      nextRandom = Math.floor(Math.random() * losTetrominos.length)
      current = losTetrominos[random][currentRotacion]
      currentPosition = 4
      dibuja()
      displayShape()
      addScore()
      gameOver()
    }
  }
  congela()


  function rota() {
    redibuja()
    currentRotacion++
    if (currentRotacion === current.length) {
      currentRotacion = 0
    }
    current = losTetrominos[random][currentRotacion]
    dibuja()
  }


  function gameOver() {
    if (current.some(index => cuadricula[currentPosition + index].classList.contains('block2'))) {
      puntuacionDisplay.innerHTML = 'FIN'
      clearInterval(tiempoId)
    }
  }

  const displayWidth = 4
  const displaySquares = document.querySelectorAll('.previous-grid div')
  let displayIndex = 0

  const smallTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], 
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], 
    [1, displayWidth, displayWidth + 1, displayWidth + 2], 
    [0, 1, displayWidth, displayWidth + 1], 
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] 
  ]

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('block')
      square.style.backgroundImage = 'none'
    })
    smallTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('block')
      displaySquares[displayIndex + index].style.backgroundImage = colores[nextRandom]
    })
  }

  function addScore() {
    for (currentIndex = 0; currentIndex < GRID_SIZE; currentIndex += GRID_WIDTH) {
      const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
      if (row.every(index => cuadricula[index].classList.contains('block2'))) {
        puntuacion += 10
        lineas += 1
        puntuacionDisplay.innerHTML = puntuacion
        lineasDisplay.innerHTML = lineas
        row.forEach(index => {
          cuadricula[index].style.backgroundImage = 'none'
          cuadricula[index].classList.remove('block2') || cuadricula[index].classList.remove('block')

        })
        
        const squaresRemoved = cuadricula.splice(currentIndex, width)
        cuadricula = squaresRemoved.concat(cuadricula)
        cuadricula.forEach(cell => grid.appendChild(cell))
      }
    }
  }


  hamburguesaBtn.addEventListener('click', () => {
    menu.style.display = 'flex'
  })
  span.addEventListener('click', () => {
    menu.style.display = 'none'
  })

})

