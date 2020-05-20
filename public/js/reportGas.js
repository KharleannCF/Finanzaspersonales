const socket = io();

socket.on('new query', (data) => {
    let categorias = []
    data.forEach(element => {
        if (categorias.indexOf(element.categorias) < 0) {
            categorias.push(element.categorias)
        }
    });
    categorias.forEach((element) => {
        let matrix = [];
        data.forEach((elem) => {
            if (elem.categorias === element) matrix.push([elem.gastos, elem.monto])
        });
        anychart.onDocumentReady(function() {
            let chart = anychart.pie3d(matrix);
            chart.title(element).radius('43%').innerRadius('30%')
            chart.container(element);
            chart.draw();
        })
    })
})