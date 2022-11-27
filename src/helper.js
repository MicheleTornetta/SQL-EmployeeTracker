
/**
 * Generates a placeholder img tag.
 * @param {25} width 
 * @param {25} height 
 * @returns Image Tag
 */
 function renderPlaceholder(width, height){
    return `<img src="https://www.placecage.com/${width}/${height}" alt="placeholder image" />`;
  }
  
  module.exports = {
    renderPlaceholder
  };