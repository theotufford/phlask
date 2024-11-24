const svgns = "http://www.w3.org/2000/svg";
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showFunction(divID) {
  document.getElementById(divID).classList.toggle("show");
}


function makeCopy(object, container) {
  const target = document.getElementById(container);
  const source = document.getElementById(object);
  const clone = source.cloneNode(true);
  target.appendChild(clone);
  console.log(target.children)
  
}

function iHateCircles(){
  const circles = document.querySelectorAll('.circ');
  circles.forEach(element => {
    element.remove();
  });


}


document.addEventListener("mousedown", function(e) {

  mousedown = true;

});

document.addEventListener("mouseup", function(e) {

  mousedown = false;

});
highlight = [];

function renderPlate(platejson){
  const canvas = document.getElementById("plateCanvas");
  const rect = canvas.getBoundingClientRect();
  iHateCircles();
  rad = 99999; 
  width = 1;
  console.log(platejson);
  for (obj in platejson){
    if (platejson[obj].x != 0){
      if (platejson[obj].x < rad){
        rad = platejson[obj].x;
      }
    }
    if (platejson[obj].x > width) {
      width = platejson[obj].x;
    }
  }
  width = width+rad*2;
  const scaleval = (rect.right-rect.left)/width;
  console.log(scaleval)
  rad = 0.98*rad/2;
  padding = 5; 
  for (well in platejson){
    xpos = ((platejson[well].x+rad)+padding)*scaleval;
    ypos = ((platejson[well].y+rad)+padding)*scaleval;
    var circle = document.createElementNS(svgns, 'circle');
    const style = 'fill-opacity:10%; stroke: blue; stroke-width: 1px;'
    const fill = 'fill: blue;'
    const notfill = 'fill: gray;' 
    circle.setAttributeNS(null, 'cx', xpos);
    circle.setAttributeNS(null, 'cy', ypos);
    circle.setAttributeNS(null, 'r', rad*scaleval);
    circle.setAttributeNS(null, 'style', notfill + style );
    circle.setAttributeNS(null, 'id', well);
    circle.setAttributeNS(null, 'class', "circ");
    canvas.appendChild(circle);
    circle.addEventListener("mouseover", function(e) {
        if (e.shiftKey){
          if (this.getAttributeNS(null, 'style') === fill + style ){
            this.setAttributeNS(null, 'style', notfill + style)
            highlight.splice(highlight.indexOf(this.getAttributeNS(null,"id"), 1))
          }else{
            this.setAttributeNS(null, 'style', fill + style)
            highlight.push(this.getAttributeNS(null,"id"))
          }
        }
    });

    circle.addEventListener("mousedown", function(e) {
      if (this.getAttributeNS(null, 'style') === fill + style ){
        this.setAttributeNS(null, 'style', notfill + style)
        highlight.splice(highlight.indexOf(this.getAttributeNS(null,"id"), 1))
      }else{
        this.setAttributeNS(null, 'style', fill + style)
        highlight.push(this.getAttributeNS(null,"id"))
      }
    });
    circle.addEventListener("keydown", function(e) {
      if (e.shiftKey){
      if (this.getAttributeNS(null, 'style') === fill + style ){
        this.setAttributeNS(null, 'style', notfill + style)
        highlight.splice(highlight.indexOf(this.getAttributeNS(null,"id"), 1))
      }else{
        this.setAttributeNS(null, 'style', fill + style)
        highlight.push(this.getAttributeNS(null,"id"))
      }
      }
    });

  }
}


function logExperiment(){

  const target = document.getElementbyId("experimentContainer")
  fetch('programmer');

}

function filterFunction(inputobj,divobj) {
  const input = document.getElementById(inputobj);
  const filter = input.value.toUpperCase();
  const div = document.getElementById(divobj);
  const a = div.getElementsByTagName("a");
  for (let i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}


