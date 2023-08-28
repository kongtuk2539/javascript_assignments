const prompt = require('prompt-sync')({
    sigint: true
});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field = [
        []
    ]) {
        this.field = field;
        this.locationX = 0;
        this.locationY = 0;
        this.fieldHeight = field.length;
        this.fieldWidth = field[0].length;

        //this.field[this.locationY][this.locationX] = pathCharacter;

        do {
            this.locationX = Math.floor(Math.random() * this.fieldWidth); // Random X coordinate
            this.locationY = Math.floor(Math.random() * this.fieldHeight); // Random Y coordinate
            console.log("Do field before", this.field)
        } while (!this.isValidStart()); // Ensure a valid starting position
        this.field[this.locationY][this.locationX] = pathCharacter;
    }

    isValidStart() {
        // Check if the player character is surrounded by valid positions
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

    static getDifficultyLevel() {
        console.log("Choose difficulty level:");
        console.log("1. Beginner");
        console.log("2. Challenge");
        console.log("3. Sovereign");

        const choice = prompt("Enter the number of your choice: ");
        switch (choice) {
            case '1':
                return 0.1;
            case '2':
                return 0.2;
            case '3':
                return 0.3;
            default:
                console.log("Invalid choice. Using default difficulty.");
                return 0.2;
        }
    }

    play() {
        let playing = true;
        this.instructions(); //
        while (playing) {
            this.print();
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

    instructions() {
        console.log(
            "\n\n**INSTRUCTIONS:**\nFIND THE HAT! \nType U, D, L, R, (Up, Down, Left, Right) and hit enter to find the hat --> ^\nPress control + c to exit.\n"
        );
    }

    askQuestion() {
        const answer = prompt("Which way do you want to go? --> ").toLowerCase();
        switch (answer) {
            case "u":
                this.locationY -= 1;
                break;
            case "d":
                this.locationY += 1;
                break;
            case "l":
                this.locationX -= 1;
                break;
            case "r":
                this.locationX += 1;
                break;
            default:
                console.log("Invalid. Enter U, D, L or R.");
                this.askQuestion();
                break;
        }
    }

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
        // const displayString = this.field.join('\n');
        const displayString = this.field
            .map((row) => {
                return row.join(" ");
            })
            .join("\n");
        console.log(displayString);
    }

}

const difficultyLevel = Field.getDifficultyLevel();
const newField = new Field(Field.generateField(30, 30, difficultyLevel));
newField.play();