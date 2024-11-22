
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

function renderPlate(platejson){
  const canvas = document.getElementById("plateCanvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
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
    width = width+rad;
    rad = rad/2;
    console.log("width" + ":" + width);
    console.log("rad" + ":" + rad);
    const scaleValue = 780/width;
    padding = 10
    for (well in platejson){
      xpos = (platejson[well].x+rad)*scaleValue;
      ypos = (platejson[well].y+rad)*scaleValue;
      ctx.beginPath();
      ctx.arc( xpos+padding, ypos+padding, rad*scaleValue, 0, Math.PI * 2, true);
      ctx.stroke();
    }
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


