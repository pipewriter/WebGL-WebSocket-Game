const imgConfig = {
    vertFile: "imgVert.glsl",
    fragFile: "imgFrag.glsl",
    imageUrl: "ff.png",
    vertAttributes: [
        {
            handle: "vertPos",
            size: 3
        },
        {
            handle: "vertColor",
            size:3
        },
        {
            handle: "textureCord",
            size: 2
        }
    ]
}

async function initializeImageFromConfig({vertFile, fragFile, imageUrl, vertAttributes}){
    let gl = window.gl;
    let [vertCode, fragCode, imageEl] = await Promise.all([
        window.utils.makeRequest("GET", vertFile),
        window.utils.makeRequest("GET", fragFile),
        window.utils.loadImageElement(imageUrl)
    ]);
    console.log(vertCode);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageEl);

    function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
    
    if (isPowerOf2(imageEl.width) && isPowerOf2(imageEl.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // No, it's not a power of 2. Turn of mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertCode);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragCode);
    gl.compileShader(fShader);

    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);  
        gl.deleteShader(fShader);
    }
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);  
        gl.deleteShader(vShader);
    }
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, fShader);
    gl.attachShader(shaderProgram, vShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
    }

    gl.useProgram(shaderProgram);

    const vertexBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer1);
    const triangleBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer1);

    const uSampler = gl.getUniformLocation(shaderProgram, 'uSampler');

    let stride = 0;
    let offset = 0;
    vertAttributes.forEach(attrib => {
        stride += attrib.size;
        attrib.location = gl.getAttribLocation(shaderProgram, attrib.handle);
        attrib.offset = offset;
        offset += attrib.size;
        console.log(attrib);
    });

    console.log(vertAttributes)
    return function _drawElements(vertexData, indexData){

        gl.useProgram(shaderProgram);

        gl.uniform1i(uSampler, 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer1);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexData),gl.STATIC_DRAW);

        for(const attrib of vertAttributes){
            gl.enableVertexAttribArray(attrib.location);
            gl.vertexAttribPointer(
                attrib.location,
                attrib.size,
                gl.FLOAT,
                false,
                stride * Float32Array.BYTES_PER_ELEMENT,
                attrib.offset * Float32Array.BYTES_PER_ELEMENT
            );
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer1);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexData),gl.STATIC_DRAW);

        gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_SHORT, 0);
    }
};