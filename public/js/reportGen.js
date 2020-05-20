const socket = io();

socket.on('new query', (data) => {
    let matrix = [];
    data.forEach((element) => {
        matrix.push([element.nombre, element.total])
    });
    let processData = {
        header: ['Name', 'Gastos por categoria por mes'],
        rows: matrix
    }
    anychart.theme(anychart.themes.darkEarth);
    anychart.onDocumentReady(function() {

        let data = processData
        let chart = anychart.bar();
        chart.data(data)
        chart.title('Categorías de mayor gastos por mes seleccionado')
        chart.container('container');
        chart.draw();

    })
})