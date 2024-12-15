// I am so sorry to anyone who has to work with this I literally did not know javascript at all when starting this project and was genuinely terrified of it 
// I still am
// but good luck deciphering this nightmare I did my best to comment it but honestly I dont even remember why I did some things lol
const output = {};
output["instructions"] = {};
const svgns = "http://www.w3.org/2000/svg";
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
let highlight = [];
let lastCell = " ";
function showFunction(divID) {
  document.getElementById(divID).classList.toggle("show");
}
function getCurrentPlate(){
  return JSON.parse(document.getElementById("plateSelector").value);
}
function returnIndex(arrayInput, target){
  let array = arrayInput
  const valueToFind = target;
  let index = -1;
  for (let i = 0; i < array.length; i++) {
    try {
      if (array[i].value === valueToFind) {
        index = i;
        return index;
      }
    } catch (error) {
      try {
        if (array[i] === valueToFind) {
          index = i;
          return index;
        }
      } catch (error) {
        
      }
      
    }
  }
}
function clear(){
  const circles = document.querySelectorAll('.circ');
  circles.forEach(element => {
    element.remove();
  });
  const labels = document.querySelectorAll('.wellLabel');
  labels.forEach(element => {
    element.remove();
  });
}

function getActiveForm(){
  return document.querySelector(".activeForm")
}

function childSearch(QS){
  let allQS = Array.from(document.querySelectorAll(QS)) 
  let childrenInActiveForm = []
  for (let i = 0; i < allQS.length; i++) {
    const searchObj = allQS[i];
    if (getActiveForm().contains(searchObj)) {
      childrenInActiveForm.push(searchObj)
    }
  }
  return childrenInActiveForm
}


function updateOutput(inkey,inval) {
  // sort of an event function that gets called whenever the output should be updated
  // the arguments are for setting the unique paramters of the method that will get used later by the translator 
  let highlightedElements = document.querySelectorAll(".highlightedWell")
  let wellids = [];
  let currentForm = getActiveForm().id
  let method = childSearch(".methodSelect")[0].value
  let contents = childSearch(".pumpDropdown")[0].value
  let units = childSearch(".unitSelect")[0].value
  highlightedElements.forEach( well => {
  wellids.push(well.id) 
  });
  wellids.sort(new Intl.Collator('en',{numeric:true, sensitivity:'accent'}).compare) // this sorts the well ids array because it normally returns a1, a10
  if (output[currentForm] === undefined) {
    output[currentForm] = {};
  }
  let parentdict = output[currentForm]
  parentdict["ids"] = wellids;
  parentdict["method"] = method;
  parentdict["contents"] = contents;
  parentdict["units"] = units;
  if (typeof inkey !== 'undefined' && typeof inval !== 'undefined') {
    parentdict["methodInfo"] = {};
    parentdict["methodInfo"][inkey] = inval;
  }
}
function highlightToggle(key) {
  let object = document.getElementById(key);
  object.classList.toggle("highlightedWell")
  updateOutput();
}

function highlightClear(key){
  let highlightedElements = document.querySelectorAll(".highlightedWell")
  highlightedElements.forEach(element => {
    element.classList.remove("highlightedWell");
  });
}
function renderPlate(){
  const platejson = getCurrentPlate();
  const lastplatejson = platejson
  const container = document.getElementById("SvgContainer");
  const canvas = document.getElementById("plateSvgElement");
  const rect = canvas.getBoundingClientRect();
  clear();
  rad = 99999; 
  width = 1;
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
  padding = 20; 
  width = width+(rad*2)+padding;
  const scaleVal = (rect.right-rect.left)/width;
  rad = 0.98*rad/2;
  for (well in platejson){
    const circle = document.createElementNS(svgns, 'circle');
    const text = document.createElementNS(svgns, 'text');
    /* set coordinates of the svg objects */
    xpos = ((platejson[well].x)+rad)*scaleVal+padding;
    ypos = ((platejson[well].y)+rad)*scaleVal+padding;
    const style = 'fill-opacity:40%; stroke: black; stroke-width: 2px;'
    const textfont = toString(rad*0.2) + "px";
    const fill = 'fill: blue;'
    const notfill = 'fill: gray;' 
    /* text html element attributes*/
    text.setAttributeNS(null, 'x', xpos );
    text.setAttributeNS(null, 'y', ypos);
    text.setAttributeNS(null, 'text-anchor', "middle");
    text.setAttributeNS(null, 'class', "wellLabel");
    text.style = textfont
    text.textContent = well;
    /* Circle html element attributes*/
    circle.setAttributeNS(null, 'cx', xpos);
    circle.setAttributeNS(null, 'cy', ypos);
    circle.setAttributeNS(null, 'r', rad*scaleVal);
    circle.setAttributeNS(null, 'id', well);
    circle.setAttributeNS(null, 'class', "circ notfill");
    canvas.appendChild(circle);
    canvas.appendChild(text);
    canvas.setAttribute("height", ypos+(rad*scaleVal)+padding);
    circle.addEventListener("mouseover", function(e) {
      if (this.getAttributeNS(null,"id") === lastCell){

      }else{
        if (e.shiftKey){
          highlightToggle(this.id,)
        }
      }
    });
    circle.addEventListener("mousedown", function(e) {
      highlightToggle(this.id)
    });
  }
}
document.addEventListener("resize", (event) => {renderPlate(lastplatejson)});

/* experiment programmer stuff*/

