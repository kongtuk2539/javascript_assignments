//add lib to project
const prompt = require('prompt-sync')({
    sigint: true
});

const clear = require('clear-screen')


// Define characters used in the game
const hat = '👒';
const hole = '🔳';
const fieldCharacter = '⬜';
const pathCharacter = '👮';

// Define the class for the game field
class Field {
    constructor(field = [
        []
    ]) {
        // Initialize the field and the player's starting position
        this.field = field;
        this.locationX = 0;
        this.locationY = 0;
        this.fieldHeight = field.length;
        this.fieldWidth = field[0].length;

        // Find a valid starting position for the player
        do {
            this.locationX = Math.floor(Math.random() * this.fieldWidth); // Random X coordinate
            this.locationY = Math.floor(Math.random() * this.fieldHeight); // Random Y coordinate

        } while (!this.isValidStart()); // Ensure a valid starting position
        this.field[this.locationY][this.locationX] = pathCharacter;
    }

    // Check if the player character is surrounded by valid positions
    isValidStart() {
        for (let y = this.locationY - 1; y <= this.locationY + 1; y++) {
            for (let x = this.locationX - 1; x <= this.locationX + 1; x++) {
                if (
                    y >= 0 && y < this.fieldHeight && x >= 0 && x < this.fieldWidth &&
                    (y !== this.locationY || x !== this.locationX) && // Exclude the current position
                    this.field[y][x] === hole
                ) {
                    return false;
                }
            }
        }
        return this.hasPathToHat(this.locationX, this.locationY);
    }

    /*Check if position player can find hat or not. Will there be a dead end? If yes, 
    it will rebuild the field until it finds a suitable level.*/
    hasPathToHat(startX, startY) {
        const visited = Array.from({
            length: this.fieldHeight
        }, () => Array(this.fieldWidth).fill(false));
        const queue = [{
            x: startX,
            y: startY
        }];

        while (queue.length > 0) {
            const {
                x,
                y
            } = queue.shift();
            if (x < 0 || x >= this.fieldWidth || y < 0 || y >= this.fieldHeight || visited[y][x] || this.field[y][x] === hole) {
                continue;
            }
            if (this.field[y][x] === hat) {
                return true;
            }
            visited[y][x] = true;
            queue.push({
                x: x - 1,
                y
            }, {
                x: x + 1,
                y
            }, {
                x,
                y: y - 1
            }, {
                x,
                y: y + 1
            });
        }
        return false;
    }


    /*This is a function used to generate this game. 
    It takes three parameters: height, length, and chance of hole.*/
    static generateField(height, width, percentage = 0.2) {
        let field = new Array(height);

        // Loop to create 2D array using 1D array
        for (let i = 0; i < field.length; i++) {
            field[i] = new Array(width);
        }

        // Loop to initilize 2D array elements.
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                const rand = Math.random();
                field[i][j] = rand > percentage ? fieldCharacter : hole;
            }
        }

        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
        };

        field[hatLocation.y][hatLocation.x] = hat;
        return field;
    }


    /*  is a function that is called before the game starts. Out array value, 
        here there are 3 values inside, height, width and chance of hole, 
        it is divided into difficulty levels for the player to choose and 
        it will return those values according to the difficulty of the player. play select
    */
    static getDifficultyLevel() {
        console.log("Choose difficulty level:");
        console.log("1. Beginner");
        console.log("2. Challenge");
        console.log("3. Only for God");
        let levelArr = [];

        const choice = prompt("Enter the number of your choice: ");

        switch (choice) {
            case '1':
                return levelArr = [10, 10, 0.1];
            case '2':
                return levelArr = [15, 15, 0.2];
            case '3':
                return levelArr = [20, 20, 0.3];
            default:
                console.log("Invalid choice. Using default difficulty.");
                return this.getDifficultyLevel();
        }

    }

    //used to clear fields
    clearField(){

        clear();
        this.instructions();
        this.print();

    }

    /*  It is a function that is used to start the game and 
        will explain the play and tell the player status.*/
    play() {
        let playing = true;
        this.instructions();
        while (playing) {
            this.print();
            this.clearField();
            this.askQuestion();
            if (!this.isInBounds()) {
                console.log("Whoops. Out of bounds!");
                playing = false;
                break;
            } else if (this.isHole()) {
                console.log("Sorry, you fell down a hole!");
                playing = false;
                break;
            } else if (this.isHat()) {
                console.log("Yay, you found your hat!");
                playing = false;
                break;
            }
            // Update the current location on the map
            this.field[this.locationY][this.locationX] = pathCharacter;
        }
    }

    //Tells how the play will be called by the play function.
    instructions() {
        console.log(
            "\n\n**INSTRUCTIONS:**\nFIND THE HAT! \nType W, S, A, D, (Up, Down, Left, Right) and hit enter to find the hat --> ^\nPress control + c to exit.\n"
        );
    }

    /*  It will check the value that the player enters and check 
        the condition that the player will go to the point of the field. */
    askQuestion() {
        const answer = prompt("Which way do you want to go? --> ").toLowerCase();
        switch (answer) {
            case "w":
                this.locationY -= 1;
                break;
            case "s":
                this.locationY += 1;
                break;
            case "a":
                this.locationX -= 1;
                break;
            case "d":
                this.locationX += 1;
                break;
            default:
                console.log("Invalid. Enter W, S, A or D.");
                this.askQuestion();
                break;
        }
    }

    /*  The following functions are used 
        to check conditions in the Play function. */
    isInBounds() {
        return (
            this.locationY >= 0 &&
            this.locationX >= 0 &&
            this.locationY < this.field.length &&
            this.locationX < this.field[0].length
        );
    }

    isHat() {
        return this.field[this.locationY][this.locationX] === hat;
    }

    isHole() {
        return this.field[this.locationY][this.locationX] === hole;
    }

    print() {
        const displayString = this.field
            .map((row) => {
                return row.join(" ");
            })
            .join("\n");
        console.log(displayString);
    }

}

/*  Call these functions to start the game with difficultyLevel 
    will tell you the difficulty level and will take 
    the received value as a parameter to create a field, 
    then call the play function to start playing according to the logic set */
const difficultyLevel = Field.getDifficultyLevel();
const newField = new Field(Field.generateField(difficultyLevel[0], difficultyLevel[1], difficultyLevel[2]));
newField.play();