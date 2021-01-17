var canvas;
var gl;

var indices = []; // To keep the indices of triangle vertices

var kirmizi= 0.0;
var mavi= 0.0;
var yesil= 0.0;
var redLoc;
var greenLoc;
var blueLoc;

var delay = 60;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

// verilen şeklin vertex koordinatları
var vertices = [ 
	-3.0 , -1.0, -3.0, 
	4.0, -2.0, -2.0,
	0.0, 0.0, 0.0,

	1.0, 2.0, -1.0,
	4.0, -2.0, -2.0,
	0.0, 0.0, 0.0,
	
]; 


var quads = [ 
	1,1,1 ,2,2,2, 3,3,3, 4,4,4,
	4,4,4,3,3,3,5,5,5,6,6,6,
	2,2,2,7,7,7,8,8,8,3,3,3,
	3,3,3,8,8,8,9,9,9,5,5,5,
	7,7,7,10,10,10,11,11,11,8,8,8,
	8,8,8,11,11,11,12,12,12,9,9,9,
	
];



window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	ucgenHazirla();
	
	var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);
	
	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
	
	modelViewMatrix = rotateX(0);
	projectionMatrix = ortho(-6.0, 6.0, -5.0,5.0, -20.0, 20.0);
	
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix));
	redLoc = gl.getUniformLocation(program, "red");
    greenLoc = gl.getUniformLocation(program, "green");
    blueLoc = gl.getUniformLocation(program, "blue");

	document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    
     if (e.keyCode == '75') { //k ile kkirmizi
      kirmizi += 0.125;
    }
    else if (e.keyCode == '89') { // y ile yesil
      yesil += 0.125;
    }
    else if (e.keyCode == '77') { //m ile mavi
      mavi += 0.125;
	}
	else if(e.keyCode == '83')  //s ile sıfırlar
	{
		kirmizi = 0;
		yesil = 0;
		mavi = 0;
	}
  
}

	render();
};

function ucgenHazirla() {
	for (var i = 0; i < quads.length; i+=12) {
		indices.push(quads[i]-1, quads[i+3]-1, quads[i+6]-1); 
		indices.push(quads[i]-1, quads[i+6]-1, quads[i+9]-1); 
	}
	
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT);

	gl.uniform1f(blueLoc, mavi);
	gl.uniform1f(greenLoc, yesil);
    gl.uniform1f(redLoc, kirmizi);
    
	
	
    for( var i=0; i<indices.length; i+=3)
	   gl.drawElements( gl.LINE_LOOP, 3, gl.UNSIGNED_BYTE, i ); //line loop formatında çizdirir.

	   setTimeout(
        function (){requestAnimFrame(render);}, delay
    );

}