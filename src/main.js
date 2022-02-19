import kaboom from "kaboom"

kaboom()

const PIPE_GAP = height() / 2.5

let highScore = 0

loadSprite("bg", "sprites/bg.png")
loadSprite("yoko", "sprites/yoko.png")
loadSprite("pipe", "sprites/pipe.png")


scene("game", () => {
    let score = 0

    add([
        sprite("bg", {
            width: width(),
            height: height(),
        })
    ])

    const scoreText = add([
        text(score)
    ])

    const player = add([
        sprite("yoko"),
        pos(80, 40),
        area(),
        scale(0.25),
        body()
    ])

    const drawPipes = () => {

        const offset = rand(-height() / 4, height() / 4)

        add([
            sprite("pipe"),
            scale(4, 6),
            pos(width(), height() / 2 + PIPE_GAP / 2 + offset),
            "pipe",
            area(),
            {passed: false}
        ])

        add([
            sprite("pipe", {
                flipY: true
            }),
            scale(4, 6),
            pos(width(), height() / 2 - PIPE_GAP / 2 + offset),
            origin("botleft"),
            "pipe",
            area()
        ])
    }

    loop(2, () => {
        drawPipes()
    })

    action("pipe", (pipe) => {
        pipe.move(-width() / 6, 0)

        if (pipe.passed === false && player.pos.x > pipe.pos.x) {
            pipe.passed = true
            score++
            scoreText.text = score
        }
    })

    player.collides("pipe", () => {
        go("gameover", score)
    })

    player.action(() => {
        if (player.pos.y > height() + 30 || player.pos.y < -30) {
            go("gameover", score)
        }
    })

    onKeyPress("space", () => {
        player.jump(800)
    })
})

scene("gameover", (score) => {
    if (score > highScore) {
        highScore = score
    }

    add([
        text("Game over!\n" + "Score: " + score + "\nHigh score: " + highScore),
        pos(width() - width() / 2, height() - height() / 2)
    ])

    onKeyPress("space", () => {
        go("game")
    })
})

go("game")
