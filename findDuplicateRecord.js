const fs = require('fs'); 
const csv = require('csv-parser');

var inputFilePath = "C:\\Users\\tokiy\\OneDrive\\Documents\\furuCRM\\Flect\\1185_duplicateNthtime\\input_20230913.csv";
var outputFilePath = "C:\\Users\\tokiy\\OneDrive\\Documents\\furuCRM\\Flect\\1185_duplicateNthtime\\output_20230913.csv";
var outputData = [];
var dictObject = {};
var orderNumberList = {};
var nthTime = '';
var orderNumber = '';
var orderId = '';
var tempKey = '';
var paymentDueDate = '';
const SHIPPING_FEE_NTHTIME = 99;

fs.createReadStream(inputFilePath)
.pipe(csv())
.on('data', function(data){
    try {
        // Parse Data
        nthTime = Object.values(data)[2];
        paymentDueDate = Object.values(data)[4];
        orderId = Object.values(data)[5];
        orderNumber = Object.values(data)[6];
        tempKey = `${orderNumber}_${nthTime}`; //B2343224_0


        // Check if nthTime is duplicate, using tempKey
        if (dictObject[tempKey]) {
            // Key already Exist -> nth Time is Duplicate
            // => save duplicated nthTime record
            outputData.push([orderId, orderNumber, nthTime]);
        } else {
            // Key is not exists, add to object,
            // Value will be PaymetnDueDate
            dictObject[tempKey] = paymentDueDate;
        }

        // Save the nth time, to findout the lastest PaymentTime (exclude ShippingFee)
        ///////////////////////////////

        // Save object orderNumber
        // if (!orderNumberList[orderNumber]) {
        //     orderNumberList[orderNumber] = orderId;
        // }

        // if (dictObject[orderNumber]) {
        //     var tempMax = dictObject[orderNumber];
        //     dictObject[orderNumber] = (parseInt(nthTime) > tempMax && parseInt(nthTime) != SHIPPING_FEE_NTHTIME) ? parseInt(nthTime) : tempMax;
        // } else {
        //     dictObject[orderNumber] = parseInt(nthTime);
        // }
    }
    catch(err) {
        //error handler
        console.log(err);
    }
})
.on('end',function(){
    //Check if have case
    // LastPayment do not have PaymentDueDate
    // SHippingFee have PaymentDueDate
    // checkLastPaymentAndShippingFee();

    //some final operation
    console.log("FINAL");
    console.log(outputData);

    parseToNewFile(outputData);
});

function checkLastPaymentAndShippingFee() {
    for (const orderNumberItem in  orderNumberList) {
        if (!dictObject[orderNumberItem]) {
            continue;
        }
        var maxTime = dictObject[orderNumberItem];
        var lastPaymentDueDate = dictObject[`${orderNumberItem}_${maxTime}`];
        var shippingPaymentDueDate = dictObject[`${orderNumberItem}_${SHIPPING_FEE_NTHTIME}`];
        console.log(lastPaymentDueDate.length);
        console.log(shippingPaymentDueDate.length);
        if (lastPaymentDueDate.length == 0 && shippingPaymentDueDate != 0) {
            outputData.push([orderNumberList[orderNumberItem], orderNumberItem, SHIPPING_FEE_NTHTIME]);
        }
    }
}

function parseToNewFile(outputData) {

    let writeStream = fs.createWriteStream(outputFilePath)
    let title = ['OrderId', 'OrderNumber', 'Duplicated nth Time'];
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