//dropdown null item remover listener,
//this has to be refreshed every time there is a new form added but also has to be called at the start for the dropdowns that already exist so its just a function 
function selectorNullItemRemove(){
  const selectElements = document.querySelectorAll('select')
  selectElements.forEach(select => {
      select.addEventListener("change", function () {
        const emptyOpt = select.options[returnIndex(select.options, "empty")]
        emptyOpt.remove();
      }, { once: true });
    });
}
// duplicator function
function makeCopy() {
  const target = document.getElementById("formContainer");
  const source = document.getElementById("instructionformtemp");
  const clone = source.cloneNode(true);
  target.appendChild(clone);
  clone.id = "instructionform" + target.childElementCount;
  setActiveForm(clone);
  selectorNullItemRemove()
}
//this is a function for finding an "aunt" container (parents parents child[of "auntClass" ])
function auntContainer(me, auntClass){
  const grandparent = me.parentElement.parentElement;
  for (const child of grandparent.children){ if ( child.className === auntClass ){ return child;  }}
}

function updateMethod(localSelect){
  const activeForm = getActiveForm().id
  methodContainer = auntContainer(localSelect, "methodContainer")
  for (const child of methodContainer.children){child.remove();}
  const method = localSelect.value;
  const formbody = document.getElementById(method);
  const methodForm = formbody.cloneNode(true);
  methodContainer.appendChild(methodForm)
  output[activeForm] = {}
  output[activeForm]["method"] = method;
  console.log(output)
}
//dropdown search filter
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
// functions for exchanging plate highlight information with the 
function unique(input, array) {
  let unique = false;
  for (let i = 0; i < array.length; i++) {
    if (input === array[i]) {
      unique = false;
      break;
    }else{
      unique = true;
    }
  }
  return unique;
}
function toggleAN(input){
  if (Number.isInteger(input)) {
    return alphabet[input]
  }else{
    return alphabet.indexOf(input);
  }
}
function row(well){
  return well.replace(/\d+/g, '');
}
function column(input){
  const match = input.match(/\d+/); // Matches one or more digits
  return match ? parseInt(match[0], 10) : null; // Convert to number, return null if no match
}
function orderWells(orderWellInput){
  let wella = orderWellInput[0]
  let wellb = orderWellInput[1]
  if (column(wella)*toggleAN(row(wella)) > column(wellb)*toggleAN(wellb)) {
    return [wella, wellb]
  }else{
    return [wella, wellb]
  }
}
function cornerHighlight(input) {
  let a = input[0]
  let b = input[1]
  const plate = getCurrentPlate();
  for (well in plate){
    let wellrow = toggleAN(row(well))
    let wellcolumn = column(well)
    let arow = toggleAN(row(a))
    let acolumn = column(a)
    let brow = toggleAN(row(b))
    let bcolumn = column(b)
    if (wellrow <= brow && wellcolumn <= bcolumn){
      if (wellrow >= arow && wellcolumn >= acolumn){
        highlightToggle(well)
      }
    }
  }
}




/*package and submit experiment*/
function logExperiment(url){
  let name = document.getElementById("title").value
  fetch(url, {
    body: JSON.stringify({
      instructions: output,
      name: name 
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((json) => console.log(json));
}



function verifyWellInput(form) {
  const cornerinput = [];
  plate = getCurrentPlate()
  inputforms = form.parentElement.children
  const in1 = inputforms[0].value
  const in2 = inputforms[1].value
  if (in1 in plate && in2 in plate){
    highlightClear();
    cornerHighlight(orderWells([in1,in2]))
  }
}
function setActiveForm(active) {
  try {
    let formKey = getActiveForm().id
    let shorthandContainer = childSearch(".shortHandInfoContainer")[0]
    let outputobj = output[formKey]
    let last  = outputobj.ids.length - 1
    console.log(last)
    shorthandContainer.innerHTML = "<p>" + outputobj.ids[0] + " - " + outputobj.ids[last] + ": " + outputobj.method + ": " + outputobj.contents + "</p>";
  } catch (error) {
  }finally{
    try {
      getActiveForm().setAttribute("class", "innactiveForm")
    } catch (error) {
    }finally{
    active.setAttribute("class","activeForm")
    highlightClear();
    wellinputs = childSearch(".wellSelector")
    verifyWellInput(wellinputs[0])
    }
  }
}
// this is overly complicated to delete because its programmed to set a "sibling" form to be the active form before removing itself 
function deleteform(obj){
  const formContainer = obj.parentElement.parentElement
  if (formContainer.className === "activeForm" ){
    try {
      if (formContainer.nextElementSibling.className === "instructionForm innactiveForm"){
        setActiveForm(formContainer.nextElementSibling);
      }
    } catch (error) {
      console.log("next empty")
      try {
        if(formContainer.previousElementSibling.className === "instructionForm innactiveForm" ){
          setActiveForm(formContainer.previousElementSibling);
        }
      } catch (error) {
        console.log("both empty")
      }
    }finally{
      formContainer.remove();
    }
  }else{
    formContainer.remove();
  }
}

function defineName(name) {
  
}

function pumpUpdatejs(updateValue){

  let pump = document.getElementById("selectPump").value

  fetch("/", {
    body: JSON.stringify({
      pump : pump,
      pumpValue: updateValue
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((json) => console.log(json));
}

//call on load
document.addEventListener('DOMContentLoaded', function() {
  const plateSelector = document.getElementById("plateSelector")
  selectorNullItemRemove()
});
