

export function loadYaml(sketch, world) {
    const yamlContent = sketch.loadStrings('scripts/caravan/data/world/aldreon.yaml', result => {
        const yamlString = result.join('\n');
        world.worldDict = jsyaml.load(yamlString);
      });
}

/*
* Populates nodes, regions, and subregions from a world dict
*/
export function traverseWorldData(sketch, worldData, nodes, regions, subregions, canvasWidth, canvasHeight) {
    function recursiveTraverse(cur, depth = 0) {
        cur.image_loaded = sketch.loadImage(`scripts/caravan/data/image/${cur.image}`)
        if (cur.children && cur.children.length > 0) {
            // Process non-leaf nodes with polygons
            if (cur.polygon) {
                cur.polygon = cur.polygon.map((coord) => ({
                    x: coord[0] * canvasWidth,
                    y: coord[1] * canvasHeight,
                }));
                if (depth === 1) regions.push({ ...cur, children: undefined });
                if (depth === 2) subregions.push({ ...cur, children: undefined });
            }
            cur.children.forEach((child) => recursiveTraverse(child, depth + 1));
        } else if (cur.coords) {
            // Leaf nodes
            cur.coords = {
                x: cur.coords[0] * canvasWidth,
                y: cur.coords[1] * canvasHeight,
            };
            // Statuses: 0: invisible, 1: visible, 2: visited
            cur.status = 0;
            nodes.push({ ...cur, children: undefined });
        }
    }

    recursiveTraverse(worldData);
}


export function populateEdges(world) {
    //Move edge data out of WorldData and into edges
    if (world.worldDict.edges) {
        world.worldDict.edges.forEach(edge => {
            world.edges.push(edge);
        });
    }
}
