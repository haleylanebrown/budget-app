// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastId from localStorage to set initial values (if they exist)
var budgetItems = JSON.parse(localStorage.getItem("budgetItems"));
var lastID = localStorage.getItem("lastID") || 0

// if budgetItems is not an array (ie. if it didn't exist in local storage, then set it equal to an empty array)
if (!Array.isArray(budgetItems)) {
    budgetItems = []
}

// ======================
// FUNCTIONS
// ======================

// 4th: update localStorage with latest budgetItems and latest lastID
function updateStorage() {
    localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
    localStorage.setItem("lastID", lastID)
}

// 5th: render budgetItems on table
function renderItems(items) {
  if (!items) {
    items = budgetItems
  } 
  
  var tbody = $("#budgetItems tbody")
  //clear out the previous budget items from the table
    tbody.empty()
  //make a table row for each budget item
items.forEach(function(item){
    var row = `<tr data-id=${item.id}><td>${item.date}</td><td>${item.name}</td><td>${item.category}</td><td>$${parseFloat(item.amount).toFixed(2)}</td><td>${item.notes}</td><td class="delete">"x"</td></tr>`
    tbody.prepend(row);
})
  
var totalAmount = items.reduce(function(accum, item){
    return accum + parseFloat(item.amount)
}, 0)
$("#total").text(`$${totalAmount.toFixed(2)}`)
}


// ======================
// MAIN PROCESS
// ======================
renderItems();

$("#toggleFormButton, #hideForm").on("click", function(){
    var button = $("#toggleFormButton");
    var form = $("#addItemForm");

    form.toggle("slow", function(){
       if ($(this).is(":visible")) {
           button.text("Hide Form")
       } else {
           button.text("Enter New Budget Item")
       }
    })

})
// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form
$("#addItem").on("click", function(event){
    event.preventDefault();
    
    var budgetItem = {
        id: ++lastID,
        date: moment().format('LLL'),
        name: $("#name").val().trim(),
        category: $("#category").val(),
        amount: $("#amount").val().trim() || "0",
        notes: $("#notes").val().trim()
    }

    budgetItems.push(budgetItem)
    updateStorage()
    renderItems()
    console.log(budgetItem)
    $("#addItemForm input, #addItemForm select").val("");
})

// 3rd: on click of 'Add Budget Item' button, gather user input and add newest item to budgetItems array
// each budget item should include: id / date / name / category / amount / notes
// (also, trigger localStorage update and trigger budgetItems rerender, once created)


// 6th: on change of the category dropdown, show filtered budgetItems and total
$("#categoryFilter").on("change", function(){
    var selected = $(this).val()
    var categoryItems = budgetItems.filter(item => item.category === selected)
    renderItems(categoryItems)
})
// 7th: on click of the delete button on a given row, delete that budgetItem

$("#budgetItems").on("click", ".delete", function(){
    var id = parseInt($(this).parent().data("id"))
    var remainingItems = budgetItems.filter(function(item){
        return item.id !== id
    })
    budgetItems = remainingItems;
    updateStorage();
    renderItems()
    $("#categoryFilter").val("")
})


