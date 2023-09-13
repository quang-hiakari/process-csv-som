const fs = require('fs'); 
const csv = require('csv-parser');

var inputFilePath = "C:\\Users\\tokiy\\OneDrive\\Documents\\furuCRM\\Flect\\1185_duplicateNthtime\\input_20230913.csv";
var outputData = [];
var temp = [];


fs.createReadStream(inputFilePath)
.pipe(csv())
.on('data', function(data){
    try {
        // temp = Object.values(data)[0].replace(/"/g, '""');
        temp = [];
        dateTimeValue = Object.values(data)[1] + ' 09:00:00';
        temp.push(Object.values(data)[0]);
        temp.push(Object.values(data)[1]);
        temp.push(dateTimeValue);
        // if (outputData[Object.values(data)[1]]) {
        //     temp = outputData[Object.values(data)[1]] + '\n' + Object.values(data)[0].replace(/"/g, '""');
        //     outputData[Object.values(data)[1]] = temp;
        // } else {
        //     outputData[Object.values(data)[1]] = Object.values(data)[0].replace(/"/g, '""');
        // }
        //perform the operation
        outputData.push(temp);
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
    var outputFilePath = "C:\\Users\\tokiy\\OneDrive\\Documents\\furuCRM\\Flect\\PaymentPlan_update\\Production\\2023-08-08\\extract_before_30-5_result.csv";
    let writeStream = fs.createWriteStream(outputFilePath)
    let title = ['PaymentPlanId', 'PaymentDate', 'PaymentDateTime'];
    writeStream.write(title.join(',') + '\n');

    outputData.map((item) => {
        writeStream.write(item.join(',')+ '\n', () => {
              // a line was written to stream
        });
    })

    writeStream.end()

    writeStream.on('finish', () => {
        console.log('finish write stream, moving along')
    }).on('error', (err) => {
        console.log(err)
    })
}

