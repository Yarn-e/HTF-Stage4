let numbers = [];
let averages = [];
let loop;

$(document).ready(() => {
    loop = setInterval(() => {
        getData();
    }, 500);
    drawFirstTime();
})

async function getData(){
    let number = await fetchNumber();
    if(!numbers.includes(number)){
        numbers.push(number);    
        let avg;
        let sum = numbers.reduce((prev,curr)=>{
            return prev + curr;
        });
        avg = sum / numbers.length;
        addData(window.myLine, "", avg);
        avg = Math.floor(avg);
        averages.push(avg);
    }
    
    if(numbers.length == 98){
        clearInterval(loop);
        postAverage(avg);
    }
    console.log(numbers);
}

function fetchNumber(){
    return fetch("http://involved-htf-js-2018-prod.azurewebsites.net/api/challenge/4",{
        method: "GET",
        headers:{
            "Content-Type":  "application/json",
            "Accept": "application/json",
            "x-team" : "lawyer"
        }
    }).then(function(response){
        return response;
    }).then(data => {
        return data.json();
    }).then(jsondata => {
        return jsondata.number;
    })
    
}

function postAverage(average){
    let body = JSON.stringify({"avg": average});
    fetch("http://involved-htf-js-2018-prod.azurewebsites.net/api/challenge/4",{
        method: "POST",
        headers:{
            "Content-Type":  "application/json",
            "Accept": "application/json",
            "x-team" : "lawyer"
        },
        body: body
        
    }).then(function(response){
        return response;
    }).then(data => {
        console.log(data);
    })
}

function drawFirstTime(){
    var config = {
        type: 'line',
        data: {
            labels: new Array(averages.length),
            datasets: [{
                label: 'Average Number of Polling the API',
                backgroundColor: "red",
                borderColor: "red",
                data: averages,
                fill: false,
            }]
        },
        options: {
            responsive: false,
            title: {
                display: true,
                text: 'Dit is een grafiek!'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '# of numbers'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Average'
                    }
                }]
            }
        }
    };
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);   
}

function addData(chart,label, data){
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}