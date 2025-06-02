document.addEventListener("btnBuscar", function (event) {
    buscarTempo();
});
async function buscarTempo() {
    const cidade = document.getElementById("cidadeInput").value;
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.style.display = "none";
    resultadoDiv.innerHTML = "Carregando...";
    
    const tempo = await getPrevisao(cidade);

    if (tempo) {
        resultadoDiv.innerHTML = `
        <h2>${cidade}</h2>
        <p><stong>Temperatura:</strong> ${tempo.main}(${tempo.description})</p>
        <p><strong>Temperatura:</strong> ${tempo.temp_min}°C - ${tempo.temp_max}°C</p>
        <p><strong>Vento:</strong> ${tempo.speed}m/s</p>
        <p><strong>Visibilidade:</strong> ${tempo.visibility}metros</p>
        <p><strong>Nascer do sol:</strong> ${tempo.sunrise}</p>
        <p><strong>Pôr do sol:</strong> ${tempo.sunset}</p>
        <p><strong>Latitude:</strong> ${tempo.lat}, <strong>Longitude:</strong>${tempo.lon}</p>
        `;
        resultadoDiv.style.display = "block";
    } else {
        resultadoDiv.innerHTML = "<p>Erro ao buscar dados. Verifique a cidade informada.</p>";
        resultadoDiv.style.display = "block";
    }
}

async function getPrevisao(cidade) {
    const chave = "6135072afe7f6cec1537d5cb08a5a1a2";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${chave}`;
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Erro ao buscar dados da API");

        const dados = await resp.json();

        const sunrise = new Date(dados.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(dados.sys.sunset * 1000).toLocaleTimeString();

        const tempo = {
            lat: dados.coord.lat,
            lon: dados.coord.lon,
            description: dados.weather[0].description,
            main: dados.weather[0].main,
            temp_min: dados.main.temp_min,
            temp_max: dados.main.temp_max,
            speed: dados.wind.speed,
            visibility: dados.visibility,
            sunrise: sunrise,
            sunset: sunset 
        };
    return tempo;
    } catch (error) {
        console.error("Erro ao buscar previsão do tempo:", error);
        return null;
    }
}