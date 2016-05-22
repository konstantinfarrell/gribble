
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

    // Append the container divs to the body and pretty them up with some css.
    $('body').append("<div id='grib-container'><div id='grib'></div></div>");
    function css(){
        $('body').css('overflow', 'hidden');
        $("#grib-container").css({
            'width': '100%',
            'height': '100%',
            'position': 'absolute'
        });

        $("#grib").css({
            'background-color': '#111',
            'width': '100%',
            'height': '100%',
            'margin': 'auto',
            'padding': '0',
            'position': 'relative'
        });
    }
    css();

    // Now define the variables for each cell.
    // Note that memory only applies to cells that have been clicked.
    var size = [30, 30];
    var num = [$(document).width()/size[0], $(document).height()/size[1]];
    var memory = 3000;

    // Here's our main function.
    function gribble(x, y){
        // From the x,y coordinates, grab the nearest
        // grid space and make sure there isn't something
        // in that space already. (We dont need to stack,
        // layers, just change the color of the last one)
        var index_X = Math.floor(x/size[0]);
        var index_Y = Math.floor(y/size[1]);
        var name = index_X + "_" + index_Y + "_cell";
        var exists = document.getElementById(name);
        if(exists == null){
            $("#grib").append("<div id='"+name+"'></div>");
            $("#"+name).css({'display': 'none'});
            $("#"+name).fadeIn(100).promise();
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

        // Now pause for a bit before
        // picking a direction, and animating
        // the movement of the square to the outside
        // of the page.
        // Once that is done, remove it.
        setTimeout(function(){
            var d = goDirection();
            var direction = d[0];
            var magnitude = d[1];
            var animation = {};
            var time = Math.floor(Math.random() * 600 + 300);
            animation[direction] = magnitude;
            $("#"+name).animate(animation,time).promise().done(function(){
                $("#"+name).remove();
            });

        }, memory);
    }

    // Also let users click to add a square.
    $("#grib").click(function(e){
        var x = e.clientX;
        var y = e.clientY;
        gribble(x, y);
    });

    // A demo function that places a square at a random
    // location at a random time interval.
    function demo_gribble(){
        var x = Math.floor(Math.random()* $(document).width());
        var y = Math.floor(Math.random()* $(document).height());
        var time = Math.floor(Math.random() * 750 + 50);
        gribble(x,y);
        setTimeout(function(){
            demo_gribble();
        }, time);
    }
    demo_gribble();
});
