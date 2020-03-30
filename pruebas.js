//El ejercicio de FLEX esta subido en Tares, no te lo pude poner en el archivo zip porque no me funcionaba la pagina de tareas completadas en Teams
// Pulsa la opcion de Buscar para guardar y mostrar los pokemons.
// Pulsa en las cajas de tipo para filtrar los pokemons
window.onload = function() {

    const divCuerpo = document.querySelector(".main");
    const botonBuscar = document.querySelector("#pokemons");
    const divFuego = document.querySelector("#fuego");
    const divAgua = document.querySelector("#agua");
    const divPlanta = document.querySelector("#planta");
    var tipo = "nada";

    botonBuscar.addEventListener("click", getMapaPokemons);
    divFuego.addEventListener("click", function() {
        tipo = "fire";
        pintarTipo(mapPokes);
    });
    divAgua.addEventListener("click", function() {
        tipo = "water";
        pintarTipo(mapPokes);
    });
    divPlanta.addEventListener("click", function() {
        tipo = "bug";
        pintarTipo(mapPokes);
    });

    divCuerpo.addEventListener("mouseover", function(event) {
        event.target.src = mapPokes.get(event.target.id).imagenback;
        setTimeout(function() {
            event.target.src = mapPokes.get(event.target.id).imagen;
        }, 500);
    });


    var mapPokes = new Map();;

    // El mapa estara formado por una clave String (nombre del poke) y una clase
    // Pokemon que tendra los atributos de url, imagen frontal y de espaldas y un array qeu contiene los tipos
    function Pokemon(url, imagen, imagenback, tipo) {
        this.url = url;
        this.imagen = imagen;
        this.imagenback = imagenback;
        this.tipo = tipo;
    }

    //Funcion que pinta los pokes filtrados por tipo
    function pintarTipo(mapa) {
        divCuerpo.innerHTML = "";
        let texto = "";
        for (var [key, value] of mapa) {
            // la funcion find devuelve undefined cuando no encuentra el valor pasado en la funcion y el valor en sí si lo encuentra.
            //En mi caso cuando el tipo del pokemon coincide con el tipo buscado (la respuesta es distinta de undefinded) pinto al poke
            if (value.tipo.find(valor => valor.type.name == tipo) != undefined) {
                console.log(value);
                texto = `<div class="poke" ><img src="${value.imagen}" id="${key}"></div>`
                divCuerpo.innerHTML += texto;
            }
        }
    }

    function getMapaPokemons() {
        // limit=151 -> Mostrar los primeros 151 resultados
        //Cambiando este valor se podra aumentar o disminuir las busquedas
        fetch("https://pokeapi.co/api/v2/pokemon/?limit=151")
            .then(response => response.json())
            .then(poke => asignaUrl(poke))
            .then(mapa => recorrerPokes(mapa))
            .catch(err => { console.log('Error...' + err) })
    }

    function getPokemons(url) {
        fetch(url)
            .then(response => response.json())
            .then(poke => asignarAtributos(poke))
            .then(mapa => pintarPokes(mapa))
            .catch(err => { console.log('Error...' + err) })
    }

    function asignaUrl(array) {
        return new Promise(function(resolve, reject) {
            array.results.forEach(poke => {
                mapPokes.set(poke.name, new Pokemon(poke.url, "", ""));
            })
            resolve(mapPokes);
        })
    }

    function asignarAtributos(obj) {
        return new Promise(function(resolve, reject) {
            mapPokes.get(obj.name).imagen = obj.sprites.front_default;
            mapPokes.get(obj.name).imagenback = obj.sprites.back_default;
            mapPokes.get(obj.name).tipo = obj.types;

            resolve(mapPokes);
        })
    }

    function recorrerPokes(mapa) {
        return new Promise(function(resolve, reject) {
            for (var [key, value] of mapa) {
                // Accedo al json de cada poke
                getPokemons(value.url);
            }
            resolve(mapa);
        })
    }
    var contador = 0;

    function pintarPokes(mapa) {
        // Como llamo a la funcion de pintar cada vez qeu accedo al json de cada pokemon creo un contador que solo pintara a éste
        // en el ultimo recorrido de la busqueda (151 busquedas)
        contador++;
        divCuerpo.innerHTML = "";
        let texto = "";
        if (contador > 150) {
            for (var [key, value] of mapa) {

                texto = `<div class="poke"><img src="${value.imagen}" id="${key}"></div>`
                divCuerpo.innerHTML += texto;
            }
            contador = 0;
        }

    }

}