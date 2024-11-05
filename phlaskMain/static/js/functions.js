/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showFunction(divID) {
  document.getElementById(divID).classList.toggle("show");
}
// this doest work because jinja works by going through the rendered template and replacing all of the {{ }} tags with whatever
// python information that they encode for and it doesnt also go through a static script document
function incrementfunction(){
  const incrementUrl = {{ url_for("test.incrementTest") }};
  fetch(incrementUrl); 
  document.getElementById("counterelement").inerHTML = "{{ session.get('ExperimentInstructionCount')  }}";
  
}

function makeCopy(counter) {
  /*
 this function takes a counter as an input that allows it to assign a unique ID to each of the form divs
  */
  const target = document.getElementById("formContainer");
  const source = document.getElementById("form-");
  const clone = source.cloneNode(true);
  const newID = "form-"+ counter; 
  clone.setAttribute("id", newID);
  target.appendChild(clone);
  
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


