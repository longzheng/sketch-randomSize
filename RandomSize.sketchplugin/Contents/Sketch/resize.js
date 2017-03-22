function onRun(context) {

  var sketch = context.api()
  var selection = context.selection;
  var doc = context.document;

  var options = ['Width', 'Height'];
  var choice = createSelect('Randomise width or height?', options, 0);

  // if dropdown prompt cancelled
  if (choice[0] == 1001)
    return;

  var maxSize = [doc askForUserInput:"Upper size?" initialValue:"0"];
  var minSize = [doc askForUserInput:"Lower size?" initialValue:"0"];

  for (var i = 0; i < selection.length; i++) {
    var layer = selection[i];
    var randomSize = getRandomInt(minSize, maxSize);

    switch (choice[1]) {
      case 0: // width
        layer.frame().setWidth(randomSize);
        break;
      case 1: // height
        var bottomY = layer.frame().y() + layer.frame().height(); // bottom Y position
        layer.frame().setHeight(randomSize);
        layer.frame().setY(bottomY - randomSize); // simulate align to bottom
        break;
    }
  }
  
}

// Create dropdown modal
function createSelect(msg, items, selectedItemIndex) {
  selectedItemIndex = selectedItemIndex || 0

  var accessory = [[NSComboBox alloc] initWithFrame:NSMakeRect(0, 0, 200, 25)]
  [accessory addItemsWithObjectValues: items]
    [accessory selectItemAtIndex:selectedItemIndex]

  var alert = [[NSAlert alloc] init]
  [alert setMessageText: msg]
    [alert addButtonWithTitle:'OK']
    [alert addButtonWithTitle:'Cancel']
    [alert setAccessoryView:accessory]

  var responseCode = [alert runModal]
  var sel = [accessory indexOfSelectedItem]

  return [responseCode, sel]
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  var min = parseInt(min);
  var max = parseInt(max);
  return Math.round((Math.random() * (max - min) + min), 0);
}