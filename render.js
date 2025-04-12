function createShader(gl ,type ,source)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
            
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) return shader;

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl , vertexShader , fragmentShader)
{
    var prog = gl.createProgram();
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);

    var success = gl.getProgramParameter(prog , gl.LINK_STATUS);
    if(success) return prog;

    console.log(gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
}