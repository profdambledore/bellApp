var config = { // Config
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    backgroundColor: '#d3d3d3',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0.8
            },
            debug: true,
            debugBodyColor: 0x000000
        }
    },

    plugins: {
        scene: [{
            plugin: PhaserMatterCollisionPlugin,
            key: "matterCollision",
            mapping: "matterCollision"
        }]
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);

// Shortening variable
var bod = Phaser.Physics.Matter.Matter.Bodies;

// Phaser Built In functions
function preload() {
    // Preload function - only used to insert bellRing.mp3

}

function create() {
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
    var chainGroup = this.matter.world.nextGroup(true);

    // Bell object creation
    const bell = createBell(chainGroup)
    this.matter.world.add(bell);
    Phaser.Physics.Matter.Matter.Body.setPosition(bell, {x: 300, y: 300})
    Phaser.Physics.Matter.Matter.Body.setStatic(bell, true);

    // Clanger object creation
    // Clanger consits of a chain and a ball
    var cChain = this.matter.add.stack(300, 600, 7, 1, 0, 0, function (x, y) {
        return bod.rectangle(x, y - 20, 53, 20, {
            collisionFilter: { group: chainGroup }, // Allows to choose a group to not collide with, a collisionFilter
            chamfer: 5,
            density: 0.005,
            frictionAir: 0.05
        });
    });
    // Chain cChain objects together
    this.matter.add.chain(cChain, 0.3, 0, -0.3, 0, {
        stiffness: 1,
        length: 0,
        render: {
            visible: true
        }
    });
    this.matter.add.constraint(bell, cChain.bodies[0], 2, 0, {
        pointA: { x: 0, y: -60 },
        pointB: { x: -25, y: 0 }
    })

    // Create Clanger Ball
    var cCircle = this.matter.add.circle(300, 300, 30, {
        collisionFilter: { group: chainGroup }
    })
    this.matter.add.constraint(cCircle, cChain.bodies[cChain.bodies.length - 1], 0, 0, {
        pointA: { x: 0, y: 0 },
        pointB: { x: 25, y: 0 }
    })

    Phaser.Physics.Matter.Matter.Body.setPosition(cCircle, { x: 300, y: 300 })

    // Create Clanger Listeners
    this.matterCollision.addOnCollideStart({
        objectA: cCircle,
        objectB: bell,
        callback: onSensorCollision()
    });

}

function update() {

}

// Create functions
function createBell(chainGroup) {
    console.log("Creating Bell...")
    var rect1 = bod.rectangle(175, -175, 300, 50); // Top Piece
    var rect2 = bod.rectangle(0, 0, 50, 300); // Left Side
    var rect3 = bod.rectangle(350, 0, 50, 300); // Right Side
    var rect4 = bod.rectangle(175, -225, 125, 50); // Top Detail
    var rect5 = bod.rectangle(25, 175, 50, 50);
    var rect6 = bod.rectangle(325, 175, 50, 50);
    var circ = bod.circle(175, -150, 25, {
        collisionFilter: {group: chainGroup}
    })

    var built = Phaser.Physics.Matter.Matter.Body.create({
        parts: [rect1, rect2, rect3, rect4, rect5, rect6, circ],
    });

    console.log("Created Bell!  Exporting...")
    return built;
}

function onSensorCollision() {
    console.log("Hello");    
}