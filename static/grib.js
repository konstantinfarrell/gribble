
$(document).ready(function(e){

    // Picks a random number from 0 to 3.
    // Based on that number, returns a direction
    // and the closest point at which the square would
    // be off the screen.
    function goDirection(){
        var num = Math.floor(Math.random()*4);
        if(num==0){
            return ['top', $(document).height()];
        } else if(num==1){
            return ['left', $(document).width()];
        } else if(num==2){
            return ['top', -30];
        } else if(num==3){
            return ['left', -30];
        }
    }

    // Take RGB values and return a CSS formatted string representation.
    function toCSS(r,g,b){
        return "rgb("+r+","+g+","+b+")";
    }

    // Return a pseudorandom number between 0 and 255
    function rcv(){
        return Math.floor(Math.random()*256);
    }

    // Style up the body.
    $('body').css({
        'width': '100%',
        'height': '100%',
        'background-color': '#111',
        'overflow': 'hidden',
        'position': 'absolute'
    });

    // Now define the variables for each cell.
    // Note that memory only applies to cells that have been clicked.
    var size = [30, 30];
    var num = [$(document).width()/size[0], $(document).height()/size[1]];
    var memory = 3000;

    // Here's our main function.
    function gribble(x, y){
        var name = gribset(x,y);
        // Now pause for a bit before
        setTimeout(function(){
            shunt(name);
        }, memory);
    }

    function gribset(x,y){
        // From the x,y coordinates, grab the nearest
        // grid space and make sure there isn't something
        // in that space already. (We dont need to stack,
        // layers, just change the color of the last one)
        var index_X = Math.floor(x/size[0]);
        var index_Y = Math.floor(y/size[1]);
        var name = index_X + "_" + index_Y + "_cell";
        var exists = document.getElementById(name);
        if(exists == null){
            $("body").append("<div id='"+name+"'></div>");
            $("#"+name).css({'display': 'none'});
            $("#"+name).fadeIn(200).promise();
        }

        // Now add the color, place the square,
        // and pretty it up with some css.
        var color = toCSS(rcv(), rcv(), rcv());
        $("#"+name).css({
            'position': 'absolute',
            'background-color': color,
            'box-shadow': '0 0 1px '+color,
            'border-radius': '2px',
            'top': index_Y * size[1],
            'left': index_X * size[0],
            'width': size[0]-3,
            'height': size[1]-3
        });
        return name;
    }

    // Pick a direction, and animate the
    // movement of the square to the outside
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

    /*
    function gribbilation(x, y, times){
        var name = gribset(x,y);

        var times = times-1;

        if(times < 0){
            gribbilation(x+size[0],y, times);
            gribbilation(x,y+size[1], times);
            gribbilation(x-size[0],y, times);
            gribbilation(x,y-size[1], times);

            gribbilation(x+size[0],y+size[1], times);
            gribbilation(x+size[0],y-size[1], times);
            gribbilation(x-size[0],y+size[1], times);
            gribbilation(x-size[0],y-size[1], times);
        }
        $("#"+name).fadeOut(100).promise();
    }
    */

    // Also let users click to add a square.
    $(document).click(function(e){
        var x = e.clientX;
        var y = e.clientY;
        gribble(x, y);
    });

    // A demo function that places a square at a random
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
    demo_gribble();
});
