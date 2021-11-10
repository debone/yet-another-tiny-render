function addVertex(vertex: string, objVertexData, webglVertexData) {
  const ptn = vertex.split("/");
  ptn.forEach((objIndexStr, i) => {
    if (!objIndexStr) return;

    const objIndex = parseInt(objIndexStr);
    const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
    webglVertexData[i].push(...objVertexData[i][index]);
  });
}

export function parseObj(objString) {
  // obj files are base 1, that's why we start our arrays with stuff
  const objPositions = [[0, 0, 0]];
  const objTexCoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // TODO I'm not sure I want to keep data like this. I rather streamline?
  const objVertexData = [objPositions, objTexCoords, objNormals];

  // same order as `f` indices
  let webglVertexData = [
    [], // positions
    [], // texcoords
    [], // normals
  ];

  const keywords = {
    // positions
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    // normals
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    // texture coords
    vt(parts) {
      objTexCoords.push(parts.map(parseFloat));
    },
    // faces
    // f 1/2/3 2/3/4 3/4/5 position/texture/normal
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        // TODO I wonder if tri is missing from this first 
        addVertex(parts[0], objVertexData, webglVertexData);
        addVertex(parts[tri + 1], objVertexData, webglVertexData);
        addVertex(parts[tri + 2], objVertexData, webglVertexData);
      }
    },
  };

  const keywordRegex = /(\w*)(?: )*(.*)/;
  const lines = objString.split("\n");

  for (let lineNumber = 0; lineNumber < lines.length; ++lineNumber) {
    //console.debug(lines[lineNumber]);
    const line: string = lines[lineNumber].trim();

    if (line === "" || line.startsWith("#")) {
      continue;
    }

    const m = keywordRegex.exec(line);

    if (!m) {
      continue;
    }

    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];

    if (!handler) {
      console.warn("unhandled keyword:", keyword, "at line", lineNumber + 1);
      continue;
    }

    handler(parts, unparsedArgs);
  }

  return {
    position: webglVertexData[0],
    texcoord: webglVertexData[1],
    normal: webglVertexData[2],
  };
}
