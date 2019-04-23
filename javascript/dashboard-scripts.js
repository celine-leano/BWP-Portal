function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("data-table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    // Loop through all table rows
    for (i = 1; i < tr.length; i++) {
        // Loop through all table columns in the current row, and hide those who don't match the search query
        var found = false;
        td = tr[i].getElementsByTagName("td");
        for(j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                //if found at least once it is set to true
                found = true;
            }
        }
        //only hides or shows it after checking all columns
        if(found){
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}