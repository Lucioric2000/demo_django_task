// Controls
const oldColorInput = document.getElementById('old_color');
const oldColorLabel = document.getElementById('old_color_label');
const newColorInput = document.getElementById('new_color');
const toleranceInput = document.getElementById('tolerance');
const imageFileInput = document.getElementById('image_file');
const metalImageFileInput = document.getElementById('metal_image_file');
const changeColors = document.getElementById('change_colors');
const applyMetal = document.getElementById('apply_metal');
const palette = document.getElementById('palette');
const recreate_palette = document.getElementById('recreate_palette');
const max_colors_palette = document.getElementById('max_colors_palette');
const undo = document.getElementById('undo');
const download = document.getElementById('download');
const clip = document.getElementById('clip');
const metal_canvas = document.getElementById('metal_canvas');
const stage_width=700;
const stage_height=700;
// Simple variables and constants
let tr;
let trim_attributes=null;
const initialX = 0;
const initialY = 0;
let resize_scale_x = 1;
let resize_scale_y = 1;
// Color replacement information
let replaces_history = [];
let scale_on_trim = null;


// functions
function hexToRgb(hex) {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');

    // Parse the hex values
    const bigint = parseInt(hex, 16);

    // Extract the RGB components
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Return the RGB object
    return [r, g, b];
    //return { r: r, g: g, b: b };
}

function rgbToHex(r, g, b) {
    // Convert each individual component to a hex value
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    // Glue the hex values together
    return `#${rHex}${gHex}${bHex}`;
}

// Configure events
const palette_callback = function(evt) {
    const target_color=evt.target.fill();
    console.log("palette callback", evt);
    oldColorInput.value = target_color;
    oldColorLabel.innerText = target_color;
}

const replace_colors = function(from_color, to_color, tolerance, data) {
    console.log("replacing color from", from_color, "to", to_color, "at tolerance", tolerance);
    for(let i = 0; i < data.length; i += 4) {
        // Replace all red (255,0,0) pixels with white (255,255,255)
        const colordiff = Math.abs(data[i] - from_color[0]) + Math.abs(data[i + 1] - from_color[1]) + Math.abs(data[i + 2] - from_color[2]);
        if(colordiff<tolerance) {
            data[i] = to_color[0];     // red
            data[i + 1] = to_color[1]; // green
            data[i + 2] = to_color[2]; // blue
        }
    }
    return data;
}

// Define a custom filter function
const replaceColorFilter = function(imageData) {
    let data = imageData.data;
    const tolerance = parseInt(toleranceInput.value);
    const from_color = hexToRgb(oldColorInput.value);
    const to_color = hexToRgb(newColorInput.value);
    replaces_history.push([from_color, to_color, tolerance]);
    console.log("replaces_history is now", replaces_history);
    //I don't know why the image here is the original one, not the one with the filter applied,
    //so I have to apply the filter again for all the replaces in the history
    for (var i = 0; i < replaces_history.length; i++) {
        //if (i < (replaces_history.length - 1)) {
        //    continue;//now there is not needed to traverse all the steps
        //}
        data = replace_colors(replaces_history[i][0], replaces_history[i][1], replaces_history[i][2], data);
    }
};

const reReplaceColorFilter = function(imageData) {
    let data = imageData.data;
    //I don't know why the image here is the original one, not the one with the filter applied,
    //so I have to apply the filter again for all the replaces in the history
    for (let i = 0; i < replaces_history.length; i++) {
        //if (i < (replaces_history.length - 1)) {
        //    continue;//now there is not needed to traverse all the steps
        //}
        data = replace_colors(replaces_history[i][0], replaces_history[i][1], replaces_history[i][2], data);
    }
};
const applyMetalFilter = function(imageData) {
    let data = imageData.data;
    let ctx = metal_canvas.getContext('2d');
    // Get the ImageData object for the entire ImageBitmap
    let metalImageData = ctx.getImageData(0, 0, metal_canvas.width, metal_canvas.height);
    //I don't know why the image here is the original one, not the one with the filter applied,
    //so I have to apply the filter again for all the replaces in the history
    for(let i = 0; i < data.length; i += 4) {
        // Replace all red (255,0,0) pixels with white (255,255,255)
        const xy = i/4;
        const x = xy % imageData.width;
        const y = Math.floor(xy / imageData.width);
        let metalIndex = (y * metalImageData.width + x) * 4;
        let metalRed = metalImageData.data[metalIndex];
        let metalGreen = metalImageData.data[metalIndex+1];
        let metalBlue = metalImageData.data[metalIndex+2];
        let metalAlpha = metalImageData.data[metalIndex+3];
        //const colordiff = Math.abs(data[i] - from_color[0]) + Math.abs(data[i + 1] - from_color[1]) + Math.abs(data[i + 2] - from_color[2]);
        //if(colordiff<tolerance) {
        data[i] = 255-((255-data[i])+(255-metalRed))/2;     // red
        data[i + 1] = 255-((255-data[i+1])+(255-metalGreen))/2; // green
        data[i + 2] = 255-((255-data[i+2])+(255-metalBlue))/2; // blue
        //}
    }
    return data;

};

