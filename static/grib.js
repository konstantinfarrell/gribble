// Now define the variables for each cell.
// Note that memory only applies to cells that have been clicked.
var size = 30;
var memory = 3000;

// Take RGB values and return a CSS formatted string representation.
function toCSS(r,g,b){
    return "rgb("+r+","+g+","+b+")";
}

// Return a pseudorandom number between 0 and 255
function rcv(){
    return Math.floor(Math.random()*256);
}

// Picks a random number from 0 to 3.
// Based on that number, returns a direction
// and the closest point at which the tile would
// be off the screen.
function goDirection(){
    var num = Math.floor(Math.random()*4);
    if(num==0){
        return ['top', $(document).height()];
    } else if(num==1){
        return ['left', $(document).width()];
    } else if(num==2){
        return ['top', -100];
    } else if(num==3){
        return ['left', -100];
    }
}

function gribble(x,y){
    var memory = Math.floor(Math.random()*2000+2000)
    // Create a gribble-tile, and shunt it.
    var name = gribset(x,y);
    // Now pause for a bit before
    setTimeout(function(){
        if(Math.floor(Math.random()*100)%10==0){
            $("#"+name).fadeOut(250).promise().done(function(){
                $("#"+name).remove();
            });
        } else {
            shunt(name);
        }
    }, memory);
}

function gribset(x,y){
    // From the x,y coordinates, grab the nearest
    // grid space and make sure there isn't something
    // in that space already. (We dont need to stack,
    // layers, just change the color of the last one)
    var index_X = Math.floor(x/size);
    var index_Y = Math.floor(y/size);
    var name = index_X + "_" + index_Y + "_cell";
    var exists = document.getElementById(name);
    if(exists == null){
        $("body").append("<div id='"+name+"'></div>");
        $("#"+name).css({'display': 'none'});
        $("#"+name).fadeIn(250).promise();
    }

    // Now add the color, place the tile,
    // and pretty it up with some css.
    var color = toCSS(rcv(), rcv(), rcv());
    $("#"+name).css({
        'position': 'absolute',
        'background-color': color,
        'box-shadow': '0 0 1px '+color,
        'border-radius': '2px',
        'top': index_Y * size,
        'left': index_X * size,
        'width': size-3,
        'height': size-3
    });
    return name;
}

// Pick a direction, and animate the
// movement of the tile to the outside
// of the page. Once that is done, remove it.
function shunt(name){
    var d = goDirection();
    var direction = d[0];
    var magnitude = d[1];
    var animation = {};
    var time = Math.floor(Math.random() * 600 + 300);
    animation[direction] = magnitude;
    $("#"+name).animate(animation,time).promise().done(function(){
        $("#"+name).remove();
    });
}

// A demo function that places a tile at a random
// location at a random time interval.
function demo_gribble(){
    var x = Math.floor(Math.random()* $(document).width());
    var y = Math.floor(Math.random()* $(document).height());
    var time = Math.floor(Math.random() * 450 + 50);
    gribble(x,y);
    setTimeout(function(){
        demo_gribble();
    }, time);
}

$(document).ready(function(e){
    // Style up the body.
    $('body').css({
        'width': '100%',
        'height': '100%',
        'background-color': '#111',
        'overflow': 'hidden',
        'position': 'absolute'
    });

    // Let users click to add a gribble-tile.
    $(document).click(function(e){
        var x = e.clientX;
        var y = e.clientY;
        gribble(x, y);
    });

    // Run the demo function
    demo_gribble();
});
