const sketch = require("sketch");

var onRun = function (context) {
  const doc = sketch.getSelectedDocument();
  const selectedLayers = doc.selectedLayers;

  if (selectedLayers.length === 0) {
    sketch.UI.message(`No layers selected`);
    return;
  }

  let widthOrHeight = "";
  let maxSize = 0;
  let minSize = 0;

  getWidthOrHeight()
    .then((result) => {
      widthOrHeight = result;
      return getSize("Maximum size?", 100);
    })
    .then((result) => {
      maxSize = result;
      return getSize("Minimum size?", 0);
    })
    .then((result) => {
      this.minSize = result;

      selectedLayers.forEach((layer) => {
        let randomSize = getRandomInt(minSize, maxSize);

        switch (widthOrHeight) {
          case "Width":
            layer.frame.width = randomSize;
            break;
          case "Height":
            var bottomY = layer.frame.y + layer.frame.height; // bottom Y position
            layer.frame.height = randomSize;
            layer.frame.y = bottomY - randomSize; // simulate align to bottom
            break;
        }
      });
    }).catch((e) => {
      console.log(e)
    });
};

var getWidthOrHeight = () => {
  return new Promise((resolve, reject) => {
    sketch.UI.getInputFromUser(
      "Randomise width or height?",
      {
        type: sketch.UI.INPUT_TYPE.selection,
        possibleValues: ["Width", "Height"],
      },
      (err, value) => {
        if (err) reject(err);
        resolve(value);
      }
    );
  });
};

var getSize = (prompt, initialValue) => {
  return new Promise((resolve, reject) => {
    sketch.UI.getInputFromUser(
      prompt,
      {
        initialValue: initialValue,
      },
      (err, value) => {
        if (err) reject(err);
        resolve(value);
      }
    );
  });
};

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
var getRandomInt = (min, max) => {
  var min = parseInt(min);
  var max = parseInt(max);
  return Math.round(Math.random() * (max - min) + min, 0);
};
