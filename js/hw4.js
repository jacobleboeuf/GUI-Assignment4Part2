/**
 * File: hw4.js
 * GUI Assignment: Using the jQuery Plugin/UI with Your Dynamic Table
 *
 * - This assignment uses HTML, CSS, and JavaScript to create a Multiplication
 *   table based off of solely user input via a form, done so completely dynamically,
 *   and saves said tables into jQuery tabs, which can be selected and deleted respectively.
 *
 * - This file contains the JavaScript for the entire project, taking the
 *   inputted values by the user to create and display a Multiplication Table
 *   based on those values, or providing JQuery
 *
 * Jacob Leboeuf, UMass Lowell Computer Science, jacob_leboeuf@student.uml.edu,
 * Copyright (c) 2021 by Jacob. All rights reserved. May be freely copied or
 * excerpted for educational purposes with credit to the author.
 * updated by JL on November 15, 2021 at 2:01 PM
**/
const inputs = document.querySelector('.inputs');
const minColText = document.getElementById("minColText");
const maxColText = document.getElementById("maxColText");
const minRowText = document.getElementById("minRowText");
const maxRowText = document.getElementById("maxRowText");
const table = document.getElementById("table");
var minCol, maxCol, minRow, maxRow;
var selectedTabs = [];
var currTab = "";
var numTabs = 1;
function updateTable() {
    if ($("#inputs").valid() == true) {
      minCol = Math.round(document.getElementById("minCol").value);
      maxCol = Math.round(document.getElementById("maxCol").value);
      minRow = Math.round(document.getElementById("minRow").value);
      maxRow = Math.round(document.getElementById("maxRow").value);
      infotext.innerHTML = "<p>Decimal numbers are rounded to whole numbers.</p>";
      table.innerHTML = createTable(minCol, maxCol, minRow, maxRow);
    }
}
/**
  * This function creates an HTML table element, fills the tabke
  * with accurate Multiplication table values based off of the
  * parameters given, and returns the filled HTML table element
  *
  * @param {int} minCol - Minimum column value
  * @param {int} maxCol - Maximum column value
  * @param {int} minRow - Minimum row value
  * @param {int} maxRow - Maximum row value
  *
  * @return {string} - HTML equivalent of Multiplication Table
  *                    based on parameters
**/
function createTable(minCol, maxCol, minRow, maxRow) {
    var values = "";
    values += "<center><table>";
    //values += "<th>";
    values +="<tr><th id = \"space\"><center>x</center></th>"
    for (var a = minCol; a <= maxCol; a++) {
        values +="<th id=\"row\"><center>" + a + "</center></th>";
    }
    values += "</tr>";
    for (var i = minRow; i <= maxRow; i++) {
        values += "<tr>";
        values += "<th id=\"row\"><center>" + i + "</center></th>"
        for (var j = minCol; j <= maxCol; j++) {
          values += "<td><center>" + i * j + "</center></td>";
        }
        values += "</tr>";
    }

    values += "</table></center>";
    return values;
}
/**
* selectTab()
* -Helper function that selects the active jquery tab and adds it to a
*  global array, which is used to track all selected tabs for removal
* -Makes corresponding table have green outline when 'selected'
* -Makes corresponding table have black outline when 'unselected' (button pressed twice on same tab)
* -Executed by clicking "Select Tab" button
*/
function selectTab() {
    currTab = $("#tableTabs .ui-tabs-panel:visible").attr("id");
    if (currTab != null) {
      if (!selectedTabs.includes(currTab)) {
          selectedTabs.push(currTab);
          // make green
          document.getElementById(currTab).style.color = "green";
      } else {
          selectedTabs.splice(selectedTabs.indexOf(currTab), 1);
          // make black again
          document.getElementById(currTab).style.color = "black";
      }
  }
}
/**
 * removeTabs()
 * -Helper function that removes the selected jquery tabs from the tab list
 * -Executed when 'Remove Selected Tabs' button is clicked
 * -Some inspiration from https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role
 * -And http://www.tutorialspark.com/jqueryUI/jQuery_UI_Tabs_Methods.php
*/
function removeTabs() {
    while (selectedTabs.length > 0) {
        $("li[aria-controls='" + selectedTabs[selectedTabs.length-1] +"']").remove();
        $("#" + selectedTabs[selectedTabs.length-1]).remove();
        selectedTabs.pop();
    }
}
//updateTable();
/**
  * This function essentially serves as the main 'function',
  * where upon user submission of the form it checks if the
  * inputs are valid, and proceeds to either inform the user of
  * where/how the inputs are invalid, or generate and display
  * a Multiplication table based upon valid inputs.
  *
*/
$(function() {
    $("#tableTabs").tabs();
    /**
      * Validator compare() function
      * - Throws error message if minimum column/row value
      *   is larger than maximum column/row value
    */
    jQuery.validator.addMethod("compare", function(value, element, params) {
          var n1 = parseInt(value);
          var n2 = parseInt($('input[name="' + params[0] +'"]').val());
          if (isNaN(n1) || isNaN(n2)) {
              return true;
          }
          if (params[2]) {
              return n1 <= n2;
          } else {
              return n1 >= n2;
          }
    }, "<p>Mininum {1} value must be</p><p> <= Maximum {1} value!</p>");
    /**
      * Validator checkRange() function
      * - Throws error message if column/row value
      *   range exceeds 200
    */
    jQuery.validator.addMethod("checkRange", function(value, element, params) {
          var n1 = parseInt(value);
          var n2 = parseInt($('input[name="' + params[0] +'"]').val());
          if (isNaN(n1) || isNaN(n2)) {
              return true;
          }
          if (params[2]) {
              return Math.abs(n2 - n1) <= 200;
          } else {
              return Math.abs(n1 - n2) <= 200;
          }
    },"<p>{1} range cannot exceed 200</p><p>between minimum and maximum values!</p>");
    /**
     * JQuery validation function:
     * - Throws error messages if user enters invalid inputs
     * - Creates the Multiplication table upon valid inputs
    */
    $("#inputs").validate({
        rules: {
            minCol : {
                required: true,
                number: true,
                compare: ['maxCol', 'Column', true],
                checkRange: ['maxCol', 'Column', true]
            },
            maxCol : {
                required: true,
                number: true,
                compare: ['minCol', 'Column', false],
                checkRange: ['minCol', 'Column', false]
            },
            minRow : {
                required: true,
                number: true,
                compare: ['maxRow', 'Row', true],
                checkRange: ['maxRow', 'Row', true]
            },
            maxRow : {
                required: true,
                number: true,
                compare: ['minRow', 'Row', false],
                checkRange: ['minRow', 'Row', false]
            }
        },
        messages: {
            minCol: {
                required: "<p>Please enter a number</p>",
                number: "<p>Value must be a number</p><p>No letters or Mathematical symbols allowed</p>"
            },
            maxCol: {
                required: "<p>Please enter a number</p>",
                number: "<p>Value must be a number</p><p>No letters or Mathematical symbols allowed</p>"
            },
            minRow: {
                required: "<p>Please enter a number</p>",
                number: "<p>Value must be a number</p><p>No letters or Mathematical symbols allowed</p>"
            },
            maxRow: {
                required: "<p>Please enter a number</p>",
                number: "<p>Value must be a number</p><p>No letters or Mathematical symbols allowed</p>"
            }
        },
        // Places error messages in desired places
        errorPlacement: function(error, element) {
            if (element.attr("name") == "minCol") {
                error.appendTo($("#minColText"));
            } else if (element.attr("name") == "maxCol") {
                error.appendTo($("#maxColText"));
            } else if (element.attr("name") == "minRow") {
                error.appendTo($("#minRowText"));
            } else if (element.attr("name") == "maxRow") {
                error.appendTo($("#maxRowText"));
            }
        },
        /**
         * submitHandler:
         * Rounds decimal values and calls createTable function
         * Adds created table to new tab and adds corresponding buttons for tab
         */
        submitHandler: function(form, e) {
            // TABLE PORTION
            e.preventDefault();
            minCol = Math.round(document.getElementById("minCol").value);
            maxCol = Math.round(document.getElementById("maxCol").value);
            minRow = Math.round(document.getElementById("minRow").value);
            maxRow = Math.round(document.getElementById("maxRow").value);
            infotext.innerHTML = "<p>Decimal numbers are rounded to whole numbers.</p>";
            table.innerHTML = createTable(minCol, maxCol, minRow, maxRow);
            // TAB PORTION
            var title = "(" + minCol + "," + maxCol + ") x (" + minRow + "," + maxRow + ")";
            $("#tableTabs").tabs("destroy");
            $("#tabList").html($("#tabList").html() +"<li><a href='#divTab" + numTabs +"'>" + title
                                + "</a><span class='ui-icon ui-icon-close' role='presentation'></span></li>");
            $("#tableTabs").html($("#tableTabs").html() + "<div id='divTab" + numTabs + "'>" +"<div id='table'>"
                                + $("#table").html() + "</div>" + "</div>");
            numTabs++;
            // Makes newly created tab the active one
            $("#tableTabs").tabs({ active: (numTabs - 2)});
            // Adds "Select Tab" and "Remove Selected Tabs" buttons for user
            $('#buttons').html("<button id='selectTab' onclick='selectTab()'>Select Tab</button>" +
                              "<button id='removeTab' onclick='removeTabs()'>Remove Selected Tabs</button>");
            /**
             * -Close tab function (not with "remove selected tabs" button)
             * -Removes tab from page when small 'x' is clicked near tab title
             * -Removes tab from list of selected tabs if it exists in array
             * -Some inspiration from https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role
             * -And http://www.tutorialspark.com/jqueryUI/jQuery_UI_Tabs_Methods.php
            */
            $("#tableTabs").delegate( "span.ui-icon-close", "click", function() {
                var panelID = $( this ).closest( "li" ).remove().attr( "aria-controls" );
                $( "#" + panelID ).remove();
                $("#tableTabs").tabs("refresh");
                numTabs--;
                if (selectedTabs.includes(panelID)) {
                    var index = selectedTabs.indexOf(panelID);
                    selectedTabs.splice(index, 1);
                }
            });
        }

    });
    /** SLIDER PORTION
     * Slider only goes from values of -50 to 50, but user can input any number via the text box
    */
    $("#minColSlider").slider({
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#minCol").val(ui.value);
            updateTable();
        }
    });
    $("#minCol").on("keyup", function() {
        $("#minColSlider").slider("value", this.value);
        updateTable();
    });
    $("#maxColSlider").slider({
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#maxCol").val(ui.value);
            updateTable();
        }
    });
    $("#maxCol").on("keyup", function() {
        $("#maxColSlider").slider("value", this.value);
        updateTable();
    });
    $("#minRowSlider").slider({
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#minRow").val(ui.value);
            $(".inputs").validate();
            updateTable();
        }
    });
    $("#minRow").on("keyup", function() {
        $("#minRowSlider").slider("value", this.value);
        updateTable();
    });
    $("#maxRowSlider").slider({
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#maxRow").val(ui.value);
            updateTable();
        }
    });
    $("#maxRow").on("keyup", function() {
        $("#maxRowSlider").slider("value", this.value);
        updateTable();
    });
});
