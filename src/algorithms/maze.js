export async function animateMaze(grid) {
    await animateBorder(grid)
    await generateMaze(grid)
}

async function animateBorder(grid) {
    const borders = await getGridBorder(grid);

    for await (let border of borders) {
        for await (let node of border) {
            if (
                !grid[node.row][node.col].isStart &&
                !grid[node.row][node.col].isFinish
            ) {
                grid[node.row][node.col].isWall = true;
                grid[node.row][node.col].isMazeWall = true;
            }
            await sleep(1);
        }
    }
}

async function getGridBorder(grid) {
    let firstRow = grid[0];
    let lastRow = grid[grid.length - 1];
    let rightCol = [];
    await grid.forEach(row => {
        rightCol.push(row[row.length - 1]);
    });
    let leftCol = [];
    await grid.forEach(row => {
        leftCol.push(row[0]);
    });

    return [firstRow, rightCol, lastRow.reverse(), leftCol.reverse()];
}

async function generateMaze(grid) {
    for (let col = 2; col < grid[0].length; col++) {
        let randomPassageAmount = await randomNum(1, 3);
        let randomPassage = []
        for (let i = 1; i <= randomPassageAmount; i++) {
            let random = await randomNum(1, 15)
            while (randomPassage.includes(random)) {
                random = await randomNum(1, 15)
            }
            randomPassage.push(random)
        }

        for (let row = 1; row < grid.length; row++) {
            if (col % 2 == 0 && !randomPassage.includes(row)) {
                if (
                    !grid[row][col].isStart &&
                    !grid[row][col].isFinish

                ) {
                    grid[row][col].isWall = true;
                    grid[row][col].isMazeWall = true;
                }

            }
            await sleep(1);
        }
    }
}


function randomNum(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

