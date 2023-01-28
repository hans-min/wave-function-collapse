class Module {
    constructor(img, edges) {
        this.img = img;
        this.edges = edges;  //top, right, bottom, left

        this.up = [];
        this.right = [];
        this.down = [];
        this.left = [];
    }

    rotate(n) {
        const w = this.img.width;
        const h = this.img.height;
        const newImg = createGraphics(w, h);
        newImg.imageMode(CENTER);
        newImg.translate(w / 2, h / 2);
        newImg.rotate(n * HALF_PI);
        newImg.image(this.img, 0, 0);

        const newEdges = [];
        const len = this.edges.length;
        for (let i = 0; i < len; i++) {
            newEdges[i] = this.edges[(i - n + len) % len];

        }
        return new Module(newImg, newEdges);
    }

    //find all possible U,R,D,L connections to this module
    analyze(modules) {
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            //top to bottom
            if (CompareSocket(this.edges[0], module.edges[2])) {
                this.up.push(i);
            }
            //right to left
            if (CompareSocket(this.edges[1], module.edges[3])) {
                this.right.push(i);
            }
            //bottom to top
            if (CompareSocket(this.edges[2], module.edges[0])) {
                this.down.push(i);
            }
            //left to right
            if (CompareSocket(this.edges[3], module.edges[1])) {
                this.left.push(i);
            }
        }
    }
}

function reverseString(str) {
    return str.split("").reverse().join("");
}

function CompareSocket(a, b) {
    return a == reverseString(b);
}


