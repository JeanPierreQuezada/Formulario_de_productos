document.getElementById("loadData").addEventListener("click", function() {
    fetch("http://localhost:8000/api/getData.php")
        .then(response => response.json())
        .then(data => {
            let output = "<ul>";
            data.forEach(item => {
                output += `<li>${item.name} - ${item.email}</li>`;
            });
            output += "</ul>";
            document.getElementById("data").innerHTML = output;
        })
        .catch(error => console.error("Error al obtener los datos:", error));
});