const color_diff = function(color1, color2) {
    return Math.abs(color1[0] - color2[0]) + Math.abs(color1[1] - color2[1]) + Math.abs(color1[2] - color2[2]);
};

function writeMessage(message) {
    console.log(message);
}

const parseColorFilter = function(imageData) {
    const palette_diff_tolerance = 40;
    const num_top_colors = parseInt(max_colors_palette.value);
    const data = imageData.data;
    let counter = {};
    for(let i = 0; i < data.length; i += 4) {
        const color= [data[i], data[i + 1], data[i + 2]];
        const color_str = color.join(",");
        counter[color_str] = counter[color_str] ? counter[color_str]+1 : 1;
    }
    const sorted_colors = Object.entries(counter).sort((a, b) => b[1] - a[1]);
    let top_colors = [];
    let i_top_color = 0;
    palette_layer.destroyChildren();
    for (let i_color = 0; i_color < sorted_colors.length; i_color++) {
        let color = sorted_colors[i_color][0].split(",").map(x => parseInt(x));
        let palette_color_close = false;
        for (let i_prev_top_color = 0; i_prev_top_color < top_colors.length; i_prev_top_color++) {
            if (color_diff(color, top_colors[i_prev_top_color][0]) < palette_diff_tolerance) {
                palette_color_close = true;
                break;
            }
        }
        if (palette_color_close) {
            continue;
        }
        const rect = new Konva.Rect({
            x: i_top_color * 20,
            y: 0,
            width: 20,
            height: 20,
            fill: rgbToHex(color[0], color[1], color[2]),
            stroke: 'black',
            strokeWidth: 1
        });
        rect.on('click', palette_callback);
        // write out drag and drop events
        rect.on('dragstart', function () {
            writeMessage('dragstart');
        });
        rect.on('dragend', function () {
            writeMessage('dragend');
        });

        top_colors.push([color, sorted_colors[i_color][1]]);
        palette_layer.add(rect);
        i_top_color += 1;
        if (i_top_color >= num_top_colors) {
            break;
        }
    }
    palette_layer.draw();
};

const image_changed = function (img) {
    replaces_history = [];
    if (stage.width()<img.width){
        stage.width(img.width);
    }
    if (stage.height()<img.height){
        stage.height(img.height);
    }
    logoNode = new Konva.Image({
        x: initialX,
        y: initialY,
        image: img,
        crop: false,
        width: img.width,
        height: img.height,
        draggable: true,
    });
    logoNode.setAttr('coordsUpLeft', {x: initialX, y: initialY});
    layer.add(logoNode);
    tr = new Konva.Transformer({
        nodes: [logoNode],
        keepRatio: false,
        flipEnabled: false,
        boundBoxFunc: (oldBox, newBox) => {
            //console.log("oldBox", (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10));
            if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
                return oldBox;
            }
            return newBox;
        },
    });
    layer.add(tr);
    logoNode.on('transform', () => {
        applyCrop(logoNode.getAttr('lastCropUsed'));
    });
    logoNode.on('dragend', function () {
        logoNode.setAttr('coordsUpLeft', {x: logoNode.x(), y: logoNode.y()});
    });
    applyCrop(clip.options[clip.selectedIndex].value);


    logoNode.cache();
    logoNode.filters([parseColorFilter]);
    layer.draw();
};

// function to calculate crop values from source image, its visible size and a crop strategy
function getCrop(image, size, img, clipPosition = 'center-middle') {
    const width = size.width;
    const height = size.height;
    const aspectRatio = width / height;

    let newCropWidth;
    let newCropHeight;
    let newWidth;
    let newHeight;

    const imageRatio = image.width / image.height;
    console.log("ir", imageRatio, image.width, image.height, width, height, aspectRatio);

    if (aspectRatio >= imageRatio) {
        newCropWidth = image.width*aspectRatio;
        newCropHeight = image.height;
        newWidth = tr.width();// / aspectRatio;
        newHeight = tr.height();
    } else {
        newCropWidth = image.width;
        newCropHeight = image.height/ aspectRatio;
        newWidth = tr.width();
        newHeight = tr.height();// * aspectRatio;
    }

    let x = 0;
    let y = 0;
    if (clipPosition === 'resize-left-top') {
        x = 0;
        y = 0;
        if (scale_on_trim != null) {
            console.log('scaX');
            var to_return= {
                cropX: x,
                cropY: y,
                cropWidth: newCropWidth,
                cropHeight: newCropHeight,
                scaleX: scale_on_trim.x,
                scaleY: scale_on_trim.y,
                width: newWidth,
                height: newHeight,
            };
            resize_scale_x = img.scaleX();
            resize_scale_y = img.scaleY();
            //scale_on_trim = null;
            return to_return;
        }
        resize_scale_x = img.scaleX();
        resize_scale_y = img.scaleY();
        console.log("cwi", newWidth, img.scaleX());
        return {
            cropX: x,
            cropY: y,
            cropWidth: newCropWidth,
            cropHeight: newCropHeight,
            width: newWidth,
            height: newHeight,
        };
    } else if (clipPosition === 'trim') {
        var coordsUpLeft = logoNode.getAttr('coordsUpLeft');
        x = img.x()-coordsUpLeft.x;
        y = img.y()-coordsUpLeft.y;
        //newWidth = width;
        //newHeight = height;
        console.log("tax", x, y, img.width(), width, image.width, size.width, "nw", image.naturalWidth);
        if (tr == null) {
            console.log("trn");
            return {
                cropX: x,
                cropY: y,
            }
        }
        console.log("try", x, tr.width(), img.scaleX());
        trim_attributes = {
            cropX: x/resize_scale_x,
            cropY: y/resize_scale_y,
            cropWidth: tr.width()/resize_scale_x,
            cropHeight: tr.height()/resize_scale_y,
        };
        scale_on_trim = {x: resize_scale_x, y: resize_scale_y}
        return trim_attributes;

        //console.log("sz", size.width, x, "w:", width, image.x, layer.x(), img.x(), layer.clipX(), stage.x());
    } else {
        console.error(
            new Error('Unknown clip position property - ' + clipPosition)
        );
    }
}

