var solarChart = null;

document.getElementById("forma").addEventListener('submit', function(ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    let consumptionData = [];
    let productionData = [];

    formData.getAll('consumption[]').forEach((consumption, index) => {
        consumptionData.push(consumption);
    });
    formData.getAll('production[]').forEach((production, index) => {
        productionData.push(production);
    });

    consumptionData = consumptionData.map(function(item) {
        return parseInt(item) || 0;
    });
    productionData = productionData.map(function(item) {
        return parseInt(item) || 0;
    });

    console.log(consumptionData);
    console.log(productionData);
    
    generuotiDiagrama(consumptionData, productionData);

    // rezultatu skaiciavimas

    const visoPagaminta = productionData.reduce(
        (accumulator, currentValue) => accumulator + currentValue, 0,
    );

    const visoSunaudota = consumptionData.reduce(
        (accumulator, currentValue) => accumulator + currentValue, 0,
    );

    const vidPagaminta = visoPagaminta / productionData.length; 
    const vidSunaudota = visoSunaudota / consumptionData.length;
    const netPower = visoPagaminta - visoSunaudota;

    // atvaizdavimas

    document.getElementById('visoPagaminta').innerText = visoPagaminta + " kWh";
    document.getElementById('visoSunaudota').innerText = visoSunaudota + " kWh";
    document.getElementById('vidPagaminta').innerText = vidPagaminta + " kWh";
    document.getElementById('vidSunaudota').innerText = vidSunaudota + " kWh";
    document.getElementById('netPower').innerText = netPower + " kWh";

    if(netPower > 0) {
        document.getElementById('netPower').style.color = "green";
    }
    if(netPower == 0) {
        document.getElementById('netPower').style.color = "black";
    }
    if(netPower < 0) {
        document.getElementById('netPower').style.color = "red";
    }

    document.getElementById('rezultatas').style.display = "block";
    setTimeout(() => {
        document.getElementById('rezultatas').scrollIntoView(true);
    }, 200);
});

function generuotiDiagrama(consumptionData, productionData) {
    var months = ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"];

    var ctx = document.getElementById('grafikas').getContext('2d');
    var netPowerData = productionData.map((value, index) => value - consumptionData[index]);

    if(solarChart != null) {
        solarChart.destroy();
    }

    solarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Grynoji galia (kWh)',
                    data: netPowerData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}