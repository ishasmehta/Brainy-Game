class Box{
    constructor(x,y,width,height,color){
        var options = {
            restitution:0,
            density:4,
            friction:1,
        }
        this.body = Bodies.rectangle(x,y,width,height,options);
        
        World.add(world,this.body);
        this.width = width;
        this.height = height;
        this.color = color;
        this.xIndex = null;
        this.yIndex = null;
    }
    display(){
        var pos = this.body.position;
        fill(this.color);
        stroke("green");
       // ellipseMode(RADIUS);
        ellipse(pos.x,pos.y,this.width,this.height);
    }
    setIndex(){
        
        var x = this.body.position.x;
        var y = this.body.position.x;
        this.xIndex = Math.floor(x / gridWidth);
        this.yIndex = Math.floor(y / gridHeight);
    }
}