// function to apply crop
function applyCrop(pos) {
    logoNode.setAttr('lastCropUsed', pos);
    const crop = getCrop(
        logoNode.image(),
        { width: logoNode.width(), height: logoNode.height() },
        logoNode,
        pos
    );
    logoNode.setAttrs(crop);
    logoNode.cache();
    //layer.draw();
}


// Create a stage and layer using Konva
const stage = new Konva.Stage({
    container: 'container',
    width: stage_width,
    height: stage_height
});
var layer = new Konva.Layer();
stage.add(layer);

// Create a stage and layer using Konva
const palette_stage = new Konva.Stage({
    container: 'palette',
    width: 1000,
    height: 100
});
const palette_layer = new Konva.Layer();
palette_stage.add(palette_layer);

// Load an image and create a Konva.Image object
var logoImage = new Image();
logoImage.onload = function() {
    console.log("logoImage onload");
    const logo_node_already_present = logoNode !== null;
    if (logo_node_already_present) {
        console.log("destroying layer old children");
        layer.destroyChildren();
        //layer.remove(logoNode);
    } else {
        console.log("no layer old children to destroy");
    }
    image_changed(logoImage);
};
var logoNode=null;


// Configure events
imageFileInput.addEventListener("change", () => {
    console.log("imageFileInput change");
    if (imageFileInput.files.length === 1) {
        console.log("File selected: ", imageFileInput.files[0]);
    }
    logoImage.src = URL.createObjectURL(imageFileInput.files[0]);
    console.log("logoImage", logoImage);
});

changeColors.addEventListener('click', function() {
    // Change the color of the logo image
    logoNode.filters([replaceColorFilter, parseColorFilter]);
    logoNode.cache();

    layer.draw();
});

applyMetal.addEventListener('click', function() {
    // Change the color of the logo image
    logoNode.filters([applyMetalFilter, parseColorFilter]);
    logoNode.cache();

    layer.draw();
});

recreate_palette.addEventListener('click', function() {
    // Change the color of the logo image
    console.log("recreate palette", max_colors_palette.value, palette_layer);
    logoNode.filters([reReplaceColorFilter, parseColorFilter]);
    logoNode.cache();
    layer.draw();
});

undo.addEventListener('click', function() {
    // Change the color of the logo image
    console.log("will undo", replaces_history);
    replaces_history.pop();
    console.log("undo", replaces_history);
    logoNode.filters([reReplaceColorFilter, parseColorFilter]);
    logoNode.cache();
    layer.draw();
});
document.querySelector('#clip').onchange = (e) => {
    applyCrop(e.target.value);
};
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
download.addEventListener('click', function() {
    // Change the color of the logo image
    // Assuming stage is your Konva.Stage object
    var dataURL = logoNode.toDataURL({ pixelRatio: 3 });
    downloadURI(dataURL, 'stage.png');
});
metalImageFileInput.addEventListener('change', function(event) {
    let file = event.target.files[0];
    let imageBitmapPromise = createImageBitmap(file);
    imageBitmapPromise.then(function(imageBitmap) {
        // 'imageBitmap' is an ImageBitmap object representing the image data
        //metalImageBitmap = imageBitmap;
        let ctx = metal_canvas.getContext('2d');

        // Draw the ImageBitmap onto the canvas
        metal_canvas.width = imageBitmap.width;
        metal_canvas.height = imageBitmap.height;
        ctx.drawImage(imageBitmap, 0, 0);

    }).catch(function(error) {
        // Handle error
        console.error('Error:', error);
    });
});

//Initialization code for development
logoImage.src = "img/Dodgers.png";