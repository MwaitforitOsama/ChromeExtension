// function processCSV(file, callback) {
//   console.log("I am in the csvprocess function");
//   console.log("FILE is : ",file);
//   var reader = new FileReader();
  
//   reader.onload = function(event) {
//     var csvData = event.target.result;

//     // Parse CSV using a library like Papaparse
//     var parsedData = Papa.parse(csvData, { header: true });

//     // Perform DataFrame operations
//     var columnsToDelete = ['VIN', 'Year', 'Make', 'Model', 'Fuel', 'License Number', 'License State', 'Group', 'Vehicle Gateway SN', 'WIFI Password', 'Current Driver Name', 'Current Driver ID', 'Dashcam', 'Engine Hours', 'Last Location'];
    
//     for (var i = 0; i < columnsToDelete.length; i++) {
//       delete parsedData.data[0][columnsToDelete[i]];
//     }

//     console.log("After Deletion : ",parsedData);

//     // Split 'Last Drive Time' into 'Date' and 'Time'
//     for (var i = 0; i < parsedData.data.length; i++) {
//       var lastDriveTime = parsedData.data[i]['Last Drive Time'];

//       // Check if 'Last Drive Time' exists and is not undefined
//       if (lastDriveTime) {
//         var [date, time] = lastDriveTime.split(/\s+/);

//         // Update the row with separate 'Date' and 'Time' columns
//         parsedData.data[i]['Last Reading Date'] = date;
//         parsedData.data[i]['Last Reading Time'] = time;
        
//         // Remove the original 'Last Drive Time' column
//         delete parsedData.data[i]['Last Drive Time'];
//         console.log("Parsing/splitting successful", parsedData);
//       } else {
//         // Handle the case where 'Last Drive Time' is missing or undefined
//         parsedData.data[i]['Last Reading Date'] = "N/A";
//         parsedData.data[i]['Last Reading Time'] = "N/A";
//       }
//     }
//     console.log("After splitting successful", parsedData);

//     // Convert the processed data back to CSV
//     var processedCSV = Papa.unparse(parsedData, { header: true });

//     // Save the processed data to a new file
//     var blob = new Blob([processedCSV], { type: 'text/csv;charset=utf-8' });
//     var outputFilePath = 'final_vehicles_detail.csv';

//     // Pass the callback to initiate the download
//     callback(blob, outputFilePath);
//   };

//   reader.readAsText(file);
// }

////////////////


function processCSV(file, callback) {
  console.log("I am in the csvprocess function");
  console.log("FILE is : ", file);

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const csvData = event.target.result;

      // Parse CSV using PapaParse library
      const parsedData = Papa.parse(csvData, { header: true });

      // Define columns to delete
      const columnsToDelete = ['VIN', 'Year', 'Make', 'Model', 'Fuel', 'License Number', 'License State', 'Group', 'Vehicle Gateway SN', 'WIFI Password', 'Current Driver Name', 'Current Driver ID', 'Dashcam', 'Engine Hours', 'Last Location'];

      // Remove unnecessary columns and split 'Last Drive Time'
      parsedData.data = parsedData.data.map(row => {
        // Delete specified columns
        columnsToDelete.forEach(column => {
          delete row[column];
        });

        // Split 'Last Drive Time' into 'Last Reading Date' and 'Last Reading Time'
        const lastDriveTime = row['Last Drive Time'];
        if (lastDriveTime) {
          // Check if the date and time are separated by a space or another character
          const separator = /\s+/g.test(lastDriveTime) ? /\s+/ : /\W+/;
          const [date, time] = lastDriveTime.split(separator);

          row['Last Reading Date'] = date;
          row['Last Reading Time'] = time;

          // Delete the original 'Last Drive Time' column
          delete row['Last Drive Time'];
        } else {
          row['Last Reading Date'] = "N/A";
          row['Last Reading Time'] = "N/A";
        }

        return row;
      });

      // Extract the headers and data for the new CSV
      const headers = Object.keys(parsedData.data[0]);
      const newData = parsedData.data.map(row => headers.map(header => row[header]));

      // Build a new CSV string with headers and data
      const processedCSV = [headers.join(','), ...newData.map(row => row.join(','))].join('\n');

      // Save processed data to a new file
      const blob = new Blob([processedCSV], { type: 'text/csv;charset=utf-8' });
      const outputFilePath = 'final_vehicles_detail.csv';

      // Pass the callback to initiate the download
      callback(blob, outputFilePath);
    } catch (error) {
      console.error("Error processing CSV:", error);
    }
  };

  reader.readAsText(file);
}



////////////////

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM event loaded");
document.getElementById('processButton').addEventListener('click', function () {
  console.log("Working");
  var fileInput = document.getElementById('fileInput');
  var file = fileInput.files[0];

  if (file) {
    processCSV(file, function (blob, outputFilePath) {
      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: outputFilePath,
        saveAs: true
      });
    });
  } else {
    alert('Please choose a CSV file.');
  }
});
});

/////

document.addEventListener('DOMContentLoaded', function () {
  var fileInput = document.getElementById('fileInput');
  var processButton = document.getElementById('processButton');
  var fileNameDisplay = document.getElementById('fileNameDisplay');

  fileInput.addEventListener('change', function () {
    // Display the selected file name
    fileNameDisplay.textContent = fileInput.files[0].name;
  });

  processButton.addEventListener('click', function () {
    // Add your code to process the CSV here
  });
});
