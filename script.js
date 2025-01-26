function calcularAmortizacion() {
  const monto = parseFloat(document.getElementById('monto').value);
  const tasa = parseFloat(document.getElementById('tasa').value) / 100;
  const periodos = parseInt(document.getElementById('periodos').value);
  const moneda = document.getElementById('moneda').value;

  if (isNaN(monto) || isNaN(tasa) || isNaN(periodos)) {
    alert("Por favor, ingrese valores válidos.");
    return;
  }

  const tasaMensual = tasa / 12;
  const cuota = monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -periodos));

  let saldo = monto;
  const resultados = [];
  const saldoRemanente = [];

  const tbody = document.querySelector('#resultados tbody');
  tbody.innerHTML = '';

  for (let i = 1; i <= periodos; i++) {
    const intereses = saldo * tasaMensual;
    const amortizacion = cuota - intereses;
    saldo -= amortizacion;

    resultados.push({
      periodo: i,
      cuota: cuota.toFixed(2),
      intereses: intereses.toFixed(2),
      amortizacion: amortizacion.toFixed(2),
      saldo: saldo > 0 ? saldo.toFixed(2) : "0.00",
    });

    saldoRemanente.push(saldo > 0 ? saldo.toFixed(2) : 0);

    const row = `<tr>
      <td>${i}</td>
      <td>${cuota.toFixed(2)}</td>
      <td>${intereses.toFixed(2)}</td>
      <td>${amortizacion.toFixed(2)}</td>
      <td>${saldo.toFixed(2)}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);
  }

  generarGrafico(saldoRemanente);
  actualizarSelectorDePeriodos(resultados, moneda);
}

function actualizarSelectorDePeriodos(resultados, moneda) {
  const selector = document.getElementById('seleccionarPeriodo');
  selector.innerHTML = '';

  resultados.forEach(resultado => {
    const option = document.createElement('option');
    option.value = resultado.periodo;
    option.textContent = `Período ${resultado.periodo} - Saldo: ${resultado.saldo} ${moneda}`;
    selector.appendChild(option);
  });
}

function cancelarDeuda() {
  const periodoSeleccionado = parseInt(document.getElementById('seleccionarPeriodo').value);
  if (!periodoSeleccionado) {
    document.getElementById('pago-cancelacion').textContent = 'Por favor seleccione un período.';
    return;
  }

  const filas = document.querySelectorAll('#resultados tbody tr');
  let saldoFinal = 0;

  filas.forEach((fila, index) => {
    if (index + 1 === periodoSeleccionado) {
      saldoFinal = parseFloat(fila.cells[4].textContent);
    }
  });

  const moneda = document.getElementById('moneda').value;
  const mensaje = `El total a pagar para cancelar toda la deuda en el período ${periodoSeleccionado} es: ${saldoFinal.toFixed(2)} ${moneda}`;
  document.getElementById('pago-cancelacion').textContent = mensaje;
}

function generarGrafico(saldoRemanente) {
  const ctx = document.getElementById('grafico').getContext('2d');
  if (Chart.getChart(ctx)) {
    Chart.getChart(ctx).destroy();
  }
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: saldoRemanente.map((_, index) => `Período ${index + 1}`),
      datasets: [{
        label: 'Saldo Remanente',
        data: saldoRemanente,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' }
      },
      scales: {
        x: { title: { display: true, text: 'Períodos' } },
        y: { title: { display: true, text: 'Saldo Remanente' }, beginAtZero: true }
      }
    }
  });
}

  