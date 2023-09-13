const fs = require('fs'); 
const csv = require('csv-parser');

var inputFilePath = "C:\\Users\\tokiy\\OneDrive\\Documents\\furuCRM\\Flect\\1128_Update_OrderedProductName\\production\\b_order.csv";
var outputData = {};
var temp = "";

fs.createReadStream(inputFilePath)
.pipe(csv())
.on('data', function(data){
    try {
        // temp = Object.values(data)[0].replace(/"/g, '""');
        if (outputData[Object.values(data)[1]]) {
            temp = outputData[Object.values(data)[1]] + '\n' + Object.values(data)[0].replace(/"/g, '""');
            outputData[Object.values(data)[1]] = temp;
        } else {
            outputData[Object.values(data)[1]] = Object.values(data)[0].replace(/"/g, '""');
        }
        //perform the operation
    }
    catch(err) {
        //error handler
        console.log(err);
    }
})
.on('end',function(){
    //some final operation
    console.log("FINAL");
    console.log(outputData);
    parseToNewFile(outputData);
});

function parseToNewFile(outputData) {
    var outputFilePath = "C:\\Users\\tokiy\\OneDrive\\Documents\\furuCRM\\Flect\\1128_Update_OrderedProductName\\production\\result\\b_order_result_20230821.csv";
    let writeStream = fs.createWriteStream(outputFilePath)
    let title = ['OrderSummaryId', 'OrderedProductName'];
    writeStream.write(title.join(',') + '\n');
    let tempNewLine = '';

    for (const orderSummaryId in outputData) {
        let newLine = [];
        newLine.push(orderSummaryId);
        newLine.push('"' + outputData[orderSummaryId] + '"');
        
        tempNewLine = newLine.join(',') + '\n';
        writeStream.write(tempNewLine, () => {
              // a line was written to stream
        });
    }

    writeStream.end()

    writeStream.on('finish', () => {
        console.log('finish write stream, moving along')
    }).on('error', (err) => {
        console.log(err)
    })
}

