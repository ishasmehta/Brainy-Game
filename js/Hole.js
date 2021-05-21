class Hole{
    constructor(width,height){
        this.status = "blank";
        this.x = null;
        this.y = null;
        this.width = width;
        this.height = height;
        this.box = null;
    }
    display(){
        rectMode(CENTER);
        fill("#dddddd");
        stroke("gray");
        rect(this.x,this.y,this.width,this.height);
    }
    assignBox(box){
        this.box = box;
    }
}