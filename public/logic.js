
var colors = [{name:"blue",value:"#1d5aff", code:1},
            {name:"green",value:"#024913", code:2},
            {name:"red",value:"#ff2c2c", code:3},
            {name:"black",value:"#242424", code:4},
            {name:"yellow",value:"#f2ff1d", code:5},
            {name:"orange",value:"#ff6b1b", code:6}];

var selectedColor; //TODO

var ctx;
var canvas;
var position = {x:0, y:0,zoom:1};
var size = 2000;


$(document).ready(()=>{
    //init colors
    colors.forEach((color)=>{
        $("#colors").append($("<div></div>").
        attr("class","color").attr("name",color.name).
        attr("style","background-color:"+color.value+";width:"+$("#colors").height()+"px"));
    });

    //little hack to make canvas not blurry
    $("#pixelfield").attr("width",$("#main").width()).attr("height", $("#main").height());

    canvas = document.getElementById("pixelfield");
    ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown", mouseDownListener, false);
    ctx.fillStyle = "#ffffff";
    render(position.x,position.y,position.zoom);
    canvas.onmousewheel = function(event){
        if(position.zoom <= 0.11 && event.wheelDelta < 0)return;
        position.zoom+=event.wheelDelta/1200;
        render(position.x, position.y, position.zoom);
    }

    $(".color").click((e)=>{
        $(".color").attr("class","color");
        var color = $(e.target);
        selectedColor = colors.filter(function(obj){
            return obj.name == color.attr("name");
        })[0];
        console.log(selectedColor);
        color.attr("class",color.attr("class")+" active");
        canvas.addEventListener("mousemove", mouseMoveListener, false);
        function mouseMoveListener(event){
            render(position.x,position.y,position.z);
            ctx.fillStyle = selectedColor.value;
            var xpos = Math.round(parseInt(event.clientX/position.zoom)/10);
            var ypos = Math.round(parseInt(event.clientY/position.zoom)/10);
            xpos = xpos*10+position.x%10-10;
            ypos = ypos*10+position.y%10-10;
            if(xpos < position.x || ypos < position.y || xpos > position.x+size-10 || ypos > position.y+size-10) return;
            ctx.fillRect(xpos,ypos,10,10);
        }
    });
});

function mouseDownListener(event){
    var startpos = {x:event.clientX,y:event.clientY};
    canvas.addEventListener("mousemove", mouseMoveListener,false);
    canvas.addEventListener("mouseup", mouseUpListener,false);
    
    $("#main").attr("style","cursor:-webkit-grabbing;");
    var oldpos = startpos;
    function mouseMoveListener(event){
        var difference = {  x: oldpos.x - event.clientX,
                            y: oldpos.y - event.clientY};
        oldpos = {x:event.clientX,y:event.clientY};
        //console.log(difference.x, difference.y);
        position = {x:position.x-difference.x / position.zoom,
                    y:position.y-difference.y / position.zoom,
                    zoom:position.zoom};
        render(position.x, position.y, position.zoom);
    }
    function mouseUpListener(event){
        $("#main").removeAttr("style");
        canvas.removeEventListener("mousemove",mouseMoveListener);
        canvas.removeEventListener("mouseup",mouseUpListener);
    }
}

function render(x,y,depth){
    $("#position").html("("+Math.round(x)+","+Math.round(y)+")");
    console.log(position);
    ctx.fillStyle = "#ffffff";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(position.zoom,position.zoom);
    ctx.fillRect(x,y,size,size);
    drawGrid(); 
}

$(window).resize(()=>{
    $("#pixelfield").attr("width",$("#main").width()).attr("height", $("#main").height());
    ctx.fillStyle = "#ffffff";
    render(position.x,position.y,position.zoom);
});


function drawGrid(){
    ctx.strokeStyle = "#7A7574";
    ctx.lineWidth=0.5;
    for(var i = 0; i <= size/10;i++){
        ctx.beginPath();
        ctx.moveTo(position.x + i*10,position.y);
        ctx.lineTo(position.x + i*10,position.y+size);
        ctx.stroke();
    }
    for(var i = 0; i <= size/10;i++){
        ctx.beginPath();
        ctx.moveTo(position.x,position.y + i*10);
        ctx.lineTo(position.x + size,position.y + i*10);
        ctx.stroke();
    }
}