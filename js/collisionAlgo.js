function isTouching(obj1,obj2){
    if(abs(obj1.x - obj2.x) <= (obj1.width + obj2.width)/2 &&
        abs(obj1.y - obj2.y) <= (obj1.height + obj2.height)/2){
        return true;
    }
    else
        return false;
}