export function loadWorldAsync(sketch, world, worldPath) {
    return new Promise((resolve, reject) => {
        sketch.loadStrings(
            worldPath,
            result => {
                if (!result) {
                    reject(new Error("Failed to load strings: result is undefined"));
                    return;
                }
                try {
                    const yamlString = result.join('\n');
                    world.worldDict = jsyaml.load(yamlString);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            },
            err => {
                reject(err);
            }
        );
    });
}

export async function loadConfigAsync(sketch, gameState, config) {
    while (!gameState.configPath) {
        await new Promise(resolve => setTimeout(resolve, 10)); // Check every 10ms
    }

    const aldreonButton = sketch.select('#aldreon-button');
    aldreonButton.remove();

    const vesperCityButton = sketch.select('#vesper-city-button');
    vesperCityButton.remove();

    return new Promise((resolve, reject) => {
        sketch.loadStrings(
            gameState.configPath,
            result => {
                if (!result) {
                    reject(new Error("Failed to load strings: result is undefined"));
                    return;
                }
                try {
                    const yamlString = result.join('\n');
                    const loadedConfig = jsyaml.load(yamlString);
                    Object.assign(config, loadedConfig);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            },
            err => {
                reject(err);
            }
        );
    });    
}

/*
* Populates nodes, regions, and subregions from a world dict
*/
export function traverseWorldData(sketch, config, worldData, nodes, regions, subregions) {
    function recursiveTraverse(cur, depth = 0) {
        cur.image_loaded = sketch.loadImage(`${config.imageDirectory}${cur.image}`)
        if (cur.children && cur.children.length > 0) {
            // Process non-leaf nodes with polygons
            if (cur.polygon) {
                cur.polygon = cur.polygon.map((coord) => ({
                    x: coord[0] * sketch.width,
                    y: coord[1] * sketch.height,
                }));
                if (depth === 1) regions.push({ ...cur, children: undefined });
                if (depth === 2) subregions.push({ ...cur, children: undefined });
            }
            cur.children.forEach((child) => recursiveTraverse(child, depth + 1));
        } else if (cur.coords) {
            // Leaf nodes
            cur.coords = {
                x: cur.coords[0] * sketch.width,
                y: cur.coords[1] * sketch.height,
            };
            // Statuses: 0: invisible, 1: visible, 2: visited
            cur.status = 1;
